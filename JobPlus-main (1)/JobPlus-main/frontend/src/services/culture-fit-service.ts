
import { useQuery } from "@tanstack/react-query";

export interface CultureFitDimensions {
  workStyle: string[];
  values: string[];
  teamSize: string;
  communication: string;
  pace: string;
  innovation: string;
}

export interface CompanyCulture {
  workStyle: string[];
  values: string[];
  teamSize: string;
  communication: string;
  pace: string;
  innovation: string;
}

export interface CultureFitResult {
  companyId: number;
  overallScore: number;
  dimensions: {
    workStyle: { score: number; match: string; gap: string };
    values: { score: number; match: string; gap: string };
    teamSize: { score: number; match: string; gap: string };
    communication: { score: number; match: string; gap: string };
    pace: { score: number; match: string; gap: string };
    innovation: { score: number; match: string; gap: string };
  };
  recommendations: string[];
  redFlags: string[];
}

export function calculateCultureFit(
  userPreferences: CultureFitDimensions,
  companyCulture: CompanyCulture
): CultureFitResult {
  const recommendations: string[] = [];
  const redFlags: string[] = [];

  // Work Style Matching (20% weight)
  const workStyleMatch = userPreferences.workStyle.filter((style: string) =>
    companyCulture.workStyle.some((companyStyle: string) =>
      style.toLowerCase().includes(companyStyle.toLowerCase()) ||
      companyStyle.toLowerCase().includes(style.toLowerCase())
    )
  );
  const workStyleScore = (workStyleMatch.length / Math.max(userPreferences.workStyle.length, 1)) * 100;

  // Values Matching (25% weight)
  const valuesMatch = userPreferences.values.filter((value: string) =>
    companyCulture.values.some((companyValue: string) =>
      value.toLowerCase().includes(companyValue.toLowerCase()) ||
      companyValue.toLowerCase().includes(value.toLowerCase())
    )
  );
  const valuesScore = (valuesMatch.length / Math.max(userPreferences.values.length, 1)) * 100;

  // Team Size Matching (15% weight)
  const teamSizeScore = calculateTeamSizeFit(userPreferences.teamSize, companyCulture.teamSize);

  // Communication Style (15% weight)
  const communicationScore = calculateStyleMatch(
    userPreferences.communication,
    companyCulture.communication
  );

  // Work Pace (15% weight)
  const paceScore = calculateStyleMatch(userPreferences.pace, companyCulture.pace);

  // Innovation Level (10% weight)
  const innovationScore = calculateStyleMatch(
    userPreferences.innovation,
    companyCulture.innovation
  );

  // Generate recommendations based on gaps
  if (workStyleScore < 60) {
    recommendations.push("Consider discussing work style expectations during interview");
  }
  if (valuesScore < 50) {
    recommendations.push("Research company values and assess alignment");
    redFlags.push("Significant values mismatch detected");
  }
  if (communicationScore < 60) {
    recommendations.push("Ask about team communication preferences");
  }
  if (paceScore < 60) {
    recommendations.push("Inquire about project timelines and work pace");
  }

  // Calculate weighted overall score
  const overallScore = Math.round(
    (workStyleScore * 0.20) +
    (valuesScore * 0.25) +
    (teamSizeScore * 0.15) +
    (communicationScore * 0.15) +
    (paceScore * 0.15) +
    (innovationScore * 0.10)
  );

  return {
    companyId: 0, // Would be actual company ID
    overallScore,
    dimensions: {
      workStyle: {
        score: Math.round(workStyleScore),
        match: workStyleMatch.length > 0 ? workStyleMatch[0] : "No match",
        gap: workStyleScore < 50 ? "Significant difference" : "Minor difference"
      },
      values: {
        score: Math.round(valuesScore),
        match: valuesMatch.length > 0 ? valuesMatch[0] : "No match",
        gap: valuesScore < 50 ? "Major misalignment" : "Good alignment"
      },
      teamSize: {
        score: Math.round(teamSizeScore),
        match: companyCulture.teamSize,
        gap: teamSizeScore < 50 ? "Size mismatch" : "Good fit"
      },
      communication: {
        score: Math.round(communicationScore),
        match: companyCulture.communication,
        gap: communicationScore < 60 ? "Style difference" : "Compatible"
      },
      pace: {
        score: Math.round(paceScore),
        match: companyCulture.pace,
        gap: paceScore < 60 ? "Pace mismatch" : "Similar pace"
      },
      innovation: {
        score: Math.round(innovationScore),
        match: companyCulture.innovation,
        gap: innovationScore < 60 ? "Innovation gap" : "Well aligned"
      }
    },
    recommendations,
    redFlags
  };
}

function calculateTeamSizeFit(userPref: string, companySize: string): number {
  const sizeOrder = ["startup", "small", "medium", "large", "enterprise"];
  const userIndex = sizeOrder.indexOf(userPref.toLowerCase());
  const companyIndex = sizeOrder.indexOf(companySize.toLowerCase());

  if (userIndex === -1 || companyIndex === -1) return 50;

  const diff = Math.abs(userIndex - companyIndex);
  return Math.max(0, 100 - (diff * 25));
}

function calculateStyleMatch(userPref: string, companyStyle: string): number {
  if (!userPref || !companyStyle) return 50;

  const userLower = userPref.toLowerCase();
  const companyLower = companyStyle.toLowerCase();

  if (userLower === companyLower) return 100;

  // Check for partial matches or related terms
  const relatedTerms: Record<string, string[]> = {
    "collaborative": ["team", "group", "cooperative"],
    "independent": ["solo", "individual", "autonomous"],
    "fast-paced": ["dynamic", "agile", "rapid"],
    "steady": ["consistent", "predictable", "structured"],
    "innovative": ["creative", "cutting-edge", "forward-thinking"],
    "traditional": ["established", "proven", "conventional"]
  };

  const userRelated = relatedTerms[userLower] || [];
  const companyRelated = relatedTerms[companyLower] || [];

  if (companyRelated.some(term => userLower.includes(term))) return 80;
  if (userRelated.some(term => companyLower.includes(term))) return 80;

  return 50; // No clear match
}

export function useCultureFit(
  userPreferences: CultureFitDimensions,
  companyId: number
) {
  return useQuery({
    queryKey: ["culture-fit", userPreferences, companyId],
    queryFn: async () => {
      // This would typically fetch company culture from the backend
      // For now, return a mock result
      return calculateCultureFit(userPreferences, {
        workStyle: ["collaborative", "innovative"],
        values: ["growth", "excellence", "teamwork"],
        teamSize: "medium",
        communication: "open",
        pace: "fast-paced",
        innovation: "high"
      });
    },
    enabled: !!userPreferences && !!companyId,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
}
