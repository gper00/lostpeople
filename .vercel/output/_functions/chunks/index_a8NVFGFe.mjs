import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as auth } from "./auth_Bd5rGxl7.mjs";
import { n as connectDB, t as Post } from "./Post_B7QHZKFm.mjs";
import { t as generateUniqueSlug } from "./slug_BmuBDEws.mjs";
//#region src/pages/api/posts/index.ts
var posts_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var GET = async () => {
	try {
		await connectDB();
		const posts = await Post.find({ status: "published" }).populate("userId", "fullname username image").sort({ createdAt: -1 }).lean();
		return new Response(JSON.stringify(posts), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var POST = async (ctx) => {
	const session = await auth.api.getSession({ headers: ctx.request.headers });
	if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const { title, content, excerpt, category, tags, thumbnail, status } = await ctx.request.json();
		if (!title || !content || !excerpt) return new Response(JSON.stringify({ error: "Title, content, and excerpt are required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		await connectDB();
		const slug = await generateUniqueSlug(title);
		const post = await Post.create({
			title,
			slug,
			userId: session.user.id,
			content,
			excerpt,
			category: category || null,
			tags: tags || [],
			thumbnail: thumbnail || null,
			status: status || "draft"
		});
		return new Response(JSON.stringify(post), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to create post" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/posts/index@_@ts
var page = () => posts_exports;
//#endregion
export { page };
