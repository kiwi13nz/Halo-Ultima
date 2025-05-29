// src/components/wizard/types.ts - Updated with dynamic profile fields

import { EvaluationParameter } from '../../types';

// Wizard stages
export type WizardStage = 'jobCollection' | 'jobReview' | 'candidateCollection' | 'aiAssessment' | 'finalReport';

// Types for insights
export interface InsightItem {
  title: string;
  emoji: string;
  description: string;
  type: 'insight' | 'coreNeed';
}

// Profile fields selection
export interface ProfileFieldsSelection {
  stats: string[];
  text: string[];
}

// Types for candidate profiles - now flexible for dynamic fields
export interface CandidateProfile {
  id?: string;
  name: string;
  // All profile fields are optional since they're dynamic
  title?: string;
  experience?: string;
  teamSize?: string;
  budgetManaged?: string;
  noticePeriod?: string;
  education?: string;
  keyAchievement?: string;
  salary?: string;
  location?: string;
  languages?: string;
  yearsInIndustry?: string;
  certification?: string;
  previousCompany?: string;
  managementStyle?: string;
  scores: Record<string, number>; // Scores set by AI
  overallAssessment?: string;     // Overall assessment paragraph
  // Index signature for any additional dynamic fields
  [key: string]: any;
}

// Key insights for final report
export interface KeyInsights {
  topPerformer: {
    title: string;
    candidate: string;
    description: string;
  };
  technicalEdge: {
    title: string;
    candidate: string;
    description: string;
  };
  fastestOnboarding: {
    title: string;
    candidate: string;
    description: string;
  };
}

// Props for each wizard step component
export interface WizardStepProps {
  onPrevious: () => void;
  onNext: (...args: any[]) => void;
  isLoading: boolean;
  setIsLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
}

// Props for job collection step
export interface JobCollectionProps extends WizardStepProps {
  clientName: string;
  setClientName: (name: string) => void;
  roleTitle: string;
  setRoleTitle: (title: string) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  clientRequirements: string;
  setClientRequirements: (requirements: string) => void;
  meetingNotes: string;
  setMeetingNotes: (notes: string) => void;
  recruiterNotes: string;
  setRecruiterNotes: (notes: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (notes: string) => void;
  jobFiles: {name: string, size: number}[];
  setJobFiles: (files: {name: string, size: number}[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

// Props for job review step
export interface JobReviewProps extends WizardStepProps {
  executiveSummary: string;
  setExecutiveSummary: (summary: string) => void;
  kecItems: EvaluationParameter[];
  setKecItems: (items: EvaluationParameter[]) => void;
  insightFlags: InsightItem[];
  setInsightFlags: (flags: InsightItem[]) => void;
}

// Props for candidate collection step
export interface CandidateCollectionProps extends WizardStepProps {
  candidates: {
    id?: string;
    name: string;
    resume: string;
    recruiterNotes: string;
    meetingNotes: string;
    additionalInfo: string;
    files: {name: string, size: number}[];
    title?: string;
    experience?: string;
    teamSize?: string;
    budgetManaged?: string;
    noticePeriod?: string;
    education?: string;
    keyAchievement?: string;
    salary?: string;
    location?: string;
    languages?: string;
    yearsInIndustry?: string;
    certification?: string;
    previousCompany?: string;
    managementStyle?: string;
  }[];
  setCandidates: React.Dispatch<React.SetStateAction<{
    id?: string;
    name: string;
    resume: string;
    recruiterNotes: string;
    meetingNotes: string;
    additionalInfo: string;
    files: {name: string, size: number}[];
    title?: string;
    experience?: string;
    teamSize?: string;
    budgetManaged?: string;
    noticePeriod?: string;
    education?: string;
    keyAchievement?: string;
    salary?: string;
    location?: string;
    languages?: string;
    yearsInIndustry?: string;
    certification?: string;
    previousCompany?: string;
    managementStyle?: string;
  }[]>>;
  candidateFileInputRefs: React.MutableRefObject<{
    [index: number]: HTMLInputElement | null;
  }>;
  selectedProfileFields?: ProfileFieldsSelection;
  setSelectedProfileFields: React.Dispatch<React.SetStateAction<ProfileFieldsSelection>>;
}

// Props for AI assessment step
export interface AiAssessmentProps extends WizardStepProps {
  kecItems: EvaluationParameter[];
  candidateAssessments: CandidateProfile[];
  setCandidateAssessments: React.Dispatch<React.SetStateAction<CandidateProfile[]>>;
  keyInsights?: KeyInsights;
  setKeyInsights?: React.Dispatch<React.SetStateAction<KeyInsights>>;
  decisionFactors?: string[];
  setDecisionFactors?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProfileFields?: ProfileFieldsSelection;
}

// Props for final report step
export interface FinalReportProps extends WizardStepProps {
  clientName: string;
  roleTitle: string;
  candidateAssessments: CandidateProfile[];
  kecItems: EvaluationParameter[];
  keyInsights?: KeyInsights;
  decisionFactors?: string[];
  selectedProfileFields?: ProfileFieldsSelection;
}