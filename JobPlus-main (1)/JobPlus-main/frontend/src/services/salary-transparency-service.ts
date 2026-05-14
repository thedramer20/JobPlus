
import { useQuery } from "@tanstack/react-query";

export interface SalaryRange {
  min: number;
  max: number;
  mid: number;
  currency: string;
}

export interface SalaryBenchmark {
  position: string;
  experienceLevel: string;
  location: string;
  industry: string;
  marketRange: SalaryRange;
  companyRange?: SalaryRange;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  factors: {
    education: number;
    experience: number;
    skills: number;
    location: number;
    companySize: number;
  };
}

export interface SalaryAnalysis {
  jobId: number;
  isCompetitive: boolean;
  marketPosition: "below" | "average" | "above" | "excellent";
  score: number;
  insights: string[];
  negotiationTips: string[];
  comparableJobs: Array<{
    company: string;
    position: string;
    salary: SalaryRange;
  }>;
}

export function analyzeSalaryCompetitiveness(
  jobSalary: SalaryRange,
  benchmark: SalaryBenchmark
): SalaryAnalysis {
  const jobMid = jobSalary.mid;
  const marketMid = benchmark.marketRange.mid;
  const marketP50 = benchmark.percentiles.p50;

  // Calculate market position
  let marketPosition: "below" | "average" | "above" | "excellent";
  let score: number;

  if (jobMid < marketP50 * 0.8) {
    marketPosition = "below";
    score = 40;
  } else if (jobMid < marketP50 * 0.95) {
    marketPosition = "average";
    score = 60;
  } else if (jobMid < marketP50 * 1.1) {
    marketPosition = "above";
    score = 80;
  } else {
    marketPosition = "excellent";
    score = 95;
  }

  // Generate insights
  const insights: string[] = [];
  const negotiationTips: string[] = [];

  if (marketPosition === "below") {
    insights.push("Salary is below market average for this position");
    insights.push(`Market range: $${marketP50.toLocaleString()} - $${benchmark.percentiles.p75.toLocaleString()}`);
    negotiationTips.push("Research market rates and prepare data-driven negotiation");
    negotiationTips.push("Highlight unique skills and experience that justify higher compensation");
    negotiationTips.push("Consider total compensation package, not just base salary");
  } else if (marketPosition === "average") {
    insights.push("Salary is aligned with market average");
    insights.push("Good competitive positioning in the current market");
    negotiationTips.push("Focus on non-monetary benefits and growth opportunities");
    negotiationTips.push("Discuss performance-based bonuses and equity");
  } else if (marketPosition === "above") {
    insights.push("Salary is above market average");
    insights.push("Strong compensation package compared to market");
    negotiationTips.push("Emphasize value you bring beyond the role requirements");
    negotiationTips.push("Negotiate for additional benefits and flexibility");
  } else {
    insights.push("Salary is excellent compared to market");
    insights.push("Top-tier compensation for this position and experience level");
    negotiationTips.push("Leverage this offer when discussing future roles");
    negotiationTips.push("Consider long-term growth and equity opportunities");
  }

  // Factor-based insights
  if (benchmark.factors.education < 0.7) {
    insights.push("Education level may impact salary negotiation");
  }

  if (benchmark.factors.experience > 0.8) {
    insights.push("Your experience level is a strong negotiating factor");
  }

  if (benchmark.factors.skills > 0.8) {
    insights.push("In-demand skills significantly increase market value");
  }

  // Generate comparable jobs
  const comparableJobs = generateComparableJobs(benchmark);

  return {
    jobId: 0, // Would be actual job ID
    isCompetitive: score >= 60,
    marketPosition,
    score,
    insights,
    negotiationTips,
    comparableJobs
  };
}

function generateComparableJobs(benchmark: SalaryBenchmark): SalaryAnalysis["comparableJobs"] {
  // In a real implementation, this would fetch actual comparable jobs
  // For now, generate mock comparable jobs
  return [
    {
      company: "Tech Corp A",
      position: benchmark.position,
      salary: {
        min: benchmark.marketRange.min * 0.9,
        max: benchmark.marketRange.max * 1.1,
        mid: benchmark.marketRange.mid,
        currency: benchmark.marketRange.currency
      }
    },
    {
      company: "InnovateTech",
      position: benchmark.position,
      salary: {
        min: benchmark.marketRange.min * 0.85,
        max: benchmark.marketRange.max * 1.05,
        mid: benchmark.marketRange.mid * 0.95,
        currency: benchmark.marketRange.currency
      }
    },
    {
      company: "StartupXYZ",
      position: benchmark.position,
      salary: {
        min: benchmark.marketRange.min * 0.95,
        max: benchmark.marketRange.max * 1.15,
        mid: benchmark.marketRange.mid * 1.05,
        currency: benchmark.marketRange.currency
      }
    }
  ];
}

