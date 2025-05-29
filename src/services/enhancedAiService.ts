// src/services/enhancedAiService.ts - Updated with localization support

import { EvaluationParameter } from '../types';
import { InsightFlag } from './wizardAiService';
import i18n from '../i18n';

// The base URL for OpenAI API
const API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Get localized language instruction for AI prompts
 */
const getLanguageInstruction = (): string => {
  const currentLanguage = i18n.language;
  
  if (currentLanguage === 'es') {
    return 'Respond in Spanish (Argentina). Use Argentine Spanish expressions, vocabulary, and the "vos" form where appropriate. ';
  }
  
  return 'Respond in English. ';
};

/**
 * Extract KEC items from a job description using GPT-3.5 Turbo with localization
 * Generates high-value insights that would impress a client
 */
export const extractKECWithGPT = async (
  jobDescription: string,
  clientRequirements: string = "",
  meetingNotes: string = "",
  recruiterNotes: string = "",
  additionalNotes: string = ""
): Promise<{kecItems: EvaluationParameter[], insightFlags: InsightFlag[], executiveSummary: string, kecDescription: string}> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please check your environment variables.');
    }

    const languageInstruction = getLanguageInstruction();
    
    const promptKEC = `${languageInstruction}You are a world-class executive talent advisor. Analyze the inputs below and return **only** a single JSON object with keys:

• executiveSummary
• kecDescription
• kecItems
• insightFlags

Inputs:
JOB DESCRIPTION: ${jobDescription}
CLIENT REQUIREMENTS: ${clientRequirements}
MEETING NOTES: ${meetingNotes}
RECRUITER NOTES: ${recruiterNotes}
ADDITIONAL CONTEXT: ${additionalNotes}

Instructions:
1. **executiveSummary**
   - Write as a flowing paragraph (150-200 words)
   - Begin by identifying the most critical business need this role addresses
   - Explain the role's strategic impact and what the client truly needs
   - Tone: authoritative C-suite briefing, weaving in language from the inputs

2. **kecDescription**
   - 3–4 sentences that introduce why these evaluation criteria are essential business levers.
   - Embed one SMART KPI example (e.g. "achieve 20% revenue growth within 12 months") drawn from the materials.

3. **kecItems** (exactly 5)
   For each parameter, provide:
   • **name**: concise, executive-friendly name with emoji
   • **description**: 1–2 sentences using specific phrases from the inputs
   • **requirementLevel**: precise percentage 0–100% (avoid multiples of 5)
   • **requirementJustification**: explain why this exact percentage ties to business outcomes
   • **assessmentQuestions**: array of 2-3 questions, each with:
     - **question**: specific, penetrating question text
     - **rationale**: one sentence explaining why this question matters
     - **idealAnswer**: one sentence describing the ideal response

4. **insightFlags** (exactly 2)
   - One with "type":"coreNeed", one with "type":"insight".
   - Each entry: { title, emoji, description } in 1–2 sentences, showing genuine strategic wisdom.

Return nothing else—just the JSON.`;
    
    const systemPrompt = i18n.language === 'es' 
      ? 'Sos un asesor de talento ejecutivo de clase mundial que crea marcos de evaluación de candidatos premium. Transformás los requisitos de trabajo en bruto en insights sofisticados y listos para el cliente que demuestran experiencia excepcional. Tu lenguaje es autoritativo, matizado e impresionante para ejecutivos de alto nivel. Usá expresiones y vocabulario argentino, incluido el "vos" cuando sea apropiado.'
      : 'You are a world-class executive talent advisor who creates premium candidate evaluation frameworks. You transform raw job requirements into sophisticated, client-ready insights that demonstrate exceptional expertise. Your language is authoritative, nuanced and impressive to C-suite executives.';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: promptKEC
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    try {
      // Find JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not extract valid JSON from the AI response');
    } catch (jsonError) {
      console.error('Error parsing AI response as JSON:', jsonError);
      throw new Error('Failed to parse assessment parameters from AI response');
    }
  } catch (error) {
    console.error('Error in requirement extraction:', error);
    throw error;
  }
};

