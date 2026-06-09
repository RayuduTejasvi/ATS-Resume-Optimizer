export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  subscriptionPlan: "free" | "pro";
  resumesUsed?: number;
  coverLettersUsed?: number;
  createdAt?: string;
}

export interface ResumeListItem {
  _id: string;
  originalName: string;
  fileName: string;
  fileType: string;
  atsScore?: number;
  isOptimized?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience?: Array<{
    company?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }>;
  skills?: string[];
  certifications?: string[];
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    url?: string;
  }>;
  languages?: string[];
  links?: string[];
}

export interface ATSScore {
  overallScore: number;
  subscores: {
    keywordMatch: number;
    skillsMatch: number;
    experienceRelevance: number;
    educationMatch: number;
    formattingScore: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  gapAnalysis: string[];
}

export interface DashboardData {
  user: User;
  analytics: {
    totalResumes: number;
    totalOptimizations: number;
    totalCoverLetters: number;
    avgAtsScore: number;
    bestAtsScore: number;
  };
  recentResumes: ResumeListItem[];
  recentCoverLetters: Array<{ companyName?: string; jobTitle?: string; createdAt: string }>;
  subscription: { plan: string; status: string };
}
