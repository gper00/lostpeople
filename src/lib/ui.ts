/**
 * Tiny dependency-free UI helpers for the dashboard: toast notifications and a
 * promise-based confirm modal. Styled with the theme CSS variables (defined in
 * global.css) via inline styles so they never depend on Tailwind's on-demand
 * class generation. Safe to import from any client `<script>`.
 */

type ToastType = 'success' | 'error' | 'info';

const ACCENT: Record<ToastType, string> = {
  success: 'oklch(62% 0.17 145)',
  error: 'oklch(58% 0.21 27)',
  info: 'var(--color-secondary)',
};

const ICON: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

function ensureToastHost(): HTMLElement {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    host.setAttribute('aria-live', 'polite');
    host.style.cssText = [
      'position:fixed',
      'z-index:100',
      'bottom:1rem',
      'right:1rem',
      'left:1rem',
      'display:flex',
      'flex-direction:column',
      'align-items:flex-end',
      'gap:0.5rem',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(host);
  }
  return host;
}

export function toast(message: string, type: ToastType = 'info', duration = 3200): void {
  const host = ensureToastHost();
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.style.cssText = [
    'pointer-events:auto',
    'display:flex',
    'align-items:center',
    'gap:0.6rem',
    'max-width:24rem',
    'padding:0.7rem 0.9rem',
    'background:var(--color-background)',
    'color:var(--color-primary)',
    'border:1px solid var(--color-border-subtle)',
    `border-left:3px solid ${ACCENT[type]}`,
    'box-shadow:0 6px 24px rgba(0,0,0,0.12)',
    'font-family:var(--font-body-md)',
    'font-size:14px',
    'opacity:0',
    'transform:translateY(8px)',
    'transition:opacity .2s ease, transform .2s ease',
  ].join(';');

  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined';
  icon.style.cssText = `font-size:18px;color:${ACCENT[type]};flex-shrink:0`;
  icon.textContent = ICON[type];

  const text = document.createElement('span');
  text.textContent = message;

  el.append(icon, text);
  host.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  const dismiss = () => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 220);
  };
  setTimeout(dismiss, duration);
  el.addEventListener('click', dismiss);
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

/** Promise-based confirmation modal. Resolves true on confirm, false otherwise. */
export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:120',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:1rem',
      'background:oklch(25% 0.005 298 / 0.45)',
      'opacity:0',
      'transition:opacity .15s ease',
    ].join(';');

    const card = document.createElement('div');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.style.cssText = [
      'width:100%',
      'max-width:24rem',
      'background:var(--color-background)',
      'border:1px solid var(--color-border-subtle)',
      'padding:1.25rem',
      'box-shadow:0 12px 40px rgba(0,0,0,0.2)',
      'transform:translateY(8px)',
      'transition:transform .15s ease',
      'font-family:var(--font-body-md)',
    ].join(';');

    const accent = opts.danger ? 'oklch(58% 0.21 27)' : 'var(--color-primary)';

    card.innerHTML = `
      ${opts.title ? `<h2 style="font-family:var(--font-headline-md);font-size:18px;color:var(--color-primary);margin:0 0 .4rem">${escapeHtml(opts.title)}</h2>` : ''}
      <p style="font-size:14px;line-height:1.5;color:var(--color-secondary);margin:0 0 1.1rem">${escapeHtml(opts.message)}</p>
      <div style="display:flex;justify-content:flex-end;gap:.6rem">
        <button data-act="cancel" style="padding:.5rem 1rem;font-size:12px;letter-spacing:.05em;text-transform:uppercase;background:transparent;color:var(--color-secondary);border:1px solid var(--color-border-subtle);cursor:pointer">${escapeHtml(opts.cancelLabel || 'Cancel')}</button>
        <button data-act="ok" style="padding:.5rem 1rem;font-size:12px;letter-spacing:.05em;text-transform:uppercase;background:${accent};color:var(--color-background);border:0;cursor:pointer">${escapeHtml(opts.confirmLabel || 'Confirm')}</button>
      </div>`;

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    const cleanup = (result: boolean) => {
      backdrop.style.opacity = '0';
      setTimeout(() => backdrop.remove(), 160);
      document.removeEventListener('keydown', onKey);
      resolve(result);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cleanup(false);
      if (e.key === 'Enter') cleanup(true);
    };
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) cleanup(false);
    });
    card.querySelector('[data-act="cancel"]')!.addEventListener('click', () => cleanup(false));
    const ok = card.querySelector('[data-act="ok"]') as HTMLButtonElement;
    ok.addEventListener('click', () => cleanup(true));
    ok.focus();
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}
