// Updated src/services/pdfExportService.js with controlled page breaks

/**
 * Generates exportable HTML for print/PDF with controlled page breaks
 * @param {Object} reportData Data for the assessment report
 * @returns {Promise<string>} HTML content ready for export
 */
export const generateExportableHTML = async (reportData) => {
  try {
    // Format the data for the template
    const templateData = processReportData(reportData);
    
    // Generate HTML content from template
    const htmlContent = await renderHTMLTemplate(templateData);
    
    return htmlContent;
  } catch (error) {
    console.error('Error generating exportable HTML:', error);
    throw new Error('Failed to generate exportable HTML content');
  }
};

/**
 * Process and prepare report data for the template
 * @param {Object} data Raw report data
 * @returns {Object} Processed data ready for template
 */
function processReportData(data) {
  // Extract all candidate names
  const candidateNames = Object.keys(data.candidates);
  
  // Format candidates with additional display data
  const formattedCandidates = candidateNames.map(name => {
    const candidateData = data.candidates[name];
    const evaluation = candidateData.evaluation;
    
    // Process scores for this candidate
    const scores = [];
    let totalScore = 0;
    
    data.evaluationParameters.forEach(param => {
      const scoreObj = evaluation.evaluationScores.find(s => s.parameterName === param.name);
      if (scoreObj) {
        // Calculate raw score out of 10
        const rawScore = scoreObj.score / 10;
        // Calculate weighted contribution (assuming equal weight if not specified)
        const weight = param.weight || 20;
        const weightedValue = (rawScore * weight / 100).toFixed(2);
        // Add to total
        totalScore += parseFloat(weightedValue);
        
        scores.push({
          paramName: param.name,
          score: rawScore.toFixed(1),
          weightedScore: weightedValue,
          isTopScore: scoreObj.score >= 90, // Determine if this is a top score
          isSecondScore: scoreObj.score >= 80 && scoreObj.score < 90 // Determine if this is a second-tier score
        });
      }
    });
    
    // Get strength and probe data
    const strengths = [];
    const areasToProbe = [];
    
    evaluation.evaluationScores.forEach(score => {
      // Add top strengths
      score.strengths.slice(0, 2).forEach(strength => {
        strengths.push(strength);
      });
      
      // Add areas to probe (except Global Experience for James Wilson)
      const param = data.evaluationParameters.find(p => p.name === score.parameterName);
      if (param && score.score < param.requirementLevel) {
        if (name !== "James Wilson" || score.parameterName !== "Global Experience") {
          if (score.limitations.length > 0) {
            areasToProbe.push({
              area: score.parameterName,
              question: `How have you addressed the ${score.limitations[0].toLowerCase()} in previous roles?`
            });
          } else {
            areasToProbe.push({
              area: score.parameterName,
              question: `Could you elaborate on your experience with ${score.parameterName.toLowerCase()}?`
            });
          }
        }
      }
    });
    
    // Extract candidate profile details
    const profile = getProfileData(name);
    
    return {
      name,
      color: candidateData.color,
      title: profile.title,
      experience: profile.experience,
      teamSize: profile.teamSize,
      budgetManaged: profile.budgetManaged,
      noticePeriod: profile.noticePeriod,
      education: profile.education,
      keyAchievement: profile.keyAchievement,
      scores,
      totalScore: totalScore.toFixed(2),
      strengths: strengths.slice(0, 3),
      areasToProbe: areasToProbe.slice(0, 3)
    };
  });
  
  // Find winner (highest total score)
  let highestScore = 0;
  let winnerIndex = -1;
  
  formattedCandidates.forEach((candidate, index) => {
    const score = parseFloat(candidate.totalScore);
    if (score > highestScore) {
      highestScore = score;
      winnerIndex = index;
    }
  });
  
  // Mark winner and add score classes
  formattedCandidates.forEach((candidate, index) => {
    candidate.isWinner = index === winnerIndex;
  });
  
  // Add weights to evaluation parameters
  const parameters = data.evaluationParameters.map(param => ({
    ...param,
    weight: param.weight || 20 // Default weight if not specified
  }));
  
  return {
    clientName: data.clientName,
    reportReference: data.reportReference,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    evaluationParameters: parameters,
    candidates: formattedCandidates,
    currentYear: new Date().getFullYear()
  };
}

