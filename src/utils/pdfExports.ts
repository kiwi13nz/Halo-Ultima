import { jsPDF } from 'jspdf';
import { EvaluationParameter, CandidateEvaluation } from '../types';

/**
 * Export the candidate assessment report as a PDF
 */
export function exportReportAsPdf(
  jobDescription: string,
  parameters: EvaluationParameter[],
  candidates: Record<string, CandidateEvaluation>
): void {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set up fonts and colors
  const titleColor = [0, 43, 92]; // #002B5C
  const textColor = [40, 40, 40]; // Dark gray
  const secondaryColor = [255, 194, 14]; // #FFC20E
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(...titleColor);
  doc.text('Candidate Assessment Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on: ${today}`, 105, 30, { align: 'center' });
  
  // Add job description summary
  doc.setFontSize(16);
  doc.setTextColor(...titleColor);
  doc.text('Job Description Summary', 20, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  const jobDescriptionLines = doc.splitTextToSize(
    jobDescription.substring(0, 800) + (jobDescription.length > 800 ? '...' : ''),
    170
  );
  doc.text(jobDescriptionLines, 20, 55);
  
  // Add parameters section
  let yPosition = 55 + jobDescriptionLines.length * 5;
  
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(...titleColor);
  doc.text('Key Assessment Parameters', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  
  parameters.forEach((parameter, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setTextColor(...titleColor);
    doc.setFontSize(12);
    doc.text(`${parameter.icon} ${parameter.name}`, 20, yPosition);
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(parameter.description, 170);
    doc.text(descriptionLines, 20, yPosition + 5);
    
    doc.text(`Requirement Level: ${parameter.requirementLevel}%`, 20, yPosition + 5 + descriptionLines.length * 5);
    
    yPosition += 15 + descriptionLines.length * 5;
  });
  
  // Add candidate assessment section
  Object.entries(candidates).forEach(([name, evaluation]) => {
    doc.addPage();
    
    // Candidate header
    doc.setFontSize(16);
    doc.setTextColor(...titleColor);
    doc.text(`Candidate: ${name}`, 20, 20);
    
    // Overall assessment
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const assessmentLines = doc.splitTextToSize(evaluation.overallAssessment, 170);
    doc.text(assessmentLines, 20, 30);
    
    let yPos = 40 + assessmentLines.length * 5;
    
    // Scores table
    doc.setFontSize(12);
    doc.setTextColor(...titleColor);
    doc.text('Evaluation Scores', 20, yPos);
    yPos += 10;
    
    // Table header
    doc.setFillColor(...titleColor);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, yPos, 70, 8, 'F');
    doc.rect(90, yPos, 30, 8, 'F');
    doc.rect(120, yPos, 70, 8, 'F');
    
    doc.text('Parameter', 25, yPos + 5);
    doc.text('Score', 95, yPos + 5);
    doc.text('Justification', 125, yPos + 5);
    
    yPos += 8;
    
    // Table rows
    evaluation.evaluationScores.forEach((score, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos, 70, 8, 'F');
        doc.rect(90, yPos, 30, 8, 'F');
        doc.rect(120, yPos, 70, 8, 'F');
      }
      
      doc.setTextColor(...textColor);
      doc.text(score.parameterName, 25, yPos + 5);
      
      // Color the score based on whether it meets requirements
      const parameter = parameters.find(p => p.name === score.parameterName);
      const meetsRequirement = parameter ? score.score >= parameter.requirementLevel : true;
      
      doc.setTextColor(meetsRequirement ? 34, 197, 94 : 239, 68, 68);
      doc.text(`${score.score}%`, 95, yPos + 5);
      
      doc.setTextColor(...textColor);
      const justificationShort = score.justification.length > 50
        ? score.justification.substring(0, 50) + '...'
        : score.justification;
      doc.text(justificationShort, 125, yPos + 5);
      
      yPos += 8;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
        
        // Add continuation header
        doc.setFontSize(12);
        doc.setTextColor(...titleColor);
        doc.text(`${name} (continued)`, 20, yPos);
        yPos += 10;
      }
    });
  });
  
  // Save the PDF
  doc.save('candidate-assessment-report.pdf');
}