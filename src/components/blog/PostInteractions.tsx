import { useEffect, useState } from 'react';

interface Props {
  postId: string;
  initialLikes?: number;
}

/**
 * Public like button for a (statically rendered) post page.
 * Views are still recorded silently here (once per browser) for the dashboard,
 * but only the like count is shown to readers. Likes toggle per browser via
 * localStorage so anonymous readers behave sensibly without login.
 */
export default function PostInteractions({ postId, initialLikes = 0 }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked:${postId}`) === '1');

    // Pull live counts (the page HTML is static and may be stale).
    fetch(`/api/posts/${postId}/stats`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.likesCount === 'number') setLikes(d.likesCount);
      })
      .catch(() => {});

    // Count one view per browser per post (silent — not shown publicly).
    const key = `viewed:${postId}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      fetch(`/api/posts/${postId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    }
  }, [postId]);

  const toggleLike = async () => {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    const delta = next ? 1 : -1;

    // Optimistic update.
    setLiked(next);
    setLikes((v) => Math.max(0, v + delta));
    localStorage.setItem(`liked:${postId}`, next ? '1' : '0');

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      const d = await res.json();
      if (typeof d.likesCount === 'number') setLikes(d.likesCount);
    } catch {
      // Revert on failure.
      setLiked(!next);
      setLikes((v) => Math.max(0, v - delta));
      localStorage.setItem(`liked:${postId}`, !next ? '1' : '0');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={busy}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 px-4 py-2 border transition-colors cursor-pointer text-sm ${
        liked
          ? 'text-red-600 border-red-600/40 bg-red-600/5'
          : 'text-secondary border-border-subtle hover:text-primary hover:border-primary'
      }`}
      title={liked ? 'Unlike' : 'Like this post'}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
      <span>{likes}</span>
      <span className="uppercase tracking-wider text-xs">{likes === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
}
