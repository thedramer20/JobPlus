
import { useQuery } from "@tanstack/react-query";

export interface GhostJobIndicators {
  missingCompanyInfo: boolean;
  vagueJobDescription: boolean;
  unrealisticSalary: boolean;
  genericRequirements: boolean;
  suspiciousContactInfo: boolean;
  noApplicationProcess: boolean;
  copiedDescription: boolean;
  poorFormatting: boolean;
  urgentLanguage: boolean;
  missingLocation: boolean;
  tooGoodToBeTrue: boolean;
}

export interface GhostJobAnalysis {
  jobId: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number;
  indicators: GhostJobIndicators;
  warnings: string[];
  recommendations: string[];
}

export function analyzeJobForGhostIndicators(job: any): GhostJobAnalysis {
  const indicators: GhostJobIndicators = {
    missingCompanyInfo: false,
    vagueJobDescription: false,
    unrealisticSalary: false,
    genericRequirements: false,
    suspiciousContactInfo: false,
    noApplicationProcess: false,
    copiedDescription: false,
    poorFormatting: false,
    urgentLanguage: false,
    missingLocation: false,
    tooGoodToBeTrue: false
  };

  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check 1: Missing Company Information
  if (!job.company || !job.company.name || !job.company.website) {
    indicators.missingCompanyInfo = true;
    warnings.push("Company information is incomplete or missing");
    recommendations.push("Research the company thoroughly before applying");
  }

  // Check 2: Vague Job Description
  if (job.description) {
    const descriptionLength = job.description.length;
    const uniqueWords = new Set(job.description.toLowerCase().split(/\s+/)).size;
    const wordCount = job.description.split(/\s+/).length;

    if (descriptionLength < 100 || uniqueWords < 20) {
      indicators.vagueJobDescription = true;
      warnings.push("Job description is too brief or generic");
      recommendations.push("Request more details about the role and responsibilities");
    }

    // Check for repetitive phrases (potential copy-paste)
    const commonPhrases = [
      "exciting opportunity",
      "dynamic team",
      "fast-paced environment",
      "great benefits package"
    ];
    const phraseMatches = commonPhrases.filter(phrase =>
      job.description.toLowerCase().includes(phrase)
    );
    if (phraseMatches.length >= 3) {
      indicators.copiedDescription = true;
      warnings.push("Description appears to be a template");
    }
  }

  // Check 3: Unrealistic Salary
  if (job.salaryRange) {
    const { min, max } = job.salaryRange;
    const avgSalary = (min + max) / 2;
    const industryAvg = getIndustryAverageSalary(job.industry);

    if (max > industryAvg * 3 || min > industryAvg * 2) {
      indicators.unrealisticSalary = true;
      warnings.push("Salary range is significantly above industry average");
      recommendations.push("Verify salary claims during interview process");
    }
  }

  // Check 4: Generic Requirements
  if (job.requirements) {
    const genericSkills = ["communication", "teamwork", "problem-solving", "computer skills"];
    const genericCount = job.requirements.filter((req: string) =>
      genericSkills.some(skill => req.toLowerCase().includes(skill))
    ).length;

    if (genericCount >= 3 && job.requirements.length <= 5) {
      indicators.genericRequirements = true;
      warnings.push("Requirements are overly generic");
      recommendations.push("Ask for specific technical requirements during interview");
    }
  }

  // Check 5: Suspicious Contact Information
  if (job.contact) {
    const { email, phone, website } = job.contact;

    if (email && !isValidEmail(email)) {
      indicators.suspiciousContactInfo = true;
      warnings.push("Contact email appears invalid");
    }

    if (website && !isValidUrl(website)) {
      indicators.suspiciousContactInfo = true;
      warnings.push("Company website URL appears invalid");
    }

    if (!email && !phone && !website) {
      indicators.noApplicationProcess = true;
      warnings.push("No clear application process or contact information");
      recommendations.push("Verify legitimate application channels");
    }
  }

  // Check 6: Poor Formatting
  if (job.description) {
    const hasMultipleSpaces = /\s{3,}/.test(job.description);
    const hasInconsistentCaps = /[A-Z]{3,}\s+[a-z]{3,}/.test(job.description);

    if (hasMultipleSpaces || hasInconsistentCaps) {
      indicators.poorFormatting = true;
      warnings.push("Job posting has formatting issues");
    }
  }

  // Check 7: Urgent Language
  if (job.title || job.description) {
    const urgentPhrases = [
      "urgent",
      "immediate start",
      "apply now",
      "limited time",
      "don't wait",
      "act fast"
    ];

    const textToCheck = (job.title + " " + (job.description || "")).toLowerCase();
    const urgentCount = urgentPhrases.filter(phrase =>
      textToCheck.includes(phrase)
    ).length;

    if (urgentCount >= 2) {
      indicators.urgentLanguage = true;
      warnings.push("Excessive use of urgent language");
      recommendations.push("Be cautious of job postings creating artificial urgency");
    }
  }

  // Check 8: Missing Location
  if (!job.location || job.location === "Remote" || job.location === "Various") {
    indicators.missingLocation = true;
    warnings.push("Location information is vague or missing");
    recommendations.push("Confirm work location and arrangements");
  }

  // Check 9: Too Good to Be True
  const positiveIndicators = [
    "unlimited earning potential",
    "work from anywhere",
    "flexible hours",
    "no experience needed",
    "quick promotion",
    "high salary",
    "great benefits",
    "amazing culture"
  ];

  if (job.description) {
    const positiveCount = positiveIndicators.filter(phrase =>
      job.description.toLowerCase().includes(phrase)
    ).length;

    if (positiveCount >= 4) {
      indicators.tooGoodToBeTrue = true;
      warnings.push("Job posting contains excessive positive claims");
      recommendations.push("Verify all claims during the interview process");
    }
  }

  // Calculate Risk Level
  const indicatorCount = Object.values(indicators).filter(Boolean).length;
  let riskLevel: "low" | "medium" | "high" | "critical";
  let confidence: number;

  if (indicatorCount <= 2) {
    riskLevel = "low";
    confidence = 85;
  } else if (indicatorCount <= 4) {
    riskLevel = "medium";
    confidence = 70;
  } else if (indicatorCount <= 6) {
    riskLevel = "high";
    confidence = 55;
  } else {
    riskLevel = "critical";
    confidence = 40;
  }

  // Add general recommendations based on risk level
  if (riskLevel !== "low") {
    recommendations.push("Research the company on multiple platforms");
    recommendations.push("Look for employee reviews and testimonials");
    recommendations.push("Verify contact information before sharing personal data");
  }

  return {
    jobId: job.id,
    riskLevel,
    confidence,
    indicators,
    warnings,
    recommendations
  };
}

