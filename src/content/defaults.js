/**
 * Default site content (used until the owner saves changes from /admin).
 * After the first save, the content stored in Firestore wins over this file.
 *
 * media shape: { provider: "local" | "cloudinary", url, publicId?, type?, width?, height? }
 * Local files live in /public (e.g. "/works/reel-1.mp4"), Cloudinary files are uploaded from the dashboard.
 */
const local = (url, width, height) => ({
  provider: "local",
  url,
  width,
  height,
});

export const SECTION_LABELS = {
  about: "About",
  services: "Services",
  work: "Selected Work",
  experience: "Experience",
  reviews: "Testimonials",
  contact: "Contact",
};

export const defaultContent = {
  site: {
    name: "izac Fayz",
    studio: "izac studio",
    jobTitle: "Senior Motion Designer",
    location: "Tanta, Egypt",
    title: "Izac Fayz | Senior Motion Designer · 2D · 3D · CGI",
    description:
      "Izac Fayz is a senior motion graphics designer in Egypt creating 2D motion graphics, 3D product animation, CGI and commercial video editing for FMCG, telecom and tech brands.",
    keywords: [
      "motion designer",
      "motion graphics designer Egypt",
      "2D animation",
      "3D product animation",
      "CGI",
      "Blender 3D",
      "After Effects",
      "commercial video editing",
      "social media ads",
      "Izac Fayz",
    ],
  },

  theme: {
    accent: "#ff3d1f",
    bg: "#000000",
    bgAlt: "#050505",
    card: "#111111",
    border: "#521b11",
    text: "#f5f1e8",
    muted: "#a8a296",
    font: "system",
    customFont: { family: "", regular: null, bold: null },
    googleFont: "",
    googleWeights: "400;600;700",
  },

  // Order of the sections after the hero + list of hidden ones (hero is always shown).
  sections: {
    order: ["about", "services", "work", "experience", "reviews", "contact"],
    hidden: [],
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    badge: "Senior Motion Designer · 2D · 3D · CGI",
    titleStart: "I make brands move, and people",
    titleAccent: "stop scrolling.",
    primary: { label: "View My Work", href: "#work" },
    secondary: { label: "Contact Me", href: "#contact" },
    stats: [
      { value: "5+", label: "Years Exp" },
      { value: "+50", label: "Clients" },
    ],
    image: local("/images/hero-izac.webp", 572, 1024),
    imageAlt: "Portrait of Izac Fayz, senior motion designer",
    showBrands: true,
    brandsLabel: "Trusted by leading brands & agencies",
  },

  // Replace "name" fallbacks with real logos from /admin → Brands (or put files in /public/brands).
  brands: [
    { id: "b1", name: "Telecom Egypt", logo: null },
    { id: "b2", name: "Familia", logo: null },
    { id: "b3", name: "Papia", logo: null },
  ],

  about: {
    titleStart: "Where precise timing meets",
    titleAccent: "bold storytelling.",
    image: local("/images/about-izac.jpg", 572, 1024),
    imageAlt: "Izac Fayz, motion graphics designer based in Tanta, Egypt",
    captionName: "Izac",
    captionRole: "Senior Motion Designer",
    text: "Senior motion graphics designer blending aesthetic intuition with high technical rigor. Proficient in After Effects and Blender 3D, I direct physics-accurate simulations, CGI compositions, and viral promotional edits built with frame-accurate timing. With a Bachelor of Commerce in Marketing, I bridge the gap between creative visual artistry and measurable brand performance.",
    cards: [
      {
        icon: "pin",
        title: "Based in Tanta, Egypt",
        text: "Seamless collaboration across US, EU & MENA timezones",
      },
      {
        icon: "cap",
        title: "BCom in Marketing",
        text: "Strategic mindset focused on ROAS and consumer psychology",
      },
      {
        icon: "briefcase",
        title: "Senior Motion Designer at BiSocial",
        text: "Leading top regional FMCG & tech animation campaigns",
      },
    ],
  },

  services: {
    titleStart: "Motion crafted to",
    titleAccent: "elevate your brand.",
    subtitle:
      "End-to-end production from initial animatic to final master delivery.",
    items: [
      {
        id: "s1",
        tag: "Kinetic Motion",
        title: "2D Motion Graphics",
        text: "High-paced kinetic typography, explainer animations, dynamic vector shapes, and animated brand identity packages built in After Effects.",
        chips: ["Explainers", "Typography", "UI Motion"],
      },
      {
        id: "s2",
        tag: "Blender 3D",
        title: "3D Product Animation",
        text: "Photorealistic commercial product visualization, dynamic camera fly-throughs, cloth physics simulations, and premium packaging showcases.",
        chips: ["Particles", "Physics", "Materials"],
      },
      {
        id: "s3",
        tag: "VFX & Compositing",
        title: "CGI & Visual Effects",
        text: "Live-action integration, 3D particle systems, realistic fluid & liquid simulations, motion tracking, and atmospheric environment enhancement.",
        chips: ["Tracking", "Roto", "Compositing"],
      },
      {
        id: "s4",
        tag: "Narrative & Retention",
        title: "Commercial Video Editing",
        text: "Fast-paced narrative editing with high auditory sync, custom sound design, cinematic grade curves, and punchy transitions tailored to retain viewers.",
        chips: ["Premiere Pro", "Sound Design", "Color Grade"],
      },
      {
        id: "s5",
        tag: "Multi-Platform",
        title: "Social Ads & Campaigns",
        text: "Multi-aspect exports (9:16 vertical TikTok/Reels, 1:1 Instagram feeds, 16:9 DOOH & YouTube ads) tested to drive instant brand recall.",
        chips: ["9:16 Vertical", "High ROAS", "Paid Ads"],
      },
    ],
  },

  work: {
    titleStart: "Featured",
    titleAccent: "commercial projects.",
    allLabel: "All",
    showMoreLabel: "Show more",
    pageSize: 4,
    autoShuffle: true,
    shuffleHours: 3,
    categories: ["Video Editing", "CGI", "3D", "Telecom Egypt"],
    // kind: "video" | "image". Put files in /public/works (e.g. "/works/reel-1.mp4") or upload from /admin.
    items: [
      {
        id: "w1",
        visible: true,
        kind: "video",
        category: "CGI",
        title: "",
        media: null,
        poster: null,
      },
      {
        id: "w2",
        visible: true,
        kind: "video",
        category: "3D",
        title: "",
        media: null,
        poster: null,
      },
      {
        id: "w3",
        visible: true,
        kind: "video",
        category: "Video Editing",
        title: "",
        media: null,
        poster: null,
      },
      {
        id: "w4",
        visible: true,
        kind: "video",
        category: "Telecom Egypt",
        title: "",
        media: null,
        poster: null,
      },
    ],
  },

  experience: {
    titleStart: "Career &",
    titleAccent: "proven impact.",
    items: [
      {
        id: "e1",
        date: "Apr 2024 - Present",
        role: "Senior Motion Graphic Designer",
        company: "BiSocial Agency",
        mode: "On-site",
        text: "Spearheading lead 2D and 3D motion graphic executions for major regional brands. Directing concept animatics, supervising CGI post-pipelines, and translating corporate visual identities into high-retention commercials.",
      },
      {
        id: "e2",
        date: "2022 - Present",
        role: "Motion Graphic Designer",
        company: "Peak Agency",
        mode: "Remote",
        text: "Designed core visual motion systems, social performance assets, and launch pitch decks. Improved average video completion rates by over +20% through aggressive pacing and dynamic typography.",
      },
      {
        id: "e3",
        date: "2020 - 2024",
        role: "Motion Graphic Designer",
        company: "HQ Agency",
        mode: "Remote",
        text: "Delivered short-form commercial animation, promo teasers, and sound-synced video content in tight collaboration with creative directors and copywriters.",
      },
    ],
  },

  // Chat screenshots (upload from /admin → Testimonials). The section hides itself while empty.
  reviews: {
    titleStart: "Words from",
    titleAccent: "collaborators.",
    items: [],
  },

  contact: {
    titleStart: "Have a project in mind?",
    titleAccent: "Let's make it unforgettable.",
    text: "Currently booking agency retainers and commercial motion projects for Q2 2025.",
    whatsapp: "201028060129",
    whatsappLabel: "Chat on WhatsApp (+20 102 806 0129)",
    whatsappMessage: "Hi Izac, I'd like to discuss a project.",
    email: "izacfayz@gmail.com",
    emailLabel: "Email Me",
    cv: local("/izac-fayz-cv.pdf"),
    cvLabel: "Download CV",
    socials: [
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/izac-fayz-350521209/",
      },
      { platform: "instagram", url: "https://www.instagram.com/izac_fayz/" },
    ],
  },

  footer: {
    tagline:
      "High-impact motion graphics, 3D animation, and CGI for world-class brands.",
    backToTop: "Back to top",
  },
};
