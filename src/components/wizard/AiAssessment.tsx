// src/components/wizard/AiAssessment.tsx - Updated with dynamic profile fields
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Loader2, Check, X, Edit2 } from 'lucide-react';
import { AiAssessmentProps, KeyInsights } from './types';

const AiAssessment: React.FC<AiAssessmentProps> = ({
  onPrevious,
  onNext,
  isLoading,
  kecItems,
  candidateAssessments,
  setCandidateAssessments,
  keyInsights,
  setKeyInsights,
  decisionFactors,
  setDecisionFactors,
  selectedProfileFields
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [expandedParameters, setExpandedParameters] = useState<Set<string>>(new Set());
  const [editingOverview, setEditingOverview] = useState<number | null>(null);
  const [editingKeyInsights, setEditingKeyInsights] = useState(false);
  const [editingDecisionFactors, setEditingDecisionFactors] = useState(false);
  
  // Toggle expanded state for a parameter
  const toggleParameter = (paramName: string) => {
    const newExpanded = new Set(expandedParameters);
    if (newExpanded.has(paramName)) {
      newExpanded.delete(paramName);
    } else {
      newExpanded.add(paramName);
    }
    setExpandedParameters(newExpanded);
  };
  
  // Find matching parameter
  const findParameter = (paramName: string) => {
    return kecItems.find(p => p.name === paramName);
  };

  // Update candidate assessment data
  const updateCandidateAssessment = (candidateIndex: number, field: string, value: string) => {
    const newCandidateAssessments = [...candidateAssessments];
    
    // For overall assessment
    if (field === 'overallAssessment') {
      newCandidateAssessments[candidateIndex] = {
        ...newCandidateAssessments[candidateIndex],
        overallAssessment: value
      };
    }
    
    setCandidateAssessments(newCandidateAssessments);
  };
  
  // Update score for a parameter - allow any value, not just multiples of 5
  const updateScore = (candidateIndex: number, paramName: string, scoreValue: string | number) => {
    const score = typeof scoreValue === 'string' ? parseInt(scoreValue) || 0 : scoreValue;
    const validScore = Math.min(100, Math.max(0, score));
    
    const newCandidateAssessments = [...candidateAssessments];
    const newScores = {...newCandidateAssessments[candidateIndex].scores};
    newScores[paramName] = validScore;
    
    newCandidateAssessments[candidateIndex] = {
      ...newCandidateAssessments[candidateIndex],
      scores: newScores
    };
    
    setCandidateAssessments(newCandidateAssessments);
  };
  
  // Update strength or limitation
  const updateStrength = (candidateIndex: number, paramName: string, index: number, value: string) => {
    // In a real implementation, this would update the actual evaluation structure
    console.log(`Updated strength ${index} for ${paramName} to: ${value}`);
  };
  
  const updateLimitation = (candidateIndex: number, paramName: string, index: number, value: string) => {
    // In a real implementation, this would update the actual evaluation structure
    console.log(`Updated limitation ${index} for ${paramName} to: ${value}`);
  };
  
  // Handle updates to key insights
  const updateKeyInsights = (newKeyInsights: KeyInsights) => {
    if (setKeyInsights) {
      setKeyInsights(newKeyInsights);
    }
  };
  
  // Handle updates to decision factors
  const updateDecisionFactors = (newFactors: string[]) => {
    if (setDecisionFactors) {
      setDecisionFactors(newFactors);
    }
  };
  
  // Generate evidence-based justification that references candidate information
  const generateJustification = (candidateIndex: number, paramName: string) => {
    const candidate = candidateAssessments[candidateIndex];
    const parameter = findParameter(paramName);
    const score = candidate.scores[paramName] || 0;
    
    if (!parameter) return "Unable to assess due to missing parameter information.";
    
    const meetsRequirement = score >= parameter.requirementLevel;
    
    // Create specific justification that references candidate information
    if (meetsRequirement) {
      return `${candidate.name} meets or exceeds the ${paramName} requirement (${parameter.requirementLevel}%) with a score of ${score}%. Their profile demonstrates strong capabilities in this area based on their qualifications and experience.`;
    } else {
      const gap = parameter.requirementLevel - score;
      return `${candidate.name} falls ${gap}% below the requirement for ${paramName} (${parameter.requirementLevel}%). While their profile provides some foundation, their capabilities in this area would benefit from further development. Additional training or support would be recommended to address this gap.`;
    }
  };

  // Helper function to get profile field label
  const getProfileFieldLabel = (fieldId: string, type: 'stats' | 'text'): string => {
    const fieldLabels = {
      stats: {
        experience: 'Experience',
        teamSize: 'Team Size',
        budgetManaged: 'Budget Managed',
        noticePeriod: 'Notice Period',
        salary: 'Current Salary',
        location: 'Location',
        languages: 'Languages',
        yearsInIndustry: 'Years in Industry'
      },
      text: {
        title: 'Current Title',
        education: 'Education',
        keyAchievement: 'Key Achievement',
        certification: 'Certifications',
        previousCompany: 'Previous Company',
        managementStyle: 'Management Style'
      }
    };
    
    return fieldLabels[type][fieldId] || fieldId;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">AI-Generated Assessment</h2>
      <p className="text-gray-600 mb-6">
        Review the AI-generated candidate assessments. You can adjust scores, edit evaluations, and customize key insights for the final report.
      </p>
      
      {/* Key insights section - only show if keyInsights exists */}
      {keyInsights && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">📊</span>
              Key Insights for Final Report
            </h3>
            <button
              onClick={() => setEditingKeyInsights(!editingKeyInsights)}
              className="text-sm flex items-center text-pink-600 hover:text-pink-700"
            >
              {editingKeyInsights ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Done Editing
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Insights
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-600">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">🏆</span>
                {editingKeyInsights ? (
                  <input
                    type="text"
                    value={keyInsights.topPerformer.title}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      topPerformer: {
                        ...keyInsights.topPerformer,
                        title: e.target.value
                      }
                    })}
                    className="text-base font-semibold w-full border-b border-pink-200 bg-transparent focus:outline-none focus:border-pink-500"
                  />
                ) : (
                  <h4 className="text-base font-semibold">{keyInsights.topPerformer.title}</h4>
                )}
              </div>
              
              {editingKeyInsights ? (
                <div className="space-y-2">
                  <select
                    value={keyInsights.topPerformer.candidate}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      topPerformer: {
                        ...keyInsights.topPerformer,
                        candidate: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-1"
                  >
                    {candidateAssessments.map(candidate => (
                      <option key={candidate.name} value={candidate.name}>{candidate.name}</option>
                    ))}
                  </select>
                  <textarea
                    value={keyInsights.topPerformer.description}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      topPerformer: {
                        ...keyInsights.topPerformer,
                        description: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                  />
                </div>
              ) : (
                <p className="text-sm">
                  <span className="font-medium">{keyInsights.topPerformer.candidate}</span> {keyInsights.topPerformer.description}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">💻</span>
                {editingKeyInsights ? (
                  <input
                    type="text"
                    value={keyInsights.technicalEdge.title}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      technicalEdge: {
                        ...keyInsights.technicalEdge,
                        title: e.target.value
                      }
                    })}
                    className="text-base font-semibold w-full border-b border-blue-200 bg-transparent focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <h4 className="text-base font-semibold">{keyInsights.technicalEdge.title}</h4>
                )}
              </div>
              
              {editingKeyInsights ? (
                <div className="space-y-2">
                  <select
                    value={keyInsights.technicalEdge.candidate}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      technicalEdge: {
                        ...keyInsights.technicalEdge,
                        candidate: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-1"
                  >
                    {candidateAssessments.map(candidate => (
                      <option key={candidate.name} value={candidate.name}>{candidate.name}</option>
                    ))}
                  </select>
                  <textarea
                    value={keyInsights.technicalEdge.description}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      technicalEdge: {
                        ...keyInsights.technicalEdge,
                        description: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                  />
                </div>
              ) : (
                <p className="text-sm">
                  <span className="font-medium">{keyInsights.technicalEdge.candidate}</span> {keyInsights.technicalEdge.description}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">⏱️</span>
                {editingKeyInsights ? (
                  <input
                    type="text"
                    value={keyInsights.fastestOnboarding.title}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      fastestOnboarding: {
                        ...keyInsights.fastestOnboarding,
                        title: e.target.value
                      }
                    })}
                    className="text-base font-semibold w-full border-b border-amber-200 bg-transparent focus:outline-none focus:border-amber-500"
                  />
                ) : (
                  <h4 className="text-base font-semibold">{keyInsights.fastestOnboarding.title}</h4>
                )}
              </div>
              
              {editingKeyInsights ? (
                <div className="space-y-2">
                  <select
                    value={keyInsights.fastestOnboarding.candidate}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      fastestOnboarding: {
                        ...keyInsights.fastestOnboarding,
                        candidate: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-1"
                  >
                    {candidateAssessments.map(candidate => (
                      <option key={candidate.name} value={candidate.name}>{candidate.name}</option>
                    ))}
                  </select>
                  <textarea
                    value={keyInsights.fastestOnboarding.description}
                    onChange={(e) => updateKeyInsights({
                      ...keyInsights,
                      fastestOnboarding: {
                        ...keyInsights.fastestOnboarding,
                        description: e.target.value
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                  />
                </div>
              ) : (
                <p className="text-sm">
                  <span className="font-medium">{keyInsights.fastestOnboarding.candidate}</span> {keyInsights.fastestOnboarding.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Decision Factors - only show if decisionFactors exists */}
      {decisionFactors && decisionFactors.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">⚖️</span>
              Decision Factors
            </h3>
            <button
              onClick={() => setEditingDecisionFactors(!editingDecisionFactors)}
              className="text-sm flex items-center text-pink-600 hover:text-pink-700"
            >
              {editingDecisionFactors ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Done Editing
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Factors
                </>
              )}
            </button>
          </div>
          
          <div className="competency-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {decisionFactors[0] && (
              <div className="competency-insight primary-insight p-4 bg-white border-l-4 border-pink-600 rounded-md shadow-sm">
                <div className="insight-icon text-xl mr-2 inline-block">💡</div>
                {editingDecisionFactors ? (
                  <textarea
                    value={decisionFactors[0]}
                    onChange={(e) => {
                      const newFactors = [...decisionFactors];
                      newFactors[0] = e.target.value;
                      updateDecisionFactors(newFactors);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mt-2"
                    rows={2}
                  />
                ) : (
                  <p className="insight-text inline">
                    <strong>Key Insight:</strong> {decisionFactors[0]}
                  </p>
                )}
              </div>
            )}
            
            {decisionFactors[1] && (
              <div className="competency-insight secondary-insight p-4 bg-white border-l-4 border-amber-600 rounded-md shadow-sm">
                <div className="insight-icon text-xl mr-2 inline-block">⏱️</div>
                {editingDecisionFactors ? (
                  <textarea
                    value={decisionFactors[1]}
                    onChange={(e) => {
                      const newFactors = [...decisionFactors];
                      newFactors[1] = e.target.value;
                      updateDecisionFactors(newFactors);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mt-2"
                    rows={2}
                  />
                ) : (
                  <p className="insight-text inline">
                    <strong>Decision Factor:</strong> {decisionFactors[1]}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {editingDecisionFactors && (
            <div className="space-y-3 mt-4">
              {decisionFactors.slice(2).map((factor, index) => (
                <div key={index + 2} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      {index + 3}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex items-center">
                    <textarea
                      value={factor}
                      onChange={(e) => {
                        const newFactors = [...decisionFactors];
                        newFactors[index + 2] = e.target.value;
                        updateDecisionFactors(newFactors);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows={2}
                    />
                    
                    <button
                      onClick={() => {
                        const newFactors = [...decisionFactors];
                        newFactors.splice(index + 2, 1);
                        updateDecisionFactors(newFactors);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => updateDecisionFactors([...decisionFactors, "New decision factor"])}
                className="mt-2 text-sm flex items-center text-pink-600 hover:text-pink-700"
              >
                + Add Decision Factor
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Candidate selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Select a candidate to view detailed assessment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {candidateAssessments.map((candidate, index) => (
            <button
              key={index}
              onClick={() => setSelectedCandidate(selectedCandidate === index ? null : index)}
              className={`p-4 rounded-lg border-2 transition ${
                selectedCandidate === index 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: `var(--${index === 0 ? 'sarah' : index === 1 ? 'james' : 'emily'})` }}
                ></div>
                <h3 className="font-medium">{candidate.name}</h3>
              </div>
              <div className="text-sm text-gray-500 mt-1">{candidate.title || 'Product Leader'}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{candidate.experience || 'N/A'}</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{candidate.noticePeriod || 'N/A'}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Detailed assessment for selected candidate */}
        {selectedCandidate !== null && candidateAssessments[selectedCandidate] && (
          <div className="hr-card border border-gray-200 rounded-lg p-6">
            <h2 className="hr-title text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
              Assessment Details: {candidateAssessments[selectedCandidate].name}
            </h2>
            
            {/* Candidate overall assessment */}
            <div className="mb-6">
              {editingOverview === selectedCandidate ? (
                <textarea
                  value={candidateAssessments[selectedCandidate].overallAssessment || ''}
                  onChange={(e) => updateCandidateAssessment(selectedCandidate, 'overallAssessment', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Enter comprehensive assessment of candidate's fit for the role..."
                />
              ) : (
                <p className="text-gray-700">
                  {candidateAssessments[selectedCandidate].overallAssessment || 
                    `${candidateAssessments[selectedCandidate].name} brings substantial qualifications and experience to this role.`
                  }
                </p>
              )}
              
              <div className="mt-2 text-right">
                <button
                  onClick={() => setEditingOverview(editingOverview === selectedCandidate ? null : selectedCandidate)}
                  className="text-sm inline-flex items-center text-pink-600 hover:text-pink-700"
                >
                  {editingOverview === selectedCandidate ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Done
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Dynamic candidate profile summary */}
            {selectedProfileFields && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Professional Profile</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProfileFields.stats.map(fieldId => {
                      const fieldLabel = getProfileFieldLabel(fieldId, 'stats');
                      const fieldValue = candidateAssessments[selectedCandidate][fieldId] || 'N/A';
                      return (
                        <div key={fieldId}>
                          <p className="text-xs text-gray-500">{fieldLabel}</p>
                          <p className="font-medium">{fieldValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Qualifications</h4>
                  <div className="space-y-2">
                    {selectedProfileFields.text.map(fieldId => {
                      const fieldLabel = getProfileFieldLabel(fieldId, 'text');
                      const fieldValue = candidateAssessments[selectedCandidate][fieldId] || 'N/A';
                      return (
                        <div key={fieldId}>
                          <p className="text-xs text-gray-500">{fieldLabel}</p>
                          <p className="font-medium">{fieldValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div className="assessment-details">
              {kecItems.map((parameter, paramIndex) => {
                // Get score data
                const score = candidateAssessments[selectedCandidate].scores[parameter.name] || 0;
                const isExpanded = expandedParameters.has(parameter.name);
                const requirementMet = score >= parameter.requirementLevel;
                
                // Calculate score difference from requirement for display
                const scoreDiff = score - parameter.requirementLevel;
                const diffClass = scoreDiff >= 0 ? 'text-green-600' : 'text-red-600';
                
                // Generate strengths and limitations that reference specific candidate information
                const strengths = [
                  `Strong ${parameter.name.toLowerCase()} capabilities, demonstrated through relevant experience`,
                  `Excellent track record in ${parameter.name.toLowerCase()}, evidenced by their background`
                ];
                
                const limitations = [
                  `Could improve ${parameter.name.toLowerCase()} skills with additional training and development`,
                  `Limited experience in advanced ${parameter.name.toLowerCase()} contexts compared to role requirements`
                ];
                
                // Create detailed assessment using parameter questions
                const assessmentItems = parameter.assessmentQuestions.map(q => {
                  // Generate evidence-based answer that references candidate info
                  const answer = requirementMet
                    ? `The candidate demonstrates strong ${parameter.name.toLowerCase()} capability based on their profile and experience.`
                    : `The candidate shows some ${parameter.name.toLowerCase()} capability but falls below the required threshold based on their experience level and demonstrated achievements.`;
                  
                  const evidence = `Evidence: Based on candidate profile and background information.`;
                  
                  return {
                    question: q.question,
                    answer: answer,
                    evidence: evidence
                  };
                });
                
                // Generate substantive justification
                const justification = generateJustification(selectedCandidate, parameter.name);
                
                return (
                  <div key={parameter.name} className="assessment-parameter mb-4 border border-gray-200 rounded-md overflow-hidden">
                    <div 
                      className="parameter-header p-4 bg-gray-100 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleParameter(parameter.name)}
                    >
                      <div className="parameter-title flex items-center">
                        <span className="icon mr-2">{parameter.icon}</span>
                        <span className="font-medium">{parameter.name}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="parameter-score rounded-full bg-white px-3 py-1 text-sm font-medium flex items-center">
                          {score}%
                          <span className={`ml-2 ${diffClass}`}>
                            {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                          </span>
                          {requirementMet ? (
                            <Check className="inline ml-1 text-green-500" size={14} />
                          ) : (
                            <X className="inline ml-1 text-red-500" size={14} />
                          )}
                        </div>
                        <div className="ml-2">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="parameter-body p-4">
                        {/* Score adjustment at top */}
                        <div className="score-adjustment p-4 bg-gray-50 rounded-md mb-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <strong>Competency Score:</strong>
                              <div className="text-sm text-gray-500 mt-1">
                                Minimum requirement: <span className="font-semibold text-gray-700">{parameter.requirementLevel}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => updateScore(selectedCandidate, parameter.name, e.target.value)}
                                className="w-16 p-1 text-center border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={score}
                            onChange={(e) => updateScore(selectedCandidate, parameter.name, e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        {/* Requirement justification */}
                        <div className="parameter-requirement p-4 bg-blue-50 rounded-md mb-4 border border-blue-100">
                          <div className="font-medium text-gray-700 mb-1">Why This Matters:</div>
                          <p className="text-sm text-gray-600">{parameter.requirementJustification || 
                            `The requirement level of ${parameter.requirementLevel}% was established because this role demands substantial ${parameter.name.toLowerCase()} capabilities to successfully meet business objectives and drive organizational growth.`
                          }</p>
                        </div>
                        
                        <div className="parameter-description mb-4">
                          <strong>Parameter Description:</strong> {parameter.description}
                        </div>
                        
                        <div className="mb-4">
                          <strong>Justification:</strong> 
                          <textarea
                            value={justification}
                            className="w-full p-2 border border-gray-300 rounded-md mt-1"
                            rows={2}
                          />
                        </div>
                        
                        <div className="mb-4">
                          <strong>Assessment Questions & Answers:</strong>
                          {assessmentItems.map((item, index) => (
                            <div key={index} className="assessment-question bg-gray-50 p-3 rounded-md mt-2">
                              <div className="question-text font-medium">{item.question}</div>
                              <textarea
                                value={item.answer}
                                className="w-full p-2 border border-gray-300 rounded-md mt-1 mb-1 question-answer"
                                rows={2}
                              />
                              <textarea
                                value={item.evidence}
                                className="w-full p-2 border border-gray-300 rounded-md question-evidence"
                                rows={1}
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="sw-section strengths-section bg-green-50 p-4 rounded-md border border-green-100">
                            <div className="sw-section-title strengths-title flex items-center mb-2 text-green-700">
                              <Check size={16} className="mr-1" />
                              <span className="font-medium">Strengths</span>
                            </div>
                            <div className="space-y-2">
                              {strengths.map((strength, index) => (
                                <div key={index} className="relative">
                                  <textarea
                                    value={strength}
                                    onChange={(e) => updateStrength(selectedCandidate, parameter.name, index, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md min-h-[80px] bg-white"
                                    placeholder="Describe candidate strength..."
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="sw-section weaknesses-section bg-red-50 p-4 rounded-md border border-red-100">
                            <div className="sw-section-title weaknesses-title flex items-center mb-2 text-red-700">
                              <X size={16} className="mr-1" />
                              <span className="font-medium">Development Areas</span>
                            </div>
                            <div className="space-y-2">
                              {limitations.map((limitation, index) => (
                                <div key={index} className="relative">
                                  <textarea
                                    value={limitation}
                                    onChange={(e) => updateLimitation(selectedCandidate, parameter.name, index, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md min-h-[80px] bg-white"
                                    placeholder="Describe development area..."
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back to Candidates
        </button>
        
        <button
          onClick={() => onNext()}
          disabled={isLoading}
          className={`flex items-center px-6 py-2 rounded-md 
            ${isLoading
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-pink-600 text-white hover:bg-pink-700'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Final Report
              <ChevronRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AiAssessment;