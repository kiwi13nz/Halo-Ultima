// src/components/PublicReport.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Loader2, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { getReport, getJob, listCandidates } from '../services/supabaseService';
import { ExportPDFButton } from './ExportPDFButton';
import { AssessmentDetail } from './AssessmentDetail';
import { EvaluationParameter, CandidateEvaluation } from '../types';

function PublicReport() {
  const { shareToken } = useParams<{ shareToken: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [shareUrlCopied, setShareUrlCopied] = useState(false);
  
  // Report data
  const [reportReference, setReportReference] = useState<string>('');
  const [executiveSummary, setExecutiveSummary] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [evaluationParameters, setEvaluationParameters] = useState<EvaluationParameter[]>([]);
  const [candidates, setCandidates] = useState<Record<string, any>>({});
  const [keyInsights, setKeyInsights] = useState<any>(null);
  const [decisionFactors, setDecisionFactors] = useState<string[]>([]);
  
  // Get current share URL
  const shareUrl = window.location.href;
  
  // Copy share URL to clipboard
  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareUrlCopied(true);
      setTimeout(() => setShareUrlCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };
  
  // Fetch report data using share token
  useEffect(() => {
    const fetchPublicReport = async () => {
      if (!shareToken) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, you would have a separate API endpoint
        // that doesn't require authentication and uses the share token
        // For now, we'll simulate this by decoding the token as a report ID
        
        // The share token could be a JWT or encrypted ID that contains the report ID
        // For this example, we'll assume it's base64 encoded report ID
        let reportId: string;
        try {
          reportId = atob(shareToken);
        } catch (e) {
          throw new Error('Invalid share token format');
        }
        
        // Get the report (this would need to be a public endpoint)
        const reportData = await getReport(reportId);
        if (!reportData) {
          throw new Error('Report not found or no longer available');
        }
        
        setReportReference(reportData.report_reference);
        setExecutiveSummary(reportData.executive_summary || '');
        
        // Extract additional data from report_data if available
        if (reportData.report_data) {
          try {
            const parsedData = JSON.parse(reportData.report_data);
            if (parsedData.keyInsights) setKeyInsights(parsedData.keyInsights);
            if (parsedData.decisionFactors) setDecisionFactors(parsedData.decisionFactors);
          } catch (e) {
            console.warn('Could not parse report data', e);
          }
        }
        
        // Get the job data
        const jobData = await getJob(reportData.job_id);
        if (!jobData) {
          throw new Error('Job data not found');
        }
        
        setClientName(jobData.client_name);
        setRoleTitle(jobData.role_title);
        setJobDescription(jobData.job_description);
        
        // Parse evaluation parameters
        const evaluationParams = jobData.kec_items 
          ? JSON.parse(jobData.kec_items) 
          : [];
        setEvaluationParameters(evaluationParams);
        
        // Get all candidates for this job
        const candidatesList = await listCandidates(reportData.job_id);
        if (!candidatesList || candidatesList.length === 0) {
          throw new Error('No candidates found for this assessment');
        }
        
        // Process candidate data
        const formattedCandidates: Record<string, any> = {};
        const candidateColors = [
          "var(--sarah)", 
          "var(--james)", 
          "var(--emily)"
        ];
        
        candidatesList.forEach((candidate, index) => {
          if (!candidate.ai_evaluation) return;
          
          try {
            const evaluation = JSON.parse(candidate.ai_evaluation);
            formattedCandidates[candidate.name] = {
              candidateInfo: `${candidate.name} ${evaluation.title ? `(${evaluation.title})` : ''} has ${evaluation.experience || 'extensive'} experience.`,
              evaluation: evaluation.evaluation || null,
              color: candidateColors[index % candidateColors.length]
            };
          } catch (e) {
            console.warn(`Could not parse evaluation for ${candidate.name}`, e);
          }
        });
        
        setCandidates(formattedCandidates);
        
        if (Object.keys(formattedCandidates).length === 0) {
          throw new Error('No candidate evaluations found for this assessment');
        }
        
      } catch (error) {
        console.error('Error fetching public report:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPublicReport();
  }, [shareToken]);
  
  const handleCandidateSelect = (candidateName: string) => {
    setSelectedCandidate(selectedCandidate === candidateName ? null : candidateName);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#4A6460] mb-4 animate-spin" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Loading assessment report...</h2>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-[#4A6460] mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Unable to Load Report</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <p className="text-sm text-gray-500 text-center max-w-md">
          This report may have been removed or the link may have expired. 
          Please contact the person who shared this link for assistance.
        </p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="halo-header shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-[#E7D0C5]" />
              <h1 className="ml-3 text-2xl font-semibold text-white">Halo Executive Search</h1>
            </div>
            
            {/* Share functionality */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-[#E7D0C5]" />
                <span className="text-[#E7D0C5] text-sm">Public Report</span>
              </div>
              
              <button
                onClick={copyShareUrl}
                className="inline-flex items-center px-3 py-2 border border-[#E7D0C5] rounded-md shadow-sm text-sm font-medium text-[#E7D0C5] hover:bg-[#5A746F] transition-colors"
              >
                {shareUrlCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Report Content - Same as regular report but with public styling */}
      <div className="hr-container">
        {/* Report Header */}
        <div className="report-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">HALO EXECUTIVE SEARCH</div>
              <h1 className="report-title">{roleTitle} Assessment</h1>
              <div className="client-name">Prepared for: {clientName}</div>
            </div>
            <div className="header-right">
              <div className="date">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="reference">Ref: {reportReference}</div>
            </div>
          </div>
        </div>
        
        {/* Executive Summary */}
        <div className="executive-summary">
          <div className="summary-title">
            <div className="summary-icon">📊</div>
            <h2>Executive Summary</h2>
          </div>
          
          <p>{executiveSummary || 
            `Following an extensive search and assessment process, we present our analysis of ${Object.keys(candidates).length} candidates for the ${roleTitle} position at ${clientName}. Each candidate brings unique strengths that align with your organizational needs.`}
          </p>
          
          {/* Key insights cards */}
          {keyInsights && (
            <div className="key-insights">
              <div className="insight-card">
                <h4>
                  <span className="insight-emoji">🏆</span>
                  {keyInsights.topPerformer?.title || "Top Performer"}
                </h4>
                <p>
                  {keyInsights.topPerformer?.candidate || Object.keys(candidates)[0] || "Top candidate"} {keyInsights.topPerformer?.description || "demonstrates the strongest overall profile with extensive experience and proven success."}
                </p>
              </div>
              
              <div className="insight-card">
                <h4>
                  <span className="insight-emoji">💻</span>
                  {keyInsights.technicalEdge?.title || "Technical Edge"}
                </h4>
                <p>
                  {keyInsights.technicalEdge?.candidate || Object.keys(candidates)[1] || "Second candidate"} {keyInsights.technicalEdge?.description || "offers exceptional technical depth with strong educational background and significant expertise."}
                </p>
              </div>
              
              <div className="insight-card">
                <h4>
                  <span className="insight-emoji">⏱️</span>
                  {keyInsights.fastestOnboarding?.title || "Fastest Onboarding"}
                </h4>
                <p>
                  {keyInsights.fastestOnboarding?.candidate || Object.keys(candidates)[2] || "Third candidate"} {keyInsights.fastestOnboarding?.description || "has the shortest notice period and brings valuable experience that can be quickly applied."}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Rest of the report content would follow the same structure as the regular Report component */}
        {/* For brevity, I'm including the key sections */}
        
        {/* Detailed Assessment Analysis */}
        <div className="hr-card">
          <h2 className="hr-title">Detailed Assessment Analysis</h2>
          <p className="mb-4">Select a candidate to view detailed AI evaluation for each parameter.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(candidates)
              .filter(([_, data]) => data.evaluation !== null)
              .map(([name, data]) => (
                <button
                  key={name}
                  onClick={() => handleCandidateSelect(name)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedCandidate === name 
                      ? 'border-[#4A6460] bg-[#E7D0C5]/10' 
                      : 'border-gray-200 hover:border-[#4A6460]/50'
                  }`}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <h3 className="font-medium">{name}</h3>
                  </div>
                </button>
              ))
            }
          </div>
          
          {selectedCandidate && candidates[selectedCandidate]?.evaluation && (
            <AssessmentDetail 
              candidate={candidates[selectedCandidate].evaluation}
              parameters={evaluationParameters}
              color={candidates[selectedCandidate].color}
            />
          )}
        </div>
        
        {/* Export controls */}
        <div className="flex justify-center mt-8">
          <ExportPDFButton
            clientName={clientName}
            reportReference={reportReference}
            jobDescription={jobDescription}
            evaluationParameters={evaluationParameters}
            candidates={Object.fromEntries(
              Object.entries(candidates)
                .filter(([_, data]) => data.evaluation !== null)
                .map(([name, data]) => [name, data.evaluation])
            )}
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="report-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white">
            © {new Date().getFullYear()} Halo Executive Search. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicReport;