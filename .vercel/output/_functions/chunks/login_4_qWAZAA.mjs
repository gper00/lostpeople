import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as renderTemplate, E as maybeRenderHead, M as createComponent, O as addAttribute, b as renderComponent, j as createAstro, v as renderScript } from "./render_C3nYDF00.mjs";
import "./compiler_0PBYMGTh.mjs";
import { t as $$BaseLayout } from "./BaseLayout_C3Fjrrxh.mjs";
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Login = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Login;
	if (Astro.locals.user) return Astro.redirect("/dashboard");
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Login | Lostpeople" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="min-h-screen flex items-center justify-center px-gutter"><div class="w-full max-w-md"><!-- Branding --><div class="mb-stack-lg text-center"><a href="/" class="font-display-lg text-display-lg text-primary italic">Lostpeople</a><p class="font-meta-italic text-meta-italic text-secondary mt-2">Revive the beauty of typography</p></div><!-- Login Form --><div class="border border-border-subtle p-stack-lg"><h1 class="font-headline-lg text-headline-lg text-primary mb-stack-md">Sign In</h1><form id="login-form" class="flex flex-col gap-stack-md"><div><label for="email" class="font-label-sm text-label-sm text-secondary block mb-1">Email</label><input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"></div><div><label for="password" class="font-label-sm text-label-sm text-secondary block mb-1">Password</label><input type="password" id="password" name="password" required${addAttribute(8, "minlength")} class="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary font-body-md focus:outline-none focus:border-primary transition-colors"></div><div id="error-message" class="text-red-600 font-label-sm text-label-sm hidden"></div><button type="submit" id="submit-btn" class="w-full py-3 bg-primary text-background font-label-sm text-label-sm tracking-wider uppercase hover:bg-on-surface-variant transition-colors cursor-pointer border-0">Sign In</button></form></div><!-- Back to site --><div class="mt-stack-md text-center"><a href="/" class="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors">← Back to Lostpeople</a></div></div></div>` })}${renderScript($$result, "/home/gper/Desktop/webdev/lostpeople/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/gper/Desktop/webdev/lostpeople/src/pages/login.astro", void 0);
var $$file = "/home/gper/Desktop/webdev/lostpeople/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
