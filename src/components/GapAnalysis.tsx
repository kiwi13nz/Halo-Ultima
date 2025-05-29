import React from 'react';
import { EvaluationParameter, CandidateEvaluation } from '../types';

interface GapAnalysisProps {
  evaluationParameters: EvaluationParameter[];
  candidateEvaluations: Record<string, CandidateEvaluation>;
}

export function GapAnalysis({ evaluationParameters, candidateEvaluations }: GapAnalysisProps) {
  const candidateNames = Object.keys(candidateEvaluations);
  
  // Helper function to find a parameter score for a candidate
  const findParameterScore = (candidateName: string, parameterName: string): number => {
    const evaluation = candidateEvaluations[candidateName];
    if (!evaluation) return 0;
    
    const scoreObj = evaluation.evaluationScores.find(
      score => score.parameterName === parameterName
    );
    
    return scoreObj ? scoreObj.score : 0;
  };
  
  // Determine gap class based on difference
  const getGapClass = (difference: number): string => {
    if (difference >= 0) return "gap-none";
    if (difference >= -10) return "gap-minor";
    return "gap-major";
  };
  
  return (
    <div className="hr-card">
      <h2 className="hr-title">Gap Analysis vs. Ideal Profile</h2>
      
      <p className="mb-4">This analysis identifies competency gaps by comparing each candidate's profile against the ideal profile defined by your requirements. Visual indicators highlight areas where development may be needed.</p>
      
      <table className="gap-table">
        <thead>
          <tr>
            <th>Competency</th>
            <th>Ideal Profile</th>
            {candidateNames.map(name => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {evaluationParameters.map(parameter => (
            <tr key={parameter.name}>
              <td>{parameter.name}</td>
              <td>
                <div className="progress-container">
                  <div 
                    className="progress-bar progress-bar-ideal" 
                    style={{ width: `${parameter.requirementLevel}%` }}
                  ></div>
                </div>
              </td>
              
              {candidateNames.map(candidateName => {
                const score = findParameterScore(candidateName, parameter.name);
                const difference = score - parameter.requirementLevel;
                const gapClass = getGapClass(difference);
                const candidateClass = candidateName.toLowerCase().includes('sarah') 
                  ? 'progress-bar-sarah' 
                  : candidateName.toLowerCase().includes('james') 
                    ? 'progress-bar-james' 
                    : 'progress-bar-emily';
                
                return (
                  <td key={candidateName}>
                    <div className="progress-container">
                      <div 
                        className={`progress-bar ${candidateClass}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className={`gap-indicator ${gapClass}`}>
                      {difference > 0 ? `+${difference}` : difference}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <p className="mt-4">
        <strong>Gap Indicators:</strong> 
        <span style={{ color: "var(--green)", fontWeight: "bold" }}> Green (+)</span> = exceeds requirements, 
        <span style={{ color: "var(--yellow)", fontWeight: "bold" }}> Yellow (-)</span> = minor development needs, 
        <span style={{ color: "var(--red)", fontWeight: "bold" }}> Red (-)</span> = significant development needs
      </p>
    </div>
  );
}