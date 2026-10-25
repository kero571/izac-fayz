// Tiny inline SVG icon set (no icon library = smaller JS). stroke icons by default, filled ones flagged.
const stroke = {
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  cap: <><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9z" />,
  award: <><circle cx="12" cy="8" r="6" /><path d="m8.2 13.9-1.2 8 5-3 5 3-1.2-8" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
};
const filled = {
  whatsapp: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />,
  play: <path d="M8 5v14l11-7z" />,
  linkedin: <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.05c.55-1 1.9-2 3.9-2 4 0 4.75 2.6 4.75 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" />,
  youtube: <path d="M22 8.2s-.2-1.6-.9-2.3c-.8-.9-1.8-.9-2.2-1C16.700 4.700 12 4.700 12 4.700s-4.700 0-6.900.2c-.4.100-1.400.100-2.200 1C2.200 6.600 2 8.200 2 8.200s-.2 1.900-.2 3.800v1.800c0 1.900.2 3.800.2 3.800s.2 1.600.9 2.300c.8.9 1.900.8 2.400.9 1.700.2 6.700.2 6.700.2s4.700 0 6.900-.2c.4-.1 1.400-.1 2.200-1 .7-.7.9-2.300.9-2.300s.2-1.900.2-3.800v-1.800c0-1.900-.2-3.800-.2-3.800zM10 15V9l5.200 3z" />,
  facebook: <path d="M14 8V6.500c0-.8.200-1.200 1.300-1.200H17V2h-2.700C11.300 2 10 3.800 10 6.200V8H7.500v3.300H10V22h4V11.300h2.600L17 8z" />,
  x: <path d="M17.800 3h3.100l-6.800 7.800L22 21h-6.200l-4.900-6.400L5.300 21H2.200l7.300-8.300L2 3h6.400l4.400 5.800zm-1.100 16.200h1.700L7.400 4.700H5.600z" />,
  tiktok: <path d="M16.600 2h-3.200v13.200a2.700 2.700 0 1 1-2.700-2.700c.300 0 .600 0 .800.100V9.300a6 6 0 1 0 5.100 5.900V8.700A7.500 7.500 0 0 0 21 10.100V6.900c-2.400 0-4.400-1.900-4.400-4.900z" />,
  behance: <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">Bē</text>,
  arrowup: <path d="M12 4 5 11h4v9h6v-9h4z" />,
};

export const ICON_NAMES = Object.keys(stroke).filter((k) => !["mail", "download", "instagram"].includes(k));
export const SOCIAL_PLATFORMS = ["linkedin", "instagram", "behance", "youtube", "facebook", "x", "tiktok"];

export default function Icon({ name, className = "h-5 w-5" }) {
  const isFilled = name in filled;
  const body = isFilled ? filled[name] : stroke[name] || stroke.star;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {body}
    </svg>
  );
}
