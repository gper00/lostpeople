export function capitalizeEachWord(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function timeSince(date: Date | string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} year(s)`;

  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} month(s)`;

  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} day(s)`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hour(s)`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minute(s)`;

  return `${Math.floor(seconds)} second(s)`;
}

export function extractPublicId(url: string): string {
  const parts = url.split('/');
  const fileName = parts.pop()!;
  const folderPath = parts.slice(-2).join('/');
  return `${folderPath}/${fileName.split('.')[0]}`;
}
