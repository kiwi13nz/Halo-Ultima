import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Loader2, Upload, FileText, PlusCircle, X, CheckCircle, User, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { CandidateCollectionProps } from './types';
import { parseDocumentText } from '../../services/pdfParsingService';

// Define profile field groups
const PROFILE_STATS_FIELDS = [
  { id: 'experience', label: 'Experience', default: true, tooltip: 'Years in the industry or relevant work experience (e.g., "10+ years")' },
  { id: 'teamSize', label: 'Team Size', default: true, tooltip: 'Number of direct/indirect reports the candidate has managed' },
  { id: 'budgetManaged', label: 'Budget Managed', default: true, tooltip: 'Size of budget the candidate has been responsible for' },
  { id: 'noticePeriod', label: 'Notice Period', default: true, tooltip: 'Time needed before the candidate can start in a new role' },
  { id: 'salary', label: 'Current Salary', default: false, tooltip: 'Candidate\'s current compensation package' },
  { id: 'location', label: 'Location', default: false, tooltip: 'Current location or willingness to relocate' },
  { id: 'languages', label: 'Languages', default: false, tooltip: 'Languages spoken by the candidate' },
  { id: 'yearsInIndustry', label: 'Years in Industry', default: false, tooltip: 'Specific time within the current industry sector' }
];

const PROFILE_TEXT_FIELDS = [
  { id: 'title', label: 'Current Title', default: true, tooltip: 'Current job title or position' },
  { id: 'education', label: 'Education', default: true, tooltip: 'Academic qualifications and certifications' },
  { id: 'keyAchievement', label: 'Key Achievement', default: false, tooltip: 'Standout accomplishment in career' },
  { id: 'certification', label: 'Certifications', default: false, tooltip: 'Professional certifications and accreditations' },
  { id: 'previousCompany', label: 'Previous Company', default: false, tooltip: 'Prior employer before current role' },
  { id: 'managementStyle', label: 'Management Style', default: false, tooltip: 'Leadership approach and team management philosophy' }
];

// Maximum number of candidates
const MAX_CANDIDATES = 3;

// Section Header component with toggle
const SectionHeader: React.FC<{
  title: string;
  number: number;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  bgColor: string;
}> = ({ title, number, subtitle, isExpanded, onToggle, bgColor }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-800 flex items-center">
      <span className={`inline-block w-6 h-6 ${bgColor} text-white rounded-full text-center mr-2`}>{number}</span>
      {title}
    </h3>
    <div className="flex items-center">
      <div className="text-sm text-gray-500 mr-4">
        {subtitle}
      </div>
      <button
        onClick={onToggle}
        className="p-1 rounded-full hover:bg-gray-200"
        aria-label={isExpanded ? "Collapse section" : "Expand section"}
      >
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  </div>
);

