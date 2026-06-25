import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, S as renderSlot, b as renderComponent, j as createAstro, v as renderScript, x as Fragment } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { n as connectDB, t as Post } from "./Post_B7QHZKFm.mjs";
import { t as $$BaseLayout } from "./BaseLayout_C3Fjrrxh.mjs";
//#region src/components/shared/Sidebar.astro
createAstro("https://astro.build");
var $$Sidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Sidebar;
	const navLinks = [
		{
			href: "/",
			label: "Posts"
		},
		{
			href: "/tags",
			label: "Tags"
		},
		{
			href: "/about",
			label: "About"
		}
	];
	const currentPath = Astro.url.pathname;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="hidden md:flex flex-col justify-center py-margin-page px-gutter h-screen max-w-[350px] sticky top-0 w-[30%] border-l border-border-subtle bg-background z-10"><div class="mb-stack-lg"><a class="text-display-lg font-display-lg italic text-primary block mb-unit" href="/">Lostpeople</a><p class="font-meta-italic text-meta-italic text-secondary">Revive the beauty of typography</p></div><nav class="flex flex-col gap-stack-md mb-stack-lg">${navLinks.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["text-secondary hover:text-primary transition-colors w-max font-headline-md text-headline-md italic", currentPath === href ? "text-primary border-b-4 border-accent-highlight pb-1 font-bold" : ""], "class:list")}>${label}</a>`)}</nav><!-- Search --><div class="mb-stack-lg"><form action="/search" method="GET" class="flex items-center border border-border-subtle"><input type="text" name="q" placeholder="Search..." class="flex-1 px-3 py-2 bg-transparent text-primary font-body-md text-body-md focus:outline-none border-0"><button type="submit" class="px-3 py-2 hover:bg-primary/5 transition-colors cursor-pointer border-0 bg-transparent" aria-label="Search"><span class="material-symbols-outlined text-[18px] text-secondary">search</span></button></form></div><div class="flex items-center gap-stack-sm mb-stack-lg text-secondary"><button id="font-size-toggle" class="hover:text-primary cursor-pointer transition-colors" aria-label="Toggle font size"><span class="material-symbols-outlined">format_size</span></button><button id="theme-toggle" class="hover:text-primary cursor-pointer transition-colors" aria-label="Toggle theme"><span class="material-symbols-outlined">contrast</span></button></div><div class="mt-auto"><p class="font-label-sm text-label-sm text-secondary mb-2">RSS / GitHub / Email</p><p class="font-label-sm text-label-sm text-on-tertiary-container">© 2025-2026 Lostpeople.<br>Powered by Astro and Retypeset.</p></div></aside>${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/components/shared/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/components/shared/Sidebar.astro", void 0);
//#endregion
//#region src/components/shared/MobileNav.astro
createAstro("https://astro.build");
var $$MobileNav = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$MobileNav;
	const navLinks = [
		{
			href: "/",
			label: "Posts"
		},
		{
			href: "/tags",
			label: "Tags"
		},
		{
			href: "/about",
			label: "About"
		}
	];
	const currentPath = Astro.url.pathname;
	return renderTemplate`${maybeRenderHead($$result)}<!-- Mobile Header --><header class="fixed top-0 w-full z-40 md:hidden bg-background/90 backdrop-blur-md border-b border-border-subtle flex justify-between items-center px-gutter py-4"><a class="font-headline-lg-mobile text-headline-lg-mobile italic text-primary" href="/">Lostpeople</a><div class="flex items-center gap-stack-sm"><button class="text-primary cursor-pointer" id="menu-btn" aria-label="Open menu"><span class="material-symbols-outlined">menu</span></button></div></header><!-- Mobile Menu Overlay --><div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[50] hidden opacity-0 transition-opacity duration-300 md:hidden" id="menu-overlay"></div><!-- Mobile Navigation Menu --><div class="fixed inset-y-0 right-0 z-[60] w-64 bg-background shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out md:hidden flex flex-col px-gutter py-margin-page" id="mobile-menu"><div class="flex justify-end mb-8"><button class="text-primary cursor-pointer text-[24px]" id="close-menu" aria-label="Close menu"><span class="material-symbols-outlined">close</span></button></div><nav class="flex flex-col gap-stack-md">${navLinks.map(({ href, label }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["text-secondary hover:text-primary transition-colors w-max font-headline-md text-headline-md italic", currentPath === href ? "text-primary border-b-4 border-accent-highlight pb-1 font-bold" : ""], "class:list")}>${label}</a>`)}</nav><div class="mt-auto border-t border-border-subtle pt-stack-md"><div class="flex gap-4 mb-6"><a aria-label="RSS" class="text-secondary hover:text-primary" href="/rss.xml"><span class="material-symbols-outlined">rss_feed</span></a><button aria-label="Toggle Dark Mode" class="text-secondary hover:text-primary" id="mobile-theme-toggle"><span class="material-symbols-outlined">dark_mode</span></button></div><p class="font-label-sm text-label-sm text-on-secondary-container">© 2025-2026 Lostpeople.</p></div></div>${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/components/shared/MobileNav.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/components/shared/MobileNav.astro", void 0);
