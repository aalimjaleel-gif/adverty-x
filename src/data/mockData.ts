export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  startingPrice: number;
  duration: string;
  deliverables: string[];
  isAddon?: boolean;
  addonNotice?: string;
  popular?: boolean;
  color: string;
}

export const AGENCY_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    slug: "website-design",
    title: "Frontend Design",
    category: "Development",
    shortDesc: "Modern, responsive and fast websites built to convert visitors into customers.",
    fullDesc: "High-performance business websites, high-converting landing pages, and interactive web applications designed with modern UI/UX principles, mobile-first responsiveness, and clean code.",
    iconName: "Monitor",
    startingPrice: 299,
    duration: "7-10 Business Days",
    color: "purple",
    deliverables: [
      "Custom business website UI/UX",
      "Modern landing pages & portfolios",
      "100% mobile-first responsive layout",
      "Next.js / Tailwind CSS clean code",
      "Performance & SEO optimization",
      "Cross-browser testing & fast loading",
    ],
  },
  {
    id: "serv-2",
    slug: "website-redesign",
    title: "Website Redesign",
    category: "Design",
    shortDesc: "Give your existing website a fresh look, modern UX, and lightning speed.",
    fullDesc: "Complete architectural and visual redesign of outdated or slow websites. We audit usability bottlenecks, improve conversions, and rebuild your frontend to modern design standards.",
    iconName: "Palette",
    startingPrice: 399,
    duration: "10-14 Business Days",
    color: "cyan",
    deliverables: [
      "Complete visual & UX overhaul",
      "Conversion rate optimization (CRO)",
      "Core Web Vitals & speed acceleration",
      "Improved mobile responsiveness",
      "Brand identity modernization",
      "Seamless content migration",
    ],
  },
  {
    id: "serv-3",
    slug: "automation",
    title: "Automation",
    category: "Technology",
    shortDesc: "Automate your business processes, lead capture pipelines, and customer follow-ups.",
    fullDesc: "Custom workflow automations that connect your website, CRM, communication channels, and databases to eliminate repetitive tasks and capture leads 24/7.",
    iconName: "Cog",
    startingPrice: 299,
    duration: "5-7 Business Days",
    color: "blue",
    deliverables: [
      "Automated lead capture & routing",
      "CRM pipeline integrations",
      "WhatsApp & email instant follow-ups",
      "Webhook & API integrations",
      "Custom Zapier / Make scenarios",
      "Automated onboarding sequences",
    ],
  },
  {
    id: "serv-4",
    slug: "social-media-management",
    title: "Social Media Management",
    category: "Marketing",
    shortDesc: "Grow and engage your audience across Facebook, Instagram, TikTok, and LinkedIn.",
    fullDesc: "Strategic social media management that builds brand authority and community trust. Includes content calendars, caption copywriting, scheduling, and monthly performance reporting.",
    iconName: "Share2",
    startingPrice: 199,
    duration: "Monthly Retainer",
    color: "pink",
    addonNotice: "IMPORTANT POLICY: Video editing is NOT included by default. Clients provide finished video footage or order our dedicated Video Editing Add-On separately.",
    deliverables: [
      "Monthly content strategy & calendar",
      "Post design & creative graphics",
      "Compelling caption copywriting",
      "Hashtag & keyword optimization",
      "Multi-platform scheduling",
      "Monthly analytics & insights report",
    ],
  },
  {
    id: "serv-5",
    slug: "paid-advertising",
    title: "Paid Advertising",
    category: "Growth",
    shortDesc: "Targeted ads for better results across Meta, TikTok, and Google Ads.",
    fullDesc: "Data-driven advertising campaigns that reach your exact prospective buyers. Management fees are strictly transparent and separated from client ad spend.",
    iconName: "Megaphone",
    startingPrice: 299,
    duration: "Monthly Campaign",
    color: "rose",
    deliverables: [
      "Target audience research & segmentation",
      "Meta Ads (Facebook & Instagram)",
      "TikTok Ads campaign structure",
      "Ad copy & creative direction",
      "A/B testing & budget optimization",
      "Transparent ROAS & performance tracking",
    ],
  },
  {
    id: "serv-6",
    slug: "video-editing",
    title: "Video Editing (Paid Add-on)",
    category: "Media",
    shortDesc: "Professional video editing service for reels, TikToks, shorts, and brand promotions.",
    fullDesc: "Standalone or add-on video editing service. Available as an optional paid add-on to any social media package or as an independent service with capped revisions and clear delivery specs.",
    iconName: "Video",
    startingPrice: 99,
    duration: "2-4 Business Days",
    popular: true,
    isAddon: true,
    color: "purple",
    deliverables: [
      "Short-form reels, TikToks & shorts",
      "Engaging captions & motion graphics",
      "Sound design & royalty-free music",
      "Color correction & audio enhancement",
      "Promotional & brand video edits",
      "Up to 2 revision rounds per video",
    ],
  },
];

