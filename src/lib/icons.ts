
const svg = (paths: string, extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${extra}>${paths}</svg>`;

export const ICONS = {
  phone: svg(
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  ),
  pin: svg(
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  ),
  mail: svg(
    '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  ),
  clock: svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  chevron: svg('<path d="m6 9 6 6 6-6"/>'),
  arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  arrowUpRight: svg('<path d="M7 17 17 7"/><path d="M9 7h8v8"/>'),
  menu: svg('<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>'),
  close: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>', 'stroke-width="2.2"'),
  shield: svg(
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  ),
  book: svg(
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  ),
  cap: svg(
    '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
  ),
  heart: svg(
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  ),
  target: svg(
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  ),
  users: svg(
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  ),
  sparkle: svg(
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17.5 19.7 19.3 21.5 20 19.7 20.7 19 22.5 18.3 20.7 16.5 20 18.3 19.3z"/>',
  ),
  calendar: svg(
    '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/>',
  ),
  zalo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 5.8 2 10.4c0 2.6 1.4 4.9 3.6 6.5-.1.9-.5 2.3-1.4 3.6-.2.3.1.7.5.6 1.9-.5 3.4-1.5 4.3-2.2 1 .2 1.9.3 3 .3 5.5 0 10-3.8 10-8.4S17.5 2 12 2z"/></svg>`,
} as const;

export const COURSE_ICONS = {
  hsk: ICONS.target,
  tocfl: ICONS.shield,
  seed: svg(
    '<path d="M12 21V9"/><path d="M12 9C12 5.7 9.3 3 6 3v2c0 3.3 2.7 6 6 6z"/><path d="M12 9c0-3.3 2.7-6 6-6v2c0 3.3-2.7 6-6 6z"/><path d="M5 21h14"/>',
  ),
  growth: svg(
    '<path d="M3 17l5-5 4 3 4-6 5 4"/><path d="M3 21h18"/>',
  ),
  peak: svg('<path d="m3 19 6.5-13 4 7 2.5-4L21 19H3z"/>'),
  chat: svg(
    '<path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.3-4.3A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01"/><path d="M12 12h.01"/><path d="M15.5 12h.01"/>',
  ),
  briefcase: svg(
    '<rect width="20" height="13" x="2" y="7" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M2 12h20"/>',
  ),
  vip: ICONS.sparkle,
  kids: svg(
    '<circle cx="12" cy="9" r="5"/><path d="M9 8.5h.01"/><path d="M15 8.5h.01"/><path d="M10 11.5c.6.6 1.2.9 2 .9s1.4-.3 2-.9"/><path d="M5 21c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"/>',
  ),
  senior: ICONS.users,
} as const;