/**
 * Evaluates a candidate against the defined parameters using GPT-3.5 Turbo with localization
 * Enhanced to provide evidence-based assessments using specific candidate information
 */
export const evaluateCandidateWithGPT = async (
  candidateName: string,
  candidateInfo: string,
  parameters: EvaluationParameter[],
  candidateProfile?: any
): Promise<CandidateEvaluation> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please check your environment variables.');
    }

    const languageInstruction = getLanguageInstruction();

    const promptEval = `${languageInstruction}You are an expert HR evaluator. Given the inputs below, return **only** a single JSON object with keys:

• candidateName
• overallAssessment
• profileFields
• evaluationScores

Inputs:
CANDIDATE NAME: ${candidateName}

CANDIDATE INFORMATION:
${candidateInfo}

SELECTED PROFILE FIELDS TO EXTRACT:
Stats Fields (4 required): ${candidateProfile?.selectedProfileFields?.stats?.join(', ') || 'experience, teamSize, budgetManaged, noticePeriod'}
Text Fields (2 required): ${candidateProfile?.selectedProfileFields?.text?.join(', ') || 'title, education'}

EVALUATION PARAMETERS:
${parameters.map(p => `
- ${p.name} (Min Requirement: ${p.requirementLevel}%)
  Description: ${p.description}`).join('\n')}

Instructions:
1. **candidateName**: "${candidateName}"

2. **overallAssessment**: 150-200 word paragraph analyzing the candidate's overall fit

3. **profileFields**: Extract/determine values for selected fields from candidate information:
${candidateProfile?.selectedProfileFields?.stats?.map(field => `   - "${field}": (extract specific value from candidate info)`).join('\n') || ''}
${candidateProfile?.selectedProfileFields?.text?.map(field => `   - "${field}": (extract specific value from candidate info)`).join('\n') || ''}

4. **evaluationScores**: Array with exactly ${parameters.length} objects:
   - "parameterName": (exact parameter name)
   - "score": (number 0-100)
   - "justification": (1-2 sentences explaining score)
   - "strengths": (array of 2 strength strings)
   - "limitations": (array of 2 limitation strings)
   - "assessment": (array with question assessments)

Return nothing else—only the JSON.`;
    
    const systemPrompt = i18n.language === 'es'
      ? 'Sos un evaluador de RR.HH. experto que evalúa objetivamente a los candidatos contra los requisitos del trabajo. Proporcionás evaluaciones detalladas y basadas en evidencia que citan calificaciones y experiencia específicas del candidato. Usá expresiones y vocabulario argentino.'
      : 'You are an expert HR evaluator who objectively assesses candidates against job requirements. You provide detailed, evidence-based evaluations that cite specific candidate qualifications and experience.';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: promptEval
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    try {
      // Find JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not extract valid JSON from the AI response');
    } catch (jsonError) {
      console.error('Error parsing AI response as JSON:', jsonError);
      throw new Error('Failed to parse candidate evaluation from AI response');
    }
  } catch (error) {
    console.error('Error in candidate evaluation:', error);
    throw error;
  }
};

/**
 * Generate key insights and decision factors from candidate evaluations with localization
 */
