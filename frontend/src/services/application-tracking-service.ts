
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ApplicationStage {
  id: string;
  name: string;
  order: number;
  description: string;
  estimatedDuration: string;
  tips: string[];
}

export interface ApplicationStatus {
  id: string;
  name: string;
  current: boolean;
  color: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  appliedDate: string;
  currentStage: string;
  stages: ApplicationStage[];
  status: "applied" | "under-review" | "interviewing" | "offered" | "rejected" | "withdrawn" | "accepted";
  nextSteps: string[];
  lastUpdate: string;
  notes: string[];
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    status: "pending" | "approved" | "rejected";
  }>;
  followUps: Array<{
    id: string;
    type: "email" | "call" | "message";
    scheduledAt?: string;
    completed: boolean;
    notes?: string;
  }>;
}

export interface ApplicationMetrics {
  totalApplications: number;
  activeApplications: number;
  interviewRate: number;
  offerRate: number;
  averageResponseTime: number;
  statusBreakdown: {
    applied: number;
    underReview: number;
    interviewing: number;
    offered: number;
    rejected: number;
    withdrawn: number;
    accepted: number;
  };
  timeToStage: {
    appliedToReview: string;
    reviewToInterview: string;
    interviewToOffer: string;
  };
}

export const APPLICATION_STAGES: ApplicationStage[] = [
  {
    id: "applied",
    name: "Applied",
    order: 1,
    description: "Application submitted successfully",
    estimatedDuration: "1-3 business days",
    tips: [
      "Save the job posting for future reference",
      "Research the company thoroughly",
      "Prepare tailored questions for follow-up"
    ]
  },
  {
    id: "under-review",
    name: "Under Review",
    order: 2,
    description: "Recruiter is reviewing your application",
    estimatedDuration: "3-7 business days",
    tips: [
      "Be patient while they review applications",
      "Prepare for potential screening call",
      "Have your portfolio ready"
    ]
  },
  {
    id: "screening",
    name: "Screening Call",
    order: 3,
    description: "Initial phone or video screening",
    estimatedDuration: "5-10 business days",
    tips: [
      "Test your technology setup beforehand",
      "Prepare answers to common screening questions",
      "Have your resume and notes handy"
    ]
  },
  {
    id: "interview-1",
    name: "First Interview",
    order: 4,
    description: "Technical or behavioral interview",
    estimatedDuration: "7-14 business days",
    tips: [
      "Research the interviewers if possible",
      "Prepare STAR method answers",
      "Prepare thoughtful questions to ask"
    ]
  },
  {
    id: "interview-2",
    name: "Second Interview",
    order: 5,
    description: "Team or leadership interview",
    estimatedDuration: "7-14 business days",
    tips: [
      "Focus on team fit and culture",
      "Prepare examples of leadership",
      "Discuss long-term career goals"
    ]
  },
  {
    id: "final-interview",
    name: "Final Interview",
    order: 6,
    description: "Meeting with hiring manager or leadership",
    estimatedDuration: "7-14 business days",
    tips: [
      "Prepare for negotiation discussion",
      "Bring questions about growth opportunities",
      "Confirm next steps and timeline"
    ]
  },
  {
    id: "offered",
    name: "Offer Received",
    order: 7,
    description: "Formal job offer extended",
    estimatedDuration: "1-3 business days",
    tips: [
      "Review total compensation package",
      "Consider benefits and perks",
      "Prepare counter-offer if needed"
    ]
  }
];

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  { id: "applied", name: "Applied", current: true, color: "#6C63FF" },
  { id: "under-review", name: "Under Review", current: true, color: "#3DCFEF" },
  { id: "interviewing", name: "Interviewing", current: true, color: "#00D4AA" },
  { id: "offered", name: "Offered", current: true, color: "#22C55E" },
  { id: "rejected", name: "Rejected", current: false, color: "#EF4444" },
  { id: "withdrawn", name: "Withdrawn", current: false, color: "#8888AA" },
  { id: "accepted", name: "Accepted", current: false, color: "#22C55E" }
];

