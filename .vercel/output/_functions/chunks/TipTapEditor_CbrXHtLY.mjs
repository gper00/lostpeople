import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/dashboard/TipTapEditor.tsx
var lowlight = createLowlight(common);
function TipTapEditor({ content, onChange }) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({ codeBlock: false }),
			Placeholder.configure({ placeholder: "Start writing..." }),
			Highlight,
			Link.configure({ openOnClick: false }),
			Image,
			CodeBlockLowlight.configure({ lowlight })
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: { attributes: { class: "prose prose-lg focus:outline-none min-h-[400px] px-0 py-0" } }
	});
	if (!editor) return null;
	const addImage = async () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			const formData = new FormData();
			formData.append("file", file);
			try {
				const data = await (await fetch("/api/posts/upload", {
					method: "POST",
					body: formData
				})).json();
				if (data.url) editor.chain().focus().setImage({ src: data.url }).run();
			} catch (err) {
				console.error("Upload failed:", err);
			}
		};
		input.click();
	};
	const setLink = () => {
		const url = window.prompt("URL:");
		if (url) editor.chain().focus().setLink({ href: url }).run();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "border border-[#E5E5E5] bg-transparent",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#E5E5E5]",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleBold().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("bold") ? "bg-[#f4f3f5]" : ""}`,
					title: "Bold",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "format_bold"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleItalic().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("italic") ? "bg-[#f4f3f5]" : ""}`,
					title: "Italic",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "format_italic"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleStrike().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("strike") ? "bg-[#f4f3f5]" : ""}`,
					title: "Strikethrough",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "strikethrough_s"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleCode().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("code") ? "bg-[#f4f3f5]" : ""}`,
					title: "Inline Code",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "code"
					})
				}),
				/* @__PURE__ */ jsx("div", { className: "w-px h-5 bg-[#E5E5E5] mx-1" }),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("heading", { level: 2 }) ? "bg-[#f4f3f5]" : ""}`,
					title: "Heading 2",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "title"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("heading", { level: 3 }) ? "bg-[#f4f3f5]" : ""}`,
					title: "Heading 3",
					children: /* @__PURE__ */ jsx("span", {
						className: "font-bold text-sm",
						children: "H3"
					})
				}),
				/* @__PURE__ */ jsx("div", { className: "w-px h-5 bg-[#E5E5E5] mx-1" }),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleBulletList().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("bulletList") ? "bg-[#f4f3f5]" : ""}`,
					title: "Bullet List",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "format_list_bulleted"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleOrderedList().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("orderedList") ? "bg-[#f4f3f5]" : ""}`,
					title: "Numbered List",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "format_list_numbered"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleBlockquote().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("blockquote") ? "bg-[#f4f3f5]" : ""}`,
					title: "Blockquote",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "format_quote"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().toggleCodeBlock().run(),
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("codeBlock") ? "bg-[#f4f3f5]" : ""}`,
					title: "Code Block",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "code_blocks"
					})
				}),
				/* @__PURE__ */ jsx("div", { className: "w-px h-5 bg-[#E5E5E5] mx-1" }),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: setLink,
					className: `p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent ${editor.isActive("link") ? "bg-[#f4f3f5]" : ""}`,
					title: "Add Link",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "link"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: addImage,
					className: "p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent",
					title: "Add Image",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "image"
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().setHorizontalRule().run(),
					className: "p-1.5 hover:bg-[#f4f3f5] transition-colors cursor-pointer border-0 bg-transparent",
					title: "Horizontal Rule",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "horizontal_rule"
					})
				})
			]
		}), /* @__PURE__ */ jsx(EditorContent, {
			editor,
			className: "p-4 font-['EB_Garamond',serif] text-[20px] leading-[1.8]"
		})]
	});
}
//#endregion
export { TipTapEditor as t };
