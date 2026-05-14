
import { useQuery } from "@tanstack/react-query";

export interface CandidateProfile {
  id: number;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  location: string;
  salaryExpectation: number;
  availability: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface ReverseHiringRequest {
  position: string;
  description: string;
  requirements: string[];
  salaryRange: { min: number; max: number };
  location: string;
  remoteOption: "remote" | "hybrid" | "onsite";
  companySize: string;
  industry: string;
  culture: string[];
}

export interface ReverseHiringMatch {
  candidateId: number;
  requestId: number;
  matchScore: number;
  fitReasons: string[];
  potentialConcerns: string[];
  recommendedActions: string[];
  interviewQuestions: string[];
}

export interface ReverseHiringAnalytics {
  totalRequests: number;
  activeRequests: number;
  totalCandidates: number;
  averageMatchScore: number;
  topSkills: Array<{ skill: string; count: number }>;
  locationDistribution: Array<{ location: string; count: number }>;
  salaryDistribution: {
    below: number;
    within: number;
    above: number;
  };
}

export function calculateReverseHiringMatch(
  candidate: CandidateProfile,
  request: ReverseHiringRequest
): ReverseHiringMatch {
  const fitReasons: string[] = [];
  const potentialConcerns: string[] = [];
  const recommendedActions: string[] = [];
  const interviewQuestions: string[] = [];

  let skillsMatch = 0;
  let experienceFit = 0;
  let locationFit = 0;
  let salaryFit = 0;
  let cultureFit = 0;

  // Skills matching (35% weight)
  const matchingSkills = request.requirements.filter(req =>
    candidate.skills.some(skill => 
      skill.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );

  if (matchingSkills.length > 0) {
    skillsMatch = (matchingSkills.length / Math.max(request.requirements.length, 1)) * 100;
    fitReasons.push(`Matches ${matchingSkills.length} of ${request.requirements.length} required skills`);
  } else {
    potentialConcerns.push("No matching skills found");
  }

  // Experience matching (25% weight)
  const experienceLevels: Record<string, number> = {
    "entry": 0,
    "junior": 1,
    "mid": 2,
    "senior": 3,
    "lead": 4,
    "manager": 5
  };

  const reqExperience = request.description.toLowerCase();
  let reqLevel = 2; // default to mid

  if (reqExperience.includes("senior") || reqExperience.includes("lead")) {
    reqLevel = 3;
  } else if (reqExperience.includes("junior")) {
    reqLevel = 1;
  }

  const candidateLevel = experienceLevels[candidate.experience] || 2;
  const experienceDiff = Math.abs(candidateLevel - reqLevel);
  experienceFit = Math.max(0, 100 - (experienceDiff * 25));

  if (experienceFit >= 75) {
    fitReasons.push("Experience level aligns well with position");
  } else if (experienceFit >= 50) {
    fitReasons.push("Experience level is acceptable for this role");
    recommendedActions.push("Consider highlighting transferable skills during interview");
  } else {
    potentialConcerns.push("Experience level may be below requirements");
    recommendedActions.push("Prepare examples of rapid learning and adaptability");
  }

  // Location matching (20% weight)
  if (candidate.location && request.location) {
    const candidateLocation = candidate.location.toLowerCase();
    const reqLocation = request.location.toLowerCase();

    if (request.remoteOption === "remote") {
      locationFit = 100;
      fitReasons.push("Fully remote position matches any location");
    } else if (candidateLocation.includes(reqLocation) || reqLocation.includes(candidateLocation)) {
      locationFit = 100;
      fitReasons.push("Located in the same area as the position");
    } else {
      locationFit = 50;
      potentialConcerns.push("Location may require relocation");
      recommendedActions.push("Be prepared to discuss remote work options");
    }
  }

  // Salary matching (15% weight)
  if (candidate.salaryExpectation && request.salaryRange) {
    const { min, max } = request.salaryRange;
    const candidateSalary = candidate.salaryExpectation;

    if (candidateSalary >= min && candidateSalary <= max) {
      salaryFit = 100;
      fitReasons.push("Salary expectations are within the offered range");
    } else if (candidateSalary < min) {
      salaryFit = Math.max(0, 100 - ((min - candidateSalary) / min) * 100);
      potentialConcerns.push("Salary expectations are below the range");
      recommendedActions.push("Research market rates and be prepared to discuss total compensation");
    } else {
      salaryFit = Math.max(0, 100 - ((candidateSalary - max) / max) * 100);
      potentialConcerns.push("Salary expectations exceed the range");
      recommendedActions.push("Consider total package including benefits and growth opportunities");
    }
  }

  // Culture matching (5% weight)
  if (request.culture && request.culture.length > 0) {
    const matchingCulture = request.culture.filter(culture =>
      candidate.skills.some(skill => 
        skill.toLowerCase().includes(culture.toLowerCase()) ||
        culture.toLowerCase().includes(skill.toLowerCase())
      )
    );

    cultureFit = (matchingCulture.length / Math.max(request.culture.length, 1)) * 100;

    if (matchingCulture.length > 0) {
      fitReasons.push(`Shares ${matchingCulture.length} cultural values with the company`);
    }
  }

  // Calculate overall match score
  const totalScore = Math.round(
    (skillsMatch * 0.35) +
    (experienceFit * 0.25) +
    (locationFit * 0.20) +
    (salaryFit * 0.15) +
    (cultureFit * 0.05)
  );

  // Generate interview questions based on gaps
  if (skillsMatch < 70) {
    interviewQuestions.push("Can you describe your experience with [specific required skill]?");
    interviewQuestions.push("How have you developed your skills in [relevant area]?");
  }

  if (experienceFit < 70) {
    interviewQuestions.push("Can you share an example of a project where you demonstrated [relevant skill]?");
    interviewQuestions.push("How do you approach learning new technologies quickly?");
  }

  if (potentialConcerns.length > 0) {
    interviewQuestions.push("What steps would you take to address [concern area] if hired?");
    interviewQuestions.push("How do you stay current with industry best practices?");
  }

  interviewQuestions.push("What interests you most about this position and our company?");
  interviewQuestions.push("Where do you see yourself in 2-3 years with our team?");
  interviewQuestions.push("What questions do you have for us about the role or company?");

  // Add general recommendations
  if (totalScore >= 80) {
    recommendedActions.push("Strong candidate - proceed with interview scheduling");
    recommendedActions.push("Prepare specific examples of past achievements");
  } else if (totalScore >= 60) {
    recommendedActions.push("Good potential - consider technical assessment");
    recommendedActions.push("Prepare to address experience concerns proactively");
  } else {
    recommendedActions.push("Moderate fit - may need additional preparation");
    recommendedActions.push("Focus on highlighting transferable skills");
  }

  return {
    candidateId: candidate.id,
    requestId: 0, // Would be actual request ID
    matchScore: totalScore,
    fitReasons: fitReasons.slice(0, 5),
    potentialConcerns,
    recommendedActions,
    interviewQuestions
  };
}

export function analyzeReverseHiringData(
  requests: ReverseHiringRequest[],
  candidates: CandidateProfile[]
): ReverseHiringAnalytics {
  const totalRequests = requests.length;
  const activeRequests = requests.filter(req => 
    new Date(req.createdDate || Date.now()).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length;

  // Calculate match scores for all combinations
  const allMatches: ReverseHiringMatch[] = [];
  candidates.forEach(candidate => {
    requests.forEach(request => {
      const match = calculateReverseHiringMatch(candidate, request);
      allMatches.push(match);
    });
  });

  const averageMatchScore = allMatches.length > 0
    ? Math.round(allMatches.reduce((sum, match) => sum + match.matchScore, 0) / allMatches.length)
    : 0;

  // Extract top skills
  const skillCounts: Record<string, number> = {};
  candidates.forEach(candidate => {
    candidate.skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      skillCounts[skillLower] = (skillCounts[skillLower] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  // Location distribution
  const locationCounts: Record<string, number> = {};
  candidates.forEach(candidate => {
    if (candidate.location) {
      const locationLower = candidate.location.toLowerCase();
      locationCounts[locationLower] = (locationCounts[locationLower] || 0) + 1;
    }
  });

  const locationDistribution = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Salary distribution
  const salaryRanges = {
    below: 0,
    within: 0,
    above: 0
  };

  requests.forEach(request => {
    const { min, max } = request.salaryRange;
    const mid = (min + max) / 2;

    candidates.forEach(candidate => {
      if (!candidate.salaryExpectation) return;

      if (candidate.salaryExpectation < min) {
        salaryRanges.below++;
      } else if (candidate.salaryExpectation <= max) {
        salaryRanges.within++;
      } else {
        salaryRanges.above++;
      }
    });
  });

  return {
    totalRequests,
    activeRequests,
    totalCandidates: candidates.length,
    averageMatchScore,
    topSkills,
    locationDistribution,
    salaryDistribution
  };
}

export function useReverseHiringMatches(candidateId: number) {
  return useQuery({
    queryKey: ["reverse-hiring", candidateId],
    queryFn: async () => {
      // This would typically fetch from the backend
      // For now, return mock data
      return {
        candidateId: candidateId,
        requestId: 1,
        matchScore: 75,
        fitReasons: [
          "Strong technical skills match",
          "Experience level appropriate",
          "Location compatible"
        ],
        potentialConcerns: [
          "May need to discuss remote work options"
        ],
        recommendedActions: [
          "Prepare examples of past projects",
          "Research company culture",
          "Prepare questions about team structure"
        ],
        interviewQuestions: [
          "Can you describe your experience with our tech stack?",
          "How do you approach learning new technologies?",
          "What interests you most about this position?"
        ]
      };
    },
    enabled: !!candidateId,
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
}

export function useReverseHiringAnalytics() {
  return useQuery({
    queryKey: ["reverse-hiring-analytics"],
    queryFn: async () => {
      // This would typically fetch from the backend
      // For now, return mock analytics
      return {
        totalRequests: 50,
        activeRequests: 12,
        totalCandidates: 200,
        averageMatchScore: 72,
        topSkills: [
          { skill: "JavaScript", count: 150 },
          { skill: "TypeScript", count: 120 },
          { skill: "React", count: 110 },
          { skill: "Node.js", count: 95 },
          { skill: "Python", count: 80 }
        ],
        locationDistribution: [
          { location: "San Francisco, CA", count: 45 },
          { location: "New York, NY", count: 38 },
          { location: "Remote", count: 52 },
          { location: "Austin, TX", count: 28 },
          { location: "Seattle, WA", count: 37 }
        ],
        salaryDistribution: {
          below: 30,
          within: 120,
          above: 50
        }
      };
    },
    staleTime: 30 * 60 * 1000 // 30 minutes
  });
}
