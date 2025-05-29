// src/components/wizard/SupabasePlacementWizard.tsx - Updated with loading screen
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WizardStage, InsightItem, CandidateProfile, KeyInsights, ProfileFieldsSelection } from './types';
import { EvaluationParameter } from '../../types';

// Import wizard components
import ProgressIndicator from './ProgressIndicator';
import JobCollection from './JobCollection';
import JobReview from './JobReview';
import CandidateCollection from './CandidateCollection';
import AiAssessment from './AiAssessment';
import FinalReport from './FinalReport';
import AiProcessingLoader from './LoadingScreen'; // Import loading screen

// Import Supabase services
import { 
  createJob, 
  getJob, 
  updateJob, 
  createCandidate, 
  listCandidates,
  updateCandidate,
  createReport,
  getReport,
  updateReport,
  convertJobDataToAppFormat,
  convertCandidateDataToAppFormat
} from '../../services/supabaseService';

// Import AI services
import { extractKECWithGPT, evaluateCandidateWithGPT, generateExecutiveSummaryWithGPT, generateKeyInsightsWithGPT } from '../../services/enhancedAiService';

const SupabasePlacementWizard: React.FC = () => {
  const navigate = useNavigate();
  const { jobId, reportId } = useParams<{ jobId?: string, reportId?: string }>();
  
  // Current wizard stage
  const [stage, setStage] = useState<WizardStage>('jobCollection');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add loading screen states
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'job-analysis' | 'candidate-evaluation'>('job-analysis');
  
  // ... rest of existing state variables remain the same ...
  const [selectedProfileFields, setSelectedProfileFields] = useState<ProfileFieldsSelection>({
    stats: ['experience', 'teamSize', 'budgetManaged', 'noticePeriod'],
    text: ['title', 'education']
  });
  
  const [currentJobId, setCurrentJobId] = useState<string | null>(jobId || null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(reportId || null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  const [clientName, setClientName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [clientRequirements, setClientRequirements] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [jobFiles, setJobFiles] = useState<{name: string, size: number}[]>([]);
  
  const [candidates, setCandidates] = useState<{
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
  }[]>([
    {
      name: 'Candidate 1',
      resume: '',
      recruiterNotes: '',
      meetingNotes: '',
      additionalInfo: '',
      files: [],
      title: '',
      experience: '',
      teamSize: '',
      budgetManaged: '',
      noticePeriod: '',
      education: '',
      keyAchievement: ''
    }
  ]);
  
  const [kecItems, setKecItems] = useState<EvaluationParameter[]>([]);
  const [insightFlags, setInsightFlags] = useState<InsightItem[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [kecDescription, setKecDescription] = useState('');
  
  const [keyInsights, setKeyInsights] = useState<KeyInsights | null>(null);
  const [decisionFactors, setDecisionFactors] = useState<string[]>([]);
  
  const [candidateAssessments, setCandidateAssessments] = useState<CandidateProfile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const candidateFileInputRefs = useRef<{[index: number]: HTMLInputElement | null}>({});
  
  // ... existing useEffect for loading data remains the same ...
  
  // Process job inputs with AI and move to job review stage - UPDATED WITH LOADING SCREEN
  const processJobInputs = async () => {
    if (!clientName) {
      setError('Please enter a client name.');
      return;
    }
    
    if (!roleTitle) {
      setError('Please enter a role title.');
      return;
    }
    
    if (!jobDescription) {
      setError('Please upload or enter a job description.');
      return;
    }
    
    setShowLoadingScreen(true);
    setLoadingStage('job-analysis');
    setError(null);
    
    try {
      // Create or update job in Supabase
      let jobData;
      
      if (currentJobId) {
        jobData = await updateJob(currentJobId, {
          clientName,
          roleTitle,
          jobDescription,
          clientRequirements,
          meetingNotes,
          recruiterNotes,
          additionalNotes
        });
      } else {
        jobData = await createJob({
          clientName,
          roleTitle,
          jobDescription,
          clientRequirements,
          meetingNotes,
          recruiterNotes,
          additionalNotes
        });
        
        setCurrentJobId(jobData.id);
      }
      
      // Call the AI service to extract KEC items and insights
      const result = await extractKECWithGPT(
        jobDescription,
        clientRequirements,
        meetingNotes,
        recruiterNotes,
        additionalNotes
      );
      
      setKecItems(result.kecItems);
      setInsightFlags(result.insightFlags);
      setExecutiveSummary(result.executiveSummary || '');
      setKecDescription(result.kecDescription || '');
      
      // Update job with AI analysis results
      await updateJob(jobData.id, {
        kecItems: JSON.stringify(result.kecItems),
        insightFlags: JSON.stringify(result.insightFlags)
      });
      
      // Hide loading screen and move to job review stage
      setShowLoadingScreen(false);
      setStage('jobReview');
    } catch (error) {
      console.error('Error processing job inputs:', error);
      setError('Failed to process job information. Please try again.');
      setShowLoadingScreen(false);
    }
  };
  
  // Process candidate collection - UPDATED WITH LOADING SCREEN
  const processCandidates = async () => {
    if (!currentJobId) {
      setError('Job data not found. Please start from the beginning.');
      return;
    }
    
    if (candidates.length === 0) {
      setError('Please add at least one candidate.');
      return;
    }
    
    const invalidCandidates = candidates.filter(c => !c.name.trim());
    if (invalidCandidates.length > 0) {
      setError('All candidates must have names.');
      return;
    }
    
    setShowLoadingScreen(true);
    setLoadingStage('candidate-evaluation');
    setError(null);
    
    try {
      // Create or update candidates in Supabase
      const candidatePromises = candidates.map(async (candidate) => {
        if (candidate.id) {
          const updatedCandidate = await updateCandidate(candidate.id, {
            name: candidate.name,
            resume: candidate.resume,
            recruiterNotes: candidate.recruiterNotes,
            meetingNotes: candidate.meetingNotes,
            additionalInfo: candidate.additionalInfo
          });
          return updatedCandidate;
        } else {
          const newCandidate = await createCandidate({
            jobId: currentJobId,
            name: candidate.name,
            resume: candidate.resume,
            recruiterNotes: candidate.recruiterNotes,
            meetingNotes: candidate.meetingNotes,
            additionalInfo: candidate.additionalInfo
          });
          return newCandidate;
        }
      });
      
      const savedCandidates = await Promise.all(candidatePromises);
      
      // Process each candidate with AI
      const assessmentPromises = savedCandidates.map(async (candidate, index) => {
        try {
          const candidateWithProfile = candidates[index];
          
          const candidateInfo = `
            Resume: ${candidate.resume}
            Recruiter Notes: ${candidate.recruiter_notes || ''}
            Meeting Notes: ${candidate.meeting_notes || ''}
            Additional Info: ${candidate.additional_info || ''}
          `;
          
          const profileData = {
            name: candidate.name,
            selectedProfileFields: selectedProfileFields
          };
          
          const evaluation = await evaluateCandidateWithGPT(candidate.name, candidateInfo, kecItems, profileData);

          if (!evaluation || !evaluation.evaluationScores || !Array.isArray(evaluation.evaluationScores)) {
            throw new Error(`AI evaluation failed for candidate ${candidate.name}: Invalid response structure`);
          }

          if (!evaluation.profileFields || typeof evaluation.profileFields !== 'object') {
            throw new Error(`AI evaluation failed for candidate ${candidate.name}: Missing profile fields`);
          }

          const profile: CandidateProfile = {
            id: candidate.id,
            name: candidate.name,
            ...evaluation.profileFields,
            overallAssessment: evaluation.overallAssessment || '',
            scores: {}
          };

          evaluation.evaluationScores.forEach(score => {
            profile.scores[score.parameterName] = score.score;
          });

          await updateCandidate(candidate.id, {
            aiEvaluation: JSON.stringify({
              evaluation,
              selectedProfileFields: selectedProfileFields,
              ...profile
            })
          });

          return profile;
        } catch (error) {
          console.error(`Error evaluating candidate ${candidate.name}:`, error);
          throw error;
        }
      });
      
      const candidateProfiles = await Promise.all(assessmentPromises);
      setCandidateAssessments(candidateProfiles);
      
      // Generate AI key insights
      if (candidateProfiles.length > 0) {
        try {
          const insightsResult = await generateKeyInsightsWithGPT(
            candidateProfiles.map(p => ({
              candidateName: p.name,
              overallAssessment: p.overallAssessment || '',
              scores: p.scores
            })),
            kecItems
          );
          
          setKeyInsights(insightsResult.keyInsights);
          setDecisionFactors(insightsResult.decisionFactors);
        } catch (error) {
          console.error('Error generating key insights:', error);
        }
      }
      
      // Hide loading screen and move to AI assessment stage
      setShowLoadingScreen(false);
      setStage('aiAssessment');
    } catch (error) {
      console.error('Error processing candidates:', error);
      setError('Failed to process candidate information. Please try again.');
      setShowLoadingScreen(false);
    }
  };
  
  // ... rest of existing methods remain the same ...
  
  // Show loading screen if active
  if (showLoadingScreen) {
    return (
      <AiProcessingLoader 
        stage={loadingStage}
        onComplete={() => setShowLoadingScreen(false)}
        duration={30000} // 30 seconds
      />
    );
  }
  
  // ... rest of existing render logic remains the same ...
  
  // Save job review and move to candidate collection stage
  const saveJobReview = async () => {
    if (!currentJobId) {
      setError('Job data not found. Please start from the beginning.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateJob(currentJobId, {
        kecItems: JSON.stringify(kecItems),
        insightFlags: JSON.stringify(insightFlags)
      });
      
      setStage('candidateCollection');
    } catch (error) {
      console.error('Error saving job review:', error);
      setError('Failed to save job review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save AI assessment and move to final report stage
  const saveAiAssessment = async () => {
    if (!currentJobId) {
      setError('Job data not found. Please start from the beginning.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const savePromises = candidateAssessments.map(async (assessment) => {
        if (assessment.id) {
          const updatedData = {
            aiEvaluation: JSON.stringify({
              evaluation: {
                candidateName: assessment.name,
                overallAssessment: assessment.overallAssessment || '',
                evaluationScores: Object.entries(assessment.scores).map(([paramName, score]) => ({
                  parameterName: paramName,
                  score: score,
                  assessment: [],
                  justification: `Based on the candidate's experience and demonstrated capabilities.`,
                  strengths: ["Strong capabilities demonstrated through experience"],
                  limitations: ["Could benefit from additional development in specific areas"]
                }))
              },
              selectedProfileFields: selectedProfileFields,
              ...assessment
            })
          };
          
          await updateCandidate(assessment.id, updatedData);
        }
      });
      
      await Promise.all(savePromises);
      
      let summary = executiveSummary;
      
      try {
        const evalFormat = candidateAssessments.map(c => ({
          candidateName: c.name,
          overallAssessment: c.overallAssessment || '',
          evaluationScores: Object.entries(c.scores).map(([paramName, score]) => ({
            parameterName: paramName,
            score: score,
            assessment: [],
            justification: '',
            strengths: [],
            limitations: []
          }))
        }));
        
        summary = await generateExecutiveSummaryWithGPT(
          clientName,
          roleTitle,
          evalFormat,
          keyInsights
        );
      } catch (e) {
        console.warn('Could not generate enhanced executive summary', e);
      }
      
      if (currentReportId) {
        await updateReport(currentReportId, {
          executiveSummary: summary,
          reportData: JSON.stringify({
            keyInsights,
            decisionFactors,
            selectedProfileFields
          })
        });
      } else {
        const reportReference = `AP-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`;
        const reportData = await createReport({
          jobId: currentJobId,
          reportReference,
          executiveSummary: summary,
          reportData: JSON.stringify({
            keyInsights,
            decisionFactors,
            selectedProfileFields
          })
        });
        
        setCurrentReportId(reportData.id);
      }
      
      setStage('finalReport');
    } catch (error) {
      console.error('Error saving AI assessment:', error);
      setError('Failed to save assessment data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate final report and navigate to dashboard
  const finishReport = async () => {
    if (!currentJobId || !currentReportId) {
      setError('Report data not found. Please start from the beginning.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateReport(currentReportId, {
        status: 'complete',
        reportData: JSON.stringify({
          keyInsights,
          decisionFactors,
          selectedProfileFields
        })
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error finalizing report:', error);
      setError('Failed to finalize report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStageContent = () => {
    switch (stage) {
      case 'jobCollection':
        return (
          <JobCollection
            onPrevious={() => navigate('/dashboard')}
            onNext={processJobInputs}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
            clientName={clientName}
            setClientName={setClientName}
            roleTitle={roleTitle}
            setRoleTitle={setRoleTitle}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            clientRequirements={clientRequirements}
            setClientRequirements={setClientRequirements}
            meetingNotes={meetingNotes}
            setMeetingNotes={setMeetingNotes}
            recruiterNotes={recruiterNotes}
            setRecruiterNotes={setRecruiterNotes}
            additionalNotes={additionalNotes}
            setAdditionalNotes={setAdditionalNotes}
            jobFiles={jobFiles}
            setJobFiles={setJobFiles}
            fileInputRef={fileInputRef}
          />
        );
      case 'jobReview':
        return (
          <JobReview
            onPrevious={() => setStage('jobCollection')}
            onNext={saveJobReview}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
            kecItems={kecItems}
            setKecItems={setKecItems}
            insightFlags={insightFlags}
            setInsightFlags={setInsightFlags}
            executiveSummary={executiveSummary}
            setExecutiveSummary={setExecutiveSummary}
          />
        );
      case 'candidateCollection':
        return (
          <CandidateCollection
            onPrevious={() => setStage('jobReview')}
            onNext={processCandidates}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
            candidates={candidates}
            setCandidates={setCandidates}
            candidateFileInputRefs={candidateFileInputRefs}
            selectedProfileFields={selectedProfileFields}
            setSelectedProfileFields={setSelectedProfileFields}
          />
        );
      case 'aiAssessment':
        return (
          <AiAssessment
            onPrevious={() => setStage('candidateCollection')}
            onNext={saveAiAssessment}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
            kecItems={kecItems}
            candidateAssessments={candidateAssessments}
            setCandidateAssessments={setCandidateAssessments}
            keyInsights={keyInsights}
            setKeyInsights={setKeyInsights}
            decisionFactors={decisionFactors}
            setDecisionFactors={setDecisionFactors}
            selectedProfileFields={selectedProfileFields}
          />
        );
      case 'finalReport':
        return (
          <FinalReport
            onPrevious={() => setStage('aiAssessment')}
            onNext={finishReport}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
            clientName={clientName}
            roleTitle={roleTitle}
            candidateAssessments={candidateAssessments}
            kecItems={kecItems}
            keyInsights={keyInsights}
            decisionFactors={decisionFactors}
            selectedProfileFields={selectedProfileFields}
          />
        );
      default:
        return <div>Unknown stage</div>;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Assessment Report' : 'New Assessment Report'}
      </h1>
      
      <ProgressIndicator currentStage={stage} />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
};

export default SupabasePlacementWizard;