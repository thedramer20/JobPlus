import type { Company } from "../types/company";
import type { Job } from "../types/job";
import type { Post } from "../types/post";
import type { SavedJob } from "../types/profile";

const now = Date.now();

// Extended Job interface for demo data
interface ExtendedJob extends Job {
  responsibilities?: string[];
  benefits?: string[];
  preferredQualifications?: string[];
  hiringProcess?: string[];
  teamInfo?: string;
  department?: string;
}

// Extended Company interface for demo data
interface ExtendedCompany extends Company {
  founded?: string;
  mission?: string;
  culture?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  benefits?: string[];
  growthNotes?: string;
  employeeCount?: string;
}

// Demo Saved Jobs
export const demoSavedJobs: SavedJob[] = [
  {
    id: 1,
    jobId: 1,
    jobTitle: "Senior Software Engineer",
    companyName: "TechFlow Inc.",
    location: "San Francisco, CA",
    jobType: "Full-time",
    status: "Active",
    savedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 2,
    jobId: 4,
    jobTitle: "Frontend Developer",
    companyName: "InnovateTech",
    location: "Austin, TX",
    jobType: "Full-time",
    status: "Active",
    savedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 3,
    jobId: 2,
    jobTitle: "Product Designer",
    companyName: "DesignHub",
    location: "New York, NY",
    jobType: "Full-time",
    status: "Active",
    savedAt: new Date(now - 1000 * 60 * 60 * 72).toISOString()
  }
];

// Demo Companies with detailed information
export const demoCompanies: ExtendedCompany[] = [
  {
    id: 1,
    ownerUsername: "techflow_admin",
    name: "TechFlow Inc.",
    industry: "Technology",
    location: "San Francisco, CA",
    size: "501-1000",
    description: "TechFlow is a leading enterprise software company specializing in cloud infrastructure and developer tools. We help businesses scale their technology operations with modern solutions.",
    website: "https://techflow.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=TechFlow&background=0D8ABC&color=fff&size=128",
    founded: "2015",
    mission: "To empower businesses with scalable, reliable cloud infrastructure that drives innovation and growth.",
    culture: "We foster a culture of continuous learning, technical excellence, and collaborative problem-solving. Our team values transparency, ownership, and customer success above all else.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/techflow",
      twitter: "https://twitter.com/techflow",
      github: "https://github.com/techflow"
    },
    benefits: [
      "Competitive compensation and equity",
      "Comprehensive health benefits",
      "Flexible remote work policy",
      "Professional development budget",
      "Parental leave and family support"
    ],
    growthNotes: "Growing 40% year-over-year with expansion into European markets planned for 2024",
    employeeCount: "847 employees across 5 global offices"
  },
  {
    id: 2,
    ownerUsername: "designhub_admin",
    name: "DesignHub",
    industry: "Design",
    location: "New York, NY",
    size: "201-500",
    description: "DesignHub is a premier design agency focused on creating exceptional digital experiences. We work with startups and Fortune 500 companies to build products people love.",
    website: "https://designhub.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=DesignHub&background=FF6B6B&color=fff&size=128",
    founded: "2018",
    mission: "To create digital experiences that delight users and drive measurable business outcomes through exceptional design.",
    culture: "Our design-first culture emphasizes creativity, empathy, and data-informed decisions. We believe great design comes from diverse perspectives and collaborative iteration.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/designhub",
      twitter: "https://twitter.com/designhub",
      github: "https://github.com/designhub"
    },
    benefits: [
      "Creative studio environment",
      "Flexible working hours",
      "Design conference attendance",
      "Latest design tools provided",
      "Portfolio development support"
    ],
    growthNotes: "Expanded client base by 60% in 2023, opening new London office",
    employeeCount: "234 designers and strategists"
  },
  {
    id: 3,
    ownerUsername: "datasphere_admin",
    name: "DataSphere",
    industry: "Data Science",
    location: "Seattle, WA",
    size: "1001-5000",
    description: "DataSphere transforms complex data into actionable insights. Our platform helps organizations make data-driven decisions with advanced analytics and machine learning.",
    website: "https://datasphere.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=DataSphere&background=4ECDC4&color=fff&size=128",
    founded: "2016",
    mission: "To democratize data analytics and empower every organization to make smarter decisions through actionable insights.",
    culture: "We cultivate a data-driven culture where curiosity meets rigor. Our team thrives on challenging assumptions, validating hypotheses, and turning insights into impact.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/datasphere",
      twitter: "https://twitter.com/datasphere",
      github: "https://github.com/datasphere"
    },
    benefits: [
      "Competitive salary and bonuses",
      "Stock option grants",
      "Research publication support",
      "Conference and training budget",
      "Flexible remote-first policy"
    ],
    growthNotes: "Series C funded, scaling to 2,500 employees by end of 2024",
    employeeCount: "1,847 employees globally"
  },
  {
    id: 4,
    ownerUsername: "innovatetech_admin",
    name: "InnovateTech",
    industry: "Technology",
    location: "Austin, TX",
    size: "101-200",
    description: "InnovateTech builds cutting-edge web applications and mobile solutions. We're passionate about creating technology that makes a real difference in people's lives.",
    website: "https://innovatetech.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=InnovateTech&background=5F27CD&color=fff&size=128",
    founded: "2020",
    mission: "To build innovative technology solutions that solve real-world problems and improve people's daily lives.",
    culture: "Our startup culture values speed, experimentation, and user empathy. We celebrate bold ideas, learn from failures, and support each other in building products that matter.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/innovatetech",
      twitter: "https://twitter.com/innovatetech",
      github: "https://github.com/innovatetech"
    },
    benefits: [
      "Early-stage equity package",
      "Health and dental insurance",
      "Unlimited PTO",
      "Learning stipend",
      "Flexible remote work"
    ],
    growthNotes: "Raised Series A in 2023, hiring aggressively across all teams",
    employeeCount: "156 employees"
  },
  {
    id: 5,
    ownerUsername: "growthco_admin",
    name: "GrowthCo",
    industry: "Marketing",
    location: "Chicago, IL",
    size: "501-1000",
    description: "GrowthCo is a full-service marketing agency that helps businesses accelerate growth through data-driven campaigns and strategic partnerships.",
    website: "https://growthco.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=GrowthCo&background=FF9F43&color=fff&size=128",
    founded: "2017",
    mission: "To help businesses achieve sustainable growth through innovative marketing strategies and measurable results.",
    culture: "Our performance-driven culture balances creativity with analytics. We believe in bold ideas backed by data, collaborative execution, and celebrating wins together.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/growthco",
      twitter: "https://twitter.com/growthco"
    },
    benefits: [
      "Performance-based bonuses",
      "Health and wellness benefits",
      "Professional development",
      "Flexible work arrangements",
      "Team events and retreats"
    ],
    growthNotes: "Expanded to 3 new markets in 2023, planning international expansion",
    employeeCount: "678 marketing professionals"
  },
  {
    id: 6,
    ownerUsername: "finwise_admin",
    name: "FinWise Solutions",
    industry: "Finance",
    location: "Boston, MA",
    size: "201-500",
    description: "FinWise provides financial planning and investment management services for individuals and businesses. We make financial wellness accessible to everyone.",
    website: "https://finwise.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=FinWise&background=00D2D3&color=fff&size=128",
    founded: "2019",
    mission: "To make financial wellness and smart investing accessible to everyone through transparent, user-friendly platforms.",
    culture: "Our fiduciary-first culture puts client interests above all else. We value integrity, education, and long-term relationships over quick wins.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/finwise",
      twitter: "https://twitter.com/finwise"
    },
    benefits: [
      "Competitive salary",
      "401(k) matching",
      "Financial planning benefits",
      "Continuing education support",
      "Hybrid work options"
    ],
    growthNotes: "AUM grew 85% in 2023, launched new advisory services",
    employeeCount: "312 financial advisors and specialists"
  },
  {
    id: 7,
    ownerUsername: "healthtech_admin",
    name: "HealthTech Pro",
    industry: "Healthcare",
    location: "Denver, CO",
    size: "1001-5000",
    description: "HealthTech Pro develops innovative healthcare technology solutions. Our mission is to improve patient outcomes through better digital experiences.",
    website: "https://healthtechpro.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=HealthTech&background=EE5A24&color=fff&size=128",
    founded: "2014",
    mission: "To improve healthcare outcomes through innovative technology that enhances the patient and provider experience.",
    culture: "Our patient-centric culture combines healthcare expertise with technology innovation. We're driven by the impact we have on real patients and providers every day.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/healthtechpro",
      twitter: "https://twitter.com/healthtechpro"
    },
    benefits: [
      "Comprehensive health coverage",
      "Life and disability insurance",
      "Wellness programs",
      "Continuing medical education",
      "Flexible scheduling"
    ],
    growthNotes: "Partnered with 50+ healthcare systems in 2023, expanding to new regions",
    employeeCount: "2,156 healthcare and technology professionals"
  },
  {
    id: 8,
    ownerUsername: "ecosys_admin",
    name: "EcoSystems",
    industry: "Environment",
    location: "Portland, OR",
    size: "51-100",
    description: "EcoSystems creates sustainable technology solutions for businesses. We help companies reduce their environmental impact while improving efficiency.",
    website: "https://ecosystems.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=EcoSystems&background=2ECC71&color=fff&size=128",
    founded: "2021",
    mission: "To help businesses achieve sustainability goals through innovative technology that reduces environmental impact.",
    culture: "Our mission-driven culture balances environmental passion with practical business solutions. We believe sustainability and profitability can and must go hand in hand.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/ecosystems",
      twitter: "https://twitter.com/ecosystems",
      github: "https://github.com/ecosystems"
    },
    benefits: [
      "Competitive salary",
      "Carbon offset program",
      "Flexible remote work",
      "Environmental volunteering days",
      "Professional development"
    ],
    growthNotes: "Helped clients reduce emissions by average 35% in 2023",
    employeeCount: "78 sustainability and technology experts"
  },
  {
    id: 9,
    ownerUsername: "learnlab_admin",
    name: "LearnLab",
    industry: "Education",
    location: "Los Angeles, CA",
    size: "201-500",
    description: "LearnLab develops interactive learning platforms for corporate training and professional development. We make learning engaging and effective.",
    website: "https://learnlab.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=LearnLab&background=9B59B6&color=fff&size=128",
    founded: "2019",
    mission: "To transform corporate learning through engaging, interactive experiences that drive real skill development and behavior change.",
    culture: "Our learning-obsessed culture believes in continuous improvement for ourselves and our customers. We experiment boldly, measure outcomes, and iterate based on what works.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/learnlab",
      twitter: "https://twitter.com/learnlab"
    },
    benefits: [
      "Learning budget",
      "Conference attendance",
      "Flexible work schedule",
      "Health benefits",
      "Professional development"
    ],
    growthNotes: "Enterprise client base grew 70% in 2023, launched AI-powered features",
    employeeCount: "287 learning and technology professionals"
  },
  {
    id: 10,
    ownerUsername: "mediacast_admin",
    name: "MediaCast",
    industry: "Media",
    location: "Atlanta, GA",
    size: "101-200",
    description: "MediaCast produces compelling digital content and marketing materials. We help brands tell their stories across multiple platforms.",
    website: "https://mediacast.example.com",
    status: "Active",
    logoUrl: "https://ui-avatars.com/api/?name=MediaCast&background=E74C3C&color=fff&size=128",
    founded: "2020",
    mission: "To help brands connect authentically with audiences through compelling storytelling and strategic content distribution.",
    culture: "Our creative culture celebrates diverse voices and bold storytelling. We believe great content comes from understanding people deeply and meeting them where they are.",
    socialLinks: {
      linkedin: "https://linkedin.com/company/mediacast",
      twitter: "https://twitter.com/mediacast",
      github: "https://github.com/mediacast"
    },
    benefits: [
      "Creative environment",
      "Flexible hours",
      "Equipment budget",
      "Content portfolio development",
      "Collaborative projects"
    ],
    growthNotes: "Client roster doubled in 2023, expanded video production capabilities",
    employeeCount: "143 content and marketing professionals"
  }
];

