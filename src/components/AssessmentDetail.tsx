import React, { useState } from 'react';
import { CandidateEvaluation, EvaluationParameter } from '../types';
import { ChevronUp, ChevronDown, Check, X } from 'lucide-react';

interface AssessmentDetailProps {
  candidate: CandidateEvaluation;
  parameters: EvaluationParameter[];
  color: string;
}

export function AssessmentDetail({ candidate, parameters, color }: AssessmentDetailProps) {
  const [expandedParameters, setExpandedParameters] = useState<string[]>([]);
  
  const toggleParameter = (paramName: string) => {
    if (expandedParameters.includes(paramName)) {
      setExpandedParameters(expandedParameters.filter(p => p !== paramName));
    } else {
      setExpandedParameters([...expandedParameters, paramName]);
    }
  };
  
  // Find matching parameter
  const findParameter = (paramName: string): EvaluationParameter | undefined => {
    return parameters.find(p => p.name === paramName);
  };
  
  return (
    <div className="hr-card">
      <h2 className="hr-title">
        Assessment Details: {candidate.candidateName}
      </h2>
      
      <p style={{ marginBottom: '1.5rem' }}>{candidate.overallAssessment}</p>
      
      <div className="assessment-details">
        {candidate.evaluationScores.map(score => {
          const parameter = findParameter(score.parameterName);
          const isExpanded = expandedParameters.includes(score.parameterName);
          
          if (!parameter) return null;
          
          const requirementMet = score.score >= parameter.requirementLevel;
          
          return (
            <div key={score.parameterName} className="assessment-parameter">
              <div 
                className="parameter-header" 
                style={{ backgroundColor: color }}
                onClick={() => toggleParameter(score.parameterName)}
              >
                <div className="parameter-title">
                  <span className="icon">{parameter.icon}</span>
                  {score.parameterName}
                </div>
                <div className="flex items-center">
                  <div className="parameter-score">
                    {score.score}%
                    {requirementMet ? (
                      <Check className="inline ml-1" size={14} />
                    ) : (
                      <X className="inline ml-1" size={14} />
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="ml-2" size={20} />
                  ) : (
                    <ChevronDown className="ml-2" size={20} />
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className="parameter-body">
                  <div className="parameter-description">
                    <strong>Parameter Description:</strong> {parameter.description}
                  </div>
                  
                  <div className="mb-4">
                    <strong>Justification:</strong> {score.justification}
                  </div>
                  
                  <div className="mb-4">
                    <strong>Assessment Questions & Answers:</strong>
                    {score.assessment.map((item, index) => (
                      <div key={index} className="assessment-question">
                        <div className="question-text">{item.question}</div>
                        <div className="question-answer">{item.answer}</div>
                        <div className="question-evidence">Evidence: {item.evidence}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="sw-sections">
                    <div className="sw-section strengths-section">
                      <div className="sw-section-title strengths-title">
                        <Check size={16} />
                        Strengths
                      </div>
                      <ul>
                        {score.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="sw-section weaknesses-section">
                      <div className="sw-section-title weaknesses-title">
                        <X size={16} />
                        Development Areas
                      </div>
                      <ul>
                        {score.limitations.map((limitation, index) => (
                          <li key={index}>{limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}