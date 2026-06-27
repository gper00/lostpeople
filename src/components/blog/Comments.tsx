import { useEffect, useMemo, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast, confirmDialog } from '@/lib/ui';
import type { CommentView } from '@/types/comment';

interface Props {
  postId: string;
}

interface Viewer {
  id: string;
  name: string;
  role?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function initial(name: string) {
  return (name.trim()[0] || '?').toUpperCase();
}

export default function Comments({ postId }: Props) {
  const [comments, setComments] = useState<CommentView[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form state
  const [guestName, setGuestName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Anti-bot: timestamp rendered (ms)
  const renderTime = useMemo(() => Date.now(), []);

  const load = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      // leave empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    authClient
      .getSession()
      .then((res: any) => {
        const u = res?.data?.user;
        if (u) {
          setViewer({ id: u.id, name: u.fullname || u.name || u.email, role: u.role });
          setIsAdmin(u.role === 'admin');
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) {
      toast('Comment cannot be empty', 'error');
      return;
    }
    if (!viewer && !guestName.trim()) {
      toast('Please enter your name', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, guestName: guestName.trim(), _t: renderTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post comment');
      setComments((prev) => [data.comment, ...prev]);
      setContent('');
      toast('Comment posted', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (c: CommentView) => {
    const ok = await confirmDialog({
      title: 'Delete comment',
      message: 'This permanently removes the comment.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/comments/${c._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to delete');
      }
      setComments((prev) => prev.filter((x) => x._id !== c._id));
      toast('Comment deleted', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to delete', 'error');
    }
  };

  const toggleHide = async (c: CommentView) => {
    try {
      const res = await fetch(`/api/comments/${c._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: !c.hidden }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to update');
      setComments((prev) =>
        prev.map((x) => (x._id === c._id ? { ...x, hidden: d.hidden } : x))
      );
      toast(d.hidden ? 'Comment hidden' : 'Comment shown', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update', 'error');
    }
  };

  const visibleCount = comments.filter((c) => !c.hidden).length;

  return (
    <div className="mt-10">
      <div className="w-full h-px bg-border-subtle mb-8"></div>
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Comments {!loading && <span className="text-secondary">({visibleCount})</span>}
      </h2>

      {/* Form */}
      <form onSubmit={submit} className="mb-10">
        {viewer ? (
          <p className="text-sm text-secondary mb-2">
            Commenting as <span className="text-primary font-bold">{viewer.name}</span>
          </p>
        ) : (
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
            className="w-full px-3 py-2 mb-2 border border-border-subtle bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors"
          />
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment…"
          rows={3}
          maxLength={2000}
          className="w-full px-3 py-2 border border-border-subtle bg-transparent text-primary text-sm focus:outline-none focus:border-primary transition-colors resize-y"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-primary text-background text-label-sm font-label-sm tracking-wider uppercase hover:bg-on-surface-variant transition-colors cursor-pointer border-0 disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
          {!viewer && (
            <span className="text-xs text-secondary italic">
              Posting as a guest. <a href="/login" className="underline hover:text-primary">Log in</a> to comment with your account.
            </span>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-secondary text-sm italic">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-secondary text-sm italic">No comments yet. Be the first.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {comments.map((c) => (
            <li
              key={c._id}
              className={`flex gap-3 ${c.hidden ? 'opacity-50' : ''}`}
            >
              <div className="shrink-0">
                {c.authorImage ? (
                  <img src={c.authorImage} alt="" className="w-9 h-9 object-cover rounded-full" />
                ) : (
                  <div className="w-9 h-9 bg-primary/10 flex items-center justify-center text-primary text-sm font-bold rounded-full">
                    {initial(c.authorName)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-primary text-sm">{c.authorName}</span>
                  {!c.isRegistered && (
                    <span className="text-[10px] uppercase tracking-wider text-secondary border border-border-subtle px-1.5 py-0.5">
                      Guest
                    </span>
                  )}
                  {c.hidden && (
                    <span className="text-[10px] uppercase tracking-wider text-red-600 border border-red-600/40 px-1.5 py-0.5">
                      Hidden
                    </span>
                  )}
                  <span className="text-xs text-secondary">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-primary mt-1 whitespace-pre-wrap break-words">{c.content}</p>

                {(c.canDelete || isAdmin) && (
                  <div className="flex items-center gap-3 mt-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => toggleHide(c)}
                        className="text-xs text-secondary hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0"
                      >
                        {c.hidden ? 'Unhide' : 'Hide'}
                      </button>
                    )}
                    {c.canDelete && (
                      <button
                        type="button"
                        onClick={() => remove(c)}
                        className="text-xs text-secondary hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
