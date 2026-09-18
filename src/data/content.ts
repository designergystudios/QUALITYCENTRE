import {
  IsoStandard,
  ServicePillar,
  TechPartner,
  ApproachStep,
  CaseStudy,
  FounderBook,
} from '../types';

export const COMPANY_DETAILS = {
  name: 'Quality Centre Limited',
  shortName: 'Quality Centre',
  legalName: 'Quality Centre Limited (Kenya)',
  tagline: 'Empowering success by making business processes run faster, easier, and better.',
  subheadline:
    'Quality Centre transforms ISO, risk, GRC, and ESG/sustainability requirements into high-performing, digitally-enabled operating systems across Africa & beyond.',
  founded: '1998',
  experienceYears: '26+',
  headquarters: 'Nairobi, Kenya',
  address: 'Eden Square Business Centre, 5th Floor, Chiromo Road, Westlands, Nairobi, Kenya',
  phone: '+254 (0) 20 386 1120 / +254 722 000 000',
  email: 'info@qualitycentre.co.ke',
  hours: 'Mon - Fri: 8:00 AM - 5:00 PM EAT',
  social: {
    companyLinkedIn: 'https://www.linkedin.com/company/quality-centreke/',
    companyTwitter: 'https://x.com/qualitycentreke',
    founderLinkedIn: 'https://www.linkedin.com/in/njatha/',
    founderTwitter: 'https://x.com/juliusnmm',
  },
  stats: [
    { value: '350+', label: 'ISO Certifications Enabled', desc: 'Across manufacturing, tech, financial & public sectors' },
    { value: '99.4%', label: 'First-Attempt Audit Pass', desc: 'Uncompromised compliance and digital audit readiness' },
    { value: '12+', label: 'African Nations Served', desc: 'Pan-African footprint across East, Central & West Africa' },
    { value: '65%', label: 'Audit Prep Time Cut', desc: 'Through automated SoftExpert workflows & PECB-certified auditing frameworks' },
  ],
};

