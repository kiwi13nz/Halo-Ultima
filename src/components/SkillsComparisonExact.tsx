import React from 'react';
import { EvaluationParameter, CandidateEvaluation } from '../types';
import { Download } from 'lucide-react';

interface SkillsComparisonExactProps {
  evaluationParameters: EvaluationParameter[];
  candidateEvaluations: Record<string, CandidateEvaluation>;
  candidateColors: Record<string, string>;
  onExportPdf?: () => void;
}

export function SkillsComparisonExact({ 
  evaluationParameters, 
  candidateEvaluations,
  candidateColors,
  onExportPdf
}: SkillsComparisonExactProps) {
  const candidateNames = Object.keys(candidateEvaluations);
  
  const handleDownloadPDF = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      alert('PDF export functionality would be implemented here');
    }
  };
  
  // Helper function to find a parameter score for a candidate
  const findParameterScore = (candidateName: string, parameterName: string): number => {
    const evaluation = candidateEvaluations[candidateName];
    if (!evaluation) return 0;
    
    const scoreObj = evaluation.evaluationScores.find(
      score => score.parameterName === parameterName
    );
    
    return scoreObj ? scoreObj.score : 0;
  };
  
  return (
    <div className="hr-card">
      <div className="flex items-center justify-between">
        <h2 className="hr-title">Candidate Skills vs. Role Requirements</h2>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>
      
      <div className="stat-comparison">
        <div className="stat-title">Skills Assessment Against Role Requirements</div>
        
        <div className="stat-grid">
          {evaluationParameters.map((parameter) => (
            <React.Fragment key={parameter.name}>
              <div className="stat-category">
                <span className="icon">{parameter.icon}</span>{parameter.name}
              </div>
              <div className="stat-bars-container">
                {candidateNames.map((candidateName) => {
                  const score = findParameterScore(candidateName, parameter.name);
                  const requirementLevel = parameter.requirementLevel;
                  const difference = score - requirementLevel;
                  
                  const candidateClass = candidateName.toLowerCase().includes('sarah') 
                    ? 'sarah-bar' 
                    : candidateName.toLowerCase().includes('james') 
                      ? 'james-bar' 
                      : 'emily-bar';
                  
                  return (
                    <div key={candidateName} className="candidate-stat-row">
                      <div 
                        className="candidate-indicator" 
                        style={{ color: candidateColors[candidateName] }}
                      >
                        {candidateName.split(' ')[0]}
                      </div>
                      <div className="bar-container">
                        <div className="requirement-bar">
                          <div 
                            className="requirement-level"
                            style={{ width: `${requirementLevel}%` }}
                          ></div>
                          <div 
                            className={`candidate-bar ${candidateClass}`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`difference-indicator ${difference >= 0 ? 'positive' : 'negative'}`}>
                        {difference > 0 ? `+${difference}%` : difference < 0 ? `${difference}%` : '0%'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
        
        <div className="legend">
          <div className="legend-item">
            <div className="requirement-indicator"></div>
            <span>Minimum Requirement</span>
          </div>
          {candidateNames.map((name) => {
            const className = name.toLowerCase().includes('sarah') 
              ? 'sarah' 
              : name.toLowerCase().includes('james') 
                ? 'james' 
                : 'emily';
            
            return (
              <div key={name} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: `var(--${className})` }}
                ></div>
                <span>{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}