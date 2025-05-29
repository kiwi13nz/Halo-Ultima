// src/components/wizard/FinalReport.tsx - Fixed version
import React, { useState } from 'react';
import { FileText, CheckCircle, ThumbsUp, ChevronLeft, ThumbsDown, Edit2, Download, Printer, X } from 'lucide-react';
import { SkillsComparisonExact } from '../SkillsComparisonExact';
import { GapAnalysis } from '../GapAnalysis';
import { StrengthWeaknessComparison } from '../StrengthWeaknessComparison';
import { UnderstandingSection } from '../UnderstandingSection';
import { AssessmentDetail } from '../AssessmentDetail';
import { ExportPDFButton } from '../ExportPDFButton';
import { FinalReportProps } from './types';

export default function FinalReport({ 
  onPrevious, 
  onNext, 
  isLoading, 
  clientName, 
  roleTitle,
  candidateAssessments,
  kecItems,
  keyInsights,
  decisionFactors
}: FinalReportProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [reportReference] = useState(`AP-${Math.floor(Math.random() * 1000)}-${new Date().getFullYear()}`);
  
  // Format data for components
  const formatDataForReport = () => {
    // Candidate colors
    const candidateColors: Record<string, string> = {};
    const colorList = ["var(--sarah)", "var(--james)", "var(--emily)"];
    
    candidateAssessments.forEach((candidate, index) => {
      candidateColors[candidate.name] = colorList[index % colorList.length];
    });
    
    // Create candidate evaluations
    const candidateEvaluations: Record<string, any> = {};
    
    candidateAssessments.forEach(candidate => {
      candidateEvaluations[candidate.name] = {
        candidateInfo: `${candidate.name} has ${candidate.experience} of experience and ${candidate.keyAchievement}.`,
        evaluation: {
          candidateName: candidate.name,
          overallAssessment: candidate.overallAssessment || `${candidate.name} has ${candidate.experience} of experience as ${candidate.title}. ${candidate.keyAchievement}.`,
          evaluationScores: Object.entries(candidate.scores).map(([paramName, score]) => {
            const kec = kecItems.find(k => k.name === paramName);
            
            // Generate evidence-based strengths and limitations
            const isStrength = score >= (kec?.requirementLevel || 75);
            const strengths = isStrength ? 
              [`Strong ${paramName.toLowerCase()} capabilities, demonstrated through ${candidate.experience} of relevant experience`, 
              `Excellent track record in ${paramName.toLowerCase()}, exemplified by ${candidate.keyAchievement}`] : 
              [`Adequate ${paramName.toLowerCase()} skills that meet minimum requirements`];
              
            const limitations = isStrength ? 
              [`Could benefit from more experience in specific aspects of ${paramName.toLowerCase()}`] :
              [`Needs development in ${paramName.toLowerCase()}`, 
              `Consider additional training or support to strengthen ${paramName.toLowerCase()} capabilities`];
            
            return {
              parameterName: paramName,
              score: score,
              assessment: [],
              justification: `Based on ${candidate.name}'s experience of ${candidate.experience} and achievements, they demonstrate ${isStrength ? 'strong' : 'adequate'} capabilities in ${paramName}.`,
              strengths,
              limitations
            };
          })
        },
        color: candidateColors[candidate.name]
      };
    });
    
    return {
      evaluationParameters: kecItems,
      candidates: candidateEvaluations
    };
  };
  
  const reportData = formatDataForReport();
  
  const handleCandidateSelect = (candidateName: string) => {
    setSelectedCandidate(selectedCandidate === candidateName ? null : candidateName);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Final Report</h2>
      <p className="text-gray-600 mb-6">
        Your report is ready! You can make final edits before exporting or printing.
      </p>
      
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
        <div className="executive-summary" style={{ marginTop: "-2rem" }}>
          <div className="summary-title">
            <div className="summary-icon">📊</div>
            <h2>Executive Summary</h2>
          </div>
          
          <p>
            Following an extensive search and thorough assessment process, we present our analysis of {candidateAssessments.length} exceptional candidates for the {roleTitle} position at {clientName}. Each candidate brings unique strengths that align with your organizational needs.
          </p>
          
          {/* Key insights cards in 3 columns - generated from AI key insights */}
          <div className="key-insights">
            <div className="insight-card">
              <h4>
                <span className="insight-emoji">🏆</span>
                {keyInsights?.topPerformer.title || "Top Performer"}
              </h4>
              <p>
                {keyInsights?.topPerformer.candidate || candidateAssessments[0]?.name} {keyInsights?.topPerformer.description || `demonstrates strong leadership and experience in the field.`}
              </p>
            </div>
            
            <div className="insight-card">
              <h4>
                <span className="insight-emoji">💻</span>
                {keyInsights?.technicalEdge.title || "Technical Edge"}
              </h4>
              <p>
                {keyInsights?.technicalEdge.candidate || candidateAssessments[0]?.name} {keyInsights?.technicalEdge.description || `brings exceptional technical expertise to the role.`}
              </p>
            </div>
            
            <div className="insight-card">
              <h4>
                <span className="insight-emoji">⏱️</span>
                {keyInsights?.fastestOnboarding.title || "Fastest Onboarding"}
              </h4>
              <p>
                {keyInsights?.fastestOnboarding.candidate || candidateAssessments[0]?.name} {keyInsights?.fastestOnboarding.description || `can start quickly and bring immediate impact.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Key Evaluation Criteria (KEC) */}
        <div className="client-requirements">
          <div className="requirements-title">
            <div className="requirements-icon">📋</div>
            <h2>Key Evaluation Criteria (KEC)</h2>
          </div>
          
          <p>{clientName} is seeking a strategic {roleTitle} to lead their product organization through a period of significant growth and international expansion.</p>
          
          <ul className="requirements-list">
            {kecItems.map((param, index) => (
              <li key={index}>{param.description}</li>
            ))}
          </ul>
          
          {/* Understanding Requirements - Changed to 2 boxes in 2x1 layout */}
          <div className="understanding-grid-2x2">
            <div className="understanding-item insight-primary">
              <span className="insight-tag tag-insight1">INSIGHT</span>
              <h3>
                <span className="emoji">⚖️</span>
                Technical-Business Balance
              </h3>
              <p>While technical expertise is important, your organization's growth stage requires a CPO who can balance technical knowledge with business acumen and executive leadership presence.</p>
            </div>
            
            <div className="understanding-item core-need">
              <span className="insight-tag tag-core">CORE NEED</span>
              <h3>
                <span className="emoji">🌎</span>
                International Expansion
              </h3>
              <p>Your planned expansion into European and North American markets requires a CPO with demonstrated international product leadership experience and cultural awareness for different market needs.</p>
            </div>
          </div>
        </div>
        
        {/* Candidate Profiles */}
        <h2 className="hr-title mt-8">Calibration Profiles</h2>
        <div className="candidates">
          {candidateAssessments.map((candidate, index) => {
            const candidateClass = `candidate-${index + 1}`;
            const color = ["var(--sarah)", "var(--james)", "var(--emily)"][index % 3];
            
            return (
              <div key={candidate.name} className={`candidate-card ${candidateClass}`}>
                <div className="candidate-header" style={{ backgroundColor: color }}>
                  <div className="candidate-photo" style={{ backgroundImage: `url('/api/placeholder/110/110')` }}></div>
                  <h3 className="candidate-name">{candidate.name}</h3>
                  <p className="candidate-title">{candidate.title}</p>
                </div>
                <div className="candidate-body" style={{ padding: "1rem" }}>
                  <div className="candidate-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div className="stat-item">
                      <div className="stat-label">Experience</div>
                      <div className="stat-value" style={{ textAlign: "center" }}>{candidate.experience}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Team Size</div>
                      <div className="stat-value" style={{ textAlign: "center" }}>{candidate.teamSize}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Budget Managed</div>
                      <div className="stat-value" style={{ textAlign: "center" }}>{candidate.budgetManaged}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Notice Period</div>
                      <div className="stat-value" style={{ textAlign: "center" }}>{candidate.noticePeriod}</div>
                    </div>
                  </div>
                  
                  <div className="candidate-info">
                    <div className="info-item">
                      <div className="info-emoji">🎓</div>
                      <div className="info-content">
                        <div className="info-label">Education</div>
                        <div className="info-value">{candidate.education}</div>
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-emoji">🏆</div>
                      <div className="info-content">
                        <div className="info-label">Key Achievement</div>
                        <div className="info-value">{candidate.keyAchievement}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Competency Analysis */}
        <div className="competency-analysis-container hr-card">
          <h2 className="hr-title">Candidate Competency Analysis</h2>
          
          <div className="competency-grid">
            <div className="competency-left-column">
              <div className="competency-matrix-section">
                <h3 className="competency-subtitle">Weighted Scoring Matrix</h3>
                
                <table className="weighted-table">
                  <thead>
                    <tr>
                      <th>Criteria</th>
                      <th>Weight</th>
                      {candidateAssessments.map(candidate => (
                        <th key={candidate.name}>{candidate.name.split(' ')[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kecItems.map((param, paramIndex) => {
                      const weight = param.weight || 20; // Default weight if not specified
                      
                      return (
                        <tr key={paramIndex}>
                          <td>{param.name}</td>
                          <td className="weight-cell">{weight}%</td>
                          
                          {candidateAssessments.map((candidate, candidateIndex) => {
                            const score = candidate.scores[param.name] || 0;
                            const normalizedScore = (score / 10).toFixed(1); // Convert to 0-10 scale
                            const weightedScore = ((score * weight) / 1000).toFixed(2); // Weighted contribution
                            
                            // Determine if this is a top or second score
                            const scores = candidateAssessments.map(c => c.scores[param.name] || 0);
                            const maxScore = Math.max(...scores);
                            const secondMaxScore = [...scores].sort((a, b) => b - a)[1] || 0;
                            
                            const isTopScore = score === maxScore && score > 0;
                            const isSecondScore = score === secondMaxScore && score > 0 && score < maxScore;
                            
                            let scoreClass = '';
                            if (isTopScore) scoreClass = 'top-score';
                            else if (isSecondScore) scoreClass = 'second-score';
                            
                            return (
                              <td key={candidateIndex} className={`score-cell ${scoreClass}`}>
                                {normalizedScore} <span className="weighted-value">({weightedScore})</span>
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
                      
                      {candidateAssessments.map((candidate, candidateIndex) => {
                        // Calculate total score
                        let totalScore = 0;
                        
                        Object.entries(candidate.scores).forEach(([paramName, score]) => {
                          const param = kecItems.find(k => k.name === paramName);
                          const weight = param?.weight || 20;
                          totalScore += (score * weight) / 100;
                        });
                        
                        // Format for display
                        const displayScore = (totalScore / 10).toFixed(2);
                        
                        // Determine winner
                        const allTotals = candidateAssessments.map(c => {
                          let total = 0;
                          Object.entries(c.scores).forEach(([paramName, score]) => {
                            const param = kecItems.find(k => k.name === paramName);
                            const weight = param?.weight || 20;
                            total += (score * weight) / 100;
                          });
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
                  <strong>Key Insight:</strong> {decisionFactors?.[0] || "Candidates show complementary strengths across different competency areas."}
                </p>
              </div>
            </div>
            
            <div className="competency-spider-section">
              <div className="spider-chart-legend">
                {candidateAssessments.map((candidate, index) => {
                  const color = ["var(--sarah)", "var(--james)", "var(--emily)"][index % 3];
                  return (
                    <div key={candidate.name} className="legend-item">
                      <div 
                        className="legend-color"
                        style={{ backgroundColor: color }}
                      />
                      <span>{candidate.name}</span>
                    </div>
                  );
                })}
              </div>
              
              <h3 className="competency-subtitle">Competency Radar</h3>
              
              <div className="improved-spider-chart">
                <svg viewBox="0 -20 400 440" preserveAspectRatio="xMidYMid meet" overflow="visible">
                  {/* This is a placeholder for the actual SVG content that would be generated */}
                  {/* In a real implementation, this would be a dynamically generated radar chart */}
                  <rect x="0" y="0" width="400" height="400" fill="#f9f9f9" rx="8" ry="8" />
                  <text x="200" y="200" textAnchor="middle" fontSize="14">Radar Chart Would Be Generated Here</text>
                </svg>
              </div>
              
              <div className="competency-insight secondary-insight">
                <div className="insight-icon">⏱️</div>
                <p className="insight-text">
                  <strong>Decision Factor:</strong> {decisionFactors?.[1] || "Consider timeline needs when making your final selection."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Areas to Probe */}
        <div className="hr-card">
          <div className="probe-title">
            <div className="probe-icon">🔍</div>
            <h2 className="hr-title" style={{border: 'none', margin: 0, paddingBottom: 0}}>Areas to Probe</h2>
          </div>
          <p>Focused questions to help you explore potential gaps and validate strengths during the final interview stage.</p>
          
          <div className="candidate-probes">
            {candidateAssessments.map((candidate, index) => {
              const headerClass = index === 0 ? 'sarah-header' : index === 1 ? 'james-header' : 'emily-header';
              const color = ["var(--sarah)", "var(--james)", "var(--emily)"][index % 3];
              
              // Generate strengths based on high scores
              const strengths = Object.entries(candidate.scores)
                .filter(([paramName, score]) => {
                  const param = kecItems.find(k => k.name === paramName);
                  return param && score >= param.requirementLevel + 5;
                })
                .slice(0, 2)
                .map(([paramName]) => `Strong ${paramName.toLowerCase()} capabilities demonstrated through experience`);
              
              // Generate questions based on gaps
              const areasToProbe = Object.entries(candidate.scores)
                .filter(([paramName, score]) => {
                  const param = kecItems.find(k => k.name === paramName);
                  return param && score < param.requirementLevel;
                })
                .slice(0, 3)
                .map(([paramName, score]) => ({
                  area: paramName,
                  question: `How have you addressed challenges in ${paramName.toLowerCase()} in previous roles?`
                }));
              
              return (
                <div key={candidate.name} className="probe-card">
                  <div className={`probe-header ${headerClass}`} style={{ backgroundColor: color }}>{candidate.name}</div>
                  <div className="probe-body">
                    <div className="probe-section-title strengths-title">
                      <CheckCircle size={16} />
                      Key Validated Strengths
                    </div>
                    <ul className="key-points">
                      {strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                      {strengths.length === 0 && (
                        <li>Strong overall performance across multiple areas</li>
                      )}
                    </ul>
                    
                    <div className="probe-section-title probe-areas-title">
                      <X size={16} />
                      Interview Focus Areas
                    </div>
                    <ul className="key-points">
                      {areasToProbe.map((area, i) => (
                        <li key={i}>
                          <strong>{area.area}:</strong> <span className="probe-question">{area.question}</span>
                        </li>
                      ))}
                      {areasToProbe.length === 0 && (
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
            {Object.entries(reportData.candidates).map(([name, data]) => (
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
            ))}
          </div>
          
          {selectedCandidate && reportData.candidates[selectedCandidate]?.evaluation && (
            <AssessmentDetail 
              candidate={reportData.candidates[selectedCandidate].evaluation}
              parameters={reportData.evaluationParameters}
              color={reportData.candidates[selectedCandidate].color}
            />
          )}
        </div>
      </div>
      
      {/* Export controls */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back to Assessment
        </button>
        
        <div className="flex space-x-4">
          <ExportPDFButton
            clientName={clientName}
            reportReference={reportReference}
            jobDescription={`${clientName} is seeking a strategic ${roleTitle}`}
            evaluationParameters={reportData.evaluationParameters}
            candidates={reportData.candidates}
          />
          
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}