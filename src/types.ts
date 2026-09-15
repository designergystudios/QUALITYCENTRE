export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface IsoStandard {
  code: string;
  name: string;
  category: 'Quality' | 'Environment' | 'Security' | 'Sector-Specific' | 'ESG';
  description: string;
  keyClauses: string[];
  digitalBenefits: string[];
  iconName: string;
  color: string;
}

export interface ServiceCapability {
  title: string;
  description: string;
  tools: string[];
  icon: string;
}

export interface ServicePillar {
  id: 'iso-transformation' | 'sustainability-esg' | 'grc-transformation';
  title: string;
  tagline: string;
  badge: string;
  description: string;
  icon: string;
  standards?: IsoStandard[];
  capabilities: ServiceCapability[];
  businessValue: string[];
}

export interface TechPartner {
  name: string;
  tag: string;
  description: string;
  accentColor: string;
  features: string[];
  logoSvg: string;
  bestFor: string;
  agreementUrl?: string;
  websiteUrl?: string;
  badge?: string;
}

export interface ApproachStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  duration: string;
  summary: string;
  deliverables: string[];
  digitalTools: string[];
  afroPatternKey: string;
}

export interface CaseStudy {
  id: string;
  clientType: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    label: string;
  }[];
  standards: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface FounderBook {
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  coverImage?: string;
  description: string;
  keyTakeaways: string[];
  quote: string;
  purchaseUrl: string;
  socialLinks: {
    companyLinkedIn: string;
    companyTwitter: string;
    founderLinkedIn: string;
    founderTwitter: string;
  };
}

export interface ConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  companySize: string;
  serviceInterest: string;
  targetedStandard: string;
  timeline: string;
  comments?: string;
}
