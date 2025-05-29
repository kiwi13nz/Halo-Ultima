// src/components/wizard/JobCollection.tsx - Fixed with translations
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Loader2, Upload, FileText, X, Check, HelpCircle, AlertCircle, Save, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { JobCollectionProps } from './types';
import { parseDocumentText } from '../../services/pdfParsingService';

interface FileWithPreview {
  file: File;
  name: string;
  size: number;
  previewText: string;
  targetField?: 'unassigned' | 'jobDescription' | 'clientRequirements' | 'meetingNotes' | 'recruiterNotes' | 'additionalNotes';
  isProcessing: boolean;
}

interface AutoFilledField {
  fieldName: string;
  fileName: string;
}

const JobCollection: React.FC<JobCollectionProps> = ({
  onPrevious,
  onNext,
  isLoading: propIsLoading,
  setIsLoading: propSetIsLoading,
  setError,
  clientName,
  setClientName,
  roleTitle,
  setRoleTitle,
  jobDescription,
  setJobDescription,
  clientRequirements,
  setClientRequirements,
  meetingNotes,
  setMeetingNotes,
  recruiterNotes,
  setRecruiterNotes,
  additionalNotes,
  setAdditionalNotes,
  jobFiles,
  setJobFiles,
  fileInputRef
}) => {
  const { t } = useTranslation(['common', 'wizard']);
  
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = propIsLoading || internalLoading;
  const setIsLoading = (loading: boolean) => {
    propSetIsLoading(loading);
    setInternalLoading(loading);
  };
  
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [autoFilledFields, setAutoFilledFields] = useState<AutoFilledField[]>([]);
  const [isCoreExpanded, setIsCoreExpanded] = useState(true);
  const [isAdditionalExpanded, setIsAdditionalExpanded] = useState(false);
  const prevFieldsFilledRef = useRef(false);

  useEffect(() => {
    const clientNameValid = clientName && clientName.trim().length > 0;
    const roleTitleValid = roleTitle && roleTitle.trim().length > 0;
    const jobDescriptionValid = jobDescription && jobDescription.trim().length > 300;
    
    const allFieldsFilled = clientNameValid && roleTitleValid && jobDescriptionValid;
    
    if (allFieldsFilled && !prevFieldsFilledRef.current) {
      const timer = setTimeout(() => {
        setIsCoreExpanded(false);
        setIsAdditionalExpanded(true);
      }, 800);
      
      prevFieldsFilledRef.current = true;
      return () => clearTimeout(timer);
    } else if (!allFieldsFilled && prevFieldsFilledRef.current) {
      prevFieldsFilledRef.current = false;
    }
  }, [clientName, roleTitle, jobDescription]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    const newUploadedFiles: FileWithPreview[] = [];
    
    for (const file of acceptedFiles) {
      try {
        const newFile: FileWithPreview = {
          file,
          name: file.name,
          size: file.size,
          previewText: '',
          isProcessing: true
        };
        
        newUploadedFiles.push(newFile);
        
        parseDocumentText(file).then(content => {
          setUploadedFiles(prev => {
            const updated = [...prev];
            const index = updated.findIndex(f => f.name === file.name && f.size === file.size);
            if (index !== -1) {
              updated[index].previewText = content;
              updated[index].isProcessing = false;
              updated[index].targetField = 'unassigned';
            }
            return updated;
          });
        }).catch(error => {
          console.error(`Error processing file ${file.name}:`, error);
          setUploadedFiles(prev => {
            const updated = [...prev];
            const index = updated.findIndex(f => f.name === file.name && f.size === file.size);
            if (index !== -1) {
              updated[index].isProcessing = false;
            }
            return updated;
          });
        });
      } catch (error) {
        console.error(`Error adding file ${file.name}:`, error);
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    setJobFiles(prev => [
      ...prev, 
      ...acceptedFiles.map(file => ({ name: file.name, size: file.size }))
    ]);
    
    setIsLoading(false);
  }, [setIsLoading, setError, setJobFiles]);
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled: isLoading,
    noClick: true
  });

  const clearAutoFilledField = (fieldName: string) => {
    switch (fieldName) {
      case 'jobDescription':
        setJobDescription('');
        break;
      case 'clientRequirements':
        setClientRequirements('');
        break;
      case 'meetingNotes':
        setMeetingNotes('');
        break;
      case 'recruiterNotes':
        setRecruiterNotes('');
        break;
      case 'additionalNotes':
        setAdditionalNotes('');
        break;
    }
    
    setAutoFilledFields(prev => prev.filter(field => field.fieldName !== fieldName));
  };
  
  const autoFillField = (
    fieldName: 'jobDescription' | 'clientRequirements' | 'meetingNotes' | 'recruiterNotes' | 'additionalNotes',
    content: string,
    fileName: string
  ) => {
    switch (fieldName) {
      case 'jobDescription':
        if (!jobDescription) {
          setJobDescription(content);
          setAutoFilledFields(prev => [...prev, { fieldName: 'jobDescription', fileName }]);
        }
        break;
      case 'clientRequirements':
        if (!clientRequirements) {
          setClientRequirements(content);
          setAutoFilledFields(prev => [...prev, { fieldName: 'clientRequirements', fileName }]);
        }
        break;
      case 'meetingNotes':
        if (!meetingNotes) {
          setMeetingNotes(content);
          setAutoFilledFields(prev => [...prev, { fieldName: 'meetingNotes', fileName }]);
        }
        break;
      case 'recruiterNotes':
        if (!recruiterNotes) {
          setRecruiterNotes(content);
          setAutoFilledFields(prev => [...prev, { fieldName: 'recruiterNotes', fileName }]);
        }
        break;
      case 'additionalNotes':
        if (!additionalNotes) {
          setAdditionalNotes(content);
          setAutoFilledFields(prev => [...prev, { fieldName: 'additionalNotes', fileName }]);
        }
        break;
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    setJobFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  const changeFileTarget = (
    index: number, 
    newTarget: 'jobDescription' | 'clientRequirements' | 'meetingNotes' | 'recruiterNotes' | 'additionalNotes'
  ) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      const oldTarget = updated[index].targetField;
      const fileContent = updated[index].previewText;
      updated[index].targetField = newTarget;
      
      if (oldTarget) {
        clearFieldIfMatches(oldTarget, fileContent);
      }
      
      if (fileContent) {
        autoFillField(newTarget, fileContent, updated[index].name);
      }
      
      return updated;
    });
  };

  const clearFieldIfMatches = (
    fieldName: 'jobDescription' | 'clientRequirements' | 'meetingNotes' | 'recruiterNotes' | 'additionalNotes',
    content: string
  ) => {
    switch (fieldName) {
      case 'jobDescription':
        if (jobDescription === content) setJobDescription('');
        break;
      case 'clientRequirements':
        if (clientRequirements === content) setClientRequirements('');
        break;
      case 'meetingNotes':
        if (meetingNotes === content) setMeetingNotes('');
        break;
      case 'recruiterNotes':
        if (recruiterNotes === content) setRecruiterNotes('');
        break;
      case 'additionalNotes':
        if (additionalNotes === content) setAdditionalNotes('');
        break;
    }
    
    setAutoFilledFields(prev => prev.filter(field => field.fieldName !== fieldName));
  };
  
  const isFieldValid = (fieldName: 'clientName' | 'roleTitle' | 'jobDescription') => {
    switch (fieldName) {
      case 'clientName':
        return clientName.trim().length > 0;
      case 'roleTitle':
        return roleTitle.trim().length > 0;
      case 'jobDescription':
        return jobDescription.trim().length > 0;
      default:
        return true;
    }
  };
  
  const isCoreFormValid = () => {
    return isFieldValid('clientName') && isFieldValid('roleTitle') && isFieldValid('jobDescription');
  };
  
  const handleProcessJobInfo = async () => {
    if (!isCoreFormValid()) {
      setError(t('wizard:errors.fillRequiredFields', { defaultValue: 'Please fill in all required fields.' }));
      return;
    }
    
    setIsLoading(true);
    
    try {
      onNext();
    } catch (error) {
      console.error('Error in job processing:', error);
      setIsLoading(false);
      setError(t('wizard:errors.processingFailed', { defaultValue: 'An error occurred while processing the job information. Please try again.' }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">{t('wizard:jobCollection.title', { defaultValue: 'What We\'re Hiring For' })}</h2>
      
      {/* File upload */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-center mr-2">📎</span>
            {t('wizard:jobCollection.uploadFiles', { defaultValue: 'Upload Job-Related Files' })}
          </h3>
          <div className="text-sm text-gray-500">
            {t('wizard:jobCollection.uploadHelp', { defaultValue: 'Upload as many files as you need. We\'ll help you extract the information.' })}
          </div>
        </div>
        
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (!isLoading) {
              open();
            }
          }}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-lg text-blue-500 font-medium">{t('wizard:jobCollection.dropFiles', { defaultValue: 'Drop your files here' })}</p>
          ) : (
            <div>
              <p className="text-lg text-gray-600 font-medium">{t('wizard:jobCollection.dragDrop', { defaultValue: 'Drag & drop files here, or click to select' })}</p>
              <p className="text-sm text-gray-500 mt-2">
                {t('wizard:jobCollection.fileTypes', { defaultValue: 'Upload job descriptions, client briefs, meeting notes, or any other relevant documents' })}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t('wizard:jobCollection.supportedFormats', { defaultValue: 'Supported formats: PDF, Word Documents, and plain text' })}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">{t('wizard:jobCollection.uploadedFiles', { defaultValue: 'Uploaded Files' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  {file.isProcessing ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">{t('common:status.processing')}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">{t('wizard:jobCollection.mappedTo', { defaultValue: 'Mapped to field:' })}</label>
                        <select
                          value={file.targetField || 'unassigned'}
                          onChange={(e) => changeFileTarget(index, e.target.value as any)}
                          className={`text-sm border ${!file.targetField || file.targetField === 'unassigned' ? 'border-red-300 text-red-600' : 'border-gray-300'} rounded-md`}
                        >
                          <option value="unassigned" className="text-red-600 font-medium">{t('wizard:jobCollection.assignField', { defaultValue: '-- Assign to field --' })}</option>
                          <option value="jobDescription">{t('wizard:jobCollection.jobDescription', { defaultValue: 'Job Description' })}</option>
                          <option value="clientRequirements">{t('wizard:jobCollection.clientRequirements', { defaultValue: 'Client Requirements' })}</option>
                          <option value="meetingNotes">{t('wizard:jobCollection.meetingNotes', { defaultValue: 'Meeting Notes' })}</option>
                          <option value="recruiterNotes">{t('wizard:jobCollection.recruiterNotes', { defaultValue: 'Recruiter Notes' })}</option>
                          <option value="additionalNotes">{t('wizard:jobCollection.additionalNotes', { defaultValue: 'Additional Notes' })}</option>
                        </select>
                        {(!file.targetField || file.targetField === 'unassigned') && (
                          <p className="text-xs text-red-500 mt-1">{t('wizard:jobCollection.pleaseAssign', { defaultValue: 'Please assign this file to a field' })}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1">{t('wizard:jobCollection.preview', { defaultValue: 'Preview:' })}</label>
                        <div className="text-xs bg-gray-50 p-2 rounded-md h-16 overflow-y-auto">
                          {file.previewText.substring(0, 150)}
                          {file.previewText.length > 150 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Auto-fill notification */}
      {autoFilledFields.length > 0 && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 font-medium">{t('wizard:jobCollection.autoFilled', { defaultValue: 'We\'ve pre-filled fields using your uploaded files' })}</p>
              <p className="text-sm text-green-700 mt-1">
                {t('wizard:jobCollection.reviewAutoFilled', { defaultValue: 'Review the auto-filled content and edit as needed. You can clear any auto-filled field if you prefer to enter it manually.' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Core info card */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div 
          className="bg-blue-50 px-6 py-4 border-b border-gray-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsCoreExpanded(!isCoreExpanded);
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-center mr-2">1</span>
              {t('wizard:jobCollection.basics', { defaultValue: 'Start with the basics' })}
            </h3>
            <div>
              {isCoreExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 ml-8">
            {t('wizard:jobCollection.basicsSubtitle', { defaultValue: 'This information is required to generate an accurate assessment.' })}
          </p>
        </div>
        
        {isCoreExpanded && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('wizard:jobCollection.clientName', { defaultValue: 'Client Name' })}
                  </label>
                  <div className="text-sm font-medium text-pink-600">({t('wizard:jobCollection.required', { defaultValue: 'Required' })})</div>
                </div>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full p-2 border ${!isFieldValid('clientName') && 'border-red-300 bg-red-50'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
                  placeholder={t('wizard:jobCollection.clientNamePlaceholder', { defaultValue: 'e.g., TechSaaS 200' })}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('wizard:jobCollection.clientNameHelp', { defaultValue: 'Enter the name of the client company' })}
                </p>
                {!isFieldValid('clientName') && (
                  <p className="mt-1 text-sm text-red-600">{t('wizard:jobCollection.clientNameRequired', { defaultValue: 'Client name is required' })}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('wizard:jobCollection.roleTitle', { defaultValue: 'Role Title' })}
                  </label>
                  <div className="text-sm font-medium text-pink-600">({t('wizard:jobCollection.required')})</div>
                </div>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className={`w-full p-2 border ${!isFieldValid('roleTitle') && 'border-red-300 bg-red-50'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
                  placeholder={t('wizard:jobCollection.roleTitlePlaceholder', { defaultValue: 'e.g., Chief Product Officer' })}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('wizard:jobCollection.roleTitleHelp', { defaultValue: 'What is the job title you\'re hiring for?' })}
                </p>
                {!isFieldValid('roleTitle') && (
                  <p className="mt-1 text-sm text-red-600">{t('wizard:jobCollection.roleTitleRequired', { defaultValue: 'Role title is required' })}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('wizard:jobCollection.jobDescription')}
                </label>
                <div className="flex items-center space-x-2">
                  {autoFilledFields.some(f => f.fieldName === 'jobDescription') && (
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 italic bg-yellow-50 px-2 py-1 rounded-full">
                        {t('wizard:jobCollection.autoFilledFrom', { fileName: autoFilledFields.find(f => f.fieldName === 'jobDescription')?.fileName, defaultValue: 'Auto-filled from {{fileName}}' })}
                      </span>
                      <button
                        onClick={() => clearAutoFilledField('jobDescription')}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="text-sm font-medium text-pink-600">({t('wizard:jobCollection.required')})</div>
                </div>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className={`w-full h-40 p-3 border ${!isFieldValid('jobDescription') && 'border-red-300 bg-red-50'} rounded-md resize-none focus:ring-pink-500 focus:border-pink-500`}
                placeholder={t('wizard:jobCollection.jobDescriptionPlaceholder', { defaultValue: 'Paste or enter the full job description here. Include responsibilities, requirements, and qualifications.' })}
              />
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <HelpCircle className="w-4 h-4 mr-1 text-gray-400" />
                {t('wizard:jobCollection.jobDescriptionHelp', { defaultValue: 'The job description is used to extract key evaluation criteria for candidate assessment' })}
              </p>
              {!isFieldValid('jobDescription') && (
                <p className="mt-1 text-sm text-red-600">{t('wizard:jobCollection.jobDescriptionRequired', { defaultValue: 'Job description is required' })}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Additional info card */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div 
          className="bg-yellow-50 px-6 py-4 border-b border-gray-200 cursor-pointer"
          onClick={() => setIsAdditionalExpanded(!isAdditionalExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <span className="inline-block w-6 h-6 bg-yellow-500 text-white rounded-full text-center mr-2">2</span>
              {t('wizard:jobCollection.additionalContext', { defaultValue: 'Add more context (optional but recommended)' })}
            </h3>
            <div>
              {isAdditionalExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 ml-8">
            {t('wizard:jobCollection.additionalContextSubtitle', { defaultValue: 'Additional information will enhance the accuracy of AI-generated assessments.' })}
          </p>
        </div>
        
        {isAdditionalExpanded && (
          <div className="p-6">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('wizard:jobCollection.clientRequirements')}
                  </label>
                  {autoFilledFields.some(f => f.fieldName === 'clientRequirements') && (
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 italic bg-yellow-50 px-2 py-1 rounded-full">
                        {t('wizard:jobCollection.autoFilledFrom', { fileName: autoFilledFields.find(f => f.fieldName === 'clientRequirements')?.fileName })}
                      </span>
                      <button
                        onClick={() => clearAutoFilledField('clientRequirements')}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={clientRequirements}
                  onChange={(e) => setClientRequirements(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('wizard:jobCollection.clientRequirementsPlaceholder', { defaultValue: 'Enter any specific client requirements or preferences not included in the job description...' })}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('wizard:jobCollection.clientRequirementsHelp', { defaultValue: 'Include any specific requirements directly from the client' })}
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('wizard:jobCollection.meetingNotes')}
                  </label>
                  {autoFilledFields.some(f => f.fieldName === 'meetingNotes') && (
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 italic bg-yellow-50 px-2 py-1 rounded-full">
                        {t('wizard:jobCollection.autoFilledFrom', { fileName: autoFilledFields.find(f => f.fieldName === 'meetingNotes')?.fileName })}
                      </span>
                      <button
                        onClick={() => clearAutoFilledField('meetingNotes')}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('wizard:jobCollection.meetingNotesPlaceholder', { defaultValue: 'Notes from client meetings about the role and requirements...' })}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('wizard:jobCollection.meetingNotesHelp', { defaultValue: 'Insights from kick-off or briefing meetings with the client' })}
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('wizard:jobCollection.recruiterNotes')}
                  </label>
                  {autoFilledFields.some(f => f.fieldName === 'recruiterNotes') && (
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 italic bg-yellow-50 px-2 py-1 rounded-full">
                        {t('wizard:jobCollection.autoFilledFrom', { fileName: autoFilledFields.find(f => f.fieldName === 'recruiterNotes')?.fileName })}
                      </span>
                      <button
                        onClick={() => clearAutoFilledField('recruiterNotes')}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('wizard:jobCollection.recruiterNotesPlaceholder', { defaultValue: 'Additional context or insights from the recruiting team...' })}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('wizard:jobCollection.recruiterNotesHelp', { defaultValue: 'Observations from recruiters about the role or market' })}
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('wizard:jobCollection.additionalContext', { defaultValue: 'Additional Context' })}
                  </label>
                  {autoFilledFields.some(f => f.fieldName === 'additionalNotes') && (
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 italic bg-yellow-50 px-2 py-1 rounded-full">
                        {t('wizard:jobCollection.autoFilledFrom', { fileName: autoFilledFields.find(f => f.fieldName === 'additionalNotes')?.fileName })}
                      </span>
                      <button
                        onClick={() => clearAutoFilledField('additionalNotes')}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-pink-500 focus:border-pink-500"
                  placeholder={t('wizard:jobCollection.additionalContextPlaceholder', { defaultValue: 'Any other important context about the role, company, or industry...' })}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('wizard:jobCollection.additionalContextHelp', { defaultValue: 'Any other relevant information that might help with assessment' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleProcessJobInfo}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common:status.processing')}
            </>
          ) : (
            <>
              {t('wizard:jobCollection.processJobInfo', { defaultValue: 'Process Job Info' })}
              <ChevronRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCollection;