import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, FileText, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileUpload, isLoading = false }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: isLoading
  });

  // Helper function to get appropriate icon based on file type
  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type === 'application/pdf') {
      return <File className="w-5 h-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    } else if (type === 'text/plain') {
      return <FileText className="w-5 h-5 text-gray-500" />;
    } else if (type === 'text/csv') {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-blue-500">Drop the file here</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600">Drag & drop a file here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, Word Documents, CSV, and plain text
            </p>
          </div>
        )}
      </div>
      
      {acceptedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected file:</p>
          <div className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200">
            {getFileIcon(acceptedFiles[0])}
            <span className="ml-2 text-sm truncate max-w-xs">
              {acceptedFiles[0].name} ({Math.round(acceptedFiles[0].size / 1024)} KB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}