export const ISO_STANDARDS: IsoStandard[] = [
  {
    code: 'ISO 9001',
    name: 'Quality Management Systems (QMS)',
    category: 'Quality',
    description: 'The global benchmark for customer satisfaction, operational consistency, and continuous process optimization.',
    keyClauses: [
      'Clause 4: Context of the Organization & Stakeholders',
      'Clause 5: Leadership & Customer Focus',
      'Clause 6: Risk-Based Planning & Quality Objectives',
      'Clause 7 & 8: Operational Support, Control & Traceability',
      'Clause 9 & 10: Performance Evaluation & CAPA',
    ],
    digitalBenefits: [
      'Automated Document & SOP Version Control',
      'Instant Root Cause Analysis & Non-Conformity Tracking',
      'Real-Time Customer Satisfaction Index Dashboards',
      'Automated Internal Audit Scheduling & Notifications',
    ],
    iconName: 'ShieldCheck',
    color: '#00B4D8',
  },
  {
    code: 'ISO/IEC 27001',
    name: 'Information Security, Cybersecurity & Privacy Protection',
    category: 'Security',
    description: 'Systematic protection of corporate intellectual property, cloud assets, sensitive customer data, and financial records.',
    keyClauses: [
      'Clause 4 to 10: ISMS Governance & Continuous Improvement',
      'Annex A.5: Organizational Security Controls',
      'Annex A.6: People Security & Awareness',
      'Annex A.7 & A.8: Physical & Technological Controls',
    ],
    digitalBenefits: [
      'Continuous Asset & Threat Vulnerability Register',
      'Access Rights & Privilege Escalation Audits',
      'Incident Response SLA Tracking & Cryptographic Logs',
      'Kenya Data Protection Act (DPA 2019) Cross-Mapping',
    ],
    iconName: 'Lock',
    color: '#38BDF8',
  },
  {
    code: 'ISO 14001',
    name: 'Environmental Management Systems (EMS)',
    category: 'Environment',
    description: 'Framework to minimize ecological footprint, ensure regulatory compliance with NEMA, and drive resource efficiency.',
    keyClauses: [
      'Environmental Aspects & Impact Significance Evaluation',
      'Compliance Obligations & NEMA Regulatory Alignment',
      'Operational Environmental Controls & Emergency Readiness',
      'Waste Stream Metrics, Energy Monitoring & Audits',
    ],
    digitalBenefits: [
      'Automated Effluent, Energy & Emission Data Capture',
      'Real-Time NEMA Compliance Calendar & Permits Tracker',
      'Incident & Spill Reporting with Geotagged Evidence',
      'Resource Conservation KPI Trend Forecasting',
    ],
    iconName: 'Leaf',
    color: '#10B981',
  },
  {
    code: 'ISO 45001',
    name: 'Occupational Health and Safety (OH&S)',
    category: 'Security',
    description: 'Proactive protection of workplace personnel, eliminating hazards, preventing injuries, and fostering workplace well-being.',
    keyClauses: [
      'Worker Consultation & Health & Safety Participation',
      'Hazard Identification, Risk Assessment & Hierarchy of Controls',
      'Emergency Preparedness & Response Simulations',
      'Incident Investigation & Corrective Action Loops',
    ],
    digitalBenefits: [
      'Mobile Field Hazard Logging with Photo Attachments',
      'Contractor Safety Pre-Qualification & Permit-to-Work',
      'Lost Time Injury Frequency Rate (LTIFR) Live Gauges',
      'Automated PPE Inspection & Maintenance Logs',
    ],
    iconName: 'HardHat',
    color: '#F59E0B',
  },
  {
    code: 'ISO 22000 / 22001',
    name: 'Food Safety Management Systems (FSMS)',
    category: 'Sector-Specific',
    description: 'Farm-to-fork integrity ensuring food safety hazards are controlled across agriculture, manufacturing, packaging, and logistics.',
    keyClauses: [
      'Prerequisite Programmes (PRPs) Verification',
      'HACCP Principles & Critical Control Point (CCP) Monitoring',
      'Interactive Communication & Product Traceability Systems',
      'Emergency Preparedness & Rapid Recall Protocols',
    ],
    digitalBenefits: [
      'Batch-Level Digital Traceability & Cold-Chain Telemetry',
      'Automated CCP Out-of-Spec Warning Alerts',
      'Supplier Ingredient Certification Verification',
      'Simulated Product Recall Drills & Audit Trails',
    ],
    iconName: 'UtensilsCrossed',
    color: '#EC4899',
  },
  {
    code: 'ISO 21001',
    name: 'Educational Organizations Management Systems (EOMS)',
    category: 'Sector-Specific',
    description: 'Tailored for Kenyan universities, colleges, and training institutes to elevate learner satisfaction and institutional governance.',
    keyClauses: [
      'Curriculum Design, Delivery & Competency Frameworks',
      'Special Educational Needs & Inclusivity Monitoring',
      'Institutional Governance & Educator Quality Evaluations',
      'Feedback Loops from Students, Alumni & Industry Employers',
    ],
    digitalBenefits: [
      'Digitized Academic Performance & Syllabus Tracking',
      'Automated Student Feedback Surveys & Sentiment Analysis',
      'Accreditation Compliance Readiness (CUE & TVETA)',
      'Digital Certificate Verification & Faculty Portals',
    ],
    iconName: 'GraduationCap',
    color: '#8B5CF6',
  },
  {
    code: 'ISO 26000',
    name: 'Social Responsibility Guidance & ESG Governance',
    category: 'ESG',
    description: 'Transforming societal commitments into verifiable actions covering human rights, fair operating practices, and community development.',
    keyClauses: [
      'Seven Core Subjects: Organizational Governance & Human Rights',
      'Labor Practices & Fair Working Conditions',
      'The Environment & Sustainable Resource Stewardship',
      'Fair Operating Practices & Consumer Issues',
    ],
    digitalBenefits: [
      'Stakeholder Materiality Assessment Matrix',
      'Automated CSR Impact & Social ROI Tracking',
      'Nairobi Securities Exchange (NSE) ESG Disclosure Readiness',
      'Ethical Supply Chain Due Diligence Verification',
    ],
    iconName: 'Globe',
    color: '#06B6D4',
  },
];

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'iso-transformation',
    title: 'ISO & Management Systems Digital Transformation',
    tagline: 'Replace cumbersome paper files with an intelligent, cloud-enabled ISO operating platform.',
    badge: 'Flagship Core Pillar',
    description:
      'We guide African corporations, manufacturing giants, and growing enterprises through full-lifecycle ISO implementation. Rather than drowning in binders, we architect your entire management system directly into digital workflows.',
    icon: 'Layers',
    standards: ISO_STANDARDS,
    capabilities: [
      {
        title: 'End-to-End Implementation & Training',
        description: 'Comprehensive gap analysis, executive masterclasses, internal auditor certification, and stage-by-stage rollout.',
        tools: ['Executive Playbooks', 'Interactive LMS', 'Audit Simulation'],
        icon: 'Award',
      },
      {
        title: 'Document & SOP Version Control',
        description: 'Automated lifecycle management of policies, work instructions, and procedures with role-based cryptographic approvals.',
        tools: ['PECB Audit Frameworks', 'SoftExpert Document', 'Cloud Repository'],
        icon: 'FileText',
      },
      {
        title: 'Digital Internal Audits & Checklists',
        description: 'Tablet-ready audit forms, dynamic evidence capture, finding categorization, and automated audit report generation.',
        tools: ['Mobile Audit Apps', 'Offline Sync', 'Clause Matrix'],
        icon: 'ClipboardCheck',
      },
      {
        title: 'Automated Non-Conformities & CAPA Engine',
        description: 'Structured 5-Why and Ishikawa root cause workflows ensuring corrective actions are closed out with verifiable proof.',
        tools: ['8D Methodology', 'Corrective Action Tracker', 'Escalation Alerts'],
        icon: 'AlertTriangle',
      },
      {
        title: 'Risk & Opportunity Management Matrix',
        description: 'Quantified probability/impact scoring across operational, strategic, financial, and regulatory risk dimensions.',
        tools: ['Heatmaps', 'Mitigation Logs', 'Residual Risk Gauges'],
        icon: 'TrendingUp',
      },
      {
        title: 'Management Reviews & Live BI Dashboards',
        description: 'Executive dashboards pulling real-time QMS metrics, customer NPS, quality costs, and objective progress.',
        tools: ['Executive Telemetry', 'Automated Agenda Builder', 'KPI Dashboards'],
        icon: 'BarChart3',
      },
    ],
    businessValue: [
      'Eliminate 80%+ of paper archiving and physical signature bottlenecks',
      'Guarantee 100% audit trail transparency for external certification bodies',
      'Empower departmental leads with autonomous self-auditing routines',
    ],
  },
  {
    id: 'sustainability-esg',
    title: 'Sustainability & Digital ESG Management',
    tagline: 'Turn sustainability from a compliance burden into measurable stakeholder and financial value.',
    badge: 'Future-Proof Pillar',
    description:
      'Navigating modern ESG expectations requires hard, verifiable data. We combine African environmental context with international frameworks (GRI, ISSB, NSE ESG Guidelines) to build automated sustainability data pipelines.',
    icon: 'Sprout',
    capabilities: [
      {
        title: 'ESG Governance Architecture',
        description: 'Board-level sustainability charters, stakeholder materiality assessments, and executive accountability structures.',
        tools: ['NSE ESG Framework', 'GRI Standards', 'Board Dashboards'],
        icon: 'Shield',
      },
      {
        title: 'Automated Scope 1, 2 & 3 Data Collection',
        description: 'IoT energy meter connectors, utility bill document extraction, fuel consumption logs, and automated carbon factoring.',
        tools: ['PECB Sustainability Criteria', 'Carbon Factor Matrix', 'ERP Sync'],
        icon: 'Cpu',
      },
      {
        title: 'Sustainability Risk & Climate Scenario Planning',
        description: 'TCFD-aligned physical and transition risk assessments tailored for East African climate vulnerabilities and supply chains.',
        tools: ['Climate Heatmaps', 'Transition Scenarios', 'Drought/Flood Indices'],
        icon: 'CloudRain',
      },
      {
        title: 'Verifiable Impact & Carbon Dashboards',
        description: 'Live carbon intensity per unit produced, water conservation metrics, diversity ratios, and community investment stats.',
        tools: ['Interactive Gauges', 'Investor-Ready Exports', 'NEMA Ready Reports'],
        icon: 'PieChart',
      },
    ],
    businessValue: [
      'Unlock green financing and preferential bank lending rates across Africa',
      'Satisfy international buyers demanding verified Scope 3 carbon transparency',
      'Comply effortlessly with Nairobi Securities Exchange mandatory ESG reporting',
    ],
  },
  {
    id: 'grc-transformation',
    title: 'GRC Management Transformation',
    tagline: 'Unify Governance, Risk, Compliance, and ISO into a single agile operating system.',
    badge: 'Enterprise Architecture',
    description:
      'Most organizations suffer from audit fatigue caused by disjointed compliance silos. Our unified GRC framework synchronizes regulatory obligations (CBK, CMA, NEMA, DPA) with operational ISO standards into one unified digital engine.',
    icon: 'Network',
    capabilities: [
      {
        title: 'Unified Corporate Compliance Universe',
        description: 'Consolidated database of all statutory laws, sector regulations, license renewals, and international standards.',
        tools: ['Regulatory Crawler', 'Obligations Matrix', 'Penalty Risk Warning'],
        icon: 'BookOpen',
      },
      {
        title: 'Enterprise Risk Management (ERM)',
        description: 'COSO and ISO 31000 aligned framework mapping risks directly to key strategic corporate initiatives.',
        tools: ['Risk Taxonomy', 'KRI (Key Risk Indicators)', 'Appetite Statements'],
        icon: 'Compass',
      },
      {
        title: 'Automated Regulatory Evidence Pipeline',
        description: 'No more scrambling for audit evidence. Policies, system logs, training records, and sign-offs are indexed automatically.',
        tools: ['Cryptographic Audit Trail', 'Instant Packager', 'Auditor Read-Only Portal'],
        icon: 'Database',
      },
      {
        title: 'Executive & Board Oversight Cockpit',
        description: 'Holistic heatmaps and confidence scores giving directors an instantaneous view of enterprise exposure.',
        tools: ['Board-Ready PDF Packs', 'Real-Time Compliance Index', 'Action Logs'],
        icon: 'Eye',
      },
    ],
    businessValue: [
      'Reduce redundant audit cycles by up to 50% across multiple overlapping standards',
      'Instantly expose blind spots before regulators or external auditors detect them',
      'Transition from reactive compliance panics to proactive risk intelligence',
    ],
  },
];

