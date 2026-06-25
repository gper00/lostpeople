import { t as Post } from "./Post_B7QHZKFm.mjs";
import slugify from "slugify";
//#region src/lib/slug.ts
async function generateUniqueSlug(title) {
	const baseSlug = slugify(title, {
		lower: true,
		strict: true
	});
	let slug = baseSlug;
	let counter = 1;
	while (await Post.findOne({ slug })) {
		slug = `${baseSlug}-${counter}`;
		counter++;
	}
	return slug;
}
//#endregion
export { generateUniqueSlug as t };