// Helper Functions
function getIndustryAverageSalary(industry: string): number {
  const industryAverages: Record<string, number> = {
    "technology": 85000,
    "finance": 95000,
    "healthcare": 75000,
    "retail": 45000,
    "education": 60000,
    "marketing": 70000,
    "consulting": 90000,
    "manufacturing": 65000,
    "default": 65000
  };

  return industryAverages[industry.toLowerCase()] || industryAverages["default"];
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function useGhostJobDetector(jobId: number) {
  return useQuery({
    queryKey: ["ghost-job", jobId],
    queryFn: async () => {
      // This would typically fetch job details from the backend
      // For now, return a mock analysis
      return analyzeJobForGhostIndicators({
        id: jobId,
        title: "Software Engineer",
        description: "Exciting opportunity in a dynamic team with great benefits package. Work from anywhere with flexible hours and unlimited earning potential.",
        company: { name: "Tech Corp" },
        salaryRange: { min: 150000, max: 200000 },
        industry: "technology"
      });
    },
    enabled: !!jobId,
    staleTime: 30 * 60 * 1000 // 30 minutes
  });
}

export function analyzeMultipleJobs(jobs: any[]): GhostJobAnalysis[] {
  return jobs.map(job => analyzeJobForGhostIndicators(job));
}