export const TECH_PARTNERS: TechPartner[] = [
  {
    name: 'SoftExpert',
    tag: 'Enterprise Management Platform',
    accentColor: '#00B4D8',
    description:
      'Global market leader in software for corporate governance, quality management, regulatory compliance, and business process automation.',
    bestFor: 'Complex enterprise architectures, multi-standard management, full QMS/EHS/GRC unification.',
    features: [
      'SoftExpert EQM (Enterprise Quality Management)',
      'SoftExpert GRC (Governance, Risk & Compliance)',
      'SoftExpert EHS (Environmental, Health & Safety)',
      'SoftExpert CPM (Corporate Performance Management)',
      'Automated CAPA, 8D, and Workflow Orchestration',
    ],
    logoSvg: 'SoftExpert-QMS',
  },
  {
    name: 'PECB',
    tag: 'Global Authorized Training & Certification Partner',
    accentColor: '#D97706',
    description:
      'Premier international certification body providing education, accredited training courses, and professional certification across ISO 9001, ISO/IEC 27001, ISO 14001, ISO 45001, and ISO 22301 under our official partnership agreement.',
    bestFor: 'Globally accredited personnel certifications, corporate lead auditor training, and ISO professional examinations.',
    features: [
      'Official PECB Authorized Training & Exam Partner in East Africa',
      'PECB Certified Lead Auditor & Lead Implementer Courses',
      'Accredited under ANSI/ISO/IEC 17024 Worldwide Standards',
      'Comprehensive Certification in ISO 9001, 27001, 14001, 45001, 37001',
      'Global Registry of Certified Lead Auditors & Systems Specialists',
    ],
    logoSvg: 'PECB-Official',
    agreementUrl: 'https://pecb.com/en/newsReleases/pecb-signs-a-partnership-agreement-with-quality-centre-ltd',
    websiteUrl: 'https://pecb.com/en',
    badge: 'Official Agreement',
  },
];

