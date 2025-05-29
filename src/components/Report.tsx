import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getReport, getJob, listCandidates } from '../services/supabaseService';
import { ExportPDFButton } from './ExportPDFButton';
import { UnderstandingSection } from './UnderstandingSection';
import { SkillsComparisonExact } from './SkillsComparisonExact';
import { GapAnalysis } from './GapAnalysis';
import { StrengthWeaknessComparison } from './StrengthWeaknessComparison';
import { AssessmentDetail } from './AssessmentDetail';
import { EvaluationParameter, CandidateEvaluation } from '../types';

function Report() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  
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
  
  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Get the report
        const reportData = await getReport(reportId);
        if (!reportData) {
          throw new Error('Report not found');
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
        
        // 2. Get the job data
        const jobData = await getJob(reportData.job_id);
        if (!jobData) {
          throw new Error('Job data not found');
        }
        
        setClientName(jobData.client_name);
        setRoleTitle(jobData.role_title);
        setJobDescription(jobData.job_description);
        
        // 3. Parse evaluation parameters (KEC items)
        const evaluationParams = jobData.kec_items 
          ? JSON.parse(jobData.kec_items) 
          : [];
        setEvaluationParameters(evaluationParams);
        
        // 4. Get all candidates for this job
        const candidatesList = await listCandidates(reportData.job_id);
        if (!candidatesList || candidatesList.length === 0) {
          throw new Error('No candidates found for this assessment');
        }
        
        // 5. Process candidate data into the format needed for visualization
        const formattedCandidates: Record<string, any> = {};
        
        // Define candidate colors
        const candidateColors = [
          "var(--sarah)", // Navy for first candidate
          "var(--james)", // Gold for second candidate
          "var(--emily)"  // Purple for third candidate
        ];
        
        candidatesList.forEach((candidate, index) => {
          // Skip candidates without AI evaluation
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
        
        // If no candidates with evaluations were found, show error
        if (Object.keys(formattedCandidates).length === 0) {
          throw new Error('No candidate evaluations found for this assessment');
        }
        
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportData();
  }, [reportId]);
  
  const handleCandidateSelect = (candidateName: string) => {
    setSelectedCandidate(selectedCandidate === candidateName ? null : candidateName);
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-pink-600 mb-4 animate-spin" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Loading assessment report...</h2>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-pink-600 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Report</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={handleBackToDashboard}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-pink-600" />
              <h1 className="ml-3 text-2xl font-medium text-gray-900">Albany Partners</h1>
            </div>
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <div className="hr-container">
        {/* Report Header */}
        <div className="report-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">ALBANY PARTNERS</div>
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
          <div className="key-insights">
            <div className="insight-card">
              <h4>
                <span className="insight-emoji">🏆</span>
                {keyInsights?.topPerformer?.title || "Top Performer"}
              </h4>
              <p>
                {keyInsights?.topPerformer?.candidate || Object.keys(candidates)[0] || "Top candidate"} {keyInsights?.topPerformer?.description || "demonstrates the strongest overall profile with extensive experience and proven success."}
              </p>
            </div>
            
            <div className="insight-card">
              <h4>
                <span className="insight-emoji">💻</span>
                {keyInsights?.technicalEdge?.title || "Technical Edge"}
              </h4>
              <p>
                {keyInsights?.technicalEdge?.candidate || Object.keys(candidates)[1] || "Second candidate"} {keyInsights?.technicalEdge?.description || "offers exceptional technical depth with strong educational background and significant expertise."}
              </p>
            </div>
            
            <div className="insight-card">
              <h4>
                <span className="insight-emoji">⏱️</span>
                {keyInsights?.fastestOnboarding?.title || "Fastest Onboarding"}
              </h4>
              <p>
                {keyInsights?.fastestOnboarding?.candidate || Object.keys(candidates)[2] || "Third candidate"} {keyInsights?.fastestOnboarding?.description || "has the shortest notice period and brings valuable experience that can be quickly applied."}
              </p>
            </div>
          </div>
        </div>
        
        {/* Client Requirements */}
        <div className="client-requirements">
          <div className="requirements-title">
            <div className="requirements-icon">📋</div>
            <h2>Key Evaluation Criteria (KEC)</h2>
          </div>
          
          <p>{clientName} is seeking a strategic {roleTitle} to lead their organization through a period of significant growth and development.</p>
          
          <ul className="requirements-list">
            {evaluationParameters.map((param, index) => (
              <li key={index}>{param.description}</li>
            ))}
          </ul>
          
          {/* Understanding Requirements */}
          <div className="understanding-grid-2x2">
            <div className="understanding-item insight-primary">
              <span className="insight-tag tag-insight1">INSIGHT</span>
              <h3>
                <span className="emoji">⚖️</span>
                Technical-Business Balance
              </h3>
              <p>While technical expertise is important, your organization's growth stage requires a leader who can balance technical knowledge with business acumen and executive leadership presence.</p>
            </div>
            
            <div className="understanding-item core-need">
              <span className="insight-tag tag-core">CORE NEED</span>
              <h3>
                <span className="emoji">🌎</span>
                Strategic Leadership
              </h3>
              <p>Your planned expansion requires a leader with demonstrated strategic vision and the ability to execute on complex initiatives across multiple business domains.</p>
            </div>
          </div>
        </div>
        
        {/* Candidate Profiles */}
        <h2 className="hr-title mt-8">Calibration Profiles</h2>
        <div className="candidates">
          {Object.entries(candidates).map(([name, data], index) => {
            const candidateClass = `candidate-${index + 1}`;
            const evaluation = data.evaluation || {};
            
            // Get profile data from evaluation
            const profile = {
              title: evaluation.title || "Product Leader",
              experience: evaluation.experience || "10+ years",
              teamSize: evaluation.teamSize || "25+ people",
              budgetManaged: evaluation.budgetManaged || "£10M+",
              noticePeriod: evaluation.noticePeriod || "3 months",
              education: evaluation.education || "Advanced Degree",
              keyAchievement: evaluation.keyAchievement || "Led significant growth initiative"
            };
            
            return (
              <div key={name} className={`candidate-card ${candidateClass}`}>
                <div className="candidate-header" style={{ backgroundColor: data.color }}>
                  <div className="candidate-photo" style={{ backgroundImage: `url('/api/placeholder/110/110')` }}></div>
                  <h3 className="candidate-name">{name}</h3>
                  <p className="candidate-title">{profile.title}</p>
                </div>
                <div className="candidate-body">
                  <div className="candidate-stats">
                    <div className="stat-item">
                      <div className="stat-label">Experience</div>
                      <div className="stat-value">{profile.experience}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Team Size</div>
                      <div className="stat-value">{profile.teamSize}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Budget Managed</div>
                      <div className="stat-value">{profile.budgetManaged}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Notice Period</div>
                      <div className="stat-value">{profile.noticePeriod}</div>
                    </div>
                  </div>
                  
                  <div className="candidate-info">
                    <div className="info-item">
                      <div className="info-emoji">🎓</div>
                      <div className="info-content">
                        <div className="info-label">Education</div>
                        <div className="info-value">{profile.education}</div>
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-emoji">🏆</div>
                      <div className="info-content">
                        <div className="info-label">Key Achievement</div>
                        <div className="info-value">{profile.keyAchievement}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Competency Analysis */}
        <div className="competency-section">
          <h2 className="competency-heading">Candidate Competency Analysis</h2>
          
          <div className="competency-grid">
            <div className="competency-left-column">
              <div className="competency-matrix-section">
                <h3 className="competency-subtitle">Weighted Scoring Matrix</h3>
                
                <table className="weighted-table">
                  <thead>
                    <tr>
                      <th>Criteria</th>
                      <th>Weight</th>
                      {Object.keys(candidates).map(name => (
                        <th key={name}>{name.split(' ')[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationParameters.map((param, paramIndex) => {
                      const weight = param.weight || 20; // Default weight
                      
                      return (
                        <tr key={paramIndex}>
                          <td>{param.name}</td>
                          <td className="weight-cell">{weight}%</td>
                          
                          {Object.entries(candidates).map(([candidateName, candidateData], candidateIndex) => {
                            // Find score for this parameter
                            const evaluation = candidateData.evaluation || {};
                            const scores = evaluation.evaluationScores || [];
                            const scoreObj = scores.find(s => s.parameterName === param.name);
                            const score = scoreObj ? scoreObj.score : 0;
                            
                            // Calculate raw score out of 10
                            const rawScore = (score / 10).toFixed(1);
                            // Calculate weighted contribution
                            const weightedScore = ((score * weight) / 1000).toFixed(2);
                            
                            // Determine if this is a top score
                            const allScores = Object.values(candidates)
                              .map(c => {
                                const evaluation = c.evaluation || {};
                                const scores = eval.evaluationScores || [];
                                const scoreObj = scores.find(s => s.parameterName === param.name);
                                return scoreObj ? scoreObj.score : 0;
                              });
                            
                            const maxScore = Math.max(...allScores);
                            const secondMaxScore = [...allScores].sort((a, b) => b - a)[1] || 0;
                            
                            const isTopScore = score === maxScore && score > 0;
                            const isSecondScore = score === secondMaxScore && score > 0 && score < maxScore;
                            
                            return (
                              <td 
                                key={candidateIndex} 
                                className={`score-cell ${isTopScore ? 'top-score' : ''} ${isSecondScore ? 'second-score' : ''}`}
                              >
                                {rawScore} <span className="weighted-value">({weightedScore})</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    
                    {/* Weighted Totals */}
                    <tr className="total-row">
                      <td>Weighted Total</td>
                      <td className="weight-cell">100%</td>
                      
                      {Object.entries(candidates).map(([candidateName, candidateData], candidateIndex) => {
                        // Calculate total weighted score
                        let totalScore = 0;
                        
                        if (candidateData.evaluation) {
                          const scores = candidateData.evaluation.evaluationScores || [];
                          
                          scores.forEach(score => {
                            const param = evaluationParameters.find(p => p.name === score.parameterName);
                            const weight = param?.weight || 20;
                            totalScore += (score.score * weight) / 100;
                          });
                        }
                        
                        // Format for display
                        const displayScore = (totalScore / 10).toFixed(2);
                        
                        // Find winner
                        const allTotals = Object.values(candidates).map(c => {
                          let total = 0;
                          if (c.evaluation) {
                            const scores = c.evaluation.evaluationScores || [];
                            scores.forEach(score => {
                              const param = evaluationParameters.find(p => p.name === score.parameterName);
                              const weight = param?.weight || 20;
                              total += (score.score * weight) / 100;
                            });
                          }
                          return total;
                        });
                        
                        const maxTotal = Math.max(...allTotals);
                        const isWinner = totalScore === maxTotal;
                        
                        return (
                          <td key={candidateIndex} className={`score-cell ${isWinner ? 'top-score winner-score' : ''}`}>
                            {displayScore} {isWinner && <span className="winner-badge">1st</span>}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
                
                <p className="weighted-note">
                  <strong>Note:</strong> Scores shown as raw score (out of 10) with weighted contribution in parentheses.
                </p>
              </div>
              
              <div className="competency-insight primary-insight">
                <div className="insight-icon">💡</div>
                <p className="insight-text">
                  <strong>Key Insight:</strong> {decisionFactors[0] || "Candidates show complementary strengths across different competency areas."}
                </p>
              </div>
            </div>
            
            <div className="competency-spider-section">
              <div className="spider-chart-legend">
                {Object.entries(candidates).map(([name, data], index) => {
                  return (
                    <div key={name} className="legend-item">
                      <div 
                        className="legend-color"
                        style={{ backgroundColor: data.color }}
                      />
                      <span>{name}</span>
                    </div>
                  );
                })}
              </div>
              
              <h3 className="competency-subtitle">Competency Radar</h3>
              
              <div className="spider-chart">
                <svg viewBox="0 -20 400 440" preserveAspectRatio="xMidYMid meet" overflow="visible">
                  {/* Background */}
                  <rect x="0" y="0" width="400" height="400" fill="#f9f9f9" rx="8" ry="8" />
                  
                  {/* Reference circles */}
                  <circle cx="200" cy="200" r="150" fill="none" stroke="#e0e0e0" strokeWidth="0.7" />
                  <circle cx="200" cy="200" r="100" fill="none" stroke="#e0e0e0" strokeWidth="0.7" />
                  <circle cx="200" cy="200" r="50" fill="none" stroke="#e0e0e0" strokeWidth="0.7" />
                  
                  {/* Axis lines - Using first 5 parameters */}
                  {evaluationParameters.slice(0, 5).map((param, i) => {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
                    const x = 200 + 150 * Math.cos(angle);
                    const y = 200 + 150 * Math.sin(angle);
                    
                    return (
                      <line 
                        key={i}
                        x1="200" 
                        y1="200" 
                        x2={x} 
                        y2={y} 
                        stroke="#ccc" 
                        strokeWidth="0.8" 
                      />
                    );
                  })}
                  
                  {/* Parameter labels */}
                  {evaluationParameters.slice(0, 5).map((param, i) => {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
                    const x = 200 + 180 * Math.cos(angle);
                    const y = 200 + 180 * Math.sin(angle);
                    
                    return (
                      <text 
                        key={i}
                        x={x} 
                        y={y} 
                        textAnchor="middle" 
                        fontSize="10"
                        fontWeight="bold"
                        fill="#333"
                      >
                        {param.name}
                      </text>
                    );
                  })}
                  
                  {/* Candidate polygons */}
                  {Object.entries(candidates).map(([name, data], candidateIndex) => {
                    if (!data.evaluation) return null;
                    
                    const scores = evaluationParameters.slice(0, 5).map(param => {
                      const evalScores = data.evaluation.evaluationScores || [];
                      const scoreObj = evalScores.find(s => s.parameterName === param.name);
                      return scoreObj ? scoreObj.score / 100 : 0; // Normalize to 0-1
                    });
                    
                    // Calculate points based on scores
                    const points = scores.map((score, i) => {
                      const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
                      const distance = 150 * score;
                      const x = 200 + distance * Math.cos(angle);
                      const y = 200 + distance * Math.sin(angle);
                      return `${x},${y}`;
                    }).join(' ');
                    
                    // Define colors based on candidateIndex
                    const colors = [
                      { fill: 'rgba(0, 43, 92, 0.2)', stroke: 'rgba(0, 43, 92, 0.8)' }, // Navy
                      { fill: 'rgba(255, 194, 14, 0.2)', stroke: 'rgba(255, 194, 14, 0.8)' }, // Gold
                      { fill: 'rgba(91, 33, 182, 0.2)', stroke: 'rgba(91, 33, 182, 0.8)' }  // Purple
                    ];
                    
                    const color = candidateIndex < colors.length ? colors[candidateIndex] : colors[0];
                    
                    return (
                      <g key={name}>
                        <polygon 
                          points={points} 
                          fill={color.fill} 
                          stroke={color.stroke} 
                          strokeWidth="2" 
                        />
                        
                        {/* Dots at vertices */}
                        {points.split(' ').map((point, i) => {
                          const [x, y] = point.split(',');
                          return (
                            <circle key={i} cx={x} cy={y} r="4" fill={color.stroke} />
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              <div className="competency-insight secondary-insight">
                <div className="insight-icon">⏱️</div>
                <p className="insight-text">
                  <strong>Decision Factor:</strong> {decisionFactors[1] || "Consider timeline needs when making your final selection."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Areas to Probe */}
        <div className="areas-to-probe">
          <div className="probe-title">
            <div className="probe-icon">🔍</div>
            <h2>Areas to Probe</h2>
          </div>
          <p>Focused questions to help you explore potential gaps and validate strengths during the final interview stage.</p>
          
          <div className="candidate-probes">
            {Object.entries(candidates).map(([name, data], index) => {
              const headerClass = index === 0 ? 'sarah-header' : index === 1 ? 'james-header' : 'emily-header';
              const evaluation = data.evaluation || {};
              const evaluationScores = evaluation.evaluationScores || [];
              
              // Generate strengths based on high scores
              const strengths = evaluationScores
                .filter(score => {
                  const param = evaluationParameters.find(p => p.name === score.parameterName);
                  return param && score.score >= param.requirementLevel + 5;
                })
                .slice(0, 2)
                .map(score => score.strengths ? score.strengths[0] : `Strong ${score.parameterName.toLowerCase()} capabilities`);
              
              // Generate questions based on gaps
              const areasToProbe = evaluationScores
                .filter(score => {
                  const param = evaluationParameters.find(p => p.name === score.parameterName);
                  return param && score.score < param.requirementLevel;
                })
                .slice(0, 3)
                .map(score => ({
                  area: score.parameterName,
                  question: score.limitations && score.limitations.length > 0 
                    ? `How have you addressed ${score.limitations[0].toLowerCase()}?`
                    : `Could you elaborate on your experience with ${score.parameterName.toLowerCase()}?`
                }));
              
              return (
                <div key={name} className="probe-card">
                  <div className={`probe-header ${headerClass}`} style={{ backgroundColor: data.color }}>{name}</div>
                  <div className="probe-body">
                    <div className="probe-section-title strengths-title">
                      ✓ Key Validated Strengths
                    </div>
                    <ul className="key-points">
                      {strengths.length > 0 ? (
                        strengths.map((strength, i) => <li key={i}>{strength}</li>)
                      ) : (
                        <li>Strong overall performance across multiple areas</li>
                      )}
                    </ul>
                    
                    <div className="probe-section-title probe-areas-title">
                      ✗ Interview Focus Areas
                    </div>
                    <ul className="key-points">
                      {areasToProbe.length > 0 ? (
                        areasToProbe.map((area, i) => (
                          <li key={i}>
                            <strong>{area.area}:</strong> <span className="probe-question">{area.question}</span>
                          </li>
                        ))
                      ) : (
                        <li>No significant areas of concern identified</li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="next-steps">
          <div className="next-steps-header">
            <div className="next-steps-icon">→</div>
            <h2>Recommended Next Steps</h2>
          </div>
          <ul className="action-items">
            <li>Schedule final interviews with shortlisted candidates</li>
            <li>Prepare focused technical and leadership questions based on identified gaps</li>
            <li>Arrange for candidates to meet key stakeholders</li>
            <li>Develop onboarding plan for the selected candidate</li>
            <li>Prepare competitive compensation package</li>
          </ul>
        </div>
        
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
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-300'
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
        <div className="flex justify-end mt-8">
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
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Albany Partners. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Report;