import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
//#region src/lib/auth.ts
var client = new MongoClient(process.env.MONGO_URI);
var auth = betterAuth({
	database: mongodbAdapter(client.db(), { client }),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 300
		},
		modelName: "sessions"
	},
	user: { modelName: "users" }
});
//#endregion
export { auth as t };