export interface AppSubscriptionItem {
  id: string;
  name: string;
  slug: string;
  category: "DESIGN & EDIT" | "ENTERTAINMENT" | "VPN" | "AI & PRODUCTIVITY" | string;
  typeBadge: string; // e.g. "1 Month • Private Screen"
  warrantyBadge: string; // e.g. "28-day replacement warranty"
  rating: number;
  reviewsCount: number;
  pricePKR: number;
  priceUSD: number;
  internalCostPKR: number; // Confidential Admin Cost
  inStock: boolean;
  iconBg: string;
  iconType: "capcut" | "netflix" | "youtube" | "surfshark" | "canva" | "chatgpt" | "spotify" | "adobe" | "prime" | string;
  description: string;
  fulfillmentType: "Instant Account Credentials" | "Private Screen Profile" | "Customer Email Activation" | string;
}

export const APP_SUBSCRIPTIONS: AppSubscriptionItem[] = [
  {
    id: "app-1",
    name: "Capcut Pro (Android/iPhone)",
    slug: "capcut-pro-mobile",
    category: "DESIGN & EDIT",
    typeBadge: "1 Month • Private",
    warrantyBadge: "2 year warranty",
    rating: 4.8,
    reviewsCount: 5078,
    pricePKR: 450,
    priceUSD: 1.62,
    internalCostPKR: 260,
    inStock: true,
    iconBg: "bg-white",
    iconType: "capcut",
    description: "Full pro access for iOS & Android with all VIP transitions, AI effects, and 4K 60fps exports without watermarks.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-2",
    name: "Capcut Pro (Laptop/PC)",
    slug: "capcut-pro-pc",
    category: "DESIGN & EDIT",
    typeBadge: "1 Month • Private",
    warrantyBadge: "28-day warranty",
    rating: 4.8,
    reviewsCount: 2511,
    pricePKR: 600,
    priceUSD: 2.15,
    internalCostPKR: 350,
    inStock: false,
    iconBg: "bg-white",
    iconType: "capcut",
    description: "Windows & Mac desktop Pro edition with full auto-captions, keyframe animation, optical flow, and multi-track video editing.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-3",
    name: "Netflix Premium (4K Quality)",
    slug: "netflix-premium-4k",
    category: "ENTERTAINMENT",
    typeBadge: "1 Month • Private Screen",
    warrantyBadge: "25-day warranty",
    rating: 4.7,
    reviewsCount: 815,
    pricePKR: 300,
    priceUSD: 1.10,
    internalCostPKR: 180,
    inStock: true,
    iconBg: "bg-black",
    iconType: "netflix",
    description: "Private single-screen pin-protected profile with Ultra HD 4K streaming and zero household interruption.",
    fulfillmentType: "Private Screen Profile",
  },
  {
    id: "app-prime-video",
    name: "Amazon Prime Video",
    slug: "amazon-prime-video",
    category: "ENTERTAINMENT",
    typeBadge: "6 Month • Private Screen",
    warrantyBadge: "2-days warranty",
    rating: 4.8,
    reviewsCount: 159,
    pricePKR: 700,
    priceUSD: 2.52,
    internalCostPKR: 600,
    inStock: true,
    iconBg: "bg-white",
    iconType: "prime",
    description: "6 Months Premium Access\n Private Ready Account\nLogin ID & Password provided after purchase\n Enjoy Movies, Series & Amazon Originals\n Stream in 4K Ultra HD where supported\n Ready to use immediately after delivery\n\n Important: Do not change the email, password, billing details, or other account settings. Any changes will void the warranty and may affect account stability.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-4",
    name: "YouTube Premium (3 Months)",
    slug: "youtube-premium-3-months",
    category: "ENTERTAINMENT",
    typeBadge: "3 Months • Private",
    warrantyBadge: "90-day warranty",
    rating: 5.0,
    reviewsCount: 14,
    pricePKR: 900,
    priceUSD: 3.25,
    internalCostPKR: 520,
    inStock: false,
    iconBg: "bg-white",
    iconType: "youtube",
    description: "3 Months ad-free YouTube and YouTube Music with background playback and offline downloads.",
    fulfillmentType: "Customer Email Activation",
  },
  {
    id: "app-5",
    name: "YouTube Premium (1 Month)",
    slug: "youtube-premium-1-month",
    category: "ENTERTAINMENT",
    typeBadge: "1 Month • Customer Gmail",
    warrantyBadge: "30-day warranty",
    rating: 4.8,
    reviewsCount: 22,
    pricePKR: 300,
    priceUSD: 1.10,
    internalCostPKR: 170,
    inStock: false,
    iconBg: "bg-white",
    iconType: "youtube",
    description: "Activated directly on your personal Gmail. Ad-free streaming, picture-in-picture, and full YouTube Music.",
    fulfillmentType: "Customer Email Activation",
  },
  {
    id: "app-6",
    name: "Surfshark VPN (1 Month)",
    slug: "surfshark-vpn-1-month",
    category: "VPN",
    typeBadge: "1 Month • User Login",
    warrantyBadge: "30-day warranty",
    rating: 4.6,
    reviewsCount: 522,
    pricePKR: 250,
    priceUSD: 0.90,
    internalCostPKR: 120,
    inStock: false,
    iconBg: "bg-teal-50",
    iconType: "surfshark",
    description: "Unlimited devices, CleanWeb ad-blocker, 3200+ servers worldwide with ultra-fast WireGuard protocol.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-7",
    name: "Surfshark VPN (3 Months)",
    slug: "surfshark-vpn-3-months",
    category: "VPN",
    typeBadge: "3 Months • User Login",
    warrantyBadge: "90-day warranty",
    rating: 4.4,
    reviewsCount: 122,
    pricePKR: 650,
    priceUSD: 2.35,
    internalCostPKR: 340,
    inStock: true,
    iconBg: "bg-teal-50",
    iconType: "surfshark",
    description: "High-speed secure browsing, bypass geo-restrictions, and torrent securely with 90 days guaranteed warranty.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-8",
    name: "Surfshark VPN (6 Months)",
    slug: "surfshark-vpn-6-months",
    category: "VPN",
    typeBadge: "6 Months • User Login",
    warrantyBadge: "160-day warranty",
    rating: 4.8,
    reviewsCount: 59,
    pricePKR: 1200,
    priceUSD: 4.30,
    internalCostPKR: 650,
    inStock: true,
    iconBg: "bg-teal-50",
    iconType: "surfshark",
    description: "Best value 6-month secure VPN package with dedicated streaming servers and full warranty support.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-9",
    name: "Canva Pro",
    slug: "canva-pro",
    category: "DESIGN & EDIT",
    typeBadge: "1 Year • Private Email",
    warrantyBadge: "365-day warranty",
    rating: 4.9,
    reviewsCount: 3420,
    pricePKR: 499,
    priceUSD: 1.80,
    internalCostPKR: 250,
    inStock: true,
    iconBg: "bg-cyan-50",
    iconType: "canva",
    description: "Premium access on your personal email. Magic Resize, 100M+ assets, background remover, and full brand kits.",
    fulfillmentType: "Customer Email Activation",
  },
  {
    id: "app-10",
    name: "ChatGPT Plus (GPT-4o)",
    slug: "chatgpt-plus",
    category: "AI & PRODUCTIVITY",
    typeBadge: "1 Month • Private Login",
    warrantyBadge: "25-day warranty",
    rating: 4.9,
    reviewsCount: 1890,
    pricePKR: 1800,
    priceUSD: 6.50,
    internalCostPKR: 1100,
    inStock: true,
    iconBg: "bg-emerald-50",
    iconType: "chatgpt",
    description: "Priority access to OpenAI GPT-4o, DALL-E 3 image generation, custom GPTs, code execution, and web analysis.",
    fulfillmentType: "Instant Account Credentials",
  },
  {
    id: "app-11",
    name: "Spotify Premium",
    slug: "spotify-premium",
    category: "ENTERTAINMENT",
    typeBadge: "3 Months • Family Invite",
    warrantyBadge: "90-day warranty",
    rating: 4.7,
    reviewsCount: 640,
    pricePKR: 400,
    priceUSD: 1.45,
    internalCostPKR: 220,
    inStock: true,
    iconBg: "bg-green-50",
    iconType: "spotify",
    description: "Ad-free music listening on your own account, offline song downloads, and high-fidelity audio streaming.",
    fulfillmentType: "Customer Email Activation",
  },
  {
    id: "app-12",
    name: "Adobe Creative Cloud",
    slug: "adobe-creative-cloud",
    category: "DESIGN & EDIT",
    typeBadge: "1 Month • All Apps",
    warrantyBadge: "28-day warranty",
    rating: 4.8,
    reviewsCount: 310,
    pricePKR: 2500,
    priceUSD: 9.00,
    internalCostPKR: 1600,
    inStock: true,
    iconBg: "bg-red-50",
    iconType: "adobe",
    description: "Complete Adobe suite: Photoshop, Illustrator, Premiere Pro, After Effects, and 100GB cloud storage.",
    fulfillmentType: "Customer Email Activation",
  },
];

