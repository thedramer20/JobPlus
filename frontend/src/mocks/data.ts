import type { Application } from "../types/application";
import type { Company } from "../types/company";
import type { Job } from "../types/job";

export const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Java Backend Engineer",
    company: "BlueOrbit Systems",
    location: "Shanghai, China",
    workMode: "Hybrid",
    type: "Full-time",
    category: "Software Development",
    level: "Senior",
    salary: "$4,500 - $6,000 / month",
    status: "Open",
    postedAt: "2 days ago",
    description: "Own API design, job search performance, and recruiter workflow tooling for a growing hiring platform.",
    requirements: ["Spring Boot", "MyBatis", "Microservices", "SQL performance"]
  },
  {
    id: 2,
    title: "Frontend React Engineer",
    company: "HireFlow Labs",
    location: "Remote",
    workMode: "Remote",
    type: "Full-time",
    category: "Software Development",
    level: "Mid",
    salary: "$3,800 - $5,200 / month",
    status: "Open",
    postedAt: "5 days ago",
    description: "Build modern candidate and employer workflows with excellent UX and performance.",
    requirements: ["React", "TypeScript", "Design systems", "REST APIs"]
  },
  {
    id: 3,
    title: "Recruitment Operations Analyst",
    company: "TalentBridge Africa",
    location: "Nairobi, Kenya",
    workMode: "On-site",
    type: "Full-time",
    category: "Human Resources",
    level: "Entry",
    salary: "$1,400 - $2,100 / month",
    status: "Open",
    postedAt: "1 week ago",
    description: "Support employer onboarding, job quality audits, and marketplace health.",
    requirements: ["Excel", "Operations", "Documentation", "Stakeholder support"]
  }
];

export const companies: Company[] = [
  {
    id: 1,
    name: "BlueOrbit Systems",
    industry: "Enterprise Software",
    location: "Shanghai, China",
    size: "120 employees",
    description: "BlueOrbit builds workflow systems for global hiring and HR operations teams.",
    website: "https://blueorbit.example.com"
  },
  {
    id: 2,
    name: "HireFlow Labs",
    industry: "Recruitment Technology",
    location: "Remote First",
    size: "65 employees",
    description: "HireFlow Labs helps modern recruiting teams operate with speed and better candidate experience.",
    website: "https://hireflow.example.com"
  }
];

export const applications: Application[] = [
  {
    id: 1,
    jobTitle: "Senior Java Backend Engineer",
    company: "BlueOrbit Systems",
    status: "Reviewed",
    appliedAt: "2026-04-02"
  },
  {
    id: 2,
    jobTitle: "Frontend React Engineer",
    company: "HireFlow Labs",
    status: "Pending",
    appliedAt: "2026-04-05"
  }
];
