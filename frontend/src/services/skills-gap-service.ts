
import { useQuery } from "@tanstack/react-query";

export interface SkillGap {
  skill: string;
  userLevel: number; // 0-100
  requiredLevel: number; // 0-100
  gap: number; // 0-100
  priority: "critical" | "important" | "nice-to-have";
  learningResources: string[];
}

export interface SkillsGapAnalysis {
  jobId: number;
  overallMatch: number;
  gaps: SkillGap[];
  strengths: string[];
  recommendations: string[];
  learningPath: {
    phase: string;
    skills: string[];
    estimatedTime: string;
    resources: string[];
  }[];
}

export function calculateSkillsGap(
  userSkills: Array<{ name: string; level: number }>,
  jobRequirements: Array<{ name: string; level: number; priority: string }>
): SkillsGapAnalysis {
  const gaps: SkillGap[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // Match user skills with job requirements
  jobRequirements.forEach((req) => {
    const userSkill = userSkills.find(
      (us) => us.name.toLowerCase() === req.name.toLowerCase()
    );

    if (userSkill) {
      // Skill exists, check level
      const gap = Math.max(0, req.level - userSkill.level);
      if (gap > 0) {
        gaps.push({
          skill: req.name,
          userLevel: userSkill.level,
          requiredLevel: req.level,
          gap,
          priority: req.priority as "critical" | "important" | "nice-to-have",
          learningResources: getLearningResources(req.name, gap)
        });
      } else {
        // User has sufficient skill
        strengths.push(req.name);
      }
    } else {
      // Skill missing entirely
      gaps.push({
        skill: req.name,
        userLevel: 0,
        requiredLevel: req.level,
        gap: req.level,
        priority: req.priority as "critical" | "important" | "nice-to-have",
        learningResources: getLearningResources(req.name, req.level)
      });
    }
  });

  // Calculate overall match percentage
  const totalRequiredLevel = jobRequirements.reduce((sum, req) => sum + req.level, 0);
  const totalUserLevel = jobRequirements.reduce((sum, req) => {
    const userSkill = userSkills.find(
      (us) => us.name.toLowerCase() === req.name.toLowerCase()
    );
    return sum + (userSkill?.level || 0);
  }, 0);

  const overallMatch = Math.round((totalUserLevel / totalRequiredLevel) * 100);

  // Generate recommendations
  const criticalGaps = gaps.filter(gap => gap.priority === "critical");
  const importantGaps = gaps.filter(gap => gap.priority === "important");

  if (criticalGaps.length > 0) {
    recommendations.push(
      `Focus on learning ${criticalGaps.map(g => g.skill).join(", ")} - these are critical for this role`
    );
  }

  if (importantGaps.length > 0) {
    recommendations.push(
      `Consider improving ${importantGaps.map(g => g.skill).join(", ")} to strengthen your application`
    );
  }

  if (strengths.length > 0) {
    recommendations.push(
      `Highlight your experience with ${strengths.slice(0, 3).join(", ")} in your application`
    );
  }

  // Create learning path
  const learningPath = createLearningPath(gaps);

  return {
    jobId: 0, // Would be actual job ID
    overallMatch,
    gaps,
    strengths,
    recommendations,
    learningPath
  };
}

function getLearningResources(skill: string, gap: number): string[] {
  const resources: Record<string, string[]> = {
    "javascript": [
      "MDN JavaScript Guide",
      "JavaScript.info",
      "freeCodeCamp JavaScript Course",
      "Eloquent JavaScript (book)"
    ],
    "python": [
      "Python.org Tutorial",
      "Real Python (book)",
      "Automate the Boring Stuff with Python",
      "Python for Everybody"
    ],
    "react": [
      "React Documentation",
      "React Tutorial (W3Schools)",
      "Full Stack React (course)",
      "React Patterns (book)"
    ],
    "typescript": [
      "TypeScript Handbook",
      "Total TypeScript (book)",
      "TypeScript Deep Dive (course)"
    ],
    "nodejs": [
      "Node.js Documentation",
      "Node.js Design Patterns (book)",
      "Node.js Best Practices"
    ],
    "sql": [
      "SQLBolt",
      "Mode (SQL Tutorial)",
      "SQL for Mere Mortals (book)"
    ],
    "default": [
      "Official Documentation",
      "Stack Overflow",
      "GitHub Topics",
      "Medium Articles",
      "YouTube Tutorials",
      "Coursera Courses",
      "edX Courses"
    ]
  };

  const skillLower = skill.toLowerCase();
  return resources[skillLower] || resources["default"];
}

function createLearningPath(gaps: SkillGap[]): SkillsGapAnalysis["learningPath"] {
  const criticalGaps = gaps.filter(g => g.priority === "critical");
  const importantGaps = gaps.filter(g => g.priority === "important");
  const niceToHaveGaps = gaps.filter(g => g.priority === "nice-to-have");

  const path: SkillsGapAnalysis["learningPath"] = [];

  if (criticalGaps.length > 0) {
    path.push({
      phase: "Phase 1: Critical Skills",
      skills: criticalGaps.map(g => g.skill),
      estimatedTime: `${Math.ceil(criticalGaps.length * 2)}-4 weeks`,
      resources: criticalGaps.flatMap(g => g.learningResources).slice(0, 5)
    });
  }

  if (importantGaps.length > 0) {
    path.push({
      phase: "Phase 2: Important Skills",
      skills: importantGaps.map(g => g.skill),
      estimatedTime: `${Math.ceil(importantGaps.length * 1.5)}-3 weeks`,
      resources: importantGaps.flatMap(g => g.learningResources).slice(0, 5)
    });
  }

  if (niceToHaveGaps.length > 0) {
    path.push({
      phase: "Phase 3: Additional Skills",
      skills: niceToHaveGaps.map(g => g.skill),
      estimatedTime: `${Math.ceil(niceToHaveGaps.length * 1)}-2 weeks`,
      resources: niceToHaveGaps.flatMap(g => g.learningResources).slice(0, 5)
    });
  }

  return path;
}

export function useSkillsGapAnalysis(
  userSkills: Array<{ name: string; level: number }>,
  jobId: number
) {
  return useQuery({
    queryKey: ["skills-gap", userSkills, jobId],
    queryFn: async () => {
      // This would typically fetch job requirements from the backend
      // For now, return a mock analysis
      return calculateSkillsGap(userSkills, [
        { name: "JavaScript", level: 80, priority: "critical" },
        { name: "TypeScript", level: 70, priority: "important" },
        { name: "React", level: 75, priority: "critical" },
        { name: "Node.js", level: 65, priority: "important" },
        { name: "SQL", level: 60, priority: "nice-to-have" }
      ]);
    },
    enabled: !!userSkills && !!jobId,
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
}

export function visualizeSkillsGap(analysis: SkillsGapAnalysis): {
  chartData: Array<{ skill: string; userLevel: number; requiredLevel: number }>;
  summary: {
    critical: number;
    important: number;
    niceToHave: number;
  };
} {
  const chartData = analysis.gaps.map(gap => ({
    skill: gap.skill,
    userLevel: gap.userLevel,
    requiredLevel: gap.requiredLevel
  }));

  const summary = {
    critical: analysis.gaps.filter(g => g.priority === "critical").length,
    important: analysis.gaps.filter(g => g.priority === "important").length,
    niceToHave: analysis.gaps.filter(g => g.priority === "nice-to-have").length
  };

  return { chartData, summary };
}