export const generateKeyInsightsWithGPT = async (
  candidateEvaluations: any[],
  parameters: EvaluationParameter[]
): Promise<{keyInsights: any, decisionFactors: string[]}> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please check your environment variables.');
    }

    const languageInstruction = getLanguageInstruction();

    const prompt = `${languageInstruction}Analyze these candidate evaluations and return **only** JSON with keys:
• keyInsights
• decisionFactors

CANDIDATES:
${candidateEvaluations.map(c => `
${c.candidateName}: ${c.overallAssessment}
Scores: ${Object.entries(c.scores || {}).map(([param, score]) => `${param}: ${score}%`).join(', ')}
`).join('\n')}

Instructions:
1. **keyInsights**: Object with topPerformer, technicalEdge, fastestOnboarding - each with:
   - **title**: creative category name
   - **candidate**: candidate name who excels in this area
   - **description**: why they excel (1-2 sentences)

2. **decisionFactors**: Array of 2-3 strategic decision insights comparing candidates

Return nothing else—just the JSON.`;

    const systemPrompt = i18n.language === 'es'
      ? 'Sos un asesor de talento experto que crea insights estratégicos de candidatos para la toma de decisiones ejecutivas. Usá expresiones y vocabulario argentino.'
      : 'You are an expert talent advisor who creates strategic candidate insights for executive decision-making.';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not extract valid JSON from the AI response');
    } catch (jsonError) {
      console.error('Error parsing AI response as JSON:', jsonError);
      throw new Error('Failed to parse key insights from AI response');
    }
  } catch (error) {
    console.error('Error generating key insights:', error);
    throw error;
  }
};

/**
 * Generate executive summary from job and candidate data using GPT-3.5 Turbo with localization
 */
export const generateExecutiveSummaryWithGPT = async (
  clientName: string,
  roleTitle: string,
  candidateEvaluations: CandidateEvaluation[],
  keyInsights: any = null
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please check your environment variables.');
    }

    const languageInstruction = getLanguageInstruction();

    // Format candidate data for the prompt
    const candidateData = candidateEvaluations.map(candidate => {
      const topScores = candidate.evaluationScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map(score => `${score.parameterName} (${score.score}%)`);
      
      const bottomScores = candidate.evaluationScores
        .sort((a, b) => a.score - b.score)
        .slice(0, 2)
        .map(score => `${score.parameterName} (${score.score}%)`);
      
      return `
        Candidate: ${candidate.candidateName}
        Overall Assessment: ${candidate.overallAssessment}
        Top Strengths: ${topScores.join(', ')}
        Development Areas: ${bottomScores.join(', ')}
      `;
    }).join('\n\n');

    // Include key insights if available
    let keyInsightsText = '';
    if (keyInsights) {
      keyInsightsText = `
        KEY INSIGHTS TO EMPHASIZE:
        - Top Performer: ${keyInsights.topPerformer.candidate} ${keyInsights.topPerformer.description}
        - Technical Edge: ${keyInsights.technicalEdge.candidate} ${keyInsights.technicalEdge.description}
        - Fastest Onboarding: ${keyInsights.fastestOnboarding.candidate} ${keyInsights.fastestOnboarding.description}
      `;
    }

    // Create the prompt for executive summary
    const prompt = `${languageInstruction}
      Generate an executive summary for a candidate assessment report for ${clientName}. 
      They are hiring for a ${roleTitle} position.
      
      The summary should highlight the key findings from the assessment of ${candidateEvaluations.length} candidates.
      
      CANDIDATE EVALUATIONS:
      ${candidateData}
      
      ${keyInsightsText}
      
      The executive summary should:
      1. Be professional and concise (about 150-200 words)
      2. Highlight key differentiators between candidates
      3. Be objective and evidence-based
      4. Reference specific candidate qualifications
      5. Avoid making a specific recommendation about which candidate to hire
      
      Format your response as a plain text paragraph without any special formatting.
    `;
    
    const systemPrompt = i18n.language === 'es'
      ? 'Sos un consultor de RR.HH. experto que produce resúmenes ejecutivos claros y concisos para informes de evaluación de candidatos. Tus resúmenes son sofisticados y basados en evidencia, destacando calificaciones específicas de candidatos y diferenciadores. Usá expresiones y vocabulario argentino.'
      : 'You are an expert HR consultant who produces clear, concise executive summaries for candidate assessment reports. Your summaries are sophisticated and evidence-based, highlighting specific candidate qualifications and differentiators.';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return content.trim();
  } catch (error) {
    console.error('Error generating executive summary:', error);
    throw error;
  }
};