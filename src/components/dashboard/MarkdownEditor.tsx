import { useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import { toast } from '@/lib/ui';

interface MarkdownEditorProps {
  content: string;
  /**
   * id of a hidden <input> the editor keeps in sync with the markdown value.
   * Astro islands can't receive function props, so we write to the DOM directly
   * instead of taking an onChange callback.
   */
  targetId: string;
}

type ToolAction =
  | { kind: 'wrap'; before: string; after: string; placeholder: string }
  | { kind: 'line'; prefix: string }
  | { kind: 'link' }
  | { kind: 'image' }
  | { kind: 'hr' };

interface Tool {
  icon: string;
  label: string;
  text?: string; // text shown instead of icon
  action: ToolAction;
}

const TOOLS: Tool[] = [
  { icon: 'format_bold', label: 'Bold', action: { kind: 'wrap', before: '**', after: '**', placeholder: 'bold text' } },
  { icon: 'format_italic', label: 'Italic', action: { kind: 'wrap', before: '*', after: '*', placeholder: 'italic text' } },
  { icon: 'code', label: 'Inline code', action: { kind: 'wrap', before: '`', after: '`', placeholder: 'code' } },
  { icon: 'title', label: 'Heading 2', action: { kind: 'line', prefix: '## ' } },
  { icon: '', text: 'H3', label: 'Heading 3', action: { kind: 'line', prefix: '### ' } },
  { icon: 'format_list_bulleted', label: 'Bullet list', action: { kind: 'line', prefix: '- ' } },
  { icon: 'format_list_numbered', label: 'Numbered list', action: { kind: 'line', prefix: '1. ' } },
  { icon: 'format_quote', label: 'Quote', action: { kind: 'line', prefix: '> ' } },
  { icon: 'code_blocks', label: 'Code block', action: { kind: 'wrap', before: '\n```\n', after: '\n```\n', placeholder: 'code' } },
  { icon: 'link', label: 'Link', action: { kind: 'link' } },
  { icon: 'image', label: 'Upload image', action: { kind: 'image' } },
  { icon: 'horizontal_rule', label: 'Horizontal rule', action: { kind: 'hr' } },
];

export default function MarkdownEditor({ content, targetId }: MarkdownEditorProps) {
  const [value, setValue] = useState(content || '');
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const syncTarget = (next: string) => {
    const target = document.getElementById(targetId) as HTMLInputElement | null;
    if (target) target.value = next;
  };

  // Keep the hidden input in sync on every change.
  const update = (next: string) => {
    setValue(next);
    syncTarget(next);
  };

  useEffect(() => {
    syncTarget(value);
    // Expose a global setter so automation / browser tools can inject content.
    (window as any).__setPostContent = (text: string) => {
      update(text);
    };
    return () => {
      delete (window as any).__setPostContent;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-grow the textarea so long content is never clipped at the bottom.
  const autoGrow = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.max(ta.scrollHeight, 420) + 'px';
  };
  useEffect(autoGrow, [value]);
  useEffect(() => {
    if (tab === 'write') autoGrow();
  }, [tab]);

  const html = useMemo(() => {
    try {
      return marked.parse(value || '*Nothing to preview yet.*') as string;
    } catch {
      return '';
    }
  }, [value]);

  const focusTextarea = () => textareaRef.current?.focus();

  const replaceRange = (start: number, end: number, insert: string, selStart: number, selEnd: number) => {
    const next = value.slice(0, start) + insert + value.slice(end);
    update(next);
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  };

  const applyWrap = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = value.slice(s, e) || placeholder;
    const insert = before + selected + after;
    replaceRange(s, e, insert, s + before.length, s + before.length + selected.length);
  };

  const applyLinePrefix = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const insert = prefix;
    replaceRange(lineStart, lineStart, insert, s + insert.length, e + insert.length);
  };

  const applyHr = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const insert = '\n\n---\n\n';
    replaceRange(s, s, insert, s + insert.length, s + insert.length);
  };

  const applyLink = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const url = window.prompt('URL:');
    if (!url) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const text = value.slice(s, e) || 'link text';
    const insert = `[${text}](${url})`;
    replaceRange(s, e, insert, s + 1, s + 1 + text.length);
  };

  const uploadImage = () => {
    // Capture the caret position before the file dialog steals focus.
    const ta = textareaRef.current;
    const caret = ta?.selectionStart ?? value.length;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    // Some browsers only fire `change` for inputs attached to the document.
    input.style.display = 'none';
    document.body.appendChild(input);

    const cleanup = () => {
      input.remove();
    };

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) {
        cleanup();
        return;
      }
      const fd = new FormData();
      fd.append('file', file);
      try {
        toast('Uploading image…', 'info');
        const res = await fetch('/api/posts/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
        // Read the live value off the textarea to avoid inserting into a stale snapshot.
        const live = textareaRef.current?.value ?? value;
        const s = Math.min(caret, live.length);
        const insert = `\n![](${data.url})\n`;
        const next = live.slice(0, s) + insert + live.slice(s);
        update(next);
        requestAnimationFrame(() => {
          const t = textareaRef.current;
          if (!t) return;
          t.focus();
          const pos = s + insert.length;
          t.setSelectionRange(pos, pos);
        });
        toast('Image uploaded', 'success');
      } catch (err: any) {
        toast(err.message || 'Upload failed', 'error');
      } finally {
        cleanup();
      }
    });

    input.click();
  };

  const run = (action: ToolAction) => {
    switch (action.kind) {
      case 'wrap':
        return applyWrap(action.before, action.after, action.placeholder);
      case 'line':
        return applyLinePrefix(action.prefix);
      case 'link':
        return applyLink();
      case 'image':
        return uploadImage();
      case 'hr':
        return applyHr();
    }
  };

  return (
    <div className="border border-border-subtle bg-transparent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border-subtle">
        {TOOLS.map((t, i) => (
          <button
            key={i}
            type="button"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => run(t.action)}
            className="p-1.5 hover:bg-primary/10 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center min-w-[30px]"
            title={t.label}
            aria-label={t.label}
          >
            {t.text ? (
              <span className="font-bold text-sm">{t.text}</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            )}
          </button>
        ))}

        {/* Tab switch (small screens) */}
        <div className="ml-auto flex md:hidden border border-border-subtle">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-3 py-1 text-[12px] uppercase tracking-wider cursor-pointer border-0 ${tab === 'write' ? 'bg-primary text-background' : 'bg-transparent text-secondary'}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-3 py-1 text-[12px] uppercase tracking-wider cursor-pointer border-0 ${tab === 'preview' ? 'bg-primary text-background' : 'bg-transparent text-secondary'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Write / Preview */}
      <div className="grid md:grid-cols-2 md:divide-x divide-border-subtle">
        {/* Write */}
        <div className={tab === 'write' ? 'block' : 'hidden md:block'}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => update(e.target.value)}
            onFocus={focusTextarea}
            spellCheck={false}
            placeholder="Write in Markdown… (## heading, **bold**, - list)"
            className="w-full min-h-[420px] p-4 bg-transparent text-primary font-mono text-[14px] leading-[1.7] focus:outline-none resize-none overflow-hidden block"
          />
        </div>

        {/* Preview */}
        <div className={tab === 'preview' ? 'block' : 'hidden md:block'}>
          <div
            className="prose prose-lg min-h-[420px] p-4 overflow-auto max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
