
import { useMutation } from "@tanstack/react-query";

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string[];
    skills: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  metadata: {
    parsedAt: string;
    confidence: number;
    warnings: string[];
  };
}

export interface ResumeUploadResponse {
  success: boolean;
  parsedResume?: ParsedResume;
  error?: string;
}

export async function parseResume(file: File): Promise<ParsedResume> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;

        // Check file type and parse accordingly
        if (file.type === "application/pdf") {
          // For PDF files, would need a PDF parsing library
          // For now, simulate parsing
          resolve(simulatePDFParsing(content, file.name));
        } else if (
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword"
        ) {
          // For Word documents, would need a DOCX parsing library
          resolve(simulateWordParsing(content, file.name));
        } else if (file.type === "text/plain") {
          // For plain text files
          resolve(parseTextResume(content));
        } else {
          reject(new Error("Unsupported file format"));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function simulatePDFParsing(content: string, filename: string): ParsedResume {
  // In a real implementation, this would use a PDF parsing library like pdf.js
  // For now, return a simulated parsed resume
  return {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe"
    },
    summary: "Experienced software engineer with 5+ years of experience in full-stack development. Passionate about building scalable applications and mentoring junior developers.",
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Software Engineer",
        startDate: "2020-01",
        endDate: "2023-12",
        current: false,
        description: [
          "Led development of microservices architecture",
          "Mentored team of 5 junior developers",
          "Improved application performance by 40%"
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js"]
      }
    ],
    education: [
      {
        institution: "State University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2015-09",
        endDate: "2019-05",
        gpa: "3.8"
      }
    ],
    skills: {
      technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL"],
      soft: ["Leadership", "Communication", "Problem-solving", "Team collaboration"],
      languages: ["English (Native)", "Spanish (Conversational)"],
      certifications: ["AWS Certified Developer", "Scrum Master"]
    },
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with payment integration",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "github.com/johndoe/ecommerce"
      }
    ],
    metadata: {
      parsedAt: new Date().toISOString(),
      confidence: 75,
      warnings: [
        "PDF parsing requires additional processing",
        "Some sections may need manual review"
      ]
    }
  };
}

function simulateWordParsing(content: string, filename: string): ParsedResume {
  // In a real implementation, this would use a DOCX parsing library like mammoth.js
  // For now, return a simulated parsed resume
  return {
    personalInfo: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY"
    },
    summary: "Results-driven product manager with 4 years of experience in SaaS products. Expert in agile methodologies and cross-functional team leadership.",
    experience: [
      {
        company: "InnovateTech",
        position: "Product Manager",
        startDate: "2021-03",
        current: true,
        description: [
          "Launched 3 major product features",
          "Increased user engagement by 25%",
          "Managed product roadmap for team of 15"
        ],
        skills: ["Product Management", "Agile", "Data Analysis", "User Research"]
      }
    ],
    education: [
      {
        institution: "Tech University",
        degree: "MBA",
        field: "Business Administration",
        startDate: "2018-09",
        endDate: "2020-05"
      }
    ],
    skills: {
      technical: ["Jira", "Figma", "Google Analytics", "SQL", "Python"],
      soft: ["Strategic Thinking", "Stakeholder Management", "Data-Driven Decision Making"],
      languages: ["English (Native)", "French (Professional)"],
      certifications: ["Product Management Certificate", "Agile Certified"]
    },
    projects: [
      {
        name: "Mobile App Redesign",
        description: "Led complete redesign of mobile application resulting in 30% increase in user retention",
        technologies: ["Figma", "React Native", "Analytics"]
      }
    ],
    metadata: {
      parsedAt: new Date().toISOString(),
      confidence: 80,
      warnings: [
        "Word document parsing may lose some formatting",
        "Review experience dates for accuracy"
      ]
    }
  };
}

function parseTextResume(content: string): ParsedResume {
  const lines = content.split("\n").filter(line => line.trim());
  const parsedResume: ParsedResume = {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: []
    },
    projects: [],
    metadata: {
      parsedAt: new Date().toISOString(),
      confidence: 60,
      warnings: ["Text resume format may require manual review"]
    }
  };

  // Simple text parsing logic
  let currentSection = "";
  let currentExperience: any = null;

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();

    // Detect sections
    if (lowerLine.includes("experience") || lowerLine.includes("work history")) {
      currentSection = "experience";
      return;
    }

    if (lowerLine.includes("education")) {
      currentSection = "education";
      return;
    }

    if (lowerLine.includes("skills")) {
      currentSection = "skills";
      return;
    }

    if (lowerLine.includes("summary") || lowerLine.includes("about")) {
      currentSection = "summary";
      return;
    }

    // Parse based on current section
    switch (currentSection) {
      case "experience":
        if (lowerLine.includes("company") || lowerLine.includes("at")) {
          if (currentExperience) {
            parsedResume.experience.push(currentExperience);
          }
          currentExperience = {
            company: line.split(/at|company/i)[1]?.trim() || "",
            position: "",
            startDate: "",
            description: [],
            skills: []
          };
        } else if (lowerLine.includes("position") || lowerLine.includes("role")) {
          currentExperience.position = line.split(/position|role/i)[1]?.trim() || "";
        }
        break;

      case "education":
        if (lowerLine.includes("university") || lowerLine.includes("college") || lowerLine.includes("institute")) {
          parsedResume.education.push({
            institution: line.trim(),
            degree: "",
            field: "",
            startDate: ""
          });
        }
        break;

      case "skills":
        const skillList = line.split(/,|;|\n/).map(s => s.trim()).filter(s => s);
        parsedResume.skills.technical.push(...skillList);
        break;

      case "summary":
        parsedResume.summary = line.trim();
        break;
    }
  });

  // Add any pending experience
  if (currentExperience) {
    parsedResume.experience.push(currentExperience);
  }

  return parsedResume;
}

export function useResumeParser() {
  return useMutation({
    mutationFn: async (file: File): Promise<ResumeUploadResponse> => {
      try {
        const parsedResume = await parseResume(file);
        return {
          success: true,
          parsedResume
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to parse resume"
        };
      }
    }
  });
}

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain"
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 5MB limit"
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file format. Please upload PDF, DOCX, or TXT"
    };
  }

  return { valid: true };
}

export function extractKeywords(resume: ParsedResume): string[] {
  const keywords: Set<string> = new Set();

  // Extract from experience
  resume.experience.forEach(exp => {
    exp.description.forEach(desc => {
      const words = desc.split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          keywords.add(word.toLowerCase());
        }
      });
    });
    exp.skills.forEach(skill => {
      keywords.add(skill.toLowerCase());
    });
  });

  // Extract from skills
  resume.skills.technical.forEach(skill => keywords.add(skill.toLowerCase()));
  resume.skills.soft.forEach(skill => keywords.add(skill.toLowerCase()));
  resume.skills.certifications.forEach(cert => {
    const words = cert.split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) {
        keywords.add(word.toLowerCase());
      }
    });
  });

  // Extract from projects
  resume.projects.forEach(proj => {
    const words = proj.description.split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) {
        keywords.add(word.toLowerCase());
      }
    });
    proj.technologies.forEach(tech => keywords.add(tech.toLowerCase()));
  });

  return Array.from(keywords);
}