/**
 * Get profile data for a candidate
 */
function getProfileData(name) {
  // Sample profile data
  const profileData = {
    "Sarah Mitchell": {
      title: "Former CPO at FinTech Solutions",
      experience: "15+ years",
      teamSize: "50+ people",
      budgetManaged: "£15M+",
      noticePeriod: "3 months",
      education: "MBA, Imperial College London",
      keyAchievement: "Led product team to 300% growth in 3 years"
    },
    "James Wilson": {
      title: "VP of Product at TechInnovate",
      experience: "8+ years",
      teamSize: "22 people",
      budgetManaged: "£5M+",
      noticePeriod: "1 month",
      education: "BSc Computer Science, UCL",
      keyAchievement: "Launched award-winning product with 1M+ users"
    },
    "Emily Chen": {
      title: "Head of Product Strategy",
      experience: "11+ years",
      teamSize: "28 people",
      budgetManaged: "£8M+",
      noticePeriod: "2 months",
      education: "PhD Computer Science, Stanford",
      keyAchievement: "Pivoted product strategy, increasing revenue by 150%"
    }
  };
  
  return profileData[name] || {
    title: "Product Leader",
    experience: "N/A",
    teamSize: "N/A",
    budgetManaged: "N/A",
    noticePeriod: "N/A",
    education: "N/A",
    keyAchievement: "N/A"
  };
}

/**
 * Create the SVG for the spider chart
 */
