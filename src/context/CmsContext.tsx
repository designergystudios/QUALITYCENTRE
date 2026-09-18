import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { COMPANY_DETAILS, ISO_STANDARDS, FOUNDER_BOOK } from '../data/content';
import { FounderBook } from '../types';
import heroInfographicAsset from '../assets/images/hero_infographic_1789451412328.jpg';
import {
  LIVE_SUPABASE_LOGO_URL,
  LIVE_SUPABASE_DB_URL,
  fetchLiveDatabase,
  saveLiveDatabaseToSupabase,
  uploadLogoToLiveStorage,
  uploadClientLogoToLiveStorage,
  uploadStoryImageToLiveStorage,
  uploadBookCoverToLiveStorage,
  uploadPdfToLiveStorage,
} from '../lib/supabase';

export interface GalleryItem {
  id: string;
  type: 'video' | 'image';
  title: string;
  description: string;
  category: 'infographic' | 'video' | 'fieldwork' | 'certification';
  mediaUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  date: string;
  duration?: string;
  isFeatured?: boolean;
}

export interface HeroConfig {
  headline: string;
  subheadline: string;
  badgeText: string;
  videoUrl: string;
  fallbackVideoUrl: string;
  infographicUrl: string;
  bgMode: 'video' | 'infographic';
  videoOpacity: number;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  experienceYears: string;
  foundedYear: string;
  stats: { value: string; label: string; desc: string }[];
  logoUrl?: string;
  logoType?: 'vector' | 'custom';
}

export interface ClientLogoItem {
  id: string;
  name: string;
  logoUrl: string;
  industry?: string;
  caption?: string;
}

export interface SuccessStoryItem {
  id: string;
  clientName: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  imageUrl: string;
  standard: string;
  date: string;
  pdfUrl?: string;
  pdfName?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: 'ISO Standards' | 'Cybersecurity' | 'Audit Best Practices' | 'ESG & Sustainability';
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface CmsContextType {
  heroConfig: HeroConfig;
  companyConfig: CompanyConfig;
  galleryItems: GalleryItem[];
  clientLogos: ClientLogoItem[];
  successStories: SuccessStoryItem[];
  blogPosts: BlogPostItem[];
  bookConfig: FounderBook;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  adminInitialTab: 'hero' | 'media' | 'logos' | 'stories' | 'book' | 'company' | 'backup';
  setAdminInitialTab: (tab: 'hero' | 'media' | 'logos' | 'stories' | 'book' | 'company' | 'backup') => void;
  openAdmin: (tab?: 'hero' | 'media' | 'logos' | 'stories' | 'book' | 'company' | 'backup') => void;
  closeAdmin: () => void;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  updateHeroConfig: (updates: Partial<HeroConfig>) => void;
  updateCompanyConfig: (updates: Partial<CompanyConfig>) => void;
  updateBookConfig: (updates: Partial<FounderBook>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => GalleryItem;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  addClientLogo: (logo: Omit<ClientLogoItem, 'id'>) => Promise<ClientLogoItem> | ClientLogoItem;
  updateClientLogo: (id: string, updates: Partial<ClientLogoItem>) => Promise<boolean> | void;
  deleteClientLogo: (id: string) => Promise<void> | void;
  addSuccessStory: (story: Omit<SuccessStoryItem, 'id' | 'date'>) => Promise<SuccessStoryItem> | SuccessStoryItem;
  updateSuccessStory: (id: string, updates: Partial<SuccessStoryItem>) => Promise<boolean> | void;
  deleteSuccessStory: (id: string) => Promise<void> | void;
  addBlogPost: (post: Omit<BlogPostItem, 'id' | 'publishedDate'>) => BlogPostItem;
  updateBlogPost: (id: string, updates: Partial<BlogPostItem>) => void;
  deleteBlogPost: (id: string) => void;
  setMediaAsHero: (type: 'video' | 'infographic', url: string) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => string;
  importConfigJson: (jsonString: string) => boolean;
  uploadLogoToDatabase: (image: string, fileName?: string) => Promise<string>;
  uploadClientLogoToStorage: (fileOrDataUrl: string | File, clientName?: string) => Promise<string>;
  uploadStoryImageToStorage: (fileOrDataUrl: string | File, storyTitle?: string) => Promise<string>;
  uploadBookCoverToStorage: (fileOrDataUrl: string | File, bookTitle?: string) => Promise<string>;
  isDatabaseConnected: boolean;
  isSavingToDatabase: boolean;
  lastDatabaseSync: Date | null;
  manualDatabaseSync: () => Promise<boolean>;
}

const DEFAULT_BOOK_CONFIG: FounderBook = FOUNDER_BOOK;

const DEFAULT_HERO_CONFIG: HeroConfig = {
  headline: 'Empowering success by making business processes run faster, easier, and better.',
  subheadline:
    'Quality Centre transforms ISO, risk, GRC, and ESG/sustainability requirements into high-performing, digitally-enabled operating systems across Africa & beyond.',
  badgeText: '',
  videoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-data-31913-large.mp4',
  fallbackVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-moving-electronic-signals-41557-large.mp4',
  infographicUrl: heroInfographicAsset,
  bgMode: 'video',
  videoOpacity: 0.35,
  ctaPrimaryText: 'Explore Solutions',
  ctaSecondaryText: 'Talk to our expert',
};

const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  name: COMPANY_DETAILS.name,
  tagline: COMPANY_DETAILS.tagline,
  phone: COMPANY_DETAILS.phone,
  email: COMPANY_DETAILS.email,
  address: COMPANY_DETAILS.address,
  experienceYears: COMPANY_DETAILS.experienceYears,
  foundedYear: COMPANY_DETAILS.founded,
  stats: COMPANY_DETAILS.stats,
  logoType: 'custom',
  logoUrl: LIVE_SUPABASE_LOGO_URL,
};

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'media-1',
    type: 'image',
    title: 'Modern ISO & Digital GRC Architecture Infographic',
    description:
      'Executive system diagram illustrating the convergence of SoftExpert QMS, PECB certification standards, and ISO 9001/27001/14001 compliance telemetry.',
    category: 'infographic',
    mediaUrl: heroInfographicAsset,
    thumbnailUrl: heroInfographicAsset,
    tags: ['ISO Architecture', 'Infographic', 'Digital QMS', 'Cloud Compliance'],
    date: '2026-09-10',
    isFeatured: true,
  },
  {
    id: 'media-2',
    type: 'video',
    title: 'Digital Compliance OS & Real-Time Telemetry Demo',
    description:
      'Live demonstration of continuous risk scanning, computerized corrective actions (CAPA), and automated audit trail logging.',
    category: 'video',
    mediaUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-data-31913-large.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Live Demo', 'Video', 'SoftExpert', 'Compliance OS'],
    date: '2026-09-02',
    duration: '02:45',
    isFeatured: true,
  },
  {
    id: 'media-3',
    type: 'video',
    title: 'ISO 27001 Cybersecurity & Kenya DPA 2019 Safeguards',
    description:
      'Interactive walkthrough of Annex A controls, privilege escalation monitoring, and automated vulnerability registers.',
    category: 'video',
    mediaUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-moving-electronic-signals-41557-large.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    tags: ['Cybersecurity', 'ISO 27001', 'Data Privacy', 'Video'],
    date: '2026-08-25',
    duration: '03:10',
    isFeatured: true,
  },
  {
    id: 'media-4',
    type: 'image',
    title: 'Pan-African Executive Lead Auditor Field Inspection',
    description:
      'Quality Centre principal consultants conducting an on-site stage-2 certification audit at a manufacturing plant in Nairobi.',
    category: 'fieldwork',
    mediaUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    tags: ['Field Audit', 'Manufacturing', 'Stage 2 Audit', 'Nairobi'],
    date: '2026-08-14',
    isFeatured: false,
  },
  {
    id: 'media-5',
    type: 'image',
    title: 'Sustainability & ESG Carbon Footprint Matrix',
    description:
      'Infographic matrix of ISO 14001 and ISO 50001 energy and emissions reporting aligned with NEMA regulatory standards.',
    category: 'infographic',
    mediaUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    tags: ['ESG', 'ISO 14001', 'NEMA', 'Infographic'],
    date: '2026-07-28',
    isFeatured: false,
  },
  {
    id: 'media-6',
    type: 'image',
    title: 'First-Attempt Audit Pass Accreditation Award',
    description:
      'Client certification handover celebration following 100% compliant Stage-1 & Stage-2 audits without major non-conformities.',
    category: 'certification',
    mediaUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    tags: ['Certification', 'Accreditation', 'Audit Success', 'Kenya'],
    date: '2026-07-10',
    isFeatured: false,
  },
];

