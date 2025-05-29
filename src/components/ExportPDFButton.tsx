// src/components/ExportPDFButton.tsx
import React, { useState } from 'react';
import { FileText, Printer } from 'lucide-react';
import { generateExportableHTML } from '../services/pdfExportService';

interface ExportPDFButtonProps {
  clientName: string;
  reportReference: string;
  jobDescription: string;
  evaluationParameters: any[];
  candidates: Record<string, any>;
}

export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  clientName,
  reportReference,
  jobDescription,
  evaluationParameters,
  candidates
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      // Generate the HTML content
      const htmlContent = await generateExportableHTML({
        clientName,
        reportReference,
        jobDescription,
        evaluationParameters,
        candidates
      });

      // Create a blob of the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Albany_Partners_Assessment_${reportReference}.html`;
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF export error:', error);
      setExportError('Unexpected error occurred during export preparation.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPreview = () => {
    // Open a new window with the print-optimized content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setExportError('Pop-up blocked. Please allow pop-ups and try again.');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      // Generate HTML for printing
      generateExportableHTML({
        clientName,
        reportReference,
        jobDescription,
        evaluationParameters,
        candidates
      }).then(htmlContent => {
        // Write the content to the new window
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Trigger print dialog after content is loaded
        printWindow.onload = () => {
          printWindow.print();
          setIsExporting(false);
        };
      });
    } catch (error) {
      console.error('Print preview error:', error);
      setExportError('Unexpected error occurred preparing the print preview.');
      setIsExporting(false);
      if (printWindow) printWindow.close();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition disabled:opacity-50 disabled:hover:bg-pink-600"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            Preparing Export...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            Export as HTML
          </>
        )}
      </button>
      
      <button
        onClick={handlePrintPreview}
        disabled={isExporting}
        className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:hover:bg-gray-700"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print Preview
      </button>
      
      {exportError && (
        <div className="mt-2 text-sm text-red-600">
          {exportError}
        </div>
      )}
    </div>
  );
};