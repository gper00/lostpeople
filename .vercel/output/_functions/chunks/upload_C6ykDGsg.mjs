import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as auth } from "./auth_Bd5rGxl7.mjs";
//#region src/pages/api/posts/upload.ts
var upload_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async (ctx) => {
	if (!await auth.api.getSession({ headers: ctx.request.headers })) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		if (!(await ctx.request.formData()).get("file")) return new Response(JSON.stringify({ error: "No file provided" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({ error: "Cloudinary not configured" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: "Upload failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/posts/upload@_@ts
var page = () => upload_exports;
//#endregion
export { page };