export const APPROACH_STEPS: ApproachStep[] = [
  {
    stepNumber: '01',
    title: 'Discover & Diagnose',
    subtitle: 'Meticulous Gap Analysis & Maturity Profiling',
    duration: 'Weeks 1 - 3',
    summary:
      'We conduct on-site and remote deep-dive diagnostics against targeted ISO clauses, statutory obligations, and operational pinch points.',
    deliverables: [
      'Executive Gap Analysis Matrix & Heatmap',
      'Process Interdependency Mapping',
      'Statutory & Regulatory Obligations Baseline',
      'Targeted Digital Transformation Roadmap & ROI Model',
    ],
    digitalTools: ['Automated Diagnostic Portal', 'Clause Cross-Reference Engine'],
    afroPatternKey: 'pattern-triangle',
  },
  {
    stepNumber: '02',
    title: 'Digitally Transform',
    subtitle: 'Process Architecture & Workflow Digitization',
    duration: 'Weeks 4 - 8',
    summary:
      'We eliminate obsolete paper forms. Our solution architects convert SOPs, inspection sheets, and approvals into streamlined digital workflows.',
    deliverables: [
      'Digital Document & SOP Architecture',
      'Automated CAPA & Non-Conformity Logic',
      'Configured SoftExpert / PECB Auditing Framework Templates',
      'Customized KPI & Quality Objective Dashboards',
    ],
    digitalTools: ['PECB Audit & Exam Portal', 'SoftExpert Process Modeler'],
    afroPatternKey: 'pattern-diamond',
  },
  {
    stepNumber: '03',
    title: 'Integrate & Empower',
    subtitle: 'Systems Rollout & Capability Transfer',
    duration: 'Weeks 9 - 14',
    summary:
      'We embed the digital operating system into daily team routines through hands-on role training, champion enablement, and internal auditor coaching.',
    deliverables: [
      'Certified Internal Auditor Cohort',
      'Role-Based Quick-Reference Digital Guides',
      'Automated Evidence Collection Infrastructure',
      'Departmental Management Review Simulation',
    ],
    digitalTools: ['Interactive LMS', 'Live Simulation Sandbox'],
    afroPatternKey: 'pattern-chevron',
  },
  {
    stepNumber: '04',
    title: 'Continuous Excellence',
    subtitle: 'Mock Audit, Certification & Ongoing Optimization',
    duration: 'Weeks 15+',
    summary:
      'We conduct rigorous pre-assessment mock audits, accompany you through Stage 1 & 2 external certification audits, and establish continuous KPI loops.',
    deliverables: [
      'Formal Pre-Certification Mock Audit Report',
      'Accompaniment during External Certification Audit',
      '100% First-Time Pass Guarantee Commitment',
      'Annual Surveillance Maintenance & Optimization Program',
    ],
    digitalTools: ['Auditor Evidence Package Builder', 'Executive Governance Telemetry'],
    afroPatternKey: 'pattern-matrix',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    clientType: 'Premier East African FMCG Manufacturer',
    industry: 'Consumer Goods & Food Processing',
    location: 'Nairobi & Thika, Kenya',
    challenge:
      'Managing duplicate paper documentation across 3 production plants for ISO 9001 and ISO 22000 resulted in audit delays, lost inspection logs, and recurring non-conformities.',
    solution:
      'Deployed SoftExpert EQM alongside PECB accredited lead auditor procedures to digitize 180+ standard operating procedures, automated batch hazard logging, and integrated digital supplier verification.',
    results: [
      { metric: '65%', label: 'Reduction in Audit Prep Time' },
      { metric: '0', label: 'Major External Findings in 4 Years' },
      { metric: '4.8x', label: 'Faster CAPA Resolution Speed' },
    ],
    standards: ['ISO 9001:2015', 'ISO 22000:2018', 'PECB Accredited Auditor Protocols'],
    testimonial: {
      quote:
        'Quality Centre Limited did not just help us pass our ISO audit—they eradicated our paperwork nightmare and created a digital culture that our shop-floor managers love using every single shift.',
      author: 'Operations & Quality Director',
      role: 'Leading Regional FMCG Conglomerate',
    },
  },
  {
    id: 'case-2',
    clientType: 'Commercial Banking & Fintech Pioneer',
    industry: 'Financial Services & Payments',
    location: 'Nairobi, Kenya (Regional Operations in Uganda & Rwanda)',
    challenge:
      'Heightened CBK regulatory demands and cyber threats required rapid alignment with ISO/IEC 27001 and Kenya Data Protection Act without stalling agile developer sprints.',
    solution:
      'Built a unified GRC architecture bridging software release cycles, automated access entitlement audits, and dynamic information asset vulnerability matrices.',
    results: [
      { metric: '100%', label: 'First-Attempt ISO 27001 Pass' },
      { metric: '82%', label: 'Faster Vendor Risk Approvals' },
      { metric: 'Zero', label: 'Data Protection Penalties' },
    ],
    standards: ['ISO/IEC 27001:2022', 'Kenya DPA 2019', 'SoftExpert GRC'],
    testimonial: {
      quote:
        'Their deep grasp of international standards alongside local Kenyan financial regulations made Quality Centre an indispensable strategic partner for our board and tech leadership.',
      author: 'Chief Information Security Officer',
      role: 'Top-Tier Commercial Bank Kenya',
    },
  },
  {
    id: 'case-3',
    clientType: 'Major Horticultural & Flower Exporter',
    industry: 'Agribusiness & Export Logistics',
    location: 'Naivasha & Eldoret, Kenya',
    challenge:
      'Strict European Union retail standards demanded rigorous proof of environmental stewardship (ISO 14001) and social compliance (ISO 26000 / ESG).',
    solution:
      'Engineered an automated ESG telemetry system monitoring water reclamation, pesticide safe-handling records, and worker welfare committees using tablet field forms.',
    results: [
      { metric: '30%', label: 'Lower Water Consumption' },
      { metric: 'EU Retained', label: 'Premium Supermarket Contracts' },
      { metric: '100%', label: 'NEMA & OSHA Full Compliance' },
    ],
    standards: ['ISO 14001:2015', 'ISO 45001:2018', 'ISO 26000 / ESG'],
    testimonial: {
      quote:
        'Quality Centre helped us translate complex sustainability requirements into clear daily actions. Our international clients frequently praise the transparency of our digital audit trails.',
      author: 'Managing Director',
      role: 'Naivasha Agricultural Exports Group',
    },
  },
];

