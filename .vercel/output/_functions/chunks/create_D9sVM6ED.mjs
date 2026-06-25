import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, b as renderComponent, j as createAstro, v as renderScript } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { t as $$DashboardLayout } from "./DashboardLayout_CROfiyjV.mjs";
import { t as TipTapEditor } from "./TipTapEditor_CbrXHtLY.mjs";
//#region src/pages/dashboard/posts/create.astro
var create_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Create,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Create = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Create;
	if (!Astro.locals.user) return Astro.redirect("/login");
	return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Create Post | Lostpeople Dashboard" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="mb-stack-lg"><a href="/dashboard/posts" class="inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary hover:text-primary transition-colors mb-stack-md group no-underline"><span class="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_left_alt</span>BACK TO POSTS</a><h1 class="font-headline-lg text-headline-lg text-primary">Create Post</h1></div><form id="create-post-form" class="flex flex-col gap-stack-md max-w-3xl"><!-- Title --><div><label for="title" class="font-label-sm text-label-sm text-secondary block mb-1">Title</label><input type="text" id="title" name="title" required${addAttribute(10, "minlength")}${addAttribute(255, "maxlength")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-headline-md text-headline-md focus:outline-none focus:border-primary transition-colors" placeholder="Post title"></div><!-- Excerpt --><div><label for="excerpt" class="font-label-sm text-label-sm text-secondary block mb-1">Excerpt</label><textarea id="excerpt" name="excerpt" required${addAttribute(30, "minlength")}${addAttribute(500, "maxlength")}${addAttribute(3, "rows")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors resize-y" placeholder="Brief description of the post"></textarea></div><!-- Content --><div><label class="font-label-sm text-label-sm text-secondary block mb-1">Content</label>${renderComponent($$result, "TipTapEditor", TipTapEditor, {
		"client:load": true,
		"content": "",
		"onChange": ((html) => {
			document.getElementById("content").value = html;
		}),
		"client:component-hydration": "load",
		"client:component-path": "@/components/dashboard/TipTapEditor",
		"client:component-export": "default"
	})}<input type="hidden" id="content" name="content"></div><!-- Category --><div><label for="category" class="font-label-sm text-label-sm text-secondary block mb-1">Category</label><input type="text" id="category" name="category"${addAttribute(25, "maxlength")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors" placeholder="e.g., Technology, Life, Philosophy"></div><!-- Tags --><div><label for="tags" class="font-label-sm text-label-sm text-secondary block mb-1">Tags (comma separated)</label><input type="text" id="tags" name="tags" class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors" placeholder="e.g., javascript, react, web"></div><!-- Thumbnail --><div><label for="thumbnail" class="font-label-sm text-label-sm text-secondary block mb-1">Thumbnail URL</label><input type="url" id="thumbnail" name="thumbnail" class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors" placeholder="https://..."></div><!-- Status --><div><label for="status" class="font-label-sm text-label-sm text-secondary block mb-1">Status</label><select id="status" name="status" class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"><option value="draft">Draft</option><option value="published">Published</option></select></div><!-- Error message --><div id="error-message" class="text-red-600 font-label-sm text-label-sm hidden"></div><!-- Submit --><div class="flex items-center gap-stack-sm mt-stack-md"><button type="submit" id="submit-btn" class="px-6 py-3 bg-primary text-background font-label-sm text-label-sm tracking-wider uppercase hover:bg-on-surface-variant transition-colors cursor-pointer border-0">Create Post</button><a href="/dashboard/posts" class="px-6 py-3 border border-border-subtle text-primary font-label-sm text-label-sm tracking-wider uppercase hover:bg-primary/5 transition-colors no-underline">Cancel</a></div></form>` })}${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/create.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/create.astro", void 0);
var $$file = "/home/gper/Desktop/webdev/lostpeople/src/pages/dashboard/posts/create.astro";
var $$url = "/dashboard/posts/create";
//#endregion
//#region \0virtual:astro:page:src/pages/dashboard/posts/create@_@astro
var page = () => create_exports;
//#endregion
export { page };
