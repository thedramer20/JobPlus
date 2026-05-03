
import { useQuery } from "@tanstack/react-query";

export interface JobMatchScore {
  jobId: number;
  score: number;
  reasons: string[];
  cultureFit: number;
  skillsMatch: number;
  salaryMatch: number;
  locationMatch: number;
}

export interface MatchingPreferences {
  preferredLocations: string[];
  salaryRange: { min: number; max: number };
  remotePreference: "remote" | "hybrid" | "onsite" | "any";
  companySize: string[];
  industry: string[];
  requiredSkills: string[];
}

export interface JobMatchFilters {
  minScore: number;
  sortBy: "score" | "salary" | "location" | "recent";
}

export function calculateJobMatch(
  job: any,
  userProfile: any,
  preferences: MatchingPreferences
): JobMatchScore {
  const reasons: string[] = [];
  let cultureFit = 0;
  let skillsMatch = 0;
  let salaryMatch = 0;
  let locationMatch = 0;

  // Skills matching (40% weight)
  const jobSkills = job.skills || [];
  const userSkills = userProfile.skills || [];
  const matchingSkills = jobSkills.filter((skill: string) => 
    userSkills.some((userSkill: string) => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  if (matchingSkills.length > 0) {
    skillsMatch = (matchingSkills.length / Math.max(jobSkills.length, userSkills.length)) * 100;
    reasons.push(`Matched ${matchingSkills.length} of ${jobSkills.length} required skills`);
  }

  // Culture fit (25% weight)
  if (userProfile.culturePreferences) {
    const cultureMatch = userProfile.culturePreferences.filter((pref: string) =>
      job.culture?.toLowerCase().includes(pref.toLowerCase())
    );
    cultureFit = (cultureMatch.length / Math.max(userProfile.culturePreferences.length, 1)) * 100;
    if (cultureMatch.length > 0) {
      reasons.push(`Strong culture fit with ${cultureMatch.length} shared values`);
    }
  }

  // Salary matching (20% weight)
  if (preferences.salaryRange && job.salaryRange) {
    const jobSalary = job.salaryRange.mid || job.salaryRange.min;
    const prefMin = preferences.salaryRange.min;
    const prefMax = preferences.salaryRange.max;

    if (jobSalary >= prefMin && jobSalary <= prefMax) {
      salaryMatch = 100;
      reasons.push("Salary within your preferred range");
    } else if (jobSalary < prefMin) {
      salaryMatch = Math.max(0, 100 - ((prefMin - jobSalary) / prefMin) * 100);
    } else {
      salaryMatch = Math.max(0, 100 - ((jobSalary - prefMax) / prefMax) * 100);
    }
  }

  // Location matching (15% weight)
  if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
    const locationMatch = preferences.preferredLocations.filter((loc: string) =>
      job.location?.toLowerCase().includes(loc.toLowerCase())
    );
    locationMatch = (locationMatch.length / preferences.preferredLocations.length) * 100;
    if (locationMatch.length > 0) {
      reasons.push(`Located in your preferred area`);
    }
  }

  // Calculate weighted score
  const totalScore = 
    (skillsMatch * 0.40) +
    (cultureFit * 0.25) +
    (salaryMatch * 0.20) +
    (locationMatch * 0.15);

  return {
    jobId: job.id,
    score: Math.round(totalScore),
    reasons: reasons.slice(0, 5), // Top 5 reasons
    cultureFit: Math.round(cultureFit),
    skillsMatch: Math.round(skillsMatch),
    salaryMatch: Math.round(salaryMatch),
    locationMatch: Math.round(locationMatch)
  };
}

export function sortJobMatches(
  matches: JobMatchScore[],
  sortBy: JobMatchFilters["sortBy"]
): JobMatchScore[] {
  return [...matches].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "salary":
        return b.salaryMatch - a.salaryMatch;
      case "location":
        return b.locationMatch - a.locationMatch;
      case "recent":
        return 0; // Would need timestamp data
      default:
        return b.score - a.score;
    }
  });
}

export function filterJobMatches(
  matches: JobMatchScore[],
  filters: JobMatchFilters
): JobMatchScore[] {
  return matches.filter(match => match.score >= filters.minScore);
}

export function getMatchingRecommendations(
  userProfile: any,
  preferences: MatchingPreferences,
  filters: JobMatchFilters = { minScore: 50, sortBy: "score" }
): JobMatchScore[] {
  // This would typically fetch jobs from the backend
  // For now, return empty array
  return [];
}

export function useJobMatches(
  userProfile: any,
  preferences: MatchingPreferences,
  filters: JobMatchFilters = { minScore: 50, sortBy: "score" }
) {
  return useQuery({
    queryKey: ["ai-matches", userProfile?.id, preferences, filters],
    queryFn: () => getMatchingRecommendations(userProfile, preferences, filters),
    enabled: !!userProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
