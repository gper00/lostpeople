import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

/**
 * Browser-side auth client. The adminClient plugin exposes
 * authClient.admin.{listUsers,createUser,setRole,banUser,unbanUser,removeUser,...}
 * for logged-in admins. baseURL defaults to the current origin in the browser.
 */
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { signIn, signOut, useSession } = authClient;