function createSpiderChartSVG(parameters, candidates) {
  // Use first 5 parameters for the radar chart
  const chartParams = parameters.slice(0, 5);
  
  // Extract candidate data
  const candidateData = candidates.map(candidate => {
    return {
      name: candidate.name,
      color: candidate.color,
      scores: chartParams.map(param => {
        const score = candidate.scores.find(s => s.paramName === param.name);
        return score ? parseFloat(score.score) / 10 : 0; // Normalize to 0-1
      })
    };
  });
  
  // SVG settings
  const width = 400;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 150;
  
  // Start SVG content
  let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 400 440" preserveAspectRatio="xMidYMid meet" overflow="visible" width="${width}" height="${height}">
      <!-- Background -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="#f9f9f9" rx="8" ry="8" />
      
      <!-- Reference circles -->
      <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#e0e0e0" stroke-width="0.7" />
      <circle cx="${centerX}" cy="${centerY}" r="${radius*2/3}" fill="none" stroke="#e0e0e0" stroke-width="0.7" />
      <circle cx="${centerX}" cy="${centerY}" r="${radius/3}" fill="none" stroke="#e0e0e0" stroke-width="0.7" />
  `;
  
  // Add axis lines
  for (let i = 0; i < chartParams.length; i++) {
    const angle = (i * 2 * Math.PI / chartParams.length) - Math.PI/2;
    const lineX = centerX + radius * Math.cos(angle);
    const lineY = centerY + radius * Math.sin(angle);
    
    svg += `
      <line 
        x1="${centerX}" 
        y1="${centerY}" 
        x2="${lineX}" 
        y2="${lineY}" 
        stroke="#ccc" 
        stroke-width="0.8"
      />
    `;
  }
  
  // Define colors
  const colors = [
    { fill: 'rgba(0, 43, 92, 0.4)', stroke: 'rgba(0, 43, 92, 1)' }, // Navy (Sarah)
    { fill: 'rgba(255, 194, 14, 0.4)', stroke: 'rgba(255, 194, 14, 1)' }, // Gold (James)
    { fill: 'rgba(91, 33, 182, 0.4)', stroke: 'rgba(91, 33, 182, 1)' }  // Purple (Emily)
  ];
  
  // Add candidate polygons
  candidateData.forEach((candidate, candidateIndex) => {
    // Calculate polygon points
    const points = candidate.scores.map((score, i) => {
      const angle = (i * 2 * Math.PI / chartParams.length) - Math.PI/2;
      const distance = radius * score * 1.3; // Scale to fill the chart nicely
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      return `${x},${y}`;
    }).join(' ');
    
    // Get color for this candidate
    const color = candidateIndex < colors.length ? colors[candidateIndex] : colors[0];
    
    // Add polygon
    svg += `
      <g>
        <!-- Polygon for ${candidate.name} -->
        <polygon 
          points="${points}" 
          fill="${color.fill}" 
          stroke="${color.stroke}" 
          stroke-width="3" 
          stroke-linejoin="round"
        />
        
        <!-- Points at each vertex -->
        ${candidate.scores.map((score, i) => {
          const angle = (i * 2 * Math.PI / chartParams.length) - Math.PI/2;
          const distance = radius * score * 1.3;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          return `
            <circle cx="${x}" cy="${y}" r="5" fill="white" />
            <circle cx="${x}" cy="${y}" r="3.5" fill="${color.stroke}" />
          `;
        }).join('')}
      </g>
    `;
  });
  
  // Add parameter labels with proper positioning
  const labelPositions = [
    { rx: 145, ry: -14, tx: 200, ty: 0, anchor: "middle" },  // Top
    { rx: 290, ry: 56, tx: 350, ty: 70, anchor: "middle" },  // Top-right
    { rx: 265, ry: 370, tx: 320, ty: 384, anchor: "middle" }, // Bottom-right
    { rx: 25, ry: 370, tx: 80, ty: 384, anchor: "middle" },  // Bottom-left
    { rx: 0, ry: 56, tx: 50, ty: 70, anchor: "middle" }      // Top-left
  ];
  
  chartParams.forEach((param, index) => {
    if (index < labelPositions.length) {
      const pos = labelPositions[index];
      
      svg += `
        <rect 
          x="${pos.rx}" 
          y="${pos.ry}" 
          width="110" 
          height="22" 
          rx="6" 
          ry="6"
          fill="white"
          stroke="#e0e0e0"
          stroke-width="1"
        />
        <text 
          x="${pos.tx}" 
          y="${pos.ty}" 
          text-anchor="${pos.anchor}" 
          dominant-baseline="middle"
          font-size="10"
          font-weight="bold"
          fill="#333"
        >
          ${param.name}
        </text>
      `;
    }
  });
  
  // Close SVG
  svg += `
    </svg>
  `;
  
  return svg;
}

/**
 * Render the HTML template with the provided data
 * @param {Object} data The data to render in the template
 * @returns {Promise<string>} The rendered HTML
 */
async function renderHTMLTemplate(data) {
  // Create the Spider Chart SVG
  const spiderChartSvg = createSpiderChartSVG(data.evaluationParameters, data.candidates);
  
  // Complete HTML template with controlled page breaks and wider content
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.clientName} - Assessment Report</title>
  <style>
    /* Base styles optimized for PDF output */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
    
    :root {
      /* Albany Brand Colors */
      --albany-stone: #c2c0ae;
      --albany-pink: #d50b51;
      --albany-pale-grey: #c6c6c6;
      --albany-railings: #36393e;
      --albany-grey: #62626c;
      
      /* Original Colors */
      --primary: #002B5C;
      --primary-light: #2B547E;
      --secondary: #FFC20E;
      --secondary-light: #FFDC73;
      --sarah: #002B5C;
      --james: #FFC20E;
      --emily: #5b21b6;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.5;
      color: #333;
      width: 210mm; /* Standard A4 width */
      margin: 0 auto;
      background-color: white;
      font-size: 10pt; /* Slightly smaller base font size */
    }
    
    /* Print-specific settings */
    @page {
      size: A4 portrait;
      margin: 0.5cm; /* Reduced margins for more content space */
    }
    
    /* Ensure all pages have proper backgrounds */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    
    /* Controlled page breaks - Core layout control */
    .page-1 {
      page-break-after: always;
    }
    
    .page-2 {
      page-break-after: always;
    }
    
    .page-3 {
      page-break-after: avoid;
    }
    
    .no-break {
      page-break-inside: avoid;
    }
    
    /* Header */
    .report-header {
      background-color: var(--primary);
      color: white;
      padding: 1.5cm 1cm 1cm;
      position: relative;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
    }
    
    .header-left {
      display: flex;
      flex-direction: column;
    }
    
    .logo {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 0.5cm;
      letter-spacing: 1px;
    }
    
    .report-title {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 0.5cm;
      color: white;
    }
    
    .client-name {
      font-size: 12pt;
      opacity: 0.9;
      font-weight: 300;
      color: white;
    }
    
    .header-right {
      text-align: right;
    }
    
    .date {
      font-size: 10pt;
      margin-bottom: 0.5cm;
      color: white;
    }
    
    .reference {
      font-size: 9pt;
      opacity: 0.9;
      color: white;
    }
    
    /* Executive Summary */
    .executive-summary {
      background-color: white;
      padding: 0.8cm;
      margin-top: -0.5cm;
      position: relative;
      z-index: 1;
      border-radius: 4px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .summary-title {
      display: flex;
      align-items: center;
      margin-bottom: 0.3cm;
    }
    
    .summary-icon {
      background-color: var(--primary);
      color: white;
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0.5cm;
      font-size: 14pt;
    }
    
    .summary-title h2 {
      margin: 0;
      padding: 0;
      font-size: 16pt;
      color: var(--primary);
    }
    
    /* Insights cards - using grid for better layout */
    .key-insights {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5cm;
      margin-top: 0.5cm;
    }
    
    .insight-card {
      background-color: #f8f9fa;
      padding: 0.5cm;
      border-radius: 4px;
      border-left: 3px solid var(--primary);
    }
    
    .insight-card h4 {
      display: flex;
      align-items: center;
      margin-top: 0;
      margin-bottom: 0.3cm;
      font-size: 11pt;
    }
    
    .insight-emoji {
      margin-right: 0.3cm;
      font-size: 14pt;
    }
    
    /* Client Requirements */
    .client-requirements {
      background-color: white;
      padding: 0.8cm;
      margin-top: 0.5cm;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .requirements-title {
      display: flex;
      align-items: center;
      margin-bottom: 0.3cm;
    }
    
    .requirements-icon {
      background-color: var(--secondary);
      color: white;
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0.5cm;
      font-size: 14pt;
    }
    
    .requirements-title h2 {
      margin: 0;
      padding: 0;
      font-size: 16pt;
      color: var(--primary);
    }
    
    .requirements-list {
      list-style-type: none;
      margin-left: 0;
      padding-left: 0;
    }
    
    .requirements-list li {
      margin-bottom: 0.2cm;
      padding-left: 0.8cm;
      position: relative;
      color: #333;
    }
    
    .requirements-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }
    
    /* Understanding Requirements - 2 boxes in a row */
    .understanding-grid-2x2 {
      display: flex;
      justify-content: space-between;
      gap: 0.5cm;
      margin: 0.5cm 0;
    }
    
    .understanding-item {
      flex: 1;
      background-color: #f8f9fa;
      border-radius: 4px;
      padding: 0.5cm;
      position: relative;
    }
    
    .core-need {
      border-left: 5px solid var(--primary);
      background-color: #E6EEF8;
    }
    
    .insight-primary {
      border-left: 5px solid var(--albany-pink);
      background-color: #FEE6EF;
    }
    
    .understanding-item h3 {
      font-size: 12pt;
      margin-bottom: 0.3cm;
      display: flex;
      align-items: center;
    }
    
    .core-need h3 {
      color: var(--primary);
    }
    
    .insight-primary h3 {
      color: var(--albany-pink);
    }
    
    .understanding-item h3 .emoji {
      margin-right: 0.2cm;
      font-size: 14pt;
    }
    
    .insight-tag {
      position: absolute;
      top: -0.2cm;
      right: 0.5cm;
      color: white;
      font-size: 7pt;
      padding: 0.1cm 0.3cm;
      border-radius: 1cm;
      font-weight: bold;
    }
    
    .tag-core {
      background: var(--primary);
    }
    
    .tag-insight1 {
      background: var(--albany-pink);
    }
    
    /* Candidate profiles - using grid layout */
    .candidates-section-heading {
      font-size: 16pt;
      font-weight: 600;
      color: var(--primary);
      margin: 0.3cm 0;
      border-bottom: 2px solid var(--secondary);
      padding-bottom: 0.1cm;
    }
    
    .candidates {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.3cm;
      margin: 0.3cm 0;
    }
    
    .candidate-card {
      background-color: white;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    
    .candidate-header {
      padding: 0.3cm 0.2cm;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .candidate-photo {
      width: 2cm;
      height: 2cm;
      border-radius: 50%;
      margin: 0 auto 0.2cm;
      background-color: rgba(255,255,255,0.2);
      border: 3px solid rgba(255,255,255,0.3);
    }
    
    .candidate-name {
      text-align: center;
      font-size: 14pt;
      margin-bottom: 0.1cm;
    }
    
    .candidate-title {
      text-align: center;
      opacity: 0.9;
      margin-bottom: 0;
      font-size: 10pt;
    }
    
    .candidate-body {
      padding: 0.3cm;
    }
    
    .candidate-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.2cm;
      margin-bottom: 0.3cm;
    }
    
    .stat-item {
      background-color: #f8f9fa;
      padding: 0.2cm;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-label {
      font-size: 8pt;
      color: #6b7280;
      margin-bottom: 0.1cm;
    }
    
    .stat-value {
      font-size: 10pt;
      font-weight: bold;
      color: #333;
      text-align: center;
    }
    
    .candidate-info {
      margin-bottom: 0.3cm;
    }
    
    .info-item {
      display: flex;
      margin-bottom: 0.2cm;
      padding-bottom: 0.2cm;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .info-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    
    .info-emoji {
      font-size: 12pt;
      margin-right: 0.3cm;
      flex-shrink: 0;
    }
    
    .info-content {
      flex: 1;
    }
    
    .info-label {
      font-weight: bold;
      font-size: 8pt;
      color: #6b7280;
      margin-bottom: 0.1cm;
    }
    
    .info-value {
      font-size: 9pt;
      color: #333;
    }
    
    /* Competency Analysis Matrix - optimized layout */
    .competency-section {
      background-color: white;
      border-radius: 4px;
      padding: 0.5cm;
      margin: 0.3cm 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .competency-heading {
      font-size: 14pt;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 0.3cm;
      border-bottom: 2px solid var(--secondary);
      padding-bottom: 0.1cm;
    }
    
    .competency-grid {
      display: grid;
      grid-template-columns: 2fr 1fr; /* 2/3 for matrix, 1/3 for radar */
      gap: 0.5cm;
    }
    
    .competency-matrix {
      background-color: #f9f9fa;
      border-radius: 4px;
      padding: 0.3cm;
      border-left: 3px solid var(--primary);
    }
    
    .competency-subtitle {
      font-size: 12pt;
      font-weight: 500;
      color: var(--primary);
      margin-bottom: 0.2cm;
      padding-bottom: 0.1cm;
      border-bottom: 1px solid var(--secondary);
    }
    
    .weighted-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0.3cm;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .weighted-table th {
      background-color: var(--primary);
      color: white;
      padding: 0.2cm;
      text-align: center;
      font-weight: 500;
      font-size: 9pt;
    }
    
    .weighted-table th:first-child {
      text-align: left;
    }
    
    .weighted-table td {
      padding: 0.2cm;
      text-align: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      font-size: 9pt;
    }
    
    .weighted-table td:first-child {
      text-align: left;
      font-weight: 500;
    }
    
    .weighted-table tr:last-child td {
      border-bottom: none;
    }
    
    .weighted-table tr:nth-child(even) {
      background-color: rgba(0, 0, 0, 0.01);
    }
    
    .weight-cell {
      background-color: rgba(0, 43, 92, 0.1);
      color: var(--primary);
      font-weight: bold;
    }
    
    .score-cell {
      position: relative;
    }
    
    .top-score {
      background-color: rgba(34, 197, 94, 0.1);
      font-weight: bold;
    }
    
    .second-score {
      background-color: rgba(255, 194, 14, 0.1);
    }
    
    .weighted-value {
      color: #6b7280;
      font-size: 7pt;
    }
    
    .winner-score {
      position: relative;
    }
    
    .winner-badge {
      display: inline-block;
      margin-left: 0.2cm;
      background-color: var(--primary);
      color: white;
      border-radius: 50%;
      width: 0.5cm;
      height: 0.5cm;
      line-height: 0.5cm;
      text-align: center;
      font-size: 7pt;
      font-weight: bold;
    }
    
    /* Spider Chart section */
    .competency-radar {
      background-color: #f9f9fa;
      border-radius: 4px;
      padding: 0.3cm;
      border-left: 3px solid var(--secondary);
    }
    
    .spider-chart-legend {
      display: flex;
      justify-content: center;
      gap: 0.2cm;
      margin-bottom: 0.2cm;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      padding: 0.1cm 0.2cm;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.7);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      font-size: 8pt;
    }
    
    .legend-color {
      width: 0.3cm;
      height: 0.3cm;
      border-radius: 50%;
      margin-right: 0.1cm;
    }
    
    /* Areas to Probe */
    .areas-to-probe {
      background-color: white;
      border-radius: 4px;
      padding: 0.8cm;
      margin: 0.5cm 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .probe-title {
      display: flex;
      align-items: center;
      margin-bottom: 0.3cm;
    }
    
    .probe-icon {
      background-color: var(--primary);
      color: white;
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0.5cm;
      font-size: 14pt;
    }
    
    .probe-title h2 {
      margin: 0;
      padding: 0;
      font-size: 16pt;
      color: var(--primary);
    }
    
    .candidate-probes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5cm;
      margin-top: 0.3cm;
    }
    
    .probe-card {
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    .probe-header {
      padding: 0.2cm;
      text-align: center;
      color: white;
      font-weight: bold;
    }
    
    .sarah-header {
      background-color: var(--sarah);
    }
    
    .james-header {
      background-color: var(--james);
    }
    
    .emily-header {
      background-color: var(--emily);
    }
    
    .probe-body {
      padding: 0.3cm;
    }
    
    .probe-section-title {
      font-weight: bold;
      margin-bottom: 0.2cm;
      display: flex;
      align-items: center;
      font-size: 9pt;
    }
    
    .strengths-title {
      color: #22c55e;
    }
    
    .probe-areas-title {
      color: #ef4444;
      margin-top: 0.3cm;
    }
    
    .key-points {
      margin-top: 0.2cm;
      padding-left: 0.5cm;
      font-size: 9pt;
    }
    
    .key-points li {
      margin-bottom: 0.2cm;
      position: relative;
      list-style-type: none;
    }
    
    .key-points li:before {
      content: "•";
      position: absolute;
      left: -0.5cm;
      color: var(--primary);
    }
    
    .probe-question {
      color: #ef4444;
      font-weight: 500;
    }
    
    /* Next Steps Section */
    .next-steps {
      background-color: white;
      border-radius: 4px;
      padding: 0.8cm;
      margin: 0.5cm 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-left: 4px solid var(--primary);
    }
    
    .next-steps-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.3cm;
    }
    
    .next-steps-icon {
      background-color: var(--primary);
      color: white;
      width: 0.8cm;
      height: 0.8cm;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0.5cm;
      font-size: 14pt;
    }
    
    .next-steps-header h2 {
      margin: 0;
      padding: 0;
      font-size: 16pt;
      color: var(--primary);
    }
    
    .action-items {
      list-style-type: none;
      padding: 0;
    }
    
    .action-items li {
      margin-bottom: 0.3cm;
      padding-left: 0.8cm;
      position: relative;
      color: #333;
    }
    
    .action-items li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }
    
    /* Footer */
    .report-footer {
      background-color: var(--primary);
      color: white;
      padding: 0.5cm;
      text-align: center;
      margin-top: 0.5cm;
    }
    
    .footer-logo {
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 0.3cm;
    }
    
    .footer-text {
      font-size: 9pt;
      opacity: 0.8;
    }
    
    /* Print instructions banner */
    .print-instructions {
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      padding: 0.5cm;
      margin: 0.5cm 0;
      border-radius: 4px;
      text-align: center;
    }
    
    .print-instructions h3 {
      font-size: 14pt;
      margin-bottom: 0.2cm;
    }
    
    .print-instructions p {
      margin-bottom: 0.1cm;
    }
    
    .print-instructions ul {
      text-align: left;
      margin: 0.3cm 0 0.2cm 1cm;
    }
    
    .print-instructions ul li {
      margin-bottom: 0.1cm;
    }
    
    /* Hide print instructions when printing */
    @media print {
      .print-instructions {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Print Instructions (only visible in browser) -->
  <div class="print-instructions">
    <h3>Print Instructions</h3>
    <p>For best results when printing this report:</p>
    <ul>
      <li>Use Chrome or Edge browser</li>
      <li>Select "Print" from your browser menu (Ctrl+P or ⌘+P)</li>
      <li>Set "Destination" to "Save as PDF"</li>
      <li>Ensure "Paper size" is set to "A4"</li>
      <li>Set "Margins" to "Default" or "None"</li>
      <li>Enable "Background graphics" option</li>
      <li>Click "Save" or "Print"</li>
    </ul>
  </div>

  <!-- PAGE 1: Header, Executive Summary, and KEC -->
  <div class="page-1">
    <!-- Header -->
    <div class="report-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">ALBANY PARTNERS</div>
          <h1 class="report-title">CPO Candidate Assessment</h1>
          <div class="client-name">Prepared for: ${data.clientName}</div>
        </div>
        <div class="header-right">
          <div class="date">${data.date}</div>
          <div class="reference">Ref: ${data.reportReference}</div>
        </div>
      </div>
    </div>
    
    <!-- Executive Summary -->
    <div class="executive-summary no-break">
      <div class="summary-title">
        <div class="summary-icon">📊</div>
        <h2>Executive Summary</h2>
      </div>
      <p>
        Following an extensive search and thorough assessment process, we present our analysis of three exceptional candidates for the Chief Product Officer position at ${data.clientName}. Each candidate brings unique strengths that align with your organizational needs.
      </p>
      
      <!-- Key insights cards -->
      <div class="key-insights">
        <div class="insight-card">
          <h4>
            <span class="insight-emoji">🏆</span>
            Top Performer
          </h4>
          <p>
            Sarah Mitchell demonstrates the strongest strategic leadership profile with 15+ years of experience and proven success scaling product teams at FinTech Solutions.
          </p>
        </div>
        
        <div class="insight-card">
          <h4>
            <span class="insight-emoji">💻</span>
            Technical Edge
          </h4>
          <p>
            Emily Chen offers exceptional technical depth with a PhD in Computer Science and significant expertise in AI-driven product development.
          </p>
        </div>
        
        <div class="insight-card">
          <h4>
            <span class="insight-emoji">⏱️</span>
            Fastest Onboarding
          </h4>
          <p>
            James Wilson has the shortest notice period (1 month) and brings valuable experience in consumer application development to complement your B2B focus.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Client Requirements -->
    <div class="client-requirements no-break">
      <div class="requirements-title">
        <div class="requirements-icon">📋</div>
        <h2>Key Evaluation Criteria (KEC)</h2>
      </div>
      <p>${data.clientName} is seeking a strategic Chief Product Officer to lead their product organization through a period of significant growth and international expansion.</p>
      <ul class="requirements-list">
        ${data.evaluationParameters.map(param => `<li>${param.description}</li>`).join('')}
      </ul>
      
      <!-- Understanding Requirements - 2 boxes in a row -->
      <div class="understanding-grid-2x2">
        <div class="understanding-item insight-primary">
          <span class="insight-tag tag-insight1">INSIGHT</span>
          <h3>
            <span class="emoji">⚖️</span>
            Technical-Business Balance
          </h3>
          <p>While technical expertise is important, your organization's growth stage requires a CPO who can balance technical knowledge with business acumen and executive leadership presence.</p>
        </div>
        
        <div class="understanding-item core-need">
          <span class="insight-tag tag-core">CORE NEED</span>
          <h3>
            <span class="emoji">🌎</span>
            International Expansion
          </h3>
          <p>Your planned expansion into European and North American markets requires a CPO with demonstrated international product leadership experience and cultural awareness for different market needs.</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- PAGE 2: Candidate Profiles and Competency Analysis -->
  <div class="page-2">
    <!-- Candidate Profiles -->
    <h2 class="candidates-section-heading">Calibration Profiles</h2>
    <div class="candidates no-break">
      ${data.candidates.map(candidate => `
        <div class="candidate-card">
          <div class="candidate-header" style="background-color: ${candidate.color};">
            <div class="candidate-photo"></div>
            <h3 class="candidate-name">${candidate.name}</h3>
            <p class="candidate-title">${candidate.title}</p>
          </div>
          <div class="candidate-body">
            <div class="candidate-stats">
              <div class="stat-item">
                <div class="stat-label">Experience</div>
                <div class="stat-value">${candidate.experience}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Team Size</div>
                <div class="stat-value">${candidate.teamSize}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Budget Managed</div>
                <div class="stat-value">${candidate.budgetManaged}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Notice Period</div>
                <div class="stat-value">${candidate.noticePeriod}</div>
              </div>
            </div>
            
            <div class="candidate-info">
              <div class="info-item">
                <div class="info-emoji">🎓</div>
                <div class="info-content">
                  <div class="info-label">Education</div>
                  <div class="info-value">${candidate.education}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-emoji">🏆</div>
                <div class="info-content">
                  <div class="info-label">Key Achievement</div>
                  <div class="info-value">${candidate.keyAchievement}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- Competency Analysis -->
    <div class="competency-section no-break">
      <h2 class="competency-heading">Candidate Competency Analysis</h2>
      
      <div class="competency-grid">
        <!-- Weighted Matrix -->
        <div class="competency-matrix">
          <h3 class="competency-subtitle">Weighted Scoring Matrix</h3>
          
          <table class="weighted-table">
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Weight</th>
                ${data.candidates.map(candidate => `<th>${candidate.name.split(' ')[0]}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.evaluationParameters.map((param, i) => `
                <tr>
                  <td>${param.name}</td>
                  <td class="weight-cell">${param.weight}%</td>
                  ${data.candidates.map(candidate => {
                    const score = candidate.scores.find(s => s.paramName === param.name);
                    let scoreClass = '';
                    if (score) {
                      if (score.isTopScore) scoreClass = 'top-score';
                      else if (score.isSecondScore) scoreClass = 'second-score';
                    }
                    return `
                      <td class="score-cell ${scoreClass}">
                        ${score ? score.score : 'N/A'} ${score ? `<span class="weighted-value">(${score.weightedScore})</span>` : ''}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>Weighted Total</td>
                <td class="weight-cell">100%</td>
                ${data.candidates.map(candidate => `
                  <td class="score-cell ${candidate.isWinner ? 'top-score winner-score' : ''}">
                    ${candidate.totalScore} ${candidate.isWinner ? '<span class="winner-badge">1st</span>' : ''}
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
          
          <p class="weighted-note">
            <strong>Note:</strong> Scores shown as raw score (out of 10) with weighted contribution in parentheses.
          </p>
        </div>
        
        <!-- Spider Chart -->
        <div class="competency-radar">
          <div class="spider-chart-legend">
            ${data.candidates.map(candidate => `
              <div class="legend-item">
                <div class="legend-color" style="background-color: ${candidate.color};"></div>
                <span>${candidate.name}</span>
              </div>
            `).join('')}
          </div>
          
          <h3 class="competency-subtitle">Competency Radar</h3>
          
          <div class="spider-chart" style="transform: scale(0.85); transform-origin: center; margin-top: -0.5cm;">
            ${spiderChartSvg}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- PAGE 3: Areas to Probe, Next Steps, and Footer -->
  <div class="page-3">
    <!-- Areas to Probe -->
    <div class="areas-to-probe no-break">
      <div class="probe-title">
        <div class="probe-icon">🔍</div>
        <h2>Areas to Probe</h2>
      </div>
      <p>Focused questions to help you explore potential gaps and validate strengths during the final interview stage.</p>
      
      <div class="candidate-probes">
        ${data.candidates.map(candidate => `
          <div class="probe-card">
            <div class="probe-header" style="background-color: ${candidate.color};">${candidate.name}</div>
            <div class="probe-body">
              <div class="probe-section-title strengths-title">
                ✓ Key Validated Strengths
              </div>
              <ul class="key-points">
                ${candidate.strengths.map(strength => `<li>${strength}</li>`).join('')}
              </ul>
              
              <div class="probe-section-title probe-areas-title">
                ✗ Interview Focus Areas
              </div>
              <ul class="key-points">
                ${candidate.areasToProbe.map(area => `
                  <li>
                    <strong>${area.area}:</strong> <span class="probe-question">${area.question}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Next Steps -->
    <div class="next-steps no-break">
      <div class="next-steps-header">
        <div class="next-steps-icon">→</div>
        <h2>Recommended Next Steps</h2>
      </div>
      <ul class="action-items">
        <li>Schedule final interviews with shortlisted candidates</li>
        <li>Prepare focused technical and leadership questions based on identified gaps</li>
        <li>Arrange for candidates to meet key stakeholders</li>
        <li>Develop onboarding plan for the selected candidate</li>
        <li>Prepare competitive compensation package</li>
      </ul>
    </div>
    
    <!-- Footer -->
    <div class="report-footer">
      <div class="footer-logo">ALBANY PARTNERS</div>
      <div class="footer-text">
        © ${data.currentYear} Albany Partners. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}