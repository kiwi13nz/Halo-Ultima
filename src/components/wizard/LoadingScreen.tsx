import React, { useState, useEffect } from 'react';

interface AiProcessingLoaderProps {
  stage: 'job-analysis' | 'candidate-evaluation';
  onComplete?: () => void;
  duration?: number; // in milliseconds
}

const AiProcessingLoader: React.FC<AiProcessingLoaderProps> = ({ 
  stage, 
  onComplete,
  duration = 60000 // 1 minute default
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  const jobAnalysisSteps = [
    "Analyzing job description...",
    "Extracting key requirements...", 
    "Identifying evaluation criteria...",
    "Generating assessment questions...",
    "Creating insights framework...",
    "Finalizing analysis..."
  ];

  const candidateEvaluationSteps = [
    "Processing candidate resumes...",
    "Analyzing qualifications...",
    "Evaluating against criteria...", 
    "Calculating competency scores...",
    "Generating assessments...",
    "Preparing final evaluation..."
  ];

  const steps = stage === 'job-analysis' ? jobAnalysisSteps : candidateEvaluationSteps;

  // Initialize floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Progress simulation
  useEffect(() => {
    const stepDuration = duration / steps.length;
    const progressInterval = 100; // Update every 100ms
    const progressIncrement = (100 / steps.length) / (stepDuration / progressInterval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressIncrement;
        const newStep = Math.floor((newProgress / 100) * steps.length);
        
        if (newStep !== currentStep && newStep < steps.length) {
          setCurrentStep(newStep);
        }

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [duration, steps.length, currentStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#4A6460] via-[#5F6D74] to-[#4A6460] flex items-center justify-center z-50">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
          {Array.from({ length: 48 }, (_, i) => (
            <div 
              key={i} 
              className="bg-white rounded opacity-20"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-[#E7D0C5] rounded-full opacity-40"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float 6s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        {/* AI Brain Icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-[#E7D0C5] rounded-full animate-spin opacity-60" 
                 style={{ animationDuration: '3s' }} />
            
            {/* Middle ring */}
            <div className="absolute inset-2 border-4 border-[#E4D8C5] rounded-full animate-spin opacity-80" 
                 style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            
            {/* Inner core */}
            <div className="absolute inset-6 bg-gradient-to-br from-[#E7D0C5] to-[#E4D8C5] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#4A6460] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>

            {/* Pulsing nodes around the brain */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-[#E7D0C5] rounded-full"
                style={{
                  transform: `rotate(${angle}deg) translateY(-50px)`,
                  animation: `pulse 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Company branding */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            HALO EXECUTIVE SEARCH
          </h1>
          <p className="text-[#E7D0C5] text-lg font-light">
            AI-Powered Talent Assessment
          </p>
        </div>

        {/* Current step */}
        <div className="mb-8">
          <div className="text-[#E4D8C5] text-xl font-medium mb-4">
            {steps[currentStep] || steps[0]}
          </div>
          
          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-[#5F6D74] bg-opacity-50 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#E7D0C5] to-[#E4D8C5] rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </div>
          </div>
          
          <div className="text-[#E4D8C5] text-sm mt-2 font-light">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Neural network visualization */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-8">
            {/* Data nodes */}
            {[1, 2, 3, 4, 5].map((node, i) => (
              <div key={i} className="relative">
                <div 
                  className={`w-4 h-4 rounded-full bg-[#E7D0C5] ${
                    currentStep >= i ? 'opacity-100 animate-pulse' : 'opacity-30'
                  }`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
                {i < 4 && (
                  <div 
                    className={`absolute top-1/2 left-4 w-8 h-0.5 ${
                      currentStep > i ? 'bg-[#E7D0C5]' : 'bg-[#5F6D74]'
                    } transition-colors duration-500`}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI processing indicators */}
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="text-[#E4D8C5]">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-sm font-light">Neural Analysis</div>
          </div>
          <div className="text-[#E4D8C5]">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-light">Deep Learning</div>
          </div>
          <div className="text-[#E4D8C5]">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-light">Smart Matching</div>
          </div>
        </div>

        {/* Estimated time */}
        <div className="mt-8 text-[#E4D8C5] text-sm font-light opacity-75">
          Estimated time remaining: {Math.max(0, Math.ceil((100 - progress) * duration / 100000))} seconds
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AiProcessingLoader;