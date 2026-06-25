import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as auth } from "./auth_Bd5rGxl7.mjs";
import { n as connectDB, t as Post } from "./Post_B7QHZKFm.mjs";
import { t as generateUniqueSlug } from "./slug_BmuBDEws.mjs";
//#region src/pages/api/posts/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	GET: () => GET,
	PUT: () => PUT
});
var GET = async (ctx) => {
	const { id } = ctx.params;
	try {
		await connectDB();
		const post = await Post.findById(id).populate("userId", "fullname username image").lean();
		if (!post) return new Response(JSON.stringify({ error: "Post not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify(post), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to fetch post" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var PUT = async (ctx) => {
	const session = await auth.api.getSession({ headers: ctx.request.headers });
	if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	const { id } = ctx.params;
	try {
		const { title, content, excerpt, category, tags, thumbnail, status } = await ctx.request.json();
		await connectDB();
		const existingPost = await Post.findById(id);
		if (!existingPost) return new Response(JSON.stringify({ error: "Post not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		if (existingPost.userId.toString() !== session.user.id) return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
			headers: { "Content-Type": "application/json" }
		});
		let slug = existingPost.slug;
		if (title && title !== existingPost.title) slug = await generateUniqueSlug(title);
		const updated = await Post.findByIdAndUpdate(id, {
			...title && { title },
			slug,
			...content && { content },
			...excerpt && { excerpt },
			category: category !== void 0 ? category : existingPost.category,
			tags: tags || existingPost.tags,
			thumbnail: thumbnail !== void 0 ? thumbnail : existingPost.thumbnail,
			status: status || existingPost.status
		}, { new: true }).lean();
		return new Response(JSON.stringify(updated), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to update post" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var DELETE = async (ctx) => {
	const session = await auth.api.getSession({ headers: ctx.request.headers });
	if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	const { id } = ctx.params;
	try {
		await connectDB();
		const post = await Post.findById(id);
		if (!post) return new Response(JSON.stringify({ error: "Post not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		if (post.userId.toString() !== session.user.id) return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
			headers: { "Content-Type": "application/json" }
		});
		await Post.findByIdAndDelete(id);
		return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		return new Response(JSON.stringify({ error: "Failed to delete post" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/posts/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
