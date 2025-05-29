// src/components/wizard/JobReview.tsx - Fully translated version
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JobReviewProps } from './types';
import { AssessmentQuestion } from '../../types';

const JobReview: React.FC<JobReviewProps> = ({
  onPrevious,
  onNext,
  isLoading,
  kecItems,
  setKecItems,
  insightFlags,
  setInsightFlags,
  executiveSummary,
  setExecutiveSummary
}) => {
  const { t } = useTranslation(['wizard', 'common']);
  const [expandedParams, setExpandedParams] = useState<Set<number>>(new Set([0]));
  const [isEditingKEC, setIsEditingKEC] = useState(false);
  const [isEditingInsights, setIsEditingInsights] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [kecDescription, setKecDescription] = useState<string>(
    t('jobReview.keyEvaluationCriteria') + ". " + t('jobReview.subtitle')
  );

  // Toggle expanded state for a parameter
  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedParams);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedParams(newExpanded);
  };
  
  // Add a new parameter
  const addParameter = () => {
    const newParam = {
      name: t('common:fields.name'),
      description: t('common:fields.description'),
      requirementLevel: 75,
      requirementJustification: t('jobReview.requirementJustification', { percentage: 75 }),
      icon: "✨",
      assessmentQuestions: [
        {
          question: t('jobReview.questionPlaceholder'),
          rationale: t('jobReview.rationalePlaceholder'),
          idealAnswer: t('jobReview.idealAnswerPlaceholder')
        }
      ]
    };
    
    const newParams = [...kecItems, newParam];
    setKecItems(newParams);
    
    // Auto-expand the new parameter
    setExpandedParams(new Set([newParams.length - 1]));
  };
  
  // Delete a parameter
  const deleteParameter = (index: number) => {
    const newParams = kecItems.filter((_, i) => i !== index);
    setKecItems(newParams);
    
    // Update expanded set
    const newExpanded = new Set<number>();
    expandedParams.forEach(expIndex => {
      if (expIndex < index) newExpanded.add(expIndex);
      else if (expIndex > index) newExpanded.add(expIndex - 1);
    });
    setExpandedParams(newExpanded);
  };
  
  // Update parameter field
  const updateParameter = (index: number, field: keyof typeof kecItems[0], value: any) => {
    const newParams = [...kecItems];
    newParams[index] = { ...newParams[index], [field]: value };
    setKecItems(newParams);
  };
  
  // Add a question to a parameter
  const addQuestion = (paramIndex: number) => {
    const newParams = [...kecItems];
    newParams[paramIndex].assessmentQuestions.push({
      question: t('jobReview.questionPlaceholder'),
      rationale: t('jobReview.rationalePlaceholder'),
      idealAnswer: t('jobReview.idealAnswerPlaceholder')
    });
    setKecItems(newParams);
  };
  
  // Delete a question
  const deleteQuestion = (paramIndex: number, questionIndex: number) => {
    const newParams = [...kecItems];
    newParams[paramIndex].assessmentQuestions = newParams[paramIndex].assessmentQuestions
      .filter((_, i) => i !== questionIndex);
    setKecItems(newParams);
  };
  
  // Update question field
  const updateQuestion = (
    paramIndex: number, 
    questionIndex: number, 
    field: keyof AssessmentQuestion, 
    value: string
  ) => {
    const newParams = [...kecItems];
    newParams[paramIndex].assessmentQuestions[questionIndex][field] = value;
    setKecItems(newParams);
  };
  
  // Validate all parameters have names
  const validateParameters = () => {
    for (const param of kecItems) {
      if (!param.name.trim()) {
        return false;
      }
    }
    return true;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateParameters()) {
      onNext();
    } else {
      alert(t('jobReview.validation.allParametersMustHaveNames'));
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">{t('jobReview.title')}</h2>
      <p className="text-gray-600 mb-6">
        {t('jobReview.subtitle')}
      </p>
      
      {/* Executive Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">{t('jobReview.executiveSummary')}</h3>
          <button 
            onClick={() => setIsEditingSummary(!isEditingSummary)}
            className="text-pink-600 hover:text-pink-800 flex items-center"
          >
            {isEditingSummary ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                {t('jobReview.doneEditing')}
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-1" />
                {t('common:buttons.edit')}
              </>
            )}
          </button>
        </div>
        
        {isEditingSummary ? (
          <textarea
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-sm mb-4"
            rows={5}
          />
        ) : (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <p className="text-gray-700">
              {typeof executiveSummary === 'string' ? executiveSummary : JSON.stringify(executiveSummary)}
            </p>
          </div>
        )}
      </div>

      {/* Key Evaluation Criteria (KEC) */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">{t('jobReview.keyEvaluationCriteria')}</h3>
          <button 
            onClick={() => setIsEditingKEC(!isEditingKEC)}
            className="text-pink-600 hover:text-pink-800 flex items-center"
          >
            {isEditingKEC ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                {t('jobReview.doneEditing')}
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-1" />
                {t('common:buttons.edit')}
              </>
            )}
          </button>
        </div>
        
        {isEditingKEC ? (
          <textarea
            value={kecDescription}
            onChange={(e) => setKecDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-md text-sm mb-4"
            rows={2}
          />
        ) : (
          <p className="mb-4">{kecDescription}</p>
        )}
        
        <ul className="requirements-list mb-6">
          {kecItems.map((kec, index) => (
            <li key={index} className="flex items-start mb-2">
              {isEditingKEC ? (
                <textarea
                  value={kec.description}
                  onChange={(e) => updateParameter(index, 'description', e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-md text-sm"
                  rows={1}
                />
              ) : (
                <span>{kec.description}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Key Insights */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">{t('jobReview.keyInsights')}</h3>
          <button 
            onClick={() => setIsEditingInsights(!isEditingInsights)}
            className="text-pink-600 hover:text-pink-800 flex items-center"
          >
            {isEditingInsights ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                {t('jobReview.doneEditing')}
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-1" />
                {t('common:buttons.edit')}
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insightFlags.map((flag, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                flag.type === 'insight' 
                  ? 'bg-pink-50 border border-pink-100' 
                  : 'bg-blue-50 border border-blue-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{flag.emoji}</span>
                {isEditingInsights ? (
                  <input
                    type="text"
                    value={flag.title}
                    onChange={(e) => {
                      const newFlags = [...insightFlags];
                      newFlags[index].title = e.target.value;
                      setInsightFlags(newFlags);
                    }}
                    className="font-semibold border border-gray-300 bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded px-2 py-1"
                  />
                ) : (
                  <h4 className="font-semibold">{flag.title}</h4>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ml-auto ${
                  flag.type === 'insight' 
                    ? 'bg-pink-100 text-pink-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {t(`jobReview.insightType.${flag.type}`)}
                </span>
              </div>
              
              {isEditingInsights ? (
                <textarea
                  value={flag.description}
                  onChange={(e) => {
                    const newFlags = [...insightFlags];
                    newFlags[index].description = e.target.value;
                    setInsightFlags(newFlags);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700">{flag.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Parameters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">{t('jobReview.assessmentParameters')}</h3>
          <button 
            onClick={() => setIsEditingKEC(!isEditingKEC)}
            className="text-pink-600 hover:text-pink-800 flex items-center"
          >
            {isEditingKEC ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                {t('jobReview.doneEditing')}
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-1" />
                {t('common:buttons.edit')}
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {kecItems.map((kec, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="text-2xl mr-3">{kec.icon}</div>
                {isEditingKEC ? (
                  <div className="flex flex-col flex-1">
                    <input
                      type="text"
                      value={kec.name}
                      onChange={(e) => {
                        updateParameter(index, 'name', e.target.value);
                      }}
                      className="font-semibold text-lg border border-gray-300 bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded px-2 py-1 w-full"
                    />
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 mr-2">{t('jobReview.icon')}</span>
                      <input
                        type="text"
                        value={kec.icon}
                        onChange={(e) => {
                          updateParameter(index, 'icon', e.target.value);
                        }}
                        className="w-12 text-center border border-gray-300 bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                ) : (
                  <h4 className="font-semibold text-lg">{kec.name}</h4>
                )}
                <div className="ml-auto flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {t('common:fields.requirement')}: <strong>{kec.requirementLevel}%</strong>
                  </span>
                  {isEditingKEC && (
                    <input
                      type="number"
                      min="5"
                      max="100"
                      step="5"
                      value={kec.requirementLevel}
                      onChange={(e) => {
                        updateParameter(index, 'requirementLevel', parseInt(e.target.value) || 0);
                      }}
                      className="w-16 text-center p-1 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              </div>
              
              {isEditingKEC ? (
                <textarea
                  value={kec.description}
                  onChange={(e) => {
                    updateParameter(index, 'description', e.target.value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md mb-2"
                  rows={2}
                />
              ) : (
                <p className="text-gray-600 mb-2">{kec.description}</p>
              )}

              {/* Requirement justification */}
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-3">
                <div className="font-medium text-blue-800 mb-1 text-sm">
                  {t('jobReview.whyThisPercentage', { percentage: kec.requirementLevel })}
                </div>
                {isEditingKEC ? (
                  <textarea
                    value={kec.requirementJustification || ''}
                    onChange={(e) => {
                      updateParameter(index, 'requirementJustification', e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    rows={2}
                    placeholder={t('jobReview.requirementJustification', { percentage: kec.requirementLevel })}
                  />
                ) : (
                  <p className="text-sm text-gray-700">
                    {kec.requirementJustification || 
                     t('jobReview.requirementJustification', { percentage: kec.requirementLevel })}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => toggleExpanded(index)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  {expandedParams.has(index) ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      {t('jobReview.hideQuestions')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      {t('jobReview.showQuestions')}
                    </>
                  )}
                </button>
                
                {isEditingKEC && (
                  <button
                    onClick={() => deleteParameter(index)}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t('common:buttons.delete')}
                  </button>
                )}
              </div>
              
              {/* Assessment questions */}
              {expandedParams.has(index) && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">{t('jobReview.assessmentQuestions')}</h4>
                    {isEditingKEC && (
                      <button
                        onClick={() => addQuestion(index)}
                        className="text-pink-600 hover:text-pink-800 text-xs font-medium flex items-center"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {t('jobReview.addQuestion')}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {kec.assessmentQuestions.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded-md p-3 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {t('jobReview.question', { number: qIndex + 1 })}
                          </label>
                          {isEditingKEC && (
                            <button
                              onClick={() => deleteQuestion(index, qIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {isEditingKEC ? (
                            <textarea
                              value={question.question}
                              onChange={(e) => updateQuestion(index, qIndex, 'question', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              rows={2}
                              placeholder={t('jobReview.questionPlaceholder')}
                            />
                          ) : (
                            <p className="text-sm font-medium">{question.question}</p>
                          )}
                          
                          {isEditingKEC ? (
                            <>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  {t('jobReview.rationale')}
                                </label>
                                <textarea
                                  value={question.rationale}
                                  onChange={(e) => updateQuestion(index, qIndex, 'rationale', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  rows={1}
                                  placeholder={t('jobReview.rationalePlaceholder')}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  {t('jobReview.idealAnswer')}
                                </label>
                                <textarea
                                  value={question.idealAnswer}
                                  onChange={(e) => updateQuestion(index, qIndex, 'idealAnswer', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  rows={1}
                                  placeholder={t('jobReview.idealAnswerPlaceholder')}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{t('jobReview.rationale')}:</span> {question.rationale}
                              </div>
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{t('jobReview.idealAnswer')}:</span> {question.idealAnswer}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {isEditingKEC && (
          <button
            onClick={addParameter}
            className="flex items-center px-4 py-2 border border-pink-500 text-pink-600 rounded-md hover:bg-pink-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('jobReview.addParameter')}
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          {t('common:buttons.back')}
        </button>
        
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          {t('common:buttons.continue')}
          <ChevronRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default JobReview;