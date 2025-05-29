export interface FileUploadResponse {
  status: 'success' | 'error';
  message: string;
}

export interface AssessmentQuestion {
  question: string;
  rationale: string;
  idealAnswer: string;
}

export interface QuestionAssessment {
  question: string;
  answer: string;
  evidence: string;
}

export interface EvaluationParameter {
  name: string;
  description: string;
  requirementLevel: number;
  icon: string;
  assessmentQuestions: AssessmentQuestion[];
}

export interface ParameterScore {
  parameterName: string;
  score: number;
  assessment: QuestionAssessment[];
  justification: string;
  strengths: string[];
  limitations: string[];
}

export interface CandidateEvaluation {
  candidateName: string;
  overallAssessment: string;
  evaluationScores: ParameterScore[];
}

export interface CandidateData {
  candidateInfo: string;
  evaluation: CandidateEvaluation | null;
  color: string;
}

export interface ComparisonData {
  jobDescription: string;
  evaluationParameters: EvaluationParameter[];
  candidates: Record<string, CandidateData>;
}

export type ProcessingStage = 
  | 'upload_doc'       // Initial stage, uploading Notion document
  | 'processing_doc'   // Processing the Notion document
  | 'analyzing_job'    // Analyzing job requirements
  | 'evaluating_candidates' // Evaluating candidates
  | 'viewing_results'  // Viewing comparison results

export interface DocumentInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
  content: string;
}

export interface CandidateData {
  name: string;
  title: string;
  experience: string;
  teamSize: string;
  budgetManaged: string;
  noticePeriod: string;
  education: string;
  keyAchievement: string;
  additionalInfo: string;
  uploadedFiles: UploadedDocument[];
}

export interface UploadedDocument {
  file: File;
  content: string;
  isProcessing: boolean;
}