// src/components/wizard/ProgressIndicator.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { WizardStage, ProgressIndicatorProps } from './types';

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStage }) => {
  const stages: { key: WizardStage; label: string }[] = [
    { key: 'jobCollection', label: 'Job Details' },
    { key: 'jobReview', label: 'Job Review' },
    { key: 'candidateCollection', label: 'Candidates' },
    { key: 'aiAssessment', label: 'AI Assessment' },
    { key: 'finalReport', label: 'Final Report' },
  ];
  
  const currentStageIndex = stages.findIndex(s => s.key === currentStage);
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stages.map((s, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          
          return (
            <div key={s.key} className="flex flex-col items-center relative">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isCurrent 
                  ? 'bg-pink-600 text-white' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="mt-2 text-sm">{s.label}</span>
              
              {/* Connect the dots with lines */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute left-0" style={{ top: '20px', width: '80px', height: '2px' }}>
                  <div className={`absolute left-10 h-0.5 w-full ${
                    index < currentStageIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;