export interface LessonItem {
  id?: string;
  title: string;
  duration: string;
  isPreview?: boolean;
  allowDownload?: boolean;
  videoUrl?: string;
  downloadUrl?: string;
}

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isFree?: boolean;
  thumbnail: string;
  thumbnailUrl?: string;
  level: string;
  duration: string;
  lessonsCount: number;
  description: string;
  curriculum: {
    module: string;
    lessons: LessonItem[];
  }[];
}

export const ACADEMY_COURSES: CourseItem[] = [
  {
    "id": "course-1792564025879",
    "slug": "damini-tripathi---ad-creative-course-you-ll-learn----",
    "title": "Damini Tripathi — Ad Creative Course You'll Learn: 📖",
    "category": "Marketing",
    "instructor": "Adverty X Team",
    "rating": 5,
    "reviewsCount": 1,
    "price": 6,
    "isFree": false,
    "thumbnail": "course-thumb",
    "thumbnailUrl": "/course-ad-creative.png",
    "level": "All Levels",
    "duration": "4 Hours",
    "lessonsCount": 19,
    "description": "You'll Learn: 📖\n* AI Ads\n* Buyer Psychology & Attention\n* Hooks, Body & CTA\n* 22+ Ad Formats\n* Complete Script Writing System\n* Shooting Guidelines\n* Creative Diversification",
    "curriculum": [
      {
        "module": "Module 1: Video Masterclass (In-Browser Streaming)",
        "lessons": [
          {
            "title": "Lecture 1: Winning Ad Creatives Masterclass: 23 Ad Frameworks for High-Converting Ads",
            "duration": "2:35",
            "isPreview": true,
            "videoUrl": "https://youtu.be/tbQifWPYJEU"
          },
          {
            "title": "Lecture 2:Why Your Ads Fail: Mastering High-Converting Ad Creatives",
            "duration": "9:09",
            "isPreview": false,
            "videoUrl": "https://youtu.be/W8C0gHrUiGk"
          },
          {
            "title": "Lecture 3: Buyer Psychology for High-Converting Ad Creatives | Understanding What Makes Customers Buy",
            "duration": "7:31",
            "isPreview": false,
            "videoUrl": "https://youtu.be/o5oP2RJRkQA"
          },
          {
            "title": "Lecture 4: Attention Economy in Digital Marketing | How to Grab Audience Attention & Create Winning Ad Hooks",
            "duration": "6:24",
            "isPreview": false,
            "videoUrl": "https://youtu.be/Tc5NLTbzctE"
          },
          {
            "title": "Lecture 5: 14 Winning Ad Hooks to Grab Attention & Boost Conversions | Ad Creative Masterclass",
            "duration": "18:52",
            "isPreview": false,
            "videoUrl": "https://youtu.be/2r6iJtXp5dI"
          },
          {
            "title": "Lecture 6: 6 Proven Hook Writing Frameworks for High-Converting Ads | Ad Creative Masterclass",
            "duration": "8:15",
            "isPreview": false,
            "videoUrl": "https://youtu.be/mRyqjjbXhY4"
          },
          {
            "title": "Lecture 7: 9 Powerful Ad Body Writing Frameworks to Boost Conversions | Ad Creative Masterclass",
            "duration": "11:59",
            "isPreview": false,
            "videoUrl": "https://youtu.be/KIW1Kao6_nI"
          },
          {
            "title": "Lecture 8: 5 Powerful Ad Body Writing Frameworks to Boost Conversions | Ad Creative Masterclass",
            "duration": "6:55",
            "isPreview": false,
            "videoUrl": "https://youtu.be/JT5ejxiJGy4"
          },
          {
            "title": "Lecture 9:  How to Write Powerful CTAs to Boost Ad Conversions | Ad Creative Masterclass",
            "duration": "3:03",
            "isPreview": false,
            "videoUrl": "https://youtu.be/jRuBlRMyqBc"
          },
          {
            "title": "Lecture 10: 8 Powerful CTA Types to Drive More Conversions | Ad Creative Masterclass",
            "duration": "9:38",
            "isPreview": false,
            "videoUrl": "https://youtu.be/Ra1NOYjqido "
          },
          {
            "title": "Lecture 11: Ad Creative Angles Explained — How to Reach Different Audiences & Boost Conversions | Ad Creative Masterclass",
            "duration": "2:59",
            "isPreview": false,
            "videoUrl": "https://youtu.be/DV_wfVjgfTA"
          },
          {
            "title": "Lecture 12: 9 Powerful Ad Creative Angles to Attract Customers & Boost Conversions | Ad Creative Masterclass",
            "duration": "3:54",
            "isPreview": false,
            "videoUrl": "https://youtu.be/JVP4hAdjZuc"
          },
          {
            "title": "Lecture 13:  5 Proven Ways to Expand Ad Creative Angles & Generate More Winning Ads | Ad Creative Masterclass",
            "duration": "4:32",
            "isPreview": false,
            "videoUrl": "https://youtu.be/aJEwljgiiiQ"
          },
          {
            "title": "Lecture 14: High-Converting UGC Ads — Winning Ad Structures, Hooks & Strategies | Ad Creative Masterclass",
            "duration": "24:12",
            "isPreview": false,
            "videoUrl": "https://youtu.be/FcSrW1vIYRQ"
          },
          {
            "title": "Lecture 15: Value-Based Ads — How to Create High-Converting Ads That Sell Value | Ad Creative Masterclass",
            "duration": "20:17",
            "isPreview": false,
            "videoUrl": "https://youtu.be/m9kyWFQ846w"
          },
          {
            "title": "Lecture 16:  Meme Ads & Quirky Creatives — How to Grab Attention & Boost Conversions | Ad Creative Masterclass",
            "duration": "22:17",
            "isPreview": false,
            "videoUrl": "https://youtu.be/E4zSzIALH9s"
          },
          {
            "title": "Lecture 17: Educational Ads — High-Converting Ad Structure, Awareness Ladder & Creative Strategies | Ad Creative Masterclass",
            "duration": "19:43",
            "isPreview": false,
            "videoUrl": "https://youtu.be/_crTD7WVTHg"
          },
          {
            "title": "Lecture 18:  Us vs. Them Ads — Competitive Positioning, Comparison Strategies & High-Converting Ad Creatives | Ad Creative Masterclass",
            "duration": "16:10",
            "isPreview": false,
            "videoUrl": "https://youtu.be/c9Y8LcAypMY"
          },
          {
            "title": "Lecture 19: Before vs. After Ads — Proven Ad Structures, Transformation Strategies & High-Converting Creatives | Ad Creative Masterclass",
            "duration": "15:17",
            "isPreview": false,
            "videoUrl": "https://youtu.be/A1xETYJcPXk"
          }
        ]
      }
    ]
  }
];

