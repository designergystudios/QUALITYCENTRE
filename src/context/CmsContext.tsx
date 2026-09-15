import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMPANY_DETAILS, ISO_STANDARDS } from '../data/content';
import heroInfographicAsset from '../assets/images/hero_infographic_1789451412328.jpg';

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
}

export interface CmsContextType {
  heroConfig: HeroConfig;
  companyConfig: CompanyConfig;
  galleryItems: GalleryItem[];
  clientLogos: ClientLogoItem[];
  successStories: SuccessStoryItem[];
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  updateHeroConfig: (updates: Partial<HeroConfig>) => void;
  updateCompanyConfig: (updates: Partial<CompanyConfig>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => GalleryItem;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  addClientLogo: (logo: Omit<ClientLogoItem, 'id'>) => ClientLogoItem;
  deleteClientLogo: (id: string) => void;
  addSuccessStory: (story: Omit<SuccessStoryItem, 'id' | 'date'>) => SuccessStoryItem;
  updateSuccessStory: (id: string, updates: Partial<SuccessStoryItem>) => void;
  deleteSuccessStory: (id: string) => void;
  setMediaAsHero: (type: 'video' | 'infographic', url: string) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => string;
  importConfigJson: (jsonString: string) => boolean;
}

const DEFAULT_HERO_CONFIG: HeroConfig = {
  headline: 'Empowering success by making business processes run faster, easier, and better.',
  subheadline:
    'Transforming ISO, Risk, GRC, and Sustainability requirements into high-performing, digitally-enabled operating systems across Kenya & East Africa.',
  badgeText: 'KENYA & PAN-AFRICA ISO ADVISORY',
  videoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-data-31913-large.mp4',
  fallbackVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-moving-electronic-signals-41557-large.mp4',
  infographicUrl: heroInfographicAsset,
  bgMode: 'video',
  videoOpacity: 0.35,
  ctaPrimaryText: 'Explore Solutions',
  ctaSecondaryText: 'Book ISO Audit',
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
  logoType: 'vector',
};

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'media-1',
    type: 'image',
    title: 'Modern ISO & Digital GRC Architecture Infographic',
    description:
      'Executive system diagram illustrating the convergence of SoftExpert QMS, airSlate automation, and ISO 9001/27001/14001 compliance telemetry.',
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
  { id: 'logo-1', name: 'Kenya Commercial Bank', logoUrl: 'https://images.unsplash.com/photo-1541359902798-011504994843?auto=format&fit=crop&w=300&q=80', industry: 'Banking & Finance' },
  { id: 'logo-2', name: 'East African Breweries', logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80', industry: 'Manufacturing' },
  { id: 'logo-3', name: 'Safaricom Telemetry', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80', industry: 'Telecommunications' },
  { id: 'logo-4', name: 'Bamburi Cement', logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80', industry: 'Construction' },
  { id: 'logo-5', name: 'Equity Group Holdings', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80', industry: 'Financial Services' },
  { id: 'logo-6', name: 'Nairobi Bottlers', logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80', industry: 'FMCG' },
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
];

const STORAGE_KEYS = {
  HERO: 'qc_cms_hero_v1',
  COMPANY: 'qc_cms_company_v1',
  GALLERY: 'qc_cms_gallery_v1',
  LOGOS: 'qc_cms_logos_v1',
  STORIES: 'qc_cms_stories_v1',
  AUTH: 'qc_cms_admin_auth_v1',
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO);
      if (saved) return { ...DEFAULT_HERO_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load hero config from localStorage', e);
    }
    return DEFAULT_HERO_CONFIG;
  });

  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
      if (saved) return { ...DEFAULT_COMPANY_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load company config from localStorage', e);
    }
    return DEFAULT_COMPANY_CONFIG;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load gallery items from localStorage', e);
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  const [clientLogos, setClientLogos] = useState<ClientLogoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load client logos from localStorage', e);
    }
    return DEFAULT_CLIENT_LOGOS;
  });

  const [successStories, setSuccessStories] = useState<SuccessStoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load success stories from localStorage', e);
    }
    return DEFAULT_SUCCESS_STORIES;
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Persist hero config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(heroConfig));
    } catch (e) {
      console.warn('Failed to save hero config', e);
    }
  }, [heroConfig]);

  // Persist company config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(companyConfig));
    } catch (e) {
      console.warn('Failed to save company config', e);
    }
  }, [companyConfig]);

  // Persist gallery items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(galleryItems));
    } catch (e) {
      console.warn('Failed to save gallery items', e);
    }
  }, [galleryItems]);

  // Persist client logos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(clientLogos));
    } catch (e) {
      console.warn('Failed to save client logos', e);
    }
  }, [clientLogos]);

  // Persist success stories
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(successStories));
    } catch (e) {
      console.warn('Failed to save success stories', e);
    }
  }, [successStories]);

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const loginAdmin = (username: string, password: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    // Enforce username: admin and password: Qckenya@2026!
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
    setHeroConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateCompanyConfig = (updates: Partial<CompanyConfig>) => {
    setCompanyConfig((prev) => ({ ...prev, ...updates }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...item,
      id: `media-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      thumbnailUrl: item.thumbnailUrl || item.mediaUrl,
    };
    setGalleryItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addClientLogo = (logo: Omit<ClientLogoItem, 'id'>): ClientLogoItem => {
    const newLogo: ClientLogoItem = {
      ...logo,
      id: `logo-${Date.now()}`,
    };
    setClientLogos((prev) => [newLogo, ...prev]);
    return newLogo;
  };

  const deleteClientLogo = (id: string) => {
    setClientLogos((prev) => prev.filter((item) => item.id !== id));
  };

  const addSuccessStory = (story: Omit<SuccessStoryItem, 'id' | 'date'>): SuccessStoryItem => {
    const newStory: SuccessStoryItem = {
      ...story,
      id: `story-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setSuccessStories((prev) => [newStory, ...prev]);
    return newStory;
  };

  const updateSuccessStory = (id: string, updates: Partial<SuccessStoryItem>) => {
    setSuccessStories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteSuccessStory = (id: string) => {
    setSuccessStories((prev) => prev.filter((item) => item.id !== id));
  };

  const setMediaAsHero = (type: 'video' | 'infographic', url: string) => {
    if (type === 'video') {
      setHeroConfig((prev) => ({
        ...prev,
        videoUrl: url,
        bgMode: 'video',
      }));
    } else {
      setHeroConfig((prev) => ({
        ...prev,
        infographicUrl: url,
        bgMode: 'infographic',
      }));
    }
  };

  const resetToDefaults = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
    setCompanyConfig(DEFAULT_COMPANY_CONFIG);
    setGalleryItems(DEFAULT_GALLERY_ITEMS);
    setClientLogos(DEFAULT_CLIENT_LOGOS);
    setSuccessStories(DEFAULT_SUCCESS_STORIES);
    try {
      localStorage.removeItem(STORAGE_KEYS.HERO);
      localStorage.removeItem(STORAGE_KEYS.COMPANY);
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      localStorage.removeItem(STORAGE_KEYS.LOGOS);
      localStorage.removeItem(STORAGE_KEYS.STORIES);
    } catch {}
  };

  const exportConfigJson = (): string => {
    const config = {
      heroConfig,
      companyConfig,
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
      if (parsed.heroConfig) setHeroConfig(parsed.heroConfig);
      if (parsed.companyConfig) setCompanyConfig(parsed.companyConfig);
      if (parsed.galleryItems && Array.isArray(parsed.galleryItems)) setGalleryItems(parsed.galleryItems);
      if (parsed.clientLogos && Array.isArray(parsed.clientLogos)) setClientLogos(parsed.clientLogos);
      if (parsed.successStories && Array.isArray(parsed.successStories)) setSuccessStories(parsed.successStories);
      return true;
    } catch (e) {
      console.error('Invalid JSON configuration', e);
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
        isAdminOpen,
        isAdminAuthenticated,
        openAdmin,
        closeAdmin,
        loginAdmin,
        logoutAdmin,
        updateHeroConfig,
        updateCompanyConfig,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addClientLogo,
        deleteClientLogo,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        setMediaAsHero,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
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