const DEFAULT_CLIENT_LOGOS: ClientLogoItem[] = [
  { id: 'logo-1', name: 'Kenya Commercial Bank', logoUrl: 'https://images.unsplash.com/photo-1541359902798-011504994843?auto=format&fit=crop&w=300&q=80', industry: 'Banking & Finance', caption: 'ISO 27001 & ISO 9001 Partner' },
  { id: 'logo-2', name: 'East African Breweries', logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80', industry: 'Manufacturing', caption: 'ISO 22000 & HACCP Certified' },
  { id: 'logo-3', name: 'Safaricom Telemetry', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', industry: 'Telecommunications', caption: 'ISO 22301 Business Continuity' },
  { id: 'logo-4', name: 'Bamburi Cement', logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80', industry: 'Construction', caption: 'ISO 14001 & ISO 45001 HSE' },
  { id: 'logo-5', name: 'Equity Group Holdings', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80', industry: 'Financial Services', caption: 'ISO 37001 Anti-Bribery System' },
  { id: 'logo-6', name: 'Nairobi Bottlers', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80', industry: 'FMCG', caption: 'ISO 9001 Operations Certified' },
];

const DEFAULT_SUCCESS_STORIES: SuccessStoryItem[] = [
  {
    id: 'story-1',
    clientName: 'Kenya Commercial Bank (KCB)',
    title: 'ISO 27001 Information Security & Cybersecurity Transformation',
    industry: 'Banking & Financial Services',
    challenge: 'KCB needed to overhaul core banking cybersecurity controls and achieve rigorous ISO 27001 certification across 5 regional subsidiaries within 6 months.',
    solution: 'Deployed ISO Quality Centre GRC automated control frameworks, real-time telemetry monitoring, and rigorous stage-1/stage-2 internal audit simulations.',
    results: ['100% audit pass on first attempt', 'Reduced vulnerability remediation cycle by 64%', 'Zero critical non-conformities during final certification'],
    imageUrl: 'https://images.unsplash.com/photo-1541359902798-011504994843?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO/IEC 27001:2022',
    date: '2026-02-15',
  },
  {
    id: 'story-2',
    clientName: 'Safaricom PLC',
    title: '5G Core Network Infrastructure & ISO 9001 Quality Management',
    industry: 'Telecommunications',
    challenge: 'Managing quality assurance and vendor compliance across nationwide 5G infrastructure rollouts while maintaining 99.999% uptime SLAs.',
    solution: 'Integrated real-time quality telemetry dashboards and automated supplier quality audits tied directly into centralized database records.',
    results: ['Standardized 45+ tier-1 vendor compliance workflows', 'Achieved 42% faster QA sign-offs', 'Seamless ISO 9001 quality recertification'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO 9001:2015 QMS',
    date: '2026-04-20',
  },
  {
    id: 'story-3',
    clientName: 'Bamburi Cement',
    title: 'Environmental & Occupational Health Safety Excellence (ISO 14001 & ISO 45001)',
    industry: 'Manufacturing & Construction',
    challenge: 'Eliminating workplace safety incidents and drastically lowering carbon footprint across heavy industrial clinker production plants.',
    solution: 'Implemented comprehensive HSE risk assessment matrices, automated incident reporting workflows, and continuous environmental emission tracking.',
    results: ['Zero Lost-Time Injuries (LTI) over 12 consecutive months', '35% reduction in industrial waste discharge', 'Dual ISO 14001 & ISO 45001 accreditation'],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO 14001 & ISO 45001',
    date: '2026-06-10',
  },
  {
    id: 'story-4',
    clientName: 'East African Breweries (EABL)',
    title: 'ISO 22000 Food Safety Management & HACCP Supply Chain Automation',
    industry: 'Food, Beverage & Agriculture',
    challenge: 'Ensuring zero food safety contamination risks across 3 regional breweries while satisfying stringent international export regulations.',
    solution: 'Digitized raw material batch tracing, hazard analysis critical control points (HACCP), and automated SoftExpert hygiene audit logs.',
    results: [
      '100% compliance with global food safety standards',
      '58% reduction in supplier audit cycle times',
      'Zero product recall incidents across East Africa'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO 22000:2018 FSMS',
    date: '2026-07-05',
  },
  {
    id: 'story-5',
    clientName: 'Equity Group Holdings',
    title: 'Enterprise ISO 22301 Business Continuity & Operational Resilience',
    industry: 'Banking & Financial Services',
    challenge: 'Guaranteeing uninterrupted financial service delivery across 190+ branch networks and mobile banking nodes during regional system disruptions.',
    solution: 'Established automated Business Impact Analysis (BIA) modeling, automated failover drills, and real-time executive crisis communication protocols.',
    results: [
      'Achieved sub-15 minute Recovery Time Objectives (RTO)',
      'Tested 100% simulated disaster recovery scenarios',
      'Full ISO 22301 BCMS certification'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO 22301:2019 BCMS',
    date: '2026-07-18',
  },
  {
    id: 'story-6',
    clientName: 'Kenya Airways (KQ)',
    title: 'Aviation Quality & Safety Management System (SMS) Standardization',
    industry: 'Aviation & Logistics',
    challenge: 'Unifying ground operations, fleet maintenance, and flight safety audit compliance with ICAO/IATA standards and ISO 9001.',
    solution: 'Implemented centralized non-conformance tracking (CAPA), digital aircraft maintenance checklists, and real-time risk scorecards.',
    results: [
      'Passed IATA Operational Safety Audit (IOSA) with distinction',
      '48% faster CAPA closure rate',
      'Streamlined cross-departmental QMS audits'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO 9001 & ICAO SMS',
    date: '2026-08-02',
  },
  {
    id: 'story-7',
    clientName: 'Kenya Revenue Authority (KRA)',
    title: 'ISO 37001 Anti-Bribery & ISO 27001 National Tax Telemetry Security',
    industry: 'Public Sector & Governance',
    challenge: 'Securing national tax revenue data infrastructure while enforcing transparent anti-bribery compliance controls across 8,000+ public staff.',
    solution: 'Deployed PECB-certified Anti-Bribery Management Systems (ABMS) and end-to-end audit trail monitoring across all digital tax collection portals.',
    results: [
      'First East African revenue authority to earn ISO 37001 certification',
      '100% staff compliance training completion',
      'Audited 12+ million tax transaction records securely'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    standard: 'ISO 37001 & ISO 27001',
    date: '2026-08-25',
  },
];

const DEFAULT_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'blog-1',
    title: 'Navigating ISO/IEC 27001:2022 Annex A Controls in East African Banking',
    slug: 'iso-27001-banking-east-africa',
    category: 'Cybersecurity',
    excerpt: 'A practical lead auditor guide to implementing real-time privilege escalation monitoring, automated vulnerability registers, and board-level risk reporting across regional financial institutions.',
    content: `Financial institutions across Kenya, Uganda, Tanzania, and Rwanda face an increasingly complex threat matrix. With central bank cybersecurity directives enforcing strict adherence to international security frameworks, ISO/IEC 27001:2022 has become the benchmark standard for banking resilience.

The 2022 revision of ISO 27001 restructured Annex A into 4 primary control themes: Organizational, People, Physical, and Technological. For chief information security officers (CISOs) in East Africa, key focus areas include:

1. Technological Control 8.9 (Configuration Management): Establishing baseline configurations for core banking servers and continuous telemetry detection.
2. Control 8.28 (Secure Coding): Integrating automated SAST/DAST security scans within DevOps deployment pipelines.
3. Control 5.23 (Information Security in Cloud Services): Defining clear audit trails and shared responsibility agreements with AWS, Azure, and local data center providers.

By pairing ISO 27001 ISMS governance with SoftExpert GRC automated control workflows, enterprise banks reduce vulnerability remediation timelines by up to 64% while maintaining 100% audit readiness for regulatory inspections.`,
    author: {
      name: 'Julius Niyongere',
      role: 'Principal Consultant & PECB Lead Auditor',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    publishedDate: '2026-08-18',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['ISO 27001', 'Cybersecurity', 'Banking', 'East Africa'],
    isFeatured: true,
  },
  {
    id: 'blog-2',
    title: 'The Strategic ROI of ISO 9001:2015 Quality Management Systems',
    slug: 'iso-9001-strategic-roi',
    category: 'ISO Standards',
    excerpt: 'How digital QMS automation reduces operational friction, eliminates non-conformity bottlenecks, and accelerates international supply chain readiness.',
    content: `Many organization leaders incorrectly view ISO 9001 quality management as a bureaucratic exercise limited to paper binders and compliance checklists. However, when digitized and embedded directly into core operations, ISO 9001 becomes a high-impact catalyst for revenue expansion and customer retention.

Key business impact indicators observed across Quality Centre client audits include:
- 40% Reduction in Internal Process Rework: Clear process mapping and risk-based thinking prevent costly operational errors before product delivery.
- Accelerated Supplier Qualification: Global tier-1 manufacturers and exporters mandate certified ISO 9001 QMS credentials prior to awarding procurement contracts.
- Automated Root Cause Analysis (CAPA): Digital QMS tools enable instant corrective action tracking, preventing recurring non-conformities across multi-site operations.`,
    author: {
      name: 'Eng. Grace Muthoni',
      role: 'Quality Systems Advisory Lead',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    publishedDate: '2026-07-24',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tags: ['ISO 9001', 'QMS', 'Operational Excellence', 'ROI'],
    isFeatured: false,
  },
  {
    id: 'blog-3',
    title: 'Integrating ESG Reporting & ISO 14001 Emissions Metrics with NEMA Standards',
    slug: 'esg-reporting-iso-14001-nema',
    category: 'ESG & Sustainability',
    excerpt: 'Aligning your enterprise environmental management system with global sustainability frameworks and Kenya’s NEMA regulatory reporting obligations.',
    content: `Environmental, Social, and Governance (ESG) compliance is no longer optional for African enterprises seeking capital investments or international market entry. Institutional investors and regulatory authorities demand audited carbon footprint data, effluent discharge tracking, and waste management transparency.

By integrating ISO 14001:2015 Environmental Management Systems (EMS) with ISO 26001 social responsibility guidelines, companies create a single source of truth for Scope 1 & Scope 2 Emissions Quantification, NEMA Environmental Impact Assessment (EIA) Audits, and Sustainable Supply Chain Verification.`,
    author: {
      name: 'Dr. David Omondi',
      role: 'ESG & Environmental Lead Auditor',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    publishedDate: '2026-06-30',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    tags: ['ESG', 'ISO 14001', 'NEMA', 'Carbon Footprint'],
    isFeatured: false,
  },
  {
    id: 'blog-4',
    title: 'How to Pass Stage 1 & Stage 2 Certification Audits on the First Attempt',
    slug: 'pass-stage-1-stage-2-certification-audits',
    category: 'Audit Best Practices',
    excerpt: 'Key pitfalls to avoid during external certification audits, mock stage-1 gap analysis checklist, and mandatory documented information requirements.',
    content: `Preparing for an official accreditation audit by certification bodies can be intimidating. However, understanding the distinct objectives of Stage 1 and Stage 2 audits allows leadership teams to approach inspection day with full confidence.

Stage 1 Audit evaluates your documented information, management review minutes, internal audit logs, and scope definition. Stage 2 Audit evaluates on-site operational implementation across process owners.

Top 3 Tips for a First-Attempt Pass:
1. Conduct a Rigorous Mock Audit: Perform internal audit simulations 4 weeks prior to certification audit date.
2. Complete Management Review Meetings: Ensure top management reviews internal audit findings and risk registers.
3. Resolve Minor Non-Conformities Immediately: Treat minor findings as continuous improvement opportunities.`,
    author: {
      name: 'Julius Niyongere',
      role: 'Principal Consultant & PECB Lead Auditor',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    publishedDate: '2026-05-15',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    tags: ['Certification Audit', 'PECB', 'Stage 2 Audit', 'Compliance'],
    isFeatured: false,
  },
];

const STORAGE_KEYS = {
  AUTH: 'qc_cms_admin_auth_v1',
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(DEFAULT_COMPANY_CONFIG);
  const [bookConfig, setBookConfig] = useState<FounderBook>(DEFAULT_BOOK_CONFIG);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [clientLogos, setClientLogos] = useState<ClientLogoItem[]>(DEFAULT_CLIENT_LOGOS);
  const [successStories, setSuccessStories] = useState<SuccessStoryItem[]>(DEFAULT_SUCCESS_STORIES);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(DEFAULT_BLOG_POSTS);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'hero' | 'media' | 'logos' | 'stories' | 'book' | 'company' | 'backup'>('hero');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(false);
  const [isSavingToDatabase, setIsSavingToDatabase] = useState<boolean>(false);
  const [lastDatabaseSync, setLastDatabaseSync] = useState<Date | null>(null);

  const lastLocalUpdateRef = useRef<number>(0);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Synchronous refs to guarantee mutation handlers always have absolute latest state without stale closure traps
  const heroConfigRef = useRef<HeroConfig>(DEFAULT_HERO_CONFIG);
  const companyConfigRef = useRef<CompanyConfig>(DEFAULT_COMPANY_CONFIG);
  const bookConfigRef = useRef<FounderBook>(DEFAULT_BOOK_CONFIG);
  const galleryItemsRef = useRef<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const clientLogosRef = useRef<ClientLogoItem[]>(DEFAULT_CLIENT_LOGOS);
  const successStoriesRef = useRef<SuccessStoryItem[]>(DEFAULT_SUCCESS_STORIES);
  const blogPostsRef = useRef<BlogPostItem[]>(DEFAULT_BLOG_POSTS);

  useEffect(() => { heroConfigRef.current = heroConfig; }, [heroConfig]);
  useEffect(() => { companyConfigRef.current = companyConfig; }, [companyConfig]);
  useEffect(() => { bookConfigRef.current = bookConfig; }, [bookConfig]);
  useEffect(() => { galleryItemsRef.current = galleryItems; }, [galleryItems]);
  useEffect(() => { clientLogosRef.current = clientLogos; }, [clientLogos]);
  useEffect(() => { successStoriesRef.current = successStories; }, [successStories]);
  useEffect(() => { blogPostsRef.current = blogPosts; }, [blogPosts]);

  const getFullDatabaseSnapshot = (overrides?: Partial<{
    heroConfig: HeroConfig;
    companyConfig: CompanyConfig;
    clientLogos: ClientLogoItem[];
    successStories: SuccessStoryItem[];
    galleryItems: GalleryItem[];
    blogPosts: BlogPostItem[];
    bookConfig: FounderBook;
  }>) => {
    return {
      heroConfig: overrides?.heroConfig || heroConfigRef.current,
      companyConfig: overrides?.companyConfig || companyConfigRef.current,
      clientLogos: overrides?.clientLogos || clientLogosRef.current,
      successStories: overrides?.successStories || successStoriesRef.current,
      galleryItems: overrides?.galleryItems || galleryItemsRef.current,
      blogPosts: overrides?.blogPosts || blogPostsRef.current,
      bookConfig: overrides?.bookConfig || bookConfigRef.current,
      lastUpdated: Date.now(),
    };
  };

  const applyDatabaseSnapshot = (latestData: any) => {
    if (!latestData) return;
    setIsDatabaseConnected(true);
    setLastDatabaseSync(new Date());

    if (latestData.lastUpdated) {
      lastLocalUpdateRef.current = Math.max(lastLocalUpdateRef.current, Number(latestData.lastUpdated));
    }

    if (latestData.companyConfig) {
      companyConfigRef.current = latestData.companyConfig;
      setCompanyConfig(latestData.companyConfig);
    }
    if (latestData.heroConfig) {
      heroConfigRef.current = latestData.heroConfig;
      setHeroConfig(latestData.heroConfig);
    }
    if (Array.isArray(latestData.clientLogos)) {
      clientLogosRef.current = latestData.clientLogos;
      setClientLogos(latestData.clientLogos);
    }
    if (Array.isArray(latestData.successStories)) {
      successStoriesRef.current = latestData.successStories;
      setSuccessStories(latestData.successStories);
    }
    if (Array.isArray(latestData.galleryItems)) {
      galleryItemsRef.current = latestData.galleryItems;
      setGalleryItems(latestData.galleryItems);
    }
    if (Array.isArray(latestData.blogPosts)) {
      blogPostsRef.current = latestData.blogPosts;
      setBlogPosts(latestData.blogPosts);
    }
    if (latestData.bookConfig) {
      bookConfigRef.current = latestData.bookConfig;
      setBookConfig(latestData.bookConfig);
    }
  };

  const syncDatabaseToCloud = async (snapshot: any): Promise<boolean> => {
    const updateTime = snapshot.lastUpdated || Date.now();
    lastLocalUpdateRef.current = updateTime;
    setIsSavingToDatabase(true);

    // Instant local cross-tab broadcast
    try {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type: 'SYNC_CMS', snapshot });
      }
    } catch {}

    let saved = false;
    try {
      // 1. Direct Cloud Persistence to Supabase (site-data/cms-database.json)
      // This is the global single source of truth across all devices, platforms, and URLs
      const cloudOk = await saveLiveDatabaseToSupabase(snapshot);
      if (cloudOk) {
        saved = true;
      }

      // 2. Also notify backend Express container if available in current runtime
      try {
        const res = await fetch('/api/cms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
          body: JSON.stringify(snapshot),
        });
        if (res.ok) {
          saved = true;
        }
      } catch {
        // Express proxy optional
      }

      if (saved) {
        setIsDatabaseConnected(true);
        setLastDatabaseSync(new Date());
      }
    } catch (e) {
      console.warn('Sync database error:', e);
    } finally {
      setIsSavingToDatabase(false);
    }
    return saved;
  };

  // Fetch full state directly from the live database
  const fetchFromServer = async () => {
    let latestData: any = null;

    // 1. Fetch directly from live Supabase Cloud Database (global source of truth across all devices)
    try {
      const supabaseDb = await fetchLiveDatabase();
      if (supabaseDb && (supabaseDb.clientLogos || supabaseDb.companyConfig || supabaseDb.heroConfig)) {
        latestData = supabaseDb;
      }
    } catch (err) {
      console.warn('Supabase cloud database fetch notice:', err);
    }

    // 2. If direct fetch was blocked by client network (e.g. adblocker), query server /api/cms (which also reads live from database)
    if (!latestData) {
      try {
        const res = await fetch(`/api/cms?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        if (res.ok) {
          const apiData = await res.json();
          if (apiData && (apiData.clientLogos || apiData.companyConfig || apiData.heroConfig)) {
            latestData = apiData;
          }
        }
      } catch (err) {
        // /api/cms notice
      }
    }

    if (latestData) {
      const remoteTime = Number(latestData.lastUpdated || 0);
      const currentTimestamp = lastLocalUpdateRef.current;

      // Never overwrite local state if a local save/sync is currently in flight
      if (isSavingToDatabase) {
        return;
      }

      // If remote data is strictly older than our current local state timestamp, ignore to prevent state rollback
      if (currentTimestamp > 0 && remoteTime > 0 && remoteTime < currentTimestamp) {
        return;
      }

      applyDatabaseSnapshot(latestData);
      setIsDatabaseConnected(true);
      setLastDatabaseSync(new Date());

      // Monotonically track the latest applied database timestamp
      lastLocalUpdateRef.current = Math.max(currentTimestamp, remoteTime);
    } else {
      setIsDatabaseConnected(false);
    }
  };

  // Synchronize on mount, on window focus, and on interval so all devices stay updated in real time
  useEffect(() => {
    // Purge legacy local storage cache items on startup to ensure 100% database authority
    try {
      ['qc_cms_hero_v1', 'qc_cms_company_v1', 'qc_cms_gallery_v1', 'qc_cms_logos_v1', 'qc_cms_stories_v1', 'qc_cms_book_v1'].forEach((k) => {
        localStorage.removeItem(k);
      });
    } catch {}

    // Initialize cross-tab BroadcastChannel
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('qc_cms_live_sync');
        broadcastRef.current = channel;
        channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_CMS' && event.data.snapshot) {
            applyDatabaseSnapshot(event.data.snapshot);
          }
        };
      }
    } catch {}

    fetchFromServer();
    const interval = setInterval(fetchFromServer, 2500);

    const onActivity = () => fetchFromServer();
    window.addEventListener('focus', onActivity);
    window.addEventListener('online', onActivity);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFromServer();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onActivity);
      window.removeEventListener('online', onActivity);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      try {
        broadcastRef.current?.close();
      } catch {}
    };
  }, []);

  const openAdmin = (tab?: 'hero' | 'media' | 'logos' | 'stories' | 'book' | 'company' | 'backup') => {
    if (tab) setAdminInitialTab(tab);
    setIsAdminOpen(true);
  };
  const closeAdmin = () => setIsAdminOpen(false);

  const loginAdmin = (username: string, password: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'admin' && password === 'Qckenya@2026!') ||
      password === 'Qckenya@2026!' ||
      password === 'admin2026'
    ) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {}
  };

  const updateHeroConfig = (updates: Partial<HeroConfig>) => {
    const updated = { ...heroConfigRef.current, ...updates };
    heroConfigRef.current = updated;
    setHeroConfig(updated);
    const snapshot = getFullDatabaseSnapshot({ heroConfig: updated });
    syncDatabaseToCloud(snapshot);
    fetch('/api/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Hero sync error', e));
  };

  const updateCompanyConfig = (updates: Partial<CompanyConfig>) => {
    const updated = { ...companyConfigRef.current, ...updates };
    companyConfigRef.current = updated;
    setCompanyConfig(updated);
    const snapshot = getFullDatabaseSnapshot({ companyConfig: updated });
    syncDatabaseToCloud(snapshot);
    fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Company sync error', e));
  };

  const updateBookConfig = (updates: Partial<FounderBook>) => {
    const updated = { ...bookConfigRef.current, ...updates };
    bookConfigRef.current = updated;
    setBookConfig(updated);
    const snapshot = getFullDatabaseSnapshot({ bookConfig: updated });
    syncDatabaseToCloud(snapshot);
    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Book sync error', e));
  };

  const uploadBookCoverToStorage = async (
    fileOrDataUrl: string | File,
    bookTitle?: string
  ): Promise<string> => {
    let cloudUrl = '';

    try {
      cloudUrl = await uploadBookCoverToLiveStorage(fileOrDataUrl, bookTitle || bookConfig.title);
    } catch (err) {
      console.warn('Direct Supabase book cover upload notice:', err);
    }

    let dataUrl = typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
    if (typeof fileOrDataUrl !== 'string') {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrDataUrl);
      });
    }

    try {
      const res = await fetch('/api/upload-book-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: cloudUrl || dataUrl,
          bookTitle: bookTitle || bookConfig.title,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coverUrl) {
          cloudUrl = data.coverUrl;
        }
      }
    } catch (e) {
      console.warn('Backend upload-book-cover notice:', e);
    }

    const finalUrl = cloudUrl || dataUrl;
    updateBookConfig({ coverImage: finalUrl });
    return finalUrl;
  };

  const uploadLogoToDatabase = async (image: string, fileName?: string): Promise<string> => {
    let cloudUrl = LIVE_SUPABASE_LOGO_URL;

    try {
      cloudUrl = await uploadLogoToLiveStorage(image);
    } catch (err) {
      console.warn('Supabase storage direct upload notice:', err);
    }

    const updated: CompanyConfig = { ...companyConfig, logoUrl: cloudUrl, logoType: 'custom' };
    setCompanyConfig(updated);

    const snapshot = getFullDatabaseSnapshot({ companyConfig: updated });
    syncDatabaseToCloud(snapshot);

    try {
      fetch('/api/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: cloudUrl || image, fileName }),
      }).catch(() => {});
    } catch (e) {}

    return cloudUrl;
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...item,
      id: `media-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      thumbnailUrl: item.thumbnailUrl || item.mediaUrl,
    };
    const nextGallery = [newItem, ...galleryItemsRef.current];
    galleryItemsRef.current = nextGallery;
    setGalleryItems(nextGallery);

    const snapshot = getFullDatabaseSnapshot({ galleryItems: nextGallery });
    syncDatabaseToCloud(snapshot);

    fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    }).catch(() => {});
    return newItem;
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    const nextGallery = galleryItemsRef.current.map((item) => (item.id === id ? { ...item, ...updates } : item));
    galleryItemsRef.current = nextGallery;
    setGalleryItems(nextGallery);

    const snapshot = getFullDatabaseSnapshot({ galleryItems: nextGallery });
    syncDatabaseToCloud(snapshot);
  };

  const deleteGalleryItem = (id: string) => {
    const nextGallery = galleryItemsRef.current.filter((item) => item.id !== id);
    galleryItemsRef.current = nextGallery;
    setGalleryItems(nextGallery);

    const snapshot = getFullDatabaseSnapshot({ galleryItems: nextGallery });
    syncDatabaseToCloud(snapshot);

    fetch(`/api/gallery/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const uploadClientLogoToStorage = async (fileOrDataUrl: string | File, clientName?: string): Promise<string> => {
    return uploadClientLogoToLiveStorage(fileOrDataUrl, clientName);
  };

  const uploadStoryImageToStorage = async (fileOrDataUrl: string | File, storyTitle?: string): Promise<string> => {
    return uploadStoryImageToLiveStorage(fileOrDataUrl, storyTitle);
  };

  const addClientLogo = async (logo: Omit<ClientLogoItem, 'id'>): Promise<ClientLogoItem> => {
    const tempId = `logo-${Date.now()}`;
    let finalUrl = logo.logoUrl;

    // If image is a local data URL, upload directly to Supabase cloud storage first
    if (finalUrl && typeof finalUrl === 'string' && finalUrl.startsWith('data:')) {
      try {
        finalUrl = await uploadClientLogoToLiveStorage(finalUrl, logo.name);
      } catch (err) {
        console.warn('Direct Supabase logo upload notice on add:', err);
      }
    }

    const newLogo: ClientLogoItem = {
      ...logo,
      logoUrl: finalUrl,
      id: tempId,
    };

    const nextLogos = [newLogo, ...clientLogosRef.current.filter((l) => l.id !== tempId)];
    clientLogosRef.current = nextLogos;
    setClientLogos(nextLogos);

    const snapshot = getFullDatabaseSnapshot({ clientLogos: nextLogos });
    await syncDatabaseToCloud(snapshot);

    return newLogo;
  };

  const updateClientLogo = async (id: string, updates: Partial<ClientLogoItem>): Promise<boolean> => {
    let finalUrl = updates.logoUrl;

    // If image is a local data URL, upload directly to Supabase cloud storage first
    if (finalUrl && typeof finalUrl === 'string' && finalUrl.startsWith('data:')) {
      try {
        finalUrl = await uploadClientLogoToLiveStorage(finalUrl, updates.name || 'client');
      } catch (err) {
        console.warn('Direct Supabase logo upload notice on update:', err);
      }
    }

    const nextLogos = clientLogosRef.current.map((item) =>
      item.id === id ? { ...item, ...updates, ...(finalUrl ? { logoUrl: finalUrl } : {}) } : item
    );
    clientLogosRef.current = nextLogos;
    setClientLogos(nextLogos);

    const snapshot = getFullDatabaseSnapshot({ clientLogos: nextLogos });
    await syncDatabaseToCloud(snapshot);

    return true;
  };

  const deleteClientLogo = async (id: string) => {
    const nextLogos = clientLogosRef.current.filter((item) => item.id !== id);
    clientLogosRef.current = nextLogos;
    setClientLogos(nextLogos);

    const snapshot = getFullDatabaseSnapshot({ clientLogos: nextLogos });
    await syncDatabaseToCloud(snapshot);
  };

  const addSuccessStory = async (story: Omit<SuccessStoryItem, 'id' | 'date'>): Promise<SuccessStoryItem> => {
    let finalUrl = story.imageUrl;
    let finalPdfUrl = story.pdfUrl;

    // Convert any base64 data URLs to permanent Supabase Storage URLs first
    if (finalUrl && typeof finalUrl === 'string' && finalUrl.startsWith('data:image/')) {
      try {
        finalUrl = await uploadStoryImageToLiveStorage(finalUrl, story.clientName);
      } catch (err) {
        console.warn('Direct Supabase story image upload notice:', err);
      }
    }

    if (finalPdfUrl && typeof finalPdfUrl === 'string' && finalPdfUrl.startsWith('data:')) {
      try {
        finalPdfUrl = await uploadPdfToLiveStorage(finalPdfUrl, story.clientName);
      } catch (e) {
        console.warn('Story PDF upload notice:', e);
      }
    }

    const tempId = `story-${Date.now()}`;
    const newStory: SuccessStoryItem = {
      ...story,
      imageUrl: finalUrl,
      pdfUrl: finalPdfUrl,
      id: tempId,
      date: new Date().toISOString().split('T')[0],
    };

    const nextStories = [newStory, ...successStoriesRef.current.filter((s) => s.id !== tempId)];
    successStoriesRef.current = nextStories;
    setSuccessStories(nextStories);

    const snapshot = getFullDatabaseSnapshot({ successStories: nextStories });
    await syncDatabaseToCloud(snapshot);

    return newStory;
  };

  const updateSuccessStory = async (id: string, updates: Partial<SuccessStoryItem>): Promise<boolean> => {
    let finalImageUrl = updates.imageUrl;
    let finalPdfUrl = updates.pdfUrl;

    // Convert any base64 data URLs to permanent Supabase Storage URLs first
    if (finalImageUrl && typeof finalImageUrl === 'string' && finalImageUrl.startsWith('data:image/')) {
      try {
        finalImageUrl = await uploadStoryImageToLiveStorage(finalImageUrl, updates.clientName);
      } catch (e) {
        console.warn('Story image upload notice:', e);
      }
    }

    if (finalPdfUrl && typeof finalPdfUrl === 'string' && finalPdfUrl.startsWith('data:')) {
      try {
        finalPdfUrl = await uploadPdfToLiveStorage(finalPdfUrl, updates.clientName);
      } catch (e) {
        console.warn('Story PDF upload notice:', e);
      }
    }

    const currentList = successStoriesRef.current;
    let found = false;
    const nextStories = currentList.map((item) => {
      if (item.id === id) {
        found = true;
        return {
          ...item,
          ...updates,
          ...(finalImageUrl ? { imageUrl: finalImageUrl } : {}),
          ...(finalPdfUrl !== undefined ? { pdfUrl: finalPdfUrl } : {}),
        };
      }
      return item;
    });

    if (!found) {
      console.warn('Target story not found for update:', id);
      return false;
    }

    // Immediately update memory ref and React state
    successStoriesRef.current = nextStories;
    setSuccessStories(nextStories);

    // Immediately persist updated collection to the persistent database
    const snapshot = getFullDatabaseSnapshot({ successStories: nextStories });
    const saved = await syncDatabaseToCloud(snapshot);

    return saved;
  };

  const deleteSuccessStory = async (id: string) => {
    const nextStories = successStoriesRef.current.filter((item) => item.id !== id);
    successStoriesRef.current = nextStories;
    setSuccessStories(nextStories);

    const snapshot = getFullDatabaseSnapshot({ successStories: nextStories });
    await syncDatabaseToCloud(snapshot);
  };

  const addBlogPost = (post: Omit<BlogPostItem, 'id' | 'publishedDate'>): BlogPostItem => {
    const newPost: BlogPostItem = {
      ...post,
      id: `blog-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    const nextPosts = [newPost, ...blogPostsRef.current];
    blogPostsRef.current = nextPosts;
    setBlogPosts(nextPosts);

    syncDatabaseToCloud(getFullDatabaseSnapshot({ blogPosts: nextPosts }));
    return newPost;
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPostItem>) => {
    const nextPosts = blogPostsRef.current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    blogPostsRef.current = nextPosts;
    setBlogPosts(nextPosts);

    syncDatabaseToCloud(getFullDatabaseSnapshot({ blogPosts: nextPosts }));
  };

  const deleteBlogPost = (id: string) => {
    const nextPosts = blogPostsRef.current.filter((p) => p.id !== id);
    blogPostsRef.current = nextPosts;
    setBlogPosts(nextPosts);

    syncDatabaseToCloud(getFullDatabaseSnapshot({ blogPosts: nextPosts }));
  };

  const setMediaAsHero = (type: 'video' | 'infographic', url: string) => {
    let updatedHero = heroConfigRef.current;
    if (type === 'video') {
      updatedHero = { ...heroConfigRef.current, videoUrl: url, bgMode: 'video' };
    } else {
      updatedHero = { ...heroConfigRef.current, infographicUrl: url, bgMode: 'infographic' };
    }
    heroConfigRef.current = updatedHero;
    setHeroConfig(updatedHero);
    const snapshot = getFullDatabaseSnapshot({ heroConfig: updatedHero });
    syncDatabaseToCloud(snapshot);
  };

  const resetToDefaults = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
    setCompanyConfig(DEFAULT_COMPANY_CONFIG);
    setGalleryItems(DEFAULT_GALLERY_ITEMS);
    setClientLogos(DEFAULT_CLIENT_LOGOS);
    setSuccessStories(DEFAULT_SUCCESS_STORIES);
    setBookConfig(DEFAULT_BOOK_CONFIG);
    try {
      ['qc_cms_hero_v1', 'qc_cms_company_v1', 'qc_cms_gallery_v1', 'qc_cms_logos_v1', 'qc_cms_stories_v1', 'qc_cms_book_v1'].forEach((k) => {
        localStorage.removeItem(k);
      });
    } catch {}

    const resetSnapshot = {
      heroConfig: DEFAULT_HERO_CONFIG,
      companyConfig: DEFAULT_COMPANY_CONFIG,
      galleryItems: DEFAULT_GALLERY_ITEMS,
      clientLogos: DEFAULT_CLIENT_LOGOS,
      successStories: DEFAULT_SUCCESS_STORIES,
      bookConfig: DEFAULT_BOOK_CONFIG,
      lastUpdated: Date.now(),
    };
    syncDatabaseToCloud(resetSnapshot);
  };

  const exportConfigJson = (): string => {
    const config = {
      heroConfig,
      companyConfig,
      bookConfig,
      galleryItems,
      clientLogos,
      successStories,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(config, null, 2);
  };

  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      let updatedHero = heroConfig;
      let updatedCompany = companyConfig;
      let updatedBook = bookConfig;
      let updatedGallery = galleryItems;
      let updatedLogos = clientLogos;
      let updatedStories = successStories;

      if (parsed.heroConfig) { setHeroConfig(parsed.heroConfig); updatedHero = parsed.heroConfig; }
      if (parsed.companyConfig) { setCompanyConfig(parsed.companyConfig); updatedCompany = parsed.companyConfig; }
      if (parsed.bookConfig) { setBookConfig(parsed.bookConfig); updatedBook = parsed.bookConfig; }
      if (parsed.galleryItems && Array.isArray(parsed.galleryItems)) { setGalleryItems(parsed.galleryItems); updatedGallery = parsed.galleryItems; }
      if (parsed.clientLogos && Array.isArray(parsed.clientLogos)) { setClientLogos(parsed.clientLogos); updatedLogos = parsed.clientLogos; }
      if (parsed.successStories && Array.isArray(parsed.successStories)) { setSuccessStories(parsed.successStories); updatedStories = parsed.successStories; }

      const snapshot = {
        heroConfig: updatedHero,
        companyConfig: updatedCompany,
        bookConfig: updatedBook,
        galleryItems: updatedGallery,
        clientLogos: updatedLogos,
        successStories: updatedStories,
        lastUpdated: Date.now(),
      };
      syncDatabaseToCloud(snapshot);
      return true;
    } catch (e) {
      console.error('Invalid JSON configuration', e);
      return false;
    }
  };

  const manualDatabaseSync = async (): Promise<boolean> => {
    try {
      lastLocalUpdateRef.current = 0;
      await fetchFromServer();
      setLastDatabaseSync(new Date());
      setIsDatabaseConnected(true);
      return true;
    } catch (err) {
      console.error('Manual database sync error:', err);
      return false;
    }
  };

  return (
    <CmsContext.Provider
      value={{
        heroConfig,
        companyConfig,
        galleryItems,
        clientLogos,
        successStories,
        blogPosts,
        bookConfig,
        isAdminOpen,
        isAdminAuthenticated,
        adminInitialTab,
        setAdminInitialTab,
        openAdmin,
        closeAdmin,
        loginAdmin,
        logoutAdmin,
        updateHeroConfig,
        updateCompanyConfig,
        updateBookConfig,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addClientLogo,
        updateClientLogo,
        deleteClientLogo,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        setMediaAsHero,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
        uploadLogoToDatabase,
        uploadClientLogoToStorage,
        uploadStoryImageToStorage,
        uploadBookCoverToStorage,
        isDatabaseConnected,
        isSavingToDatabase,
        lastDatabaseSync,
        manualDatabaseSync,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
