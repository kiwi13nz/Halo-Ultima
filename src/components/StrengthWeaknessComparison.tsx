import React from 'react';
import { EvaluationParameter, CandidateEvaluation } from '../types';

interface StrengthWeaknessComparisonProps {
  evaluationParameters: EvaluationParameter[];
  candidateEvaluations: Record<string, CandidateEvaluation>;
}

export function StrengthWeaknessComparison({ 
  evaluationParameters, 
  candidateEvaluations 
}: StrengthWeaknessComparisonProps) {
  const candidateNames = Object.keys(candidateEvaluations);
  
  // Helper function to extract relevant parameter data
  const getParameterScoreData = (paramName: string, candidateName: string) => {
    const evaluation = candidateEvaluations[candidateName];
    if (!evaluation) return null;
    
    return evaluation.evaluationScores.find(
      score => score.parameterName === paramName
    );
  };
  
  return (
    <div className="hr-card">
      <h2 className="hr-title">Strength-Weakness Comparison</h2>
      
      <div className="strengths-weaknesses">
        <p className="mb-4">Side-by-side analysis of key strengths and limitations for each candidate. This comparison highlights their complementary skills and areas requiring development.</p>
        
        <table className="sw-table">
          <thead>
            <tr>
              <th>Factor</th>
              {candidateNames.map(name => (
                <th key={name}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evaluationParameters.map(parameter => (
              <tr key={parameter.name}>
                <td>{parameter.name}</td>
                
                {candidateNames.map(candidateName => {
                  const scoreData = getParameterScoreData(parameter.name, candidateName);
                  
                  if (!scoreData) {
                    return <td key={candidateName}>No data available</td>;
                  }
                  
                  const hasStrengths = scoreData.strengths.length > 0;
                  const hasLimitations = scoreData.limitations.length > 0;
                  
                  return (
                    <td key={candidateName}>
                      <ul className="sw-list">
                        {scoreData.strengths.map((strength, index) => (
                          <li key={`strength-${index}`} className="strength-item">
                            <span className="sw-icon">+</span>
                            <span className="sw-text">{strength}</span>
                          </li>
                        ))}
                        
                        {hasStrengths && hasLimitations && (
                          <div className="sw-divider"></div>
                        )}
                        
                        {scoreData.limitations.map((limitation, index) => (
                          <li key={`limitation-${index}`} className="weakness-item">
                            <span className="sw-icon">−</span>
                            <span className="sw-text">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}