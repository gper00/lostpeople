/**
 * ONE-TIME data reconciliation.
 *
 * Problem: the `users` collection mixes legacy Mongoose users (password on the
 * doc, cannot log in via Better Auth) with Better Auth users (credentials in the
 * `account` collection). All 7 posts belong to the legacy "Umam" user, who cannot
 * log in — so the login user never owns any posts.
 *
 * Goal: make Umam (alfariziuchiha@gmail.com) the canonical Better Auth login (role
 * admin) that owns the 7 posts; demote the two test accounts to role `user`.
 *
 * Strategy: create proper Better Auth users via signUpEmail (creates user + hashed
 * credential account natively), repoint posts to the new owner _id, then apply the
 * remaining profile fields (image/socialMedia) directly. Idempotent: skips creation
 * if a credential account already exists for that email.
 *
 * Run:  node scripts/reconcile-users.mjs
 */
import fs from 'node:fs';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { MongoClient, ObjectId } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

const DEFAULT_PASSWORD = 'lostpeople123';

// --- load .env (simple parser) ---
const env = Object.fromEntries(
  fs
    .readFileSync('.env', 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const client = new MongoClient(env.MONGO_URI);
await client.connect();
const db = client.db();
const usersCol = db.collection('users');
const accountCol = db.collection('account');
const postsCol = db.collection('posts');

const auth = betterAuth({
  appName: 'Lostpeople',
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  user: {
    modelName: 'users',
    additionalFields: {
      fullname: { type: 'string', required: false, input: true },
      username: { type: 'string', required: false, input: true },
      bio: { type: 'string', required: false, input: true },
    },
  },
  plugins: [admin({ defaultRole: 'user', adminRoles: ['admin'] })],
});

async function hasCredential(userId) {
  return !!(await accountCol.findOne({
    providerId: 'credential',
    $or: [{ userId: String(userId) }, { userId: new ObjectId(userId) }],
  }));
}

/**
 * Ensure `email` exists as a Better Auth login with the given role/profile.
 * If `repointFromId` is set, move that legacy user's posts to the new owner.
 */
async function reconcile({ email, role, repointFromId }) {
  console.log(`\n── ${email} (target role: ${role}) ──`);
  let userDoc = await usersCol.findOne({ email });
  const legacyProfile = userDoc
    ? {
        fullname: userDoc.fullname ?? null,
        username: userDoc.username ?? null,
        bio: userDoc.bio ?? null,
        image: userDoc.image ?? null,
        socialMedia: userDoc.socialMedia ?? {},
        name: userDoc.fullname ?? userDoc.name ?? email,
      }
    : { name: email };

  const alreadyBA = userDoc && (await hasCredential(userDoc._id));

  if (alreadyBA) {
    console.log('  • already a Better Auth login — skipping signup');
  } else {
    if (userDoc) {
      console.log(`  • deleting legacy doc ${userDoc._id} (frees unique email)`);
      await usersCol.deleteOne({ _id: userDoc._id });
    }
    console.log('  • creating Better Auth user via signUpEmail');
    await auth.api.signUpEmail({
      body: {
        email,
        password: DEFAULT_PASSWORD,
        name: legacyProfile.name,
        fullname: legacyProfile.fullname ?? undefined,
        username: legacyProfile.username ?? undefined,
        bio: legacyProfile.bio ?? undefined,
      },
    });
    userDoc = await usersCol.findOne({ email });
  }

  // Apply role + profile fields that Better Auth doesn't manage.
  await usersCol.updateOne(
    { _id: userDoc._id },
    {
      $set: {
        role,
        emailVerified: true,
        fullname: legacyProfile.fullname ?? legacyProfile.name,
        ...(legacyProfile.username ? { username: legacyProfile.username } : {}),
        bio: legacyProfile.bio ?? null,
        image: legacyProfile.image ?? null,
        socialMedia: legacyProfile.socialMedia ?? {},
      },
    }
  );
  console.log(`  • set role=${role}, emailVerified=true, profile applied`);

  let moved = 0;
  if (repointFromId && String(repointFromId) !== String(userDoc._id)) {
    const r = await postsCol.updateMany(
      { userId: new ObjectId(repointFromId) },
      { $set: { userId: userDoc._id } }
    );
    moved = r.modifiedCount;
    console.log(`  • repointed ${moved} post(s) ${repointFromId} → ${userDoc._id}`);
  }

  return { email, newId: String(userDoc._id), role, moved };
}

// --- BEFORE snapshot ---
console.log('=== BEFORE ===');
for (const u of await usersCol.find({}).toArray()) {
  const cred = await hasCredential(u._id);
  const posts = await postsCol.countDocuments({ userId: u._id });
  console.log(
    `  ${u.email} | _id ${u._id} | role ${u.role ?? '-'} | login:${cred ? 'yes' : 'no'} | posts:${posts}`
  );
}

// --- run reconciliation ---
const results = [];
results.push(
  await reconcile({
    email: 'alfariziuchiha@gmail.com',
    role: 'admin',
    repointFromId: '66a88cd7c84ddc01bd4cf366',
  })
);
results.push(
  await reconcile({ email: 'user@gmail.com', role: 'user' })
);
results.push(
  await reconcile({ email: 'admin@lostpeople.com', role: 'user' })
);

// --- AFTER snapshot ---
console.log('\n=== AFTER ===');
for (const u of await usersCol.find({}).toArray()) {
  const cred = await hasCredential(u._id);
  const posts = await postsCol.countDocuments({ userId: u._id });
  console.log(
    `  ${u.email} | _id ${u._id} | role ${u.role ?? '-'} | login:${cred ? 'yes' : 'no'} | posts:${posts}`
  );
}

console.log('\n=== SUMMARY ===');
console.table(results);
console.log(`\nLogin: alfariziuchiha@gmail.com / ${DEFAULT_PASSWORD}  (CHANGE AFTER LOGIN)`);

await client.close();
process.exit(0);
