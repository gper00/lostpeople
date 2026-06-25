import { F as sequence, G as defineMiddleware } from "./chunks/render_C3nYDF00.mjs";
import { t as auth } from "./chunks/auth_Bd5rGxl7.mjs";
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(defineMiddleware(async (context, next) => {
	const isAuthed = await auth.api.getSession({ headers: context.request.headers });
	if (isAuthed) {
		context.locals.user = isAuthed.user;
		context.locals.session = isAuthed.session;
	} else {
		context.locals.user = null;
		context.locals.session = null;
	}
	return next();
}));
//#endregion
export { onRequest };