// Demo Jobs with detailed information
export const demoJobs: ExtendedJob[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechFlow Inc.",
    companyId: 1,
    location: "San Francisco, CA",
    workMode: "Hybrid",
    type: "Full-time",
    category: "Technology",
    categoryId: 1,
    level: "Mid-Senior level",
    salary: "$120,000 - $160,000",
    status: "Active",
    postedAt: "2 days ago",
    description: "We're looking for a Senior Software Engineer to join our growing team. You'll be working on cutting-edge projects using React, TypeScript, and Node.js. Strong problem-solving skills and ability to work in a fast-paced environment are essential. You'll collaborate with cross-functional teams to deliver high-quality software solutions that impact millions of users worldwide.",
    requirements: ["5+ years of experience", "React/TypeScript expertise", "Node.js experience", "Strong communication skills"],
    deadline: "2024-03-15",
    currency: "USD",
    salaryMin: 120000,
    salaryMax: 160000,
    vacancyCount: 3,
    department: "Engineering",
    teamInfo: "Join our Platform Engineering team of 12 engineers building scalable cloud infrastructure",
    responsibilities: [
      "Design and implement scalable microservices architecture",
      "Lead technical decisions for new features",
      "Mentor junior engineers and conduct code reviews",
      "Collaborate with product and design teams",
      "Optimize application performance and reliability"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible PTO and parental leave",
      "Professional development budget ($2,000/year)",
      "Remote-first culture with flexible hours",
      "401(k) matching up to 4%"
    ],
    preferredQualifications: [
      "Experience with cloud platforms (AWS/GCP/Azure)",
      "Knowledge of containerization (Docker, Kubernetes)",
      "Previous experience leading teams",
      "Open source contributions",
      "Experience with distributed systems"
    ],
    hiringProcess: [
      "Initial recruiter screen (30 minutes)",
      "Technical interview with engineering team (1 hour)",
      "System design discussion (1 hour)",
      "Take-home coding exercise (3 hours)",
      "Final team fit interview with hiring manager (45 minutes)",
      "Offer decision within 48 hours"
    ]
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignHub",
    companyId: 2,
    location: "New York, NY",
    workMode: "Remote",
    type: "Full-time",
    category: "Design",
    categoryId: 2,
    level: "Associate",
    salary: "$90,000 - $120,000",
    status: "Active",
    postedAt: "1 week ago",
    description: "Join our design team to create beautiful, user-centered products. You'll work closely with product managers and engineers to bring ideas to life. Strong portfolio and design system experience required. You'll have the opportunity to shape the design language of products used by thousands of customers.",
    requirements: ["3+ years of product design", "Figma expertise", "Design system experience", "User research skills"],
    deadline: "2024-03-20",
    currency: "USD",
    salaryMin: 90000,
    salaryMax: 120000,
    vacancyCount: 2,
    department: "Product Design",
    teamInfo: "Work with our design team of 8 designers across product and brand",
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate with engineering to ensure design fidelity",
      "Maintain and evolve our design system",
      "Present design decisions to stakeholders"
    ],
    benefits: [
      "Competitive salary and stock options",
      "Health, dental, and vision insurance",
      "Unlimited PTO policy",
      "Home office setup stipend ($1,500)",
      "Annual design conference budget",
      "Flexible remote work policy"
    ],
    preferredQualifications: [
      "Experience designing B2B SaaS products",
      "Motion design skills (Framer, After Effects)",
      "Accessibility design expertise",
      "Experience with design tokens",
      "Background in psychology or HCI"
    ],
    hiringProcess: [
      "Portfolio review with design team (45 minutes)",
      "Design exercise (2 hours)",
      "Collaborative design session (1 hour)",
      "Culture fit interview (30 minutes)",
      "Reference checks",
      "Offer within 1 week"
    ]
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataSphere",
    companyId: 3,
    location: "Seattle, WA",
    workMode: "On-site",
    type: "Full-time",
    category: "Data Science",
    categoryId: 3,
    level: "Mid-Senior level",
    salary: "$130,000 - $170,000",
    status: "Active",
    postedAt: "3 days ago",
    description: "We're seeking a Data Scientist to help us unlock insights from complex datasets. Experience with machine learning, statistical analysis, and data visualization is crucial. You'll work on projects that directly impact business decisions and customer experience.",
    requirements: ["Python/R expertise", "Machine learning experience", "SQL proficiency", "Communication skills"],
    deadline: "2024-03-25",
    currency: "USD",
    salaryMin: 130000,
    salaryMax: 170000,
    vacancyCount: 1,
    department: "Data Science",
    teamInfo: "Join our Analytics team of 6 data scientists and analysts",
    responsibilities: [
      "Build and deploy machine learning models",
      "Analyze large datasets to identify trends",
      "Create data visualizations and dashboards",
      "Collaborate with product teams on data-driven features",
      "Present insights to executive stakeholders"
    ],
    benefits: [
      "Top-tier salary and performance bonuses",
      "Full health coverage including family",
      "Stock option grants",
      "Annual learning stipend ($3,000)",
      "On-site gym and wellness programs",
      "Catered meals and snacks"
    ],
    preferredQualifications: [
      "PhD in Statistics, Computer Science, or related field",
      "Experience with big data technologies (Spark, Hadoop)",
      "Deep learning expertise",
      "Published research papers",
      "Industry experience in analytics"
    ],
    hiringProcess: [
      "Technical screen with data team lead (45 minutes)",
      "Data analysis case study (2 hours)",
      "Machine learning presentation (1 hour)",
      "Cross-functional team interview (1 hour)",
      "Onsite interview with leadership (half day)",
      "Offer within 5 business days"
    ]
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "InnovateTech",
    companyId: 4,
    location: "Austin, TX",
    workMode: "Remote",
    type: "Full-time",
    category: "Technology",
    categoryId: 1,
    level: "Entry level",
    salary: "$70,000 - $95,000",
    status: "Active",
    postedAt: "5 days ago",
    description: "Join our frontend team to build modern web applications. You'll work with React, Vue.js, and modern CSS frameworks. Passion for clean code and great user experience is a must. This is an excellent opportunity for growth in a supportive environment.",
    requirements: ["1+ years of frontend development", "React/Vue.js experience", "Modern CSS knowledge", "Team collaboration"],
    deadline: "2024-04-01",
    currency: "USD",
    salaryMin: 70000,
    salaryMax: 95000,
    vacancyCount: 5,
    department: "Frontend Engineering",
    teamInfo: "Work with our frontend team of 6 engineers building user interfaces",
    responsibilities: [
      "Build responsive web applications",
      "Implement pixel-perfect designs",
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Collaborate with designers and backend engineers"
    ],
    benefits: [
      "Competitive entry-level salary",
      "Health insurance and dental",
      "20 days PTO",
      "Learning budget ($1,000/year)",
      "Mentorship program",
      "Remote work flexibility"
    ],
    preferredQualifications: [
      "Experience with TypeScript",
      "Knowledge of testing frameworks",
      "Familiarity with CI/CD",
      "Open source contributions",
      "Bootcamp or CS degree"
    ],
    hiringProcess: [
      "Initial phone screen (30 minutes)",
      "Technical coding challenge (1 hour)",
      "Team culture interview (30 minutes)",
      "Practical exercise (take home, 2 hours)",
      "Final interview with team lead (30 minutes)",
      "Offer within 1 week"
    ]
  },
  {
    id: 5,
    title: "UX Researcher",
    company: "DesignHub",
    companyId: 2,
    location: "Remote",
    workMode: "Remote",
    type: "Contract",
    category: "Design",
    categoryId: 2,
    level: "Associate",
    salary: "$85,000 - $110,000",
    status: "Active",
    postedAt: "1 week ago",
    description: "We need a UX Researcher to conduct user studies and create actionable insights. You'll work with product and design teams to improve user experience across our platforms. This contract role offers flexibility and the chance to make significant impact.",
    requirements: ["2+ years of UX research", "User testing experience", "Data analysis skills", "Presentation skills"],
    deadline: "2024-03-18",
    currency: "USD",
    salaryMin: 85000,
    salaryMax: 110000,
    vacancyCount: 1,
    department: "UX Research",
    teamInfo: "Collaborate with our research team of 4 researchers",
    responsibilities: [
      "Plan and conduct user interviews",
      "Analyze qualitative and quantitative data",
      "Create research reports and presentations",
      "Work with product to prioritize research insights",
      "Maintain research repository"
    ],
    benefits: [
      "Competitive contract rate",
      "Flexible schedule",
      "Remote work",
      "Equipment stipend",
      "Professional development budget",
      "Potential for full-time conversion"
    ],
    preferredQualifications: [
      "Experience with research tools (UserTesting, Dovetail)",
      "Background in psychology or sociology",
      "Experience with A/B testing",
      "Presentation skills to executive audiences",
      "Published research case studies"
    ],
    hiringProcess: [
      "Portfolio review (30 minutes)",
      "Research methodology discussion (45 minutes)",
      "Practical research exercise (1.5 hours)",
      "Team fit interview (30 minutes)",
      "Contract offer within 48 hours"
    ]
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "TechFlow Inc.",
    companyId: 1,
    location: "Boston, MA",
    workMode: "Hybrid",
    type: "Full-time",
    category: "Technology",
    categoryId: 1,
    level: "Mid-Senior level",
    salary: "$115,000 - $150,000",
    status: "Active",
    postedAt: "4 days ago",
    description: "Join our infrastructure team to build and maintain CI/CD pipelines. Experience with AWS, Docker, and Kubernetes is essential for this role.",
    requirements: ["4+ years of DevOps experience", "AWS/Docker/Kubernetes", "CI/CD pipeline experience", "Automation skills"],
    deadline: "2024-03-22",
    currency: "USD",
    salaryMin: 115000,
    salaryMax: 150000,
    vacancyCount: 2
  },
  {
    id: 7,
    title: "Marketing Manager",
    company: "GrowthCo",
    companyId: 5,
    location: "Chicago, IL",
    workMode: "On-site",
    type: "Full-time",
    category: "Marketing",
    categoryId: 4,
    level: "Director",
    salary: "$140,000 - $180,000",
    status: "Active",
    postedAt: "2 weeks ago",
    description: "Lead our marketing team and drive growth strategies. You'll manage campaigns, analyze metrics, and work with cross-functional teams to achieve business objectives.",
    requirements: ["7+ years of marketing experience", "Team management", "Data-driven mindset", "Strategic planning"],
    deadline: "2024-04-10",
    currency: "USD",
    salaryMin: 140000,
    salaryMax: 180000,
    vacancyCount: 1
  },
  {
    id: 8,
    title: "Backend Developer",
    company: "DataSphere",
    companyId: 3,
    location: "Denver, CO",
    workMode: "Remote",
    type: "Full-time",
    category: "Technology",
    categoryId: 1,
    level: "Associate",
    salary: "$95,000 - $125,000",
    status: "Active",
    postedAt: "6 days ago",
    description: "Build scalable backend services using Node.js, Python, and PostgreSQL. You'll work on API development, database optimization, and system architecture.",
    requirements: ["3+ years of backend development", "Node.js/Python experience", "Database design", "API development"],
    deadline: "2024-04-05",
    currency: "USD",
    salaryMin: 95000,
    salaryMax: 125000,
    vacancyCount: 3
  },
  {
    id: 9,
    title: "Financial Analyst",
    company: "FinWise Solutions",
    companyId: 6,
    location: "Boston, MA",
    workMode: "Hybrid",
    type: "Full-time",
    category: "Finance",
    categoryId: 5,
    level: "Associate",
    salary: "$85,000 - $110,000",
    status: "Active",
    postedAt: "3 days ago",
    description: "Analyze financial data and provide insights to support business decisions. You'll work with financial models, market analysis, and investment strategies.",
    requirements: ["3+ years of financial analysis", "Excel/SQL proficiency", "Financial modeling", "Communication skills"],
    deadline: "2024-03-28",
    currency: "USD",
    salaryMin: 85000,
    salaryMax: 110000,
    vacancyCount: 2
  },
  {
    id: 10,
    title: "Healthcare Product Manager",
    company: "HealthTech Pro",
    companyId: 7,
    location: "Denver, CO",
    workMode: "Remote",
    type: "Full-time",
    category: "Healthcare",
    categoryId: 6,
    level: "Mid-Senior level",
    salary: "$125,000 - $165,000",
    status: "Active",
    postedAt: "1 week ago",
    description: "Drive product strategy for healthcare technology solutions. You'll work with clinical teams, developers, and stakeholders to deliver impactful products.",
    requirements: ["5+ years of product management", "Healthcare experience", "Technical background", "Stakeholder management"],
    deadline: "2024-04-08",
    currency: "USD",
    salaryMin: 125000,
    salaryMax: 165000,
    vacancyCount: 1
  },
  {
    id: 11,
    title: "Sustainability Engineer",
    company: "EcoSystems",
    companyId: 8,
    location: "Portland, OR",
    workMode: "On-site",
    type: "Full-time",
    category: "Environment",
    categoryId: 7,
    level: "Associate",
    salary: "$75,000 - $95,000",
    status: "Active",
    postedAt: "4 days ago",
    description: "Develop sustainable technology solutions for businesses. You'll work on energy efficiency, waste reduction, and environmental impact projects.",
    requirements: ["2+ years of environmental engineering", "Sustainability knowledge", "Project management", "Technical analysis"],
    deadline: "2024-03-30",
    currency: "USD",
    salaryMin: 75000,
    salaryMax: 95000,
    vacancyCount: 2
  },
  {
    id: 12,
    title: "Learning Experience Designer",
    company: "LearnLab",
    companyId: 9,
    location: "Los Angeles, CA",
    workMode: "Hybrid",
    type: "Full-time",
    category: "Education",
    categoryId: 8,
    level: "Associate",
    salary: "$80,000 - $105,000",
    status: "Active",
    postedAt: "5 days ago",
    description: "Create engaging learning experiences for corporate training programs. You'll design curriculum, develop content, and measure learning outcomes.",
    requirements: ["3+ years of instructional design", "Learning theory knowledge", "Content development", "Analytics skills"],
    deadline: "2024-04-02",
    currency: "USD",
    salaryMin: 80000,
    salaryMax: 105000,
    vacancyCount: 3
  }
];

