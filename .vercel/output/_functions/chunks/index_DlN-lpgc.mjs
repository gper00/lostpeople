import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, b as renderComponent, j as createAstro, v as renderScript } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { n as connectDB, t as Post } from "./Post_B7QHZKFm.mjs";
import { t as $$DashboardLayout } from "./DashboardLayout_CROfiyjV.mjs";
//#region src/pages/dashboard/posts/index.astro
var posts_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const user = Astro.locals.user;
	if (!user) return Astro.redirect("/login");
	let posts = [];
	try {
		await connectDB();
		posts = await Post.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
	} catch (e) {
		console.warn("Could not connect to database:", e);
	}
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Posts | Lostpeople Dashboard" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="flex items-center justify-between mb-stack-lg"><div><h1 class="font-headline-lg text-headline-lg text-primary mb-2">Posts</h1><p class="font-meta-italic text-meta-italic text-secondary">${posts.length} post${posts.length !== 1 ? "s" : ""}</p></div><a href="/dashboard/posts/create" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background font-label-sm text-label-sm tracking-wider uppercase hover:bg-on-surface-variant transition-colors no-underline"><span class="material-symbols-outlined text-[16px]">add</span>New Post</a></div>${posts.length > 0 ? renderTemplate`<div class="border border-border-subtle divide-y divide-border-subtle">${posts.map((post) => renderTemplate`<div class="flex items-center justify-between px-stack-md py-stack-sm hover:bg-primary/5 transition-colors"><div class="flex-1 min-w-0"><a${addAttribute(`/dashboard/posts/${post._id}`, "href")} class="font-headline-md text-body-md text-primary hover:text-secondary transition-colors no-underline block truncate">${post.title}</a><div class="flex items-center gap-3 mt-1"><span class="font-label-sm text-label-sm text-secondary">${new Date(post.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	})}</span><span${addAttribute(["px-2 py-0.5 text-[11px] uppercase tracking-wider", post.status === "published" ? "bg-green-100 text-green-800" : post.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"], "class:list")}>${post.status}</span>${post.category && renderTemplate`<span class="font-label-sm text-label-sm text-secondary">${post.category}</span>`}</div></div><div class="flex items-center gap-2 ml-4"><a${addAttribute(`/dashboard/posts/${post._id}`, "href")} class="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors no-underline">Edit</a><button class="delete-btn font-label-sm text-label-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer bg-transparent border-0"${addAttribute(post._id, "data-id")}>Delete</button></div></div>`)}</div>` : renderTemplate`<div class="border border-border-subtle p-stack-lg text-center"><p class="font-meta-italic text-meta-italic text-secondary mb-stack-sm">No posts yet</p><a href="/dashboard/posts/create" class="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors no-underline">Create your first post →</a></div>`}` })}${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/index.astro", void 0);
var $$file = "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/index.astro";
var $$url = "/dashboard/posts";
//#endregion
//#region \0virtual:astro:page:src/pages/dashboard/posts/index@_@astro
var page = () => posts_exports;
//#endregion
export { page };
