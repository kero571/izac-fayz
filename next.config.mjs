const isDev = process.env.NODE_ENV !== "production";

// الدومينات المسموح لها تعمل iframe للموقع ده
const ALLOWED_EMBEDDERS = [
  "https://kerolesadel.vercel.app",
  "https://nodern-web.vercel.app",
];

const frameAncestorsPublic = [
  "'self'",
  ...ALLOWED_EMBEDDERS,
  ...(isDev ? ["http://localhost:3000"] : []),
].join(" ");

const buildCsp = (frameAncestors) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.clarity.ms https://scripts.clarity.ms`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.clarity.ms https://c.bing.com",
    "media-src 'self' blob: https://res.cloudinary.com",
    "font-src 'self' https://res.cloudinary.com https://fonts.gstatic.com",
    "connect-src 'self' https://api.cloudinary.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://*.clarity.ms https://c.bing.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// الصفحات العامة: متاحة للـ iframe من موقعيك بس
const publicSecurity = [
  {
    key: "Content-Security-Policy",
    value: buildCsp(frameAncestorsPublic),
  },
  ...baseHeaders,
];

// الـ admin: ممنوع تمامًا
const adminSecurity = [
  { key: "Content-Security-Policy", value: buildCsp("'none'") },
  { key: "X-Frame-Options", value: "DENY" },
];

const longCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 80],
    deviceSizes: [360, 640, 828, 1080, 1440, 1920],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: publicSecurity },
      {
        // لازم ييجي بعد القاعدة العامة علشان يعمل override لنفس الـ header
        source: "/admin/:path*",
        headers: [
          ...adminSecurity,
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      { source: "/fonts/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;