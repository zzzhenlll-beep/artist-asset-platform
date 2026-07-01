export function artPlaceholderSvg(options: {
  title: string;
  subtitle?: string;
  width?: number;
  height?: number;
  variant?: "portrait" | "landscape" | "square";
}) {
  const width =
    options.width ??
    (options.variant === "portrait" ? 800 : options.variant === "square" ? 400 : 1200);
  const height =
    options.height ??
    (options.variant === "portrait" ? 1000 : options.variant === "square" ? 400 : 900);
  const subtitle = options.subtitle ?? "René Magritte · 玛格丽特档案馆";
  const title = escapeXml(options.title);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="55%" stop-color="#2d4a6f"/>
      <stop offset="100%" stop-color="#c4b5a0"/>
    </linearGradient>
    <linearGradient id="frame" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5f0e8"/>
      <stop offset="100%" stop-color="#e8dfd0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="${width * 0.08}" y="${height * 0.1}" width="${width * 0.84}" height="${height * 0.72}" rx="4" fill="url(#frame)" opacity="0.92"/>
  <circle cx="${width * 0.22}" cy="${height * 0.28}" r="${Math.min(width, height) * 0.09}" fill="#1e3a5f" opacity="0.12"/>
  <circle cx="${width * 0.78}" cy="${height * 0.62}" r="${Math.min(width, height) * 0.14}" fill="#1e3a5f" opacity="0.08"/>
  <rect x="${width * 0.18}" y="${height * 0.38}" width="${width * 0.64}" height="${height * 0.04}" fill="#1e3a5f" opacity="0.1" rx="2"/>
  <rect x="${width * 0.24}" y="${height * 0.48}" width="${width * 0.52}" height="${height * 0.03}" fill="#1e3a5f" opacity="0.07" rx="2"/>
  <text x="50%" y="${height * 0.72}" text-anchor="middle" fill="#1e3a5f" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(width * 0.045)}" font-weight="400">${title}</text>
  <text x="50%" y="${height * 0.78}" text-anchor="middle" fill="#5a6b7d" font-family="system-ui, sans-serif" font-size="${Math.round(width * 0.022)}" letter-spacing="0.12em">${escapeXml(subtitle)}</text>
</svg>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
