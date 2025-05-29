// src/components/wizard/PlacementWizard.tsx - Updated with profile fields selection
import React, { useState, useRef, useEffect } from 'react';
import { WizardStage, InsightItem, CandidateProfile, ProfileFieldsSelection } from './types';
import { EvaluationParameter } from '../../types';
import { extractKECFromJobDescription } from '../../services/wizardAiService';

// Import wizard components
import ProgressIndicator from './ProgressIndicator';
import JobCollection from './JobCollection';
import JobReview from './JobReview';
import CandidateCollection from './CandidateCollection';
import AiAssessment from './AiAssessment';
import FinalReport from './FinalReport';

const PlacementWizard: React.FC = () => {
  // Current wizard stage
  const [stage, setStage] = useState<WizardStage>('jobCollection');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Added profile fields selection state
  const [selectedProfileFields, setSelectedProfileFields] = useState<ProfileFieldsSelection>({
    stats: ['experience', 'teamSize', 'budgetManaged', 'noticePeriod'],
    text: ['title', 'education']
  });
  
  // Job input collection state
  const [clientName, setClientName] = useState('TechSaaS 200');
  const [roleTitle, setRoleTitle] = useState('Chief Product Officer');
  const [jobDescription, setJobDescription] = useState('');
  const [clientRequirements, setClientRequirements] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [jobFiles, setJobFiles] = useState<{name: string, size: number}[]>([]);
  
  // Candidate input collection state
  const [candidates, setCandidates] = useState<{
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
  
  // AI generated data
  const [kecItems, setKecItems] = useState<EvaluationParameter[]>([]);
  const [insightFlags, setInsightFlags] = useState<InsightItem[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState('');
  
  // Key insights and decision factors for final report
  const [keyInsights, setKeyInsights] = useState<{
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
  }>({
    topPerformer: {
      title: "Top Performer",
      candidate: "Sarah Mitchell",
      description: "demonstrates the strongest strategic leadership profile with 15+ years of experience and proven success scaling product teams at FinTech Solutions."
    },
    technicalEdge: {
      title: "Technical Edge",
      candidate: "Emily Chen",
      description: "offers exceptional technical depth with a PhD in Computer Science and significant expertise in AI-driven product development."
    },
    fastestOnboarding: {
      title: "Fastest Onboarding",
      candidate: "James Wilson",
      description: "has the shortest notice period (1 month) and brings valuable experience in consumer application development to complement your B2B focus."
    }
  });
  
  const [decisionFactors, setDecisionFactors] = useState<string[]>([
    "Emily excels in technical expertise while Sarah leads in strategic leadership.",
    "James can start in 1 month vs. 2-3 months for others."
  ]);
  
  // Candidate assessment data - will be populated with AI-generated values
  const [candidateAssessments, setCandidateAssessments] = useState<CandidateProfile[]>([]);
  
  // File upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const candidateFileInputRefs = useRef<{[index: number]: HTMLInputElement | null}>({});
  
  // Process job inputs with AI and move to job review stage
  const processJobInputs = async () => {
    // Validate required inputs
    if (!jobDescription) {
      setError('Please upload or enter a job description.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the AI service to extract KEC items and insights
      const result = await extractKECFromJobDescription(jobDescription);
      
      setKecItems(result.kecItems);
      setInsightFlags(result.insightFlags);
      
      // Generate executive summary
      const summary = `${clientName} is seeking an experienced ${roleTitle} to lead their product organization through a period of significant growth and international expansion. The ideal candidate will demonstrate strong strategic leadership capabilities balanced with technical expertise and a proven track record of scaling product teams.`;
      
      setExecutiveSummary(summary);
      
      // Move to job review stage
      setStage('jobReview');
    } catch (error) {
      console.error('Error processing job inputs:', error);
      setError('Failed to process job information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process candidate collection and move to AI assessment stage
  const processCandidates = () => {
    // Validate at least one candidate
    if (candidates.length === 0) {
      setError('Please add at least one candidate.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create candidate assessment profiles with defaults that will be populated in AI assessment
      const generatedAssessments: CandidateProfile[] = candidates.map(candidate => {
        // Extract experience and achievements from resume or additional info
        let experience = extractExperience(candidate.resume || candidate.additionalInfo);
        let keyAchievement = extractAchievement(candidate.resume || candidate.additionalInfo);
        
        // Sample default values for fields if not extracted
        const defaultProfile: CandidateProfile = {
          name: candidate.name,
          title: candidate.title || (candidate.name === 'Sarah Mitchell' ? 'Former CPO at FinTech Solutions' : 
                 candidate.name === 'James Wilson' ? 'VP of Product at TechInnovate' : 
                 candidate.name === 'Emily Chen' ? 'Head of Product Strategy' :
                 'Product Leader'),
          experience: candidate.experience || experience || '10+ years',
          teamSize: candidate.teamSize || '30+ people',
          budgetManaged: candidate.budgetManaged || '£10M+',
          noticePeriod: candidate.noticePeriod || '3 months',
          education: candidate.education || 'MBA, Top University',
          keyAchievement: candidate.keyAchievement || keyAchievement || 'Led significant product growth initiative',
          salary: candidate.salary || '',
          location: candidate.location || '',
          languages: candidate.languages || '',
          yearsInIndustry: candidate.yearsInIndustry || '',
          certification: candidate.certification || '',
          previousCompany: candidate.previousCompany || '',
          managementStyle: candidate.managementStyle || '',
          scores: {}
        };
        
        // Initialize empty scores for all parameters
        kecItems.forEach(kec => {
          defaultProfile.scores[kec.name] = 0;
        });
        
        // For demo purposes, add sample scores
        if (candidate.name === 'Sarah Mitchell' || candidate.name.includes('Sarah')) {
          defaultProfile.scores = {
            'Strategic Leadership': 95,
            'Technical Knowledge': 75,
            'Team Management': 90,
            'Global Experience': 80,
            'Time to Impact': 70
          };
        } else if (candidate.name === 'James Wilson' || candidate.name.includes('James')) {
          defaultProfile.scores = {
            'Strategic Leadership': 80,
            'Technical Knowledge': 90,
            'Team Management': 80,
            'Global Experience': 60,
            'Time to Impact': 95
          };
        } else if (candidate.name === 'Emily Chen' || candidate.name.includes('Emily')) {
          defaultProfile.scores = {
            'Strategic Leadership': 85,
            'Technical Knowledge': 95,
            'Team Management': 85,
            'Global Experience': 95,
            'Time to Impact': 80
          };
        } else {
          // For any other candidate, generate random scores between 70-95
          kecItems.forEach(kec => {
            defaultProfile.scores[kec.name] = Math.floor(Math.random() * 25) + 70;
          });
        }
        
        return defaultProfile;
      });
      
      setCandidateAssessments(generatedAssessments);
      
      // Move to AI assessment stage
      setStage('aiAssessment');
    } catch (error) {
      console.error('Error processing candidates:', error);
      setError('Failed to process candidate information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Extract experience from text
  const extractExperience = (text: string): string => {
    // Simple pattern matching for experience mentions
    const experiencePatterns = [
      /(\d+)\s*(?:\+)?\s*years?\s+(?:of\s+)?experience/i,
      /experience\s*(?:of|:)?\s*(\d+)\s*(?:\+)?\s*years?/i,
      /(\d+)\s*(?:\+)?\s*years?\s+in\s+(?:the\s+)?industry/i
    ];
    
    for (const pattern of experiencePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return `${match[1]}+ years`;
      }
    }
    
    // Default if no pattern matches
    return '';
  };
  
  // Extract key achievement from text
  const extractAchievement = (text: string): string => {
    // Simple pattern matching for achievement mentions
    const achievementPatterns = [
      /led\s+([^.]+)/i,
      /achieved\s+([^.]+)/i,
      /increased\s+([^.]+)/i,
      /improved\s+([^.]+)/i,
      /launched\s+([^.]+)/i,
      /created\s+([^.]+)/i
    ];
    
    for (const pattern of achievementPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        // Make sure it's not too long
        const achievement = match[1].trim();
        return achievement.length > 100 ? achievement.substring(0, 100) + '...' : achievement;
      }
    }
    
    // Default if no pattern matches
    return '';
  };
  
  // Generate final report and move to final report stage
  const generateFinalReport = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would finalize report data by calling an API
      
      // Add weights to parameters if not already set
      const weightedParams = kecItems.map((param, index) => {
        if (!param.weight) {
          // Assign weights based on requirement level or default to 20%
          let weight = 20;
          if (param.requirementLevel >= 90) weight = 25;
          else if (param.requirementLevel >= 85) weight = 22;
          else if (param.requirementLevel >= 80) weight = 20;
          else if (param.requirementLevel >= 75) weight = 18;
          else weight = 15;
          
          return { ...param, weight };
        }
        return param;
      });
      
      setKecItems(weightedParams);
      
      // Move to final report stage
      setStage('finalReport');
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate final report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the appropriate component based on current stage
  const renderStageContent = () => {
    switch (stage) {
      case 'jobCollection':
        return (
          <JobCollection
            onPrevious={() => {}} // No previous step
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
            onNext={() => setStage('candidateCollection')}
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
            onNext={generateFinalReport}
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
          />
        );
      case 'finalReport':
        return (
          <FinalReport
            onPrevious={() => setStage('aiAssessment')}
            onNext={() => {}} // No next step
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Placement Report Builder</h1>
      
      {/* Progress Indicator */}
      <ProgressIndicator currentStage={stage} />
      
      {/* Error display */}
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
      
      {/* Stage content */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
};

export default PlacementWizard;