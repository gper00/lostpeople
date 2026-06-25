import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, b as renderComponent, j as createAstro } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { n as connectDB, t as Post } from "./Post_B7QHZKFm.mjs";
import { t as $$DashboardLayout } from "./DashboardLayout_CROfiyjV.mjs";
//#region src/pages/dashboard/index.astro
var dashboard_exports = /* @__PURE__ */ __exportAll({
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
	let totalPosts = 0;
	let publishedPosts = 0;
	let draftPosts = 0;
	try {
		await connectDB();
		posts = await Post.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).lean();
		totalPosts = await Post.countDocuments({ userId: user.id });
		publishedPosts = await Post.countDocuments({
			userId: user.id,
			status: "published"
		});
		draftPosts = await Post.countDocuments({
			userId: user.id,
			status: "draft"
		});
	} catch (e) {
		console.warn("Could not connect to database:", e);
	}
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard | Lostpeople" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="mb-stack-lg"><h1 class="font-headline-lg text-headline-lg text-primary mb-2">Dashboard</h1><p class="font-meta-italic text-meta-italic text-secondary">Welcome back, ${user?.name || user?.email}</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg"><div class="border border-border-subtle p-stack-md"><p class="font-label-sm text-label-sm text-secondary mb-1">Total Posts</p><p class="font-headline-lg text-headline-lg text-primary">${totalPosts}</p></div><div class="border border-border-subtle p-stack-md"><p class="font-label-sm text-label-sm text-secondary mb-1">Published</p><p class="font-headline-lg text-headline-lg text-primary">${publishedPosts}</p></div><div class="border border-border-subtle p-stack-md"><p class="font-label-sm text-label-sm text-secondary mb-1">Drafts</p><p class="font-headline-lg text-headline-lg text-primary">${draftPosts}</p></div></div><div class="mb-stack-lg"><div class="flex items-center justify-between mb-stack-md"><h2 class="font-headline-md text-headline-md text-primary">Recent Posts</h2><a href="/dashboard/posts/create" class="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors flex items-center gap-1 no-underline"><span class="material-symbols-outlined text-[16px]">add</span>New Post</a></div>${posts.length > 0 ? renderTemplate`<div class="border border-border-subtle divide-y divide-border-subtle">${posts.map((post) => renderTemplate`<div class="flex items-center justify-between px-stack-md py-stack-sm hover:bg-primary/5 transition-colors"><div class="flex-1 min-w-0"><a${addAttribute(`/dashboard/posts/${post._id}`, "href")} class="font-headline-md text-body-md text-primary hover:text-secondary transition-colors no-underline block truncate">${post.title}</a><p class="font-label-sm text-label-sm text-secondary mt-1">${new Date(post.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	})}<span${addAttribute(["ml-2 px-2 py-0.5 text-[11px] uppercase tracking-wider", post.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"], "class:list")}>${post.status}</span></p></div><a${addAttribute(`/dashboard/posts/${post._id}`, "href")} class="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors no-underline ml-4">Edit</a></div>`)}</div>` : renderTemplate`<div class="border border-border-subtle p-stack-lg text-center"><p class="font-meta-italic text-meta-italic text-secondary mb-stack-sm">No posts yet</p><a href="/dashboard/posts/create" class="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors no-underline">Create your first post →</a></div>`}</div>` })}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/index.astro", void 0);
var $$file = "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/index.astro";
var $$url = "/dashboard";
//#endregion
//#region \0virtual:astro:page:src/pages/dashboard/index@_@astro
var page = () => dashboard_exports;
//#endregion
export { page };