export const CLIENT_DASHBOARD_DATA = {
  user: {
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    avatar: "/avatars/ahmed.jpg",
    joinedDate: "January 2026",
    role: "Client & Student",
  },
  stats: {
    totalOrders: 5,
    activeSubscriptions: 2,
    enrolledCourses: 3,
    supportTickets: 1,
  },
  recentOrders: [
    {
      id: "ORD-1043",
      serviceProduct: "Web Design Package",
      amount: "Rs 45,000",
      status: "Completed",
      date: "Apr 20, 2026",
    },
    {
      id: "ORD-1038",
      serviceProduct: "Social Media Management",
      amount: "Rs 19,000",
      status: "Completed",
      date: "Apr 15, 2026",
    },
    {
      id: "ORD-1031",
      serviceProduct: "Digital Marketing Course",
      amount: "Rs 4,900",
      status: "Completed",
      date: "Apr 10, 2026",
    },
    {
      id: "ORD-1019",
      serviceProduct: "Netflix Premium (4K)",
      amount: "Rs 300",
      status: "Active",
      date: "Apr 01, 2026",
    },
    {
      id: "ORD-1007",
      serviceProduct: "YouTube Premium (3 Months)",
      amount: "Rs 900",
      status: "Active",
      date: "Mar 28, 2026",
    },
  ],
  courseProgress: [
    {
      id: "cp-1",
      title: "Digital Marketing Mastery",
      nextLesson: "Next lesson: SEO Basics",
      progress: 40,
    },
    {
      id: "cp-2",
      title: "Web Development with Next.js",
      nextLesson: "Next lesson: Components & Props",
      progress: 65,
    },
  ],
};

