import * as pdfjs from 'pdfjs-dist';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Parse a PDF file and extract its text content
 * @param file PDF file to parse
 * @returns Promise with extracted text
 */
export async function parsePDF(file: File): Promise<string> {
  try {
    // Convert the file to an array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    
    // Extract text from each page
    let fullText = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Join all the text items from the page
      const pageText = textContent.items
        .filter(item => 'str' in item)
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please try another file or format.');
  }
}

/**
 * Parse the text from multiple types of files (PDF, DOCX, TXT)
 * @param file File to parse
 * @returns Promise with extracted text
 */
export async function parseDocumentText(file: File): Promise<string> {
  try {
    // Determine file type and use appropriate parser
    if (file.name.toLowerCase().endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      // Use mammoth for DOCX files
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      // Simple text file
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } else {
      throw new Error(`Unsupported file type: ${file.type || file.name.split('.').pop()}`);
    }
  } catch (error) {
    console.error('Error parsing document:', error);
    throw error;
  }
}