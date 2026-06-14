export interface TimeParts {
  h: number;
  m: number;
  s: number;
  ms: number;
  date: Date;
}

export function getTimeParts(tz: string): TimeParts {
  const now = new Date();
  const ms = now.getMilliseconds();

  if (tz && tz !== 'local') {
    try {
      const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
      const parts = fmt.formatToParts(now);
      const get = (type: string) =>
        parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);
      const h = get('hour') % 24; // some impls return 24 at midnight
      const m = get('minute');
      const s = get('second');
      const dateStr = now.toLocaleString('en-US', { timeZone: tz });
      return { h, m, s, ms, date: new Date(dateStr) };
    } catch {
      // fall through to local
    }
  }

  return {
    h: now.getHours(),
    m: now.getMinutes(),
    s: now.getSeconds(),
    ms,
    date: now,
  };
}

export function formatDate(d: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>"']/g,
    (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] ?? m),
  );
}

export function escapeAttr(s: string): string {
  return String(s).replace(/"/g, '&quot;');
}

export function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}