export const ADMIN_CREDENTIALS = {
  email: "admin@advertyx.com",
  password: "AdminPassword123!",
  role: "SUPER_ADMIN",
  name: "Adverty X Administrator",
};

export const CASE_STUDIES = [
  {
    id: "case-1",
    client: "Apex Growth SaaS",
    category: "Website Design & Automation",
    metrics: "+310% Inbound Leads",
    summary: "Complete redesign and Next.js frontend rebuild coupled with automated CRM routing.",
    timeline: "3 Weeks",
  },
  {
    id: "case-2",
    client: "Lumina Skin Care",
    category: "Paid Advertising & Social Media",
    metrics: "4.8x Return on Ad Spend (ROAS)",
    summary: "Targeted Meta & TikTok ad creative testing combined with audience segmentation.",
    timeline: "Ongoing",
  },
];

export const FAQS = [
  {
    q: "How does the subscription warranty work?",
    a: "Every app subscription includes a dedicated replacement warranty (25 days to 160 days depending on the plan). If you ever experience any downtime or profile issues, our support team replaces your access credentials within 1-2 hours via your dashboard or WhatsApp.",
  },
  {
    q: "Is video editing included in your Social Media Management packages?",
    a: "No. In accordance with our clear agency policy, standard social media management packages do NOT include video editing by default. Clients must provide finished video assets or hire our dedicated Video Editing Add-On separately.",
  },
  {
    q: "How does course access work in Adverty X Academy?",
    a: "Every course in Adverty X Academy is a one-time purchase that grants permanent lifetime access. Your course access never expires, even if an unrelated tool subscription ends.",
  },
];