// Demo Posts
export const demoPosts: Post[] = [
  {
    id: 101,
    userId: 10,
    authorUsername: "amira.k",
    authorFullName: "Amira Khan",
    authorTitle: "Growth Marketing Lead",
    avatarUrl: "https://i.pravatar.cc/120?img=20",
    categoryId: 1,
    categoryName: "Marketing",
    content: "We increased qualified leads by 34% after moving from feature-first copy to customer-pain storytelling. Message hierarchy changed everything.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    likeCount: 186,
    commentCount: 29,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: 102,
    userId: 11,
    authorUsername: "samuel.t",
    authorFullName: "Samuel Tran",
    authorTitle: "Brand Strategist",
    avatarUrl: "https://i.pravatar.cc/120?img=16",
    categoryId: 1,
    categoryName: "Marketing",
    content: "If your campaign brief has no clear distribution plan, you do not have a campaign. Create channel-level hypotheses before creative production.",
    likeCount: 132,
    commentCount: 21,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 10).toISOString()
  },
  {
    id: 103,
    userId: 12,
    authorUsername: "lina.mo",
    authorFullName: "Lina Morgan",
    authorTitle: "Lifecycle Marketing Manager",
    avatarUrl: "https://i.pravatar.cc/120?img=24",
    categoryId: 1,
    categoryName: "Marketing",
    content: "Email is still our highest ROI channel, but only after we segmented users by onboarding behavior, not demographics.",
    likeCount: 119,
    commentCount: 18,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 14).toISOString()
  },
  {
    id: 201,
    userId: 20,
    authorUsername: "hassan.r",
    authorFullName: "Hassan Rahman",
    authorTitle: "Business Operations Director",
    avatarUrl: "https://i.pravatar.cc/120?img=33",
    categoryId: 2,
    categoryName: "Business Strategy",
    content: "A useful strategy test: can each objective be linked to a measurable customer or revenue outcome in one sentence?",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    likeCount: 165,
    commentCount: 26,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 7).toISOString()
  },
  {
    id: 202,
    userId: 21,
    authorUsername: "emma.v",
    authorFullName: "Emma Vega",
    authorTitle: "Corporate Strategy Consultant",
    avatarUrl: "https://i.pravatar.cc/120?img=44",
    categoryId: 2,
    categoryName: "Business Strategy",
    content: "Quarterly planning got better when we removed vanity metrics and ranked initiatives by expected impact and execution confidence.",
    likeCount: 143,
    commentCount: 22,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 15).toISOString()
  },
  {
    id: 203,
    userId: 22,
    authorUsername: "daniel.co",
    authorFullName: "Daniel Cole",
    authorTitle: "Startup Advisor",
    avatarUrl: "https://i.pravatar.cc/120?img=57",
    categoryId: 2,
    categoryName: "Business Strategy",
    content: "Founders often scale headcount before process clarity. Document decision rights first, then hire into clear ownership lanes.",
    likeCount: 121,
    commentCount: 16,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: 301,
    userId: 30,
    authorUsername: "noah.li",
    authorFullName: "Noah Lin",
    authorTitle: "Staff Software Engineer",
    avatarUrl: "https://i.pravatar.cc/120?img=67",
    categoryId: 3,
    categoryName: "Technology",
    content: "Our API latency dropped 38% after introducing endpoint-level performance budgets and automated regression checks in CI.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    likeCount: 209,
    commentCount: 34,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 302,
    userId: 31,
    authorUsername: "fatima.dev",
    authorFullName: "Fatima Alvi",
    authorTitle: "AI Product Engineer",
    avatarUrl: "https://i.pravatar.cc/120?img=5",
    categoryId: 3,
    categoryName: "Technology",
    content: "The best AI feature launch this quarter was not the biggest model. It was better UX around prompt templates and fallback states.",
    likeCount: 177,
    commentCount: 25,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 11).toISOString()
  },
  {
    id: 303,
    userId: 32,
    authorUsername: "jorge.p",
    authorFullName: "Jorge Perez",
    authorTitle: "Platform Architect",
    avatarUrl: "https://i.pravatar.cc/120?img=12",
    categoryId: 3,
    categoryName: "Technology",
    content: "Teams move faster when architecture reviews are framed as trade-off discussions, not approval gates.",
    likeCount: 150,
    commentCount: 19,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 401,
    userId: 40,
    authorUsername: "olivia.m",
    authorFullName: "Olivia Martin",
    authorTitle: "Learning Experience Designer",
    avatarUrl: "https://i.pravatar.cc/120?img=47",
    categoryId: 4,
    categoryName: "Education",
    content: "Completion rates improved after we split one long course into weekly skill sprints with lightweight checkpoints.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    likeCount: 136,
    commentCount: 17,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: 402,
    userId: 41,
    authorUsername: "karim.h",
    authorFullName: "Karim Haddad",
    authorTitle: "Training Program Manager",
    avatarUrl: "https://i.pravatar.cc/120?img=36",
    categoryId: 4,
    categoryName: "Education",
    content: "Skill transfer is higher when managers coach learners in the first two weeks after training, not just approve attendance.",
    likeCount: 118,
    commentCount: 13,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 16).toISOString()
  },
  {
    id: 403,
    userId: 42,
    authorUsername: "ana.g",
    authorFullName: "Ana Gomez",
    authorTitle: "Instructional Strategist",
    avatarUrl: "https://i.pravatar.cc/120?img=18",
    categoryId: 4,
    categoryName: "Education",
    content: "Use learner reflection prompts after each module. We measured stronger retention and better practical application.",
    likeCount: 101,
    commentCount: 12,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 21).toISOString()
  },
  {
    id: 501,
    userId: 50,
    authorUsername: "nora.s",
    authorFullName: "Nora Silva",
    authorTitle: "People Leader",
    avatarUrl: "https://i.pravatar.cc/120?img=28",
    categoryId: 5,
    categoryName: "Leadership",
    content: "The best one-on-ones I run are 70% employee agenda, 30% manager agenda. Ownership changes the quality of the conversation.",
    likeCount: 167,
    commentCount: 24,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 9).toISOString()
  },
  {
    id: 502,
    userId: 51,
    authorUsername: "leo.w",
    authorFullName: "Leo White",
    authorTitle: "Engineering Manager",
    avatarUrl: "https://i.pravatar.cc/120?img=60",
    categoryId: 5,
    categoryName: "Leadership",
    content: "Performance discussions become healthier when expectations are written as concrete behaviors instead of vague outcomes.",
    likeCount: 148,
    commentCount: 20,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 19).toISOString()
  },
  {
    id: 503,
    userId: 52,
    authorUsername: "maya.c",
    authorFullName: "Maya Chan",
    authorTitle: "Head of Operations",
    avatarUrl: "https://i.pravatar.cc/120?img=55",
    categoryId: 5,
    categoryName: "Leadership",
    content: "Leaders can reduce team anxiety by sharing what is known, unknown, and next in every major update.",
    likeCount: 129,
    commentCount: 15,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 22).toISOString()
  },
  {
    id: 601,
    userId: 60,
    authorUsername: "ray.k",
    authorFullName: "Ray Kim",
    authorTitle: "Productivity Coach",
    avatarUrl: "https://i.pravatar.cc/120?img=9",
    categoryId: 6,
    categoryName: "Productivity",
    content: "Try a two-list system: outcomes list for priorities and tasks list for execution. It prevents busywork from hijacking focus.",
    likeCount: 141,
    commentCount: 17,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 602,
    userId: 61,
    authorUsername: "sophia.a",
    authorFullName: "Sophia Ahmed",
    authorTitle: "Operations Analyst",
    avatarUrl: "https://i.pravatar.cc/120?img=31",
    categoryId: 6,
    categoryName: "Productivity",
    content: "Asynchronous weekly updates reduced meeting load by 26% while improving cross-team visibility.",
    likeCount: 126,
    commentCount: 14,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 17).toISOString()
  },
  {
    id: 603,
    userId: 62,
    authorUsername: "zane.r",
    authorFullName: "Zane Roberts",
    authorTitle: "Founder",
    avatarUrl: "https://i.pravatar.cc/120?img=41",
    categoryId: 6,
    categoryName: "Productivity",
    content: "Decision memos with clear assumptions and risks helped us cut rework in product planning by nearly one third.",
    likeCount: 117,
    commentCount: 11,
    likedByCurrentUser: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 23).toISOString()
  }
];

export function getDemoCompanies(): Company[] {
  return [...demoCompanies];
}

export function getDemoJobs(): Job[] {
  return [...demoJobs];
}

export function getDemoPosts(): Post[] {
  return [...demoPosts];
}