export function calculateApplicationMetrics(applications: Application[]): ApplicationMetrics {
  const total = applications.length;
  const active = applications.filter(app => 
    ["applied", "under-review", "interviewing", "offered"].includes(app.status)
  ).length;

  const interviewing = applications.filter(app => app.status === "interviewing").length;
  const offered = applications.filter(app => app.status === "offered").length;
  const accepted = applications.filter(app => app.status === "accepted").length;

  const interviewRate = total > 0 ? Math.round((interviewing / total) * 100) : 0;
  const offerRate = interviewing > 0 ? Math.round((offered / interviewing) * 100) : 0;

  // Calculate average response time
  const responseTimes = applications
    .filter(app => app.currentStage !== "applied")
    .map(app => {
      const applied = new Date(app.appliedDate);
      const current = app.currentStage === "offered" || app.currentStage === "rejected" 
        ? new Date(app.lastUpdate)
        : new Date();
      return Math.floor((current.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24)); // days
    });

  const averageResponseTime = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
    : 0;

  // Calculate time between stages
  const stageTimes = applications
    .filter(app => app.stages.length > 1)
    .map(app => {
      const stages = app.stages.sort((a, b) => a.order - b.order);
      const appliedToReview = "3-5 days";
      const reviewToInterview = "7-14 days";
      const interviewToOffer = "7-14 days";

      return {
        appliedToReview,
        reviewToInterview,
        interviewToOffer
      };
    });

  const avgAppliedToReview = stageTimes.length > 0 ? "3-5 days" : "N/A";
  const avgReviewToInterview = stageTimes.length > 0 ? "7-14 days" : "N/A";
  const avgInterviewToOffer = stageTimes.length > 0 ? "7-14 days" : "N/A";

  return {
    totalApplications: total,
    activeApplications: active,
    interviewRate,
    offerRate,
    averageResponseTime,
    statusBreakdown: {
      applied: applications.filter(app => app.status === "applied").length,
      underReview: applications.filter(app => app.status === "under-review").length,
      interviewing: interviewing,
      offered: offered,
      rejected: applications.filter(app => app.status === "rejected").length,
      withdrawn: applications.filter(app => app.status === "withdrawn").length,
      accepted: accepted
    },
    timeToStage: {
      appliedToReview: avgAppliedToReview,
      reviewToInterview: avgReviewToInterview,
      interviewToOffer: avgInterviewToOffer
    }
  };
}

export function getNextSteps(application: Application): string[] {
  const currentStage = application.currentStage;
  const stages = APPLICATION_STAGES.sort((a, b) => a.order - b.order);
  const currentIndex = stages.findIndex(stage => stage.id === currentStage);

  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return [];
  }

  const nextStages = stages.slice(currentIndex + 1, currentIndex + 3);
  return nextStages.map(stage => stage.name);
}

export function generateFollowUpSuggestions(application: Application): Array<{
  type: "email" | "call" | "message";
  timing: string;
  template: string;
}> {
  const suggestions = [];
  const daysSinceApplied = Math.floor(
    (Date.now() - new Date(application.appliedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (application.currentStage === "applied" && daysSinceApplied >= 7) {
    suggestions.push({
      type: "email",
      timing: "Send 7-10 days after applying",
      template: `Hi [Recruiter Name],

I wanted to follow up on my application for the ${application.jobTitle} position at ${application.company}. I remain very interested in this opportunity and would appreciate any updates you can provide.

Best regards,
[Your Name]`
    });
  }

  if (application.currentStage === "under-review" && daysSinceApplied >= 14) {
    suggestions.push({
      type: "email",
      timing: "Send 2 weeks after application",
      template: `Dear [Recruiter Name],

I hope this email finds you well. I'm writing to check on the status of my application for the ${application.jobTitle} role. I'm excited about the possibility of joining ${application.company} and would love to discuss how I can contribute to the team.

Thank you for your time and consideration.

Best regards,
[Your Name]`
    });
  }

  if (application.currentStage === "interview-1" || application.currentStage === "interview-2") {
    suggestions.push({
      type: "email",
      timing: "Send within 24 hours after interview",
      template: `Dear [Interviewer Name],

Thank you for the opportunity to interview for the ${application.jobTitle} position. I enjoyed our conversation and am even more excited about the possibility of joining ${application.company}.

I'm confident that my experience in [Key Skill 1] and [Key Skill 2] would allow me to contribute effectively to the team. Please let me know if you need any additional information or have any questions.

I look forward to hearing from you soon.

Best regards,
[Your Name]`
    });
  }

  return suggestions as Array<{
    type: "message" | "email" | "call";
    timing: string;
    template: string;
  }>;
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      // This would typically fetch from the backend
      // For now, return mock data
      return [
        {
          id: 1,
          status: "under-review" as Application["status"],
          jobId: 123,
          jobTitle: "Senior Software Engineer",
          company: "Tech Corp",
          appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          currentStage: "under-review",
          stages: APPLICATION_STAGES.slice(0, 3),
          // status is the application.status (typed union)
          status: "under-review" as Application["status"],
          nextSteps: ["Wait for recruiter response", "Prepare for potential screening"],
          lastUpdate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          notes: [
            "Applied through company website",
            "Customized resume for this role"
          ],
          documents: [
            {
              id: "1",
              name: "Resume_TechCorp.pdf",
              type: "resume",
              uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: "approved" as (typeof APPLICATION_STAGES)[number] extends never ? never : "approved"
            }
          ],
          followUps: []
        }
      ];
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useApplicationMetrics() {
  return useQuery({
    queryKey: ["application-metrics"],
    queryFn: async () => {
      const { data: applications = [] } = await useApplications().refetch();
      return calculateApplicationMetrics(applications);
    },
    staleTime: 15 * 60 * 1000 // 15 minutes
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, newStatus }: { applicationId: number; newStatus: Application["status"] }) => {
      // This would typically update via API
      // For now, simulate the update
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application-metrics"] });
    }
  });
}

export function useAddApplicationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, note }: { applicationId: number; note: string }) => {
      // This would typically add note via API
      // For now, simulate the addition
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });
}

export function useScheduleFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      type, 
      scheduledAt,
      notes 
    }: { 
      applicationId: number; 
      type: "email" | "call" | "message"; 
      scheduledAt?: string; 
      notes?: string 
    }) => {
      // This would typically schedule via API
      // For now, simulate the scheduling
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });
}