export const FOUNDER_BOOK: FounderBook = {
  title: 'ISO 9000 Secret',
  subtitle: 'Unlocking World Markets',
  author: 'Julius N.',
  authorRole: 'Founder & Lead Management Systems Strategist, Quality Centre Limited',
  description:
    'In this seminal work, Julius N. demystifies international quality standards for visionary entrepreneurs and corporate executives across Africa and developing economies. The book reveals how to stop viewing ISO as bureaucratic red tape and instead wield it as a lethal competitive weapon to dominate domestic tenders, conquer export barriers, and command premium pricing in global supply chains.',
  keyTakeaways: [
    'How African businesses can shatter international trade suspicion by mastering verifiable quality consistency.',
    'The "Anti-Bureaucracy Method": Streamlining documentation so ISO fuels speed instead of paralyzing agility.',
    'Winning lucrative corporate and government tenders through certified compliance credentials.',
    'Bridging local operational culture with European, North American, and Asian import criteria.',
  ],
  quote:
    'Certification on the wall is useless if your processes remain slow, painful, and prone to error. Real ISO mastery is about speed, precision, and building an organization that can scale across borders without breaking.',
  purchaseUrl: '#book-consultation',
  socialLinks: {
    companyLinkedIn: 'https://www.linkedin.com/company/quality-centreke/',
    companyTwitter: 'https://x.com/qualitycentreke',
    founderLinkedIn: 'https://www.linkedin.com/in/njatha/',
    founderTwitter: 'https://x.com/juliusnmm',
  },
};