//#endregion
//#region src/layouts/BlogLayout.astro
createAstro("https://astro.build");
var $$BlogLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlogLayout;
	const { title, description, image, url, keywords } = Astro.props;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": title,
		"description": description,
		"image": image,
		"url": url,
		"keywords": keywords
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "MobileNav", $$MobileNav, {})}${maybeRenderHead($$result)}<div class="max-w-[1100px] mx-auto min-h-screen relative md:flex justify-between pt-24 md:pt-0"><!-- Left: Main Content Canvas (70%) --><main class="w-full md:w-[70%] px-gutter md:px-margin-page py-margin-page mt-[80px] md:mt-0">${renderSlot($$result, $$slots["default"])}</main><!-- Right: SideNavBar (30%) - Fixed position on Web -->${renderComponent($$result, "Sidebar", $$Sidebar, {})}</div>` })}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/layouts/BlogLayout.astro", void 0);
//#endregion
//#region src/components/blog/PostItem.astro
createAstro("https://astro.build");
var $$PostItem = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostItem;
	const { post } = Astro.props;
	const formattedDate = new Date(post.createdAt).toISOString().split("T")[0];
	return renderTemplate`${maybeRenderHead($$result)}<article class="group cursor-pointer"><a${addAttribute(`/posts/${post.slug}`, "href")} class="block"><h2 class="font-headline-lg text-headline-lg text-primary mb-2 group-hover:text-secondary transition-colors">${post.title}</h2><div class="flex items-center gap-2 font-meta-italic text-meta-italic text-secondary mb-4"><time${addAttribute(formattedDate, "datetime")}>${formattedDate}</time>${post.category && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<span class="text-border-subtle px-1">•</span><span>${post.category}</span>` })}`}</div><p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">${post.excerpt}</p></a></article><div class="w-10 h-px bg-border-subtle"></div>`;
}, "/home/gper/Desktop/webdev/lostpeople/src/components/blog/PostItem.astro", void 0);
//#endregion
//#region src/pages/search.astro
var search_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Search,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Search = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Search;
	const query = Astro.url.searchParams.get("q") || "";
	let posts = [];
	if (query.trim()) try {
		await connectDB();
		const regex = new RegExp(query, "i");
		posts = await Post.find({
			status: "published",
			$or: [
				{ title: regex },
				{ excerpt: regex },
				{ tags: regex },
				{ category: regex }
			]
		}).sort({ createdAt: -1 }).populate("userId", "fullname username image").lean();
	} catch (e) {
		console.warn("Search failed:", e);
	}
	return renderTemplate`${renderComponent($$result, "BlogLayout", $$BlogLayout, {
		"title": query ? `Search: ${query} | Lostpeople` : "Search | Lostpeople",
		"description": query ? `Search results for "${query}"` : "Search posts on Lostpeople"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="mb-stack-lg"><h1 class="font-display-lg text-display-lg text-primary mb-stack-sm">Search</h1><div class="w-full h-px bg-border-subtle"></div></div><form action="/search" method="GET" class="mb-stack-lg"><div class="flex items-center border border-border-subtle"><input type="text" name="q"${addAttribute(query, "value")} placeholder="Search posts..." class="flex-1 px-4 py-3 bg-transparent text-primary font-body-md text-body-lg focus:outline-none border-0" autofocus><button type="submit" class="px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer border-0 bg-transparent"><span class="material-symbols-outlined text-[20px] text-secondary">search</span></button></div></form>${query.trim() ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<p class="font-meta-italic text-meta-italic text-secondary mb-stack-md">${posts.length} result${posts.length !== 1 ? "s" : ""} for "${query}"</p>${posts.length > 0 ? renderTemplate`<div class="flex flex-col gap-stack-lg">${posts.map((post) => renderTemplate`${renderComponent($$result, "PostItem", $$PostItem, { "post": post })}`)}</div>` : renderTemplate`<p class="font-meta-italic text-meta-italic text-secondary">No posts found. Try a different search term.</p>`}` })}` : renderTemplate`<p class="font-meta-italic text-meta-italic text-secondary">Enter a search term to find posts.</p>`}` })}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/pages/search.astro", void 0);
var $$file = "/home/gper/Desktop/webdev/lostpeople/src/pages/search.astro";
var $$url = "/search";
//#endregion
//#region \0virtual:astro:page:src/pages/search@_@astro
var page = () => search_exports;
//#endregion
export { page };