export function calculateSalaryBenchmark(
  position: string,
  experienceLevel: string,
  location: string,
  industry: string
): SalaryBenchmark {
  // In a real implementation, this would fetch from a salary database
  // For now, return a mock benchmark
  const baseSalary = getBaseSalaryForPosition(position, industry);
  const experienceMultiplier = getExperienceMultiplier(experienceLevel);
  const locationMultiplier = getLocationMultiplier(location);

  const marketMin = Math.round(baseSalary * experienceMultiplier * locationMultiplier * 0.8);
  const marketMax = Math.round(baseSalary * experienceMultiplier * locationMultiplier * 1.3);
  const marketMid = Math.round((marketMin + marketMax) / 2);

  return {
    position,
    experienceLevel,
    location,
    industry,
    marketRange: {
      min: marketMin,
      max: marketMax,
      mid: marketMid,
      currency: "USD"
    },
    percentiles: {
      p25: Math.round(marketMin + (marketMid - marketMin) * 0.25),
      p50: marketMid,
      p75: Math.round(marketMid + (marketMax - marketMid) * 0.5),
      p90: Math.round(marketMid + (marketMax - marketMid) * 0.8)
    },
    factors: {
      education: 0.7, // Would be calculated based on actual education
      experience: experienceMultiplier,
      skills: 0.8, // Would be calculated based on actual skills
      location: locationMultiplier,
      companySize: 1.0 // Would be calculated based on company size
    }
  };
}

function getBaseSalaryForPosition(position: string, industry: string): number {
  const positionMultipliers: Record<string, number> = {
    "junior": 0.6,
    "mid": 1.0,
    "senior": 1.4,
    "lead": 1.6,
    "manager": 1.8,
    "director": 2.2,
    "vp": 2.8,
    "c-level": 3.5
  };

  const industryBases: Record<string, number> = {
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

  const industryBase = industryBases[industry.toLowerCase()] || industryBases["default"];
  const positionLower = position.toLowerCase();

  let multiplier = 1.0;
  for (const [key, value] of Object.entries(positionMultipliers)) {
    if (positionLower.includes(key)) {
      multiplier = value;
      break;
    }
  }

  return industryBase * multiplier;
}

function getExperienceMultiplier(level: string): number {
  const multipliers: Record<string, number> = {
    "entry": 0.7,
    "junior": 0.85,
    "mid": 1.0,
    "senior": 1.25,
    "lead": 1.4,
    "manager": 1.6,
    "director": 1.9,
    "executive": 2.2
  };

  const levelLower = level.toLowerCase();
  return multipliers[levelLower] || 1.0;
}

function getLocationMultiplier(location: string): number {
  const highCostAreas = [
    "san francisco",
    "new york",
    "seattle",
    "boston",
    "washington dc",
    "los angeles"
  ];

  const mediumCostAreas = [
    "chicago",
    "denver",
    "austin",
    "portland",
    "minneapolis"
  ];

  const locationLower = location.toLowerCase();

  if (highCostAreas.some(area => locationLower.includes(area))) {
    return 1.3;
  } else if (mediumCostAreas.some(area => locationLower.includes(area))) {
    return 1.1;
  }

  return 1.0;
}

export function useSalaryAnalysis(
  position: string,
  experienceLevel: string,
  location: string,
  industry: string,
  jobSalary: SalaryRange
) {
  return useQuery({
    queryKey: ["salary-analysis", position, experienceLevel, location, industry],
    queryFn: () => {
      const benchmark = calculateSalaryBenchmark(position, experienceLevel, location, industry);
      return analyzeSalaryCompetitiveness(jobSalary, benchmark);
    },
    enabled: !!position && !!experienceLevel && !!location && !!industry,
    staleTime: 60 * 60 * 1000 // 1 hour
  });
}

export function formatSalaryRange(range: SalaryRange): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: range.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return `${formatter.format(range.min)} - ${formatter.format(range.max)}`;
}
