import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, b as renderComponent, j as createAstro, v as renderScript } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { n as connectDB, t as Post } from "./Post_B7QHZKFm.mjs";
import { t as $$DashboardLayout } from "./DashboardLayout_CROfiyjV.mjs";
import { t as TipTapEditor } from "./TipTapEditor_CbrXHtLY.mjs";
//#region src/pages/dashboard/posts/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const user = Astro.locals.user;
	if (!user) return Astro.redirect("/login");
	const { id } = Astro.params;
	let post = null;
	try {
		await connectDB();
		post = await Post.findById(id).lean();
		if (!post || post.userId.toString() !== user.id) return Astro.redirect("/dashboard/posts");
	} catch (e) {
		console.warn("Could not connect to database:", e);
		return Astro.redirect("/dashboard/posts");
	}
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": `Edit: ${post?.title || "Post"} | Lostpeople Dashboard` }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="mb-stack-lg"><a href="/dashboard/posts" class="inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary hover:text-primary transition-colors mb-stack-md group no-underline"><span class="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_left_alt</span>BACK TO POSTS</a><h1 class="font-headline-lg text-headline-lg text-primary">Edit Post</h1></div><form id="edit-post-form" class="flex flex-col gap-stack-md max-w-3xl"${addAttribute(post?._id, "data-id")}><!-- Title --><div><label for="title" class="font-label-sm text-label-sm text-secondary block mb-1">Title</label><input type="text" id="title" name="title" required${addAttribute(10, "minlength")}${addAttribute(255, "maxlength")}${addAttribute(post?.title || "", "value")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-headline-md text-headline-md focus:outline-none focus:border-primary transition-colors"></div><!-- Excerpt --><div><label for="excerpt" class="font-label-sm text-label-sm text-secondary block mb-1">Excerpt</label><textarea id="excerpt" name="excerpt" required${addAttribute(30, "minlength")}${addAttribute(500, "maxlength")}${addAttribute(3, "rows")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors resize-y">${post?.excerpt || ""}</textarea></div><!-- Content --><div><label class="font-label-sm text-label-sm text-secondary block mb-1">Content</label>${renderComponent($$result, "TipTapEditor", TipTapEditor, {
		"client:load": true,
		"content": post?.content || "",
		"onChange": ((html) => {
			document.getElementById("content").value = html;
		}),
		"client:component-hydration": "load",
		"client:component-path": "@/components/dashboard/TipTapEditor",
		"client:component-export": "default"
	})}<input type="hidden" id="content" name="content"${addAttribute(post?.content || "", "value")}></div><!-- Category --><div><label for="category" class="font-label-sm text-label-sm text-secondary block mb-1">Category</label><input type="text" id="category" name="category"${addAttribute(25, "maxlength")}${addAttribute(post?.category || "", "value")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"></div><!-- Tags --><div><label for="tags" class="font-label-sm text-label-sm text-secondary block mb-1">Tags (comma separated)</label><input type="text" id="tags" name="tags"${addAttribute(post?.tags?.join(", ") || "", "value")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"></div><!-- Thumbnail --><div><label for="thumbnail" class="font-label-sm text-label-sm text-secondary block mb-1">Thumbnail URL</label><input type="url" id="thumbnail" name="thumbnail"${addAttribute(post?.thumbnail || "", "value")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"></div><!-- Status --><div><label for="status" class="font-label-sm text-label-sm text-secondary block mb-1">Status</label><select id="status" name="status" class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"><option value="draft"${addAttribute(post?.status === "draft", "selected")}>Draft</option><option value="published"${addAttribute(post?.status === "published", "selected")}>Published</option><option value="archived"${addAttribute(post?.status === "archived", "selected")}>Archived</option></select></div><!-- Error message --><div id="error-message" class="text-red-600 font-label-sm text-label-sm hidden"></div><!-- Submit --><div class="flex items-center gap-stack-sm mt-stack-md"><button type="submit" id="submit-btn" class="px-6 py-3 bg-primary text-background font-label-sm text-label-sm tracking-wider uppercase hover:bg-on-surface-variant transition-colors cursor-pointer border-0">Save Changes</button><a href="/dashboard/posts" class="px-6 py-3 border border-border-subtle text-primary font-label-sm text-label-sm tracking-wider uppercase hover:bg-primary/5 transition-colors no-underline">Cancel</a></div></form>` })}${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/[id].astro", void 0);
var $$file = "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/[id].astro";
var $$url = "/dashboard/posts/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/dashboard/posts/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