// Sub-component for individual candidate card
const CandidateCard = ({
  index,
  candidate,
  updateCandidate,
  removeCandidate,
  isUploading,
  selectedFields,
  isExpanded,
  toggleExpand,
  candidateFileInputRefs
}) => {
  // State for file processing
  const [uploadedFiles, setUploadedFiles] = useState(candidate.files || []);
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  
  // Handle multiple file upload via drag and drop
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const newUploadedFiles = [];
    
    // Process each file
    for (const file of acceptedFiles) {
      try {
        const newFile = {
          file,
          name: file.name,
          size: file.size,
          previewText: '',
          targetField: 'unassigned',
          isProcessing: true
        };
        
        newUploadedFiles.push(newFile);
        
        // Start parsing in background
        parseDocumentText(file).then(content => {
          setUploadedFiles(prev => {
            const updated = [...prev];
            const index = updated.findIndex(f => f.name === file.name && f.size === file.size);
            if (index !== -1) {
              updated[index].previewText = content;
              updated[index].isProcessing = false;
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
  }, []);
  
// Update candidate.files when uploadedFiles change
useEffect(() => {
  updateCandidate(index, 'files', uploadedFiles.map(f => ({
    name: f.name,
    size: f.size,
    targetField: f.targetField
  })));
}, [uploadedFiles, index, updateCandidate]);
  
  // Set up dropzone with proper click handling
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled: isUploading,
    noClick: true // Disable built-in click handling so we can use our own
  });

  // Remove a file
  const removeFile = (fileIndex) => {
    const fileToRemove = uploadedFiles[fileIndex];
    
    // If the file was assigned to a field, clear that field
    if (fileToRemove.targetField && fileToRemove.targetField !== 'unassigned') {
      clearAutoFilledField(fileToRemove.targetField);
    }
    
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(fileIndex, 1);
      return newFiles;
    });
  };
  
  // Clear an auto-filled field
  const clearAutoFilledField = (fieldName) => {
    switch (fieldName) {
      case 'resume':
        updateCandidate(index, 'resume', '');
        break;
      case 'recruiterNotes':
        updateCandidate(index, 'recruiterNotes', '');
        break;
      case 'meetingNotes':
        updateCandidate(index, 'meetingNotes', '');
        break;
      case 'additionalInfo':
        updateCandidate(index, 'additionalInfo', '');
        break;
    }
    
    setAutoFilledFields(prev => prev.filter(field => field.fieldName !== fieldName));
  };
  
  // Change the target field for a file
  const changeFileTarget = (fileIndex, newTarget) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      const oldTarget = updated[fileIndex].targetField;
      const fileContent = updated[fileIndex].previewText;
      updated[fileIndex].targetField = newTarget;
      
      // Clear content from old field if it matches this file's content
      if (oldTarget && oldTarget !== 'unassigned') {
        clearFieldIfMatches(oldTarget, fileContent);
      }
      
      // Auto-fill new target if it's not unassigned
      if (fileContent && newTarget !== 'unassigned') {
        autoFillField(newTarget, fileContent, updated[fileIndex].name);
      }
      
      return updated;
    });
  };

  // Helper to clear a field if its content matches the provided content
  const clearFieldIfMatches = (fieldName, content) => {
    switch (fieldName) {
      case 'resume':
        if (candidate.resume === content) updateCandidate(index, 'resume', '');
        break;
      case 'recruiterNotes':
        if (candidate.recruiterNotes === content) updateCandidate(index, 'recruiterNotes', '');
        break;
      case 'meetingNotes':
        if (candidate.meetingNotes === content) updateCandidate(index, 'meetingNotes', '');
        break;
      case 'additionalInfo':
        if (candidate.additionalInfo === content) updateCandidate(index, 'additionalInfo', '');
        break;
    }
    
    // Also remove from auto-filled fields
    setAutoFilledFields(prev => prev.filter(field => field.fieldName !== fieldName));
  };
  
  // Auto-fill a field from an uploaded file
  const autoFillField = (fieldName, content, fileName) => {
    // Only auto-fill if the field is empty
    switch (fieldName) {
      case 'resume':
        updateCandidate(index, 'resume', content);
        setAutoFilledFields(prev => [...prev.filter(f => f.fieldName !== 'resume'), { fieldName: 'resume', fileName }]);
        break;
      case 'recruiterNotes':
        updateCandidate(index, 'recruiterNotes', content);
        setAutoFilledFields(prev => [...prev.filter(f => f.fieldName !== 'recruiterNotes'), { fieldName: 'recruiterNotes', fileName }]);
        break;
      case 'meetingNotes':
        updateCandidate(index, 'meetingNotes', content);
        setAutoFilledFields(prev => [...prev.filter(f => f.fieldName !== 'meetingNotes'), { fieldName: 'meetingNotes', fileName }]);
        break;
      case 'additionalInfo':
        updateCandidate(index, 'additionalInfo', content);
        setAutoFilledFields(prev => [...prev.filter(f => f.fieldName !== 'additionalInfo'), { fieldName: 'additionalInfo', fileName }]);
        break;
    }
  };
  
  // Check if we have a resume
  const hasResume = uploadedFiles.some(f => f.targetField === 'resume');
  
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            value={candidate.name}
            onChange={(e) => updateCandidate(index, 'name', e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 text-lg font-medium"
            placeholder={`Candidate ${index + 1}`}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              onClick={() => removeCandidate(index)}
              className="text-gray-400 hover:text-red-500 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </button>
          )}
          <button
            onClick={toggleExpand}
            className="p-1 rounded-full hover:bg-gray-200"
            aria-label={isExpanded ? "Collapse candidate" : "Expand candidate"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6">
          {/* Auto-fill notification */}
          {autoFilledFields.length > 0 && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">We've pre-filled fields using your uploaded files</p>
                  <ul className="mt-1 text-xs text-green-600">
                    {autoFilledFields.map((field, index) => (
                      <li key={index}>• {getFieldLabel(field.fieldName)} filled from {field.fileName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* File upload - Improved drag and drop */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-700">
                Upload Candidate Documents
                {!hasResume && (
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Resume Required
                  </span>
                )}
              </h3>
            </div>
            
            <div
              {...getRootProps()}
              className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!isUploading) {
                  // Direct call to the open function
                  open();
                }
              }}
            >
              <input 
                {...getInputProps()} 
                ref={node => {
                  if (candidateFileInputRefs.current) {
                    candidateFileInputRefs.current[index] = node;
                  }
                }}
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg text-blue-500 font-medium">Drop your files here</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-600 font-medium">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload resume (required), interview notes, recruiter notes, or any other relevant documents
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: PDF, Word Documents, and plain text
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Uploaded files preview */}
          {uploadedFiles.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">Uploaded Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedFiles.map((file, fileIndex) => (
                  <div key={fileIndex} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                      </div>
                      <button 
                        onClick={() => removeFile(fileIndex)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      {file.isProcessing ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-500" />
                          <span className="text-sm text-gray-500">Processing...</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Mapped to field:</label>
                            <select
                              value={file.targetField || 'unassigned'}
                              onChange={(e) => changeFileTarget(fileIndex, e.target.value)}
                              className={`text-sm border ${!file.targetField || file.targetField === 'unassigned' ? 'border-red-300 text-red-600' : file.targetField === 'resume' ? 'border-green-300 text-green-600' : 'border-gray-300'} rounded-md`}
                            >
                              <option value="unassigned" className="text-red-600 font-medium">-- Assign to field --</option>
                              <option value="resume" className="text-green-600">Resume (Required)</option>
                              <option value="recruiterNotes">Recruiter Notes</option>
                              <option value="meetingNotes">Interview/Meeting Notes</option>
                              <option value="additionalInfo">Additional Information</option>
                            </select>
                            {(!file.targetField || file.targetField === 'unassigned') && (
                              <p className="text-xs text-red-500 mt-1">Please assign this file to a field</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1">Preview:</label>
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
              
              {!hasResume && (
                <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-xs">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <p>At least one file must be assigned as a Resume/CV.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
        
        </div>
      )}
    </div>
  );
};

const CandidateCollection: React.FC<CandidateCollectionProps> = ({
  onPrevious,
  onNext,
  isLoading,
  setIsLoading,
  setError,
  candidates,
  setCandidates,
  candidateFileInputRefs,
  selectedProfileFields,
  setSelectedProfileFields
}) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([0]); // First candidate expanded by default

  useEffect(() => {
    if (!selectedProfileFields?.stats || !selectedProfileFields.text) {
      setSelectedProfileFields({
        stats: PROFILE_STATS_FIELDS.filter(f => f.default).map(f => f.id),
        text: PROFILE_TEXT_FIELDS.filter(f => f.default).map(f => f.id)
      });
    }
  }, [selectedProfileFields, setSelectedProfileFields]);

  const toggleProfileField = (fieldId: string, type: 'stats' | 'text') => {
    const current = selectedProfileFields[type];
    const limit = type === 'stats' ? 4 : 2;

    if (current.includes(fieldId)) {
      setSelectedProfileFields({
        ...selectedProfileFields,
        [type]: current.filter(id => id !== fieldId)
      });
    } else if (current.length < limit) {
      setSelectedProfileFields({
        ...selectedProfileFields,
        [type]: [...current, fieldId]
      });
    }
  };

  const updateCandidate = (index: number, field: string, value: any) => {
    const updated = [...candidates];
    if (typeof value === 'function') {
      updated[index] = { 
        ...updated[index], 
        [field]: value(updated[index][field]) 
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setCandidates(updated);
  };

  const addCandidate = () => {
    if (candidates.length >= MAX_CANDIDATES) return;
    const newCandidate = {
      name: `Candidate ${candidates.length + 1}`,
      resume: '',
      recruiterNotes: '',
      meetingNotes: '',
      additionalInfo: '',
      files: [],
      ...Object.fromEntries([
        ...selectedProfileFields.stats,
        ...selectedProfileFields.text
      ].map(id => [id, '']))
    };
    setCandidates([...candidates, newCandidate]);
    // Expand the newly added candidate
    setExpandedIndexes([...expandedIndexes, candidates.length]);
  };

  const removeCandidate = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
    setExpandedIndexes(expandedIndexes.filter(i => i !== index));
  };

  const toggleExpand = (index: number) => {
    setExpandedIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const canProceed = () => {
    return candidates.length > 0 &&
      candidates.every(c => 
        // Check if files includes a resume
        (c.files?.some(f => f.targetField === 'resume')) &&
        // Check if candidate has a name
        c.name && c.name.trim() !== ''
      );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Candidate Information</h2>
      <p className="text-gray-600 mb-6">
        Upload candidate resumes and provide information that will be used for comparison in the assessment report.
      </p>

      {/* Box 1: Candidate Details */}
      <SectionHeader
        number={1}
        title="Candidate Details"
        subtitle="Upload resume and provide details for each candidate"
        isExpanded={true}
        onToggle={() => {}}
        bgColor="bg-pink-600"
      />

      {candidates.map((candidate, index) => (
        <CandidateCard
          key={index}
          index={index}
          candidate={candidate}
          updateCandidate={updateCandidate}
          removeCandidate={removeCandidate}
          isUploading={isLoading}
          selectedFields={selectedProfileFields}
          isExpanded={expandedIndexes.includes(index)}
          toggleExpand={() => toggleExpand(index)}
          candidateFileInputRefs={candidateFileInputRefs}
        />
      ))}

      {candidates.length < MAX_CANDIDATES && (
        <div className="flex justify-center mb-6">
          <button
            onClick={addCandidate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Candidate
          </button>
        </div>
      )}

      {/* Box 2: Candidate Profile Fields */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <SectionHeader
          number={2}
          title="Candidate Profile Fields"
          subtitle="Select fields to compare across all candidates"
          isExpanded={true}
          onToggle={() => {}}
          bgColor="bg-blue-600"
        />
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Why this matters:</strong> These fields will be used to create comparison charts and tables in the final assessment report. Choose the most relevant fields for this role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Comparison Metrics <span className="text-xs text-pink-600">(Choose 4)</span></h4>
              <span className="text-sm text-gray-500">{selectedProfileFields?.stats.length || 0}/4 selected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROFILE_STATS_FIELDS.map(field => {
                const selected = selectedProfileFields.stats.includes(field.id);
                const disabled = !selected && selectedProfileFields.stats.length >= 4;
                return (
                  <div
                    key={field.id}
                    className={`p-3 rounded-md border cursor-pointer ${selected ? 'border-blue-500 bg-blue-50' : disabled ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-300 hover:border-blue-300'}`}
                    onClick={() => !disabled && toggleProfileField(field.id, 'stats')}
                  >
                    <div className="flex items-start">
                      <input type="checkbox" checked={selected} readOnly disabled />
                      <div className="ml-2">
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                        <p className="text-xs text-gray-500">{field.tooltip}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Descriptive Fields <span className="text-xs text-pink-600">(Choose 2)</span></h4>
              <span className="text-sm text-gray-500">{selectedProfileFields?.text.length || 0}/2 selected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROFILE_TEXT_FIELDS.map(field => {
                const selected = selectedProfileFields.text.includes(field.id);
                const disabled = !selected && selectedProfileFields.text.length >= 2;
                return (
                  <div
                    key={field.id}
                    className={`p-3 rounded-md border cursor-pointer ${selected ? 'border-pink-500 bg-pink-50' : disabled ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-300 hover:border-pink-300'}`}
                    onClick={() => !disabled && toggleProfileField(field.id, 'text')}
                  >
                    <div className="flex items-start">
                      <input type="checkbox" checked={selected} readOnly disabled />
                      <div className="ml-2">
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                        <p className="text-xs text-gray-500">{field.tooltip}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back to Job Review
        </button>
        <button
          onClick={onNext}
          disabled={isLoading || !canProceed()}
          className={`flex items-center px-4 py-2 rounded-md ${
            isLoading || !canProceed() ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Candidates
              <ChevronRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Helper function to format field names for display
function getFieldLabel(fieldName: string): string {
  switch (fieldName) {
    case 'resume':
      return 'Resume';
    case 'recruiterNotes':
      return 'Recruiter Notes';
    case 'meetingNotes':
      return 'Meeting Notes';
    case 'additionalInfo':
      return 'Additional Information';
    default:
      return fieldName;
  }
}

export default CandidateCollection;