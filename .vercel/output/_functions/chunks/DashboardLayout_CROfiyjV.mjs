import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, S as renderSlot, b as renderComponent, j as createAstro, v as renderScript } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { t as $$BaseLayout } from "./BaseLayout_C3Fjrrxh.mjs";
//#region src/layouts/DashboardLayout.astro
createAstro("https://astro.build");
var $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$DashboardLayout;
	const { title, description } = Astro.props;
	const user = Astro.locals.user;
	const currentPath = Astro.url.pathname;
	const navItems = [
		{
			href: "/dashboard",
			label: "Dashboard",
			icon: "dashboard"
		},
		{
			href: "/dashboard/posts",
			label: "Posts",
			icon: "article"
		},
		{
			href: "/dashboard/users",
			label: "Users",
			icon: "people"
		},
		{
			href: "/dashboard/categories",
			label: "Categories",
			icon: "category"
		}
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": title,
		"description": description
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen bg-background"><!-- Top bar --><header class="fixed top-0 left-0 right-0 h-16 border-b border-border-subtle bg-background z-50 flex items-center justify-between px-6"><a href="/" class="font-display-lg text-headline-md italic text-primary">Lostpeople</a><div class="flex items-center gap-4"><span class="font-label-sm text-label-sm text-secondary">${user?.name || user?.email || "Admin"}</span><button id="logout-btn" class="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors cursor-pointer bg-transparent border-0">Sign Out</button></div></header><div class="flex pt-16"><!-- Sidebar --><aside class="fixed left-0 top-16 bottom-0 w-60 border-r border-border-subtle bg-background hidden md:block"><nav class="flex flex-col gap-1 p-4">${navItems.map(({ href, label, icon }) => renderTemplate`<a${addAttribute(href, "href")}${addAttribute(["flex items-center gap-3 px-3 py-2 font-label-sm text-label-sm transition-colors no-underline", currentPath === href || href !== "/dashboard" && currentPath.startsWith(href) ? "text-primary bg-accent-highlight/10 border-l-2 border-accent-highlight" : "text-secondary hover:text-primary hover:bg-primary/5"], "class:list")}><span class="material-symbols-outlined text-[18px]">${icon}</span>${label}</a>`)}</nav><div class="absolute bottom-0 left-0 right-0 p-4 border-t border-border-subtle"><a href="/" class="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-2 no-underline"><span class="material-symbols-outlined text-[16px]">arrow_back</span>View Site</a></div></aside><!-- Main content --><main class="flex-1 md:ml-60 p-6 md:p-8">${renderSlot($$result, $$slots["default"])}</main></div></div>` })}${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/layouts/DashboardLayout.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/layouts/DashboardLayout.astro", void 0);
//#endregion
export { $$DashboardLayout as t };
