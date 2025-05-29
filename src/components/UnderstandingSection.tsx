import React from 'react';
import { EvaluationParameter } from '../types';

interface UnderstandingSectionProps {
  jobDescription: string;
  evaluationParameters: EvaluationParameter[];
}

export function UnderstandingSection({ 
  jobDescription, 
  evaluationParameters 
}: UnderstandingSectionProps) {
  // Create insight objects from evaluation parameters
  const createInsightsFromParameters = (): React.ReactNode[] => {
    // Get core parameters (highest requirement level)
    const sortedParams = [...evaluationParameters].sort((a, b) => 
      b.requirementLevel - a.requirementLevel
    );
    
    // Take the top 3 as core needs, the rest as insights
    const coreNeeds = sortedParams.slice(0, 3);
    const insights = sortedParams.slice(3);
    
    // Create elements for both types
    const coreElements = coreNeeds.map((param, index) => (
      <div key={`core-${index}`} className="understanding-item core-need">
        <span className="insight-tag tag-core">CORE NEED</span>
        <h3>
          <span className="emoji">{param.icon}</span>
          {param.name}
        </h3>
        <p>{param.description}</p>
      </div>
    ));
    
    const insightElements = insights.map((param, index) => {
      const insightClasses = [
        'understanding-item insight-primary',
        'understanding-item insight-secondary',
        'understanding-item insight-tertiary'
      ];
      
      const tagClasses = [
        'insight-tag tag-insight1',
        'insight-tag tag-insight2',
        'insight-tag tag-insight3'
      ];
      
      const classIndex = index % 3;
      
      return (
        <div key={`insight-${index}`} className={insightClasses[classIndex]}>
          <span className={tagClasses[classIndex]}>INSIGHT</span>
          <h3>
            <span className="emoji">{param.icon}</span>
            {param.name}
          </h3>
          <p>{param.description}</p>
        </div>
      );
    });
    
    // Mix core needs and insights to create a balanced layout
    const allElements = [...coreElements, ...insightElements];
    
    return allElements;
  };

  // Split insights for two columns
  const allInsights = createInsightsFromParameters();
  const halfLength = Math.ceil(allInsights.length / 2);
  const leftColumnInsights = allInsights.slice(0, halfLength);
  const rightColumnInsights = allInsights.slice(halfLength);
  
  return (
    <div className="hr-card">
      <h2 className="hr-title">Understanding Your Requirements</h2>
      
      <p className="mb-4">Based on our analysis of your job description, we've developed the following understanding of your requirements for this role.</p>
      
      <div className="understanding-grid">
        <div className="understanding-column">
          {leftColumnInsights}
        </div>
        
        <div className="understanding-column">
          {rightColumnInsights}
        </div>
      </div>
    </div>
  );
}