// src/i18n/index.ts - Complete Argentine Spanish translation
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    common: {
      "appName": "Halo Executive Search",
      "buttons": {
        "save": "Save",
        "cancel": "Cancel", 
        "delete": "Delete",
        "edit": "Edit",
        "continue": "Continue",
        "back": "Back",
        "next": "Next",
        "previous": "Previous",
        "create": "Create",
        "view": "View",
        "export": "Export",
        "print": "Print",
        "close": "Close",
        "confirm": "Confirm",
        "remove": "Remove",
        "add": "Add",
        "done": "Done",
        "finish": "Finish",
        "submit": "Submit",
        "loading": "Loading",
        "processing": "Processing",
        "downloadReport": "Download Report",
        "printPreview": "Print Preview",
        "exportAsHTML": "Export as HTML"
      },
      "status": {
        "draft": "Draft",
        "complete": "Complete", 
        "archived": "Archived",
        "loading": "Loading...",
        "saving": "Saving...",
        "processing": "Processing...",
        "checkingAuth": "Checking authentication...",
        "connecting": "Connecting to database...",
        "analyzing": "Analyzing...",
        "evaluating": "Evaluating...",
        "generating": "Generating...",
        "preparingExport": "Preparing Export..."
      },
      "navigation": {
        "dashboard": "Dashboard",
        "newAssessment": "New Assessment",
        "reports": "Reports",
        "settings": "Settings"
      },
      "fields": {
        "name": "Name",
        "title": "Title",
        "description": "Description",
        "status": "Status",
        "date": "Date",
        "createdAt": "Created",
        "updatedAt": "Updated",
        "client": "Client",
        "role": "Role",
        "candidate": "Candidate",
        "score": "Score",
        "requirement": "Requirement",
        "experience": "Experience",
        "education": "Education",
        "notes": "Notes",
        "criteria": "Criteria",
        "weight": "Weight",
        "weightedTotal": "Weighted Total"
      },
      "colors": {
        "sarah": "Navy Blue",
        "james": "Gold",
        "emily": "Purple"
      },
      "months": {
        "january": "January",
        "february": "February", 
        "march": "March",
        "april": "April",
        "may": "May",
        "june": "June",
        "july": "July",
        "august": "August",
        "september": "September",
        "october": "October",
        "november": "November",
        "december": "December"
      }
    },
    auth: {
      "login": {
        "title": "Sign In",
        "subtitle": "Access your assessment platform",
        "email": "Email",
        "password": "Password",
        "emailPlaceholder": "your@email.com",
        "passwordPlaceholder": "••••••••",
        "loginButton": "Sign in",
        "loggingIn": "Signing in...",
        "errors": {
          "invalidCredentials": "Invalid credentials. Please check your email and password.",
          "userNotFound": "User not found.",
          "wrongPassword": "Incorrect password.",
          "tooManyAttempts": "Too many failed attempts. Please try again later.",
          "emailNotConfirmed": "Please confirm your email before signing in.",
          "generic": "Error signing in. Please try again."
        }
      },
      "logout": {
        "button": "Sign out",
        "confirm": "Are you sure you want to sign out?"
      }
    },
    dashboard: {
      "title": "Dashboard",
      "subtitle": "View and manage all your assessments",
      "newAssessment": "New Assessment",
      "incompleteAssessments": {
        "title": "Incomplete Assessments",
        "subtitle": "Assessments that have been started but not completed",
        "continueButton": "Continue"
      },
      "assessmentReports": {
        "title": "Assessment Reports",
        "subtitle": "All candidate assessment reports",
        "noReports": "No assessment reports yet",
        "createFirst": "Create Your First Assessment"
      }
    },
    reports: {
      "title": "Assessment Report",
      "loadingReport": "Loading assessment report...",
      "errorLoading": "Error Loading Report",
      "backToDashboard": "Back to Dashboard",
      "executiveSummary": "Executive Summary",
      "keyInsights": "Key Insights",
      "keyEvaluationCriteria": "Key Evaluation Criteria (KEC)",
      "calibrationProfiles": "Calibration Profiles",
      "competencyAnalysis": "Candidate Competency Analysis",
      "weightedScoringMatrix": "Weighted Scoring Matrix",
      "competencyRadar": "Competency Radar",
      "areasToProbe": "Areas to Probe",
      "keyValidatedStrengths": "Key Validated Strengths",
      "interviewFocusAreas": "Interview Focus Areas",
      "recommendedNextSteps": "Recommended Next Steps",
      "detailedAssessmentAnalysis": "Detailed Assessment Analysis",
      "selectCandidate": "Select a candidate to view detailed AI evaluation for each parameter.",
      "preparedFor": "Prepared for: {{clientName}}",
      "reference": "Ref: {{reference}}",
      "topPerformer": "Top Performer",
      "technicalEdge": "Technical Edge",
      "fastestOnboarding": "Fastest Onboarding",
      "candidateProfiles": "Candidate Profiles",
      "assessmentDetails": "Assessment Details: {{candidateName}}",
      "overallAssessment": "Overall Assessment",
      "parameterDescription": "Parameter Description:",
      "justification": "Justification:",
      "assessmentQuestions": "Assessment Questions & Answers",
      "strengths": "Strengths",
      "developmentAreas": "Development Areas",
      "competencyScore": "Competency Score:",
      "minimumRequirement": "Minimum requirement: {{percentage}}%",
      "whyThisMatters": "Why This Matters:",
      "nextStepsItems": [
        "Schedule final interviews with shortlisted candidates",
        "Prepare focused technical and leadership questions based on identified gaps",
        "Arrange for candidates to meet key stakeholders", 
        "Develop onboarding plan for the selected candidate",
        "Prepare competitive compensation package"
      ],
      "insights": {
        "technicalBusinessBalance": {
          "title": "Technical-Business Balance",
          "description": "While technical expertise is important, your organization's growth stage requires a leader who can balance technical knowledge with business acumen and executive leadership presence."
        },
        "strategicLeadership": {
          "title": "Strategic Leadership", 
          "description": "Your planned expansion requires a leader with demonstrated strategic vision and the ability to execute on complex initiatives across multiple business domains."
        }
      },
      "candidateFields": {
        "experience": "Experience",
        "teamSize": "Team Size",
        "budgetManaged": "Budget Managed",
        "noticePeriod": "Notice Period",
        "education": "Education",
        "keyAchievement": "Key Achievement",
        "salary": "Current Salary",
        "location": "Location",
        "languages": "Languages",
        "yearsInIndustry": "Years in Industry",
        "currentTitle": "Current Title",
        "certification": "Certifications",
        "previousCompany": "Previous Company",
        "managementStyle": "Management Style"
      },
      "chartLabels": {
        "note": "Note:",
        "scoresNote": "Scores shown as raw score (out of 10) with weighted contribution in parentheses.",
        "keyInsight": "Key Insight:",
        "decisionFactor": "Decision Factor:",
        "radarChart": "The radar chart would be generated here",
        "legend": "Legend"
      },
      "exportMessages": {
        "preparingExport": "Preparing Export...",
        "exportError": "Export error occurred",
        "printInstructions": {
          "title": "Print Instructions",
          "subtitle": "For best results when printing this report:",
          "useBrowser": "Use Chrome or Edge browser",
          "selectPrint": "Select \"Print\" from your browser menu (Ctrl+P or ⌘+P)",
          "setPdf": "Set \"Destination\" to \"Save as PDF\"",
          "paperSize": "Ensure \"Paper size\" is set to \"A4\"",
          "margins": "Set \"Margins\" to \"Default\" or \"None\"",
          "graphics": "Enable \"Background graphics\" option",
          "clickSave": "Click \"Save\" or \"Print\""
        }
      }
    },
    wizard: {
      "steps": {
        "jobDetails": "Job Details",
        "jobReview": "Job Review", 
        "candidates": "Candidates",
        "aiAssessment": "AI Assessment",
        "finalReport": "Final Report"
      },
      "aiAssessment": {
        "title": "AI-Generated Assessment",
        "subtitle": "Review the AI-generated candidate assessments. You can adjust scores, edit evaluations, and customize key insights for the final report.",
        "keyInsightsTitle": "Key Insights for Final Report",
        "decisionFactors": "Decision Factors",
        "editInsights": "Edit Insights",
        "editFactors": "Edit Factors", 
        "doneEditing": "Done Editing",
        "addDecisionFactor": "Add Decision Factor",
        "selectCandidate": "Select a candidate to view detailed assessment",
        "assessmentDetails": "Assessment Details: {{candidateName}}",
        "overallAssessment": "Overall Assessment",
        "editAssessment": "Edit Assessment",
        "professionalProfile": "Professional Profile",
        "qualifications": "Qualifications",
        "competencyScore": "Competency Score:",
        "minimumRequirement": "Minimum requirement: {{percentage}}%",
        "whyThisMatters": "Why This Matters:",
        "parameterDescription": "Parameter Description:",
        "justification": "Justification:",
        "assessmentQuestions": "Assessment Questions & Answers",
        "strengths": "Strengths",
        "developmentAreas": "Development Areas"
      },
      "finalReport": {
        "title": "Final Report",
        "subtitle": "Your report is ready! You can make final edits before exporting or printing.",
        "executiveSummary": "Executive Summary",
        "keyEvaluationCriteria": "Key Evaluation Criteria (KEC)",
        "calibrationProfiles": "Calibration Profiles",
        "competencyAnalysis": "Candidate Competency Analysis",
        "weightedScoringMatrix": "Weighted Scoring Matrix",
        "competencyRadar": "Competency Radar",
        "areasToProbe": "Areas to Probe",
        "areasToProbeSubtitle": "Focused questions to help you explore potential gaps and validate strengths during the final interview stage.",
        "keyValidatedStrengths": "Key Validated Strengths",
        "interviewFocusAreas": "Interview Focus Areas",
        "recommendedNextSteps": "Recommended Next Steps",
        "detailedAssessmentAnalysis": "Detailed Assessment Analysis",
        "selectCandidateForDetails": "Select a candidate to view detailed AI evaluation for each parameter.",
        "exportAsHTML": "Export as HTML",
        "printPreview": "Print Preview"
      }
    }
  },
  es: {
    common: {
      "appName": "Halo Executive Search",
      "buttons": {
        "save": "Guardar",
        "cancel": "Cancelar",
        "delete": "Eliminar", 
        "edit": "Editar",
        "continue": "Continuar",
        "back": "Volver",
        "next": "Siguiente",
        "previous": "Anterior",
        "create": "Crear",
        "view": "Ver",
        "export": "Exportar",
        "print": "Imprimir",
        "close": "Cerrar",
        "confirm": "Confirmar",
        "remove": "Quitar",
        "add": "Agregar",
        "done": "Listo",
        "finish": "Finalizar",
        "submit": "Enviar",
        "loading": "Cargando",
        "processing": "Procesando",
        "downloadReport": "Descargar Informe",
        "printPreview": "Vista Previa de Impresión",
        "exportAsHTML": "Exportar como HTML"
      },
      "status": {
        "draft": "Borrador",
        "complete": "Completo",
        "archived": "Archivado",
        "loading": "Cargando...",
        "saving": "Guardando...",
        "processing": "Procesando...",
        "checkingAuth": "Verificando autenticación...",
        "connecting": "Conectando a la base de datos...",
        "analyzing": "Analizando...",
        "evaluating": "Evaluando...",
        "generating": "Generando...",
        "preparingExport": "Preparando Exportación..."
      },
      "navigation": {
        "dashboard": "Panel de Control",
        "newAssessment": "Nueva Evaluación",
        "reports": "Informes",
        "settings": "Configuración"
      },
      "fields": {
        "name": "Nombre",
        "title": "Título",
        "description": "Descripción",
        "status": "Estado",
        "date": "Fecha",
        "createdAt": "Creado",
        "updatedAt": "Actualizado",
        "client": "Cliente",
        "role": "Puesto",
        "candidate": "Candidato",
        "score": "Puntaje",
        "requirement": "Requisito",
        "experience": "Experiencia",
        "education": "Educación",
        "notes": "Notas",
        "criteria": "Criterios",
        "weight": "Peso",
        "weightedTotal": "Total Ponderado"
      },
      "colors": {
        "sarah": "Azul Marino",
        "james": "Dorado",
        "emily": "Violeta"
      },
      "months": {
        "january": "Enero",
        "february": "Febrero",
        "march": "Marzo",
        "april": "Abril",
        "may": "Mayo",
        "june": "Junio",
        "july": "Julio",
        "august": "Agosto",
        "september": "Septiembre",
        "october": "Octubre",
        "november": "Noviembre",
        "december": "Diciembre"
      }
    },
    auth: {
      "login": {
        "title": "Iniciar Sesión",
        "subtitle": "Accedé a tu plataforma de evaluación",
        "email": "Correo electrónico",
        "password": "Contraseña",
        "emailPlaceholder": "tu@email.com",
        "passwordPlaceholder": "••••••••",
        "loginButton": "Iniciar sesión",
        "loggingIn": "Iniciando sesión...",
        "errors": {
          "invalidCredentials": "Credenciales inválidas. Verificá tu email y contraseña.",
          "userNotFound": "Usuario no encontrado.",
          "wrongPassword": "Contraseña incorrecta.",
          "tooManyAttempts": "Demasiados intentos fallidos. Intentá nuevamente más tarde.",
          "emailNotConfirmed": "Por favor confirmá tu email antes de iniciar sesión.",
          "generic": "Error al iniciar sesión. Por favor, intentá nuevamente."
        }
      },
      "logout": {
        "button": "Cerrar sesión",
        "confirm": "¿Estás seguro que querés cerrar sesión?"
      }
    },
    dashboard: {
      "title": "Panel de Control",
      "subtitle": "Visualizá y gestioná todas tus evaluaciones",
      "newAssessment": "Nueva Evaluación",
      "incompleteAssessments": {
        "title": "Evaluaciones Incompletas",
        "subtitle": "Evaluaciones que fueron iniciadas pero no completadas",
        "continueButton": "Continuar"
      },
      "assessmentReports": {
        "title": "Informes de Evaluación",
        "subtitle": "Todos los informes de evaluación de candidatos",
        "noReports": "Aún no hay informes de evaluación",
        "createFirst": "Crear tu Primera Evaluación"
      }
    },
    reports: {
      "title": "Informe de Evaluación",
      "loadingReport": "Cargando informe de evaluación...",
      "errorLoading": "Error al Cargar el Informe",
      "backToDashboard": "Volver al Panel de Control",
      "executiveSummary": "Resumen Ejecutivo",
      "keyInsights": "Puntos Clave",
      "keyEvaluationCriteria": "Criterios Clave de Evaluación (KEC)",
      "calibrationProfiles": "Perfiles de Calibración",
      "competencyAnalysis": "Análisis de Competencias de Candidatos",
      "weightedScoringMatrix": "Matriz de Puntuación Ponderada",
      "competencyRadar": "Radar de Competencias",
      "areasToProbe": "Áreas a Explorar",
      "keyValidatedStrengths": "Fortalezas Clave Validadas",
      "interviewFocusAreas": "Áreas de Enfoque en Entrevista",
      "recommendedNextSteps": "Próximos Pasos Recomendados",
      "detailedAssessmentAnalysis": "Análisis Detallado de Evaluación",
      "selectCandidate": "Seleccioná un candidato para ver evaluación detallada de IA para cada parámetro.",
      "preparedFor": "Preparado para: {{clientName}}",
      "reference": "Ref: {{reference}}",
      "topPerformer": "Mejor Desempeño",
      "technicalEdge": "Ventaja Técnica",
      "fastestOnboarding": "Incorporación Más Rápida",
      "candidateProfiles": "Perfiles de Candidatos",
      "assessmentDetails": "Detalles de Evaluación: {{candidateName}}",
      "overallAssessment": "Evaluación General",
      "parameterDescription": "Descripción del Parámetro:",
      "justification": "Justificación:",
      "assessmentQuestions": "Preguntas y Respuestas de Evaluación",
      "strengths": "Fortalezas",
      "developmentAreas": "Áreas de Desarrollo",
      "competencyScore": "Puntaje de Competencia:",
      "minimumRequirement": "Requisito mínimo: {{percentage}}%",
      "whyThisMatters": "Por Qué Esto Importa:",
      "nextStepsItems": [
        "Programar entrevistas finales con candidatos preseleccionados",
        "Preparar preguntas técnicas y de liderazgo enfocadas basadas en brechas identificadas",
        "Organizar reuniones de candidatos con stakeholders clave",
        "Desarrollar plan de incorporación para el candidato seleccionado",
        "Preparar paquete de compensación competitivo"
      ],
      "insights": {
        "technicalBusinessBalance": {
          "title": "Balance Técnico-Comercial",
          "description": "Aunque la experiencia técnica es importante, la etapa de crecimiento de tu organización requiere un líder que pueda equilibrar el conocimiento técnico con acumen comercial y presencia de liderazgo ejecutivo."
        },
        "strategicLeadership": {
          "title": "Liderazgo Estratégico",
          "description": "Tu expansión planificada requiere un líder con visión estratégica demostrada y la capacidad de ejecutar iniciativas complejas a través de múltiples dominios comerciales."
        }
      },
      "candidateFields": {
        "experience": "Experiencia",
        "teamSize": "Tamaño del Equipo",
        "budgetManaged": "Presupuesto Gestionado",
        "noticePeriod": "Período de Preaviso",
        "education": "Educación",
        "keyAchievement": "Logro Clave",
        "salary": "Salario Actual",
        "location": "Ubicación",
        "languages": "Idiomas",
        "yearsInIndustry": "Años en la Industria",
        "currentTitle": "Cargo Actual",
        "certification": "Certificaciones",
        "previousCompany": "Empresa Anterior",
        "managementStyle": "Estilo de Liderazgo"
      },
      "chartLabels": {
        "note": "Nota:",
        "scoresNote": "Puntajes mostrados como puntaje bruto (sobre 10) con contribución ponderada entre paréntesis.",
        "keyInsight": "Punto Clave:",
        "decisionFactor": "Factor de Decisión:",
        "radarChart": "El gráfico radar se generaría acá",
        "legend": "Leyenda"
      },
      "exportMessages": {
        "preparingExport": "Preparando Exportación...",
        "exportError": "Ocurrió un error de exportación",
        "printInstructions": {
          "title": "Instrucciones de Impresión",
          "subtitle": "Para mejores resultados al imprimir este informe:",
          "useBrowser": "Usá el navegador Chrome o Edge",
          "selectPrint": "Seleccioná \"Imprimir\" del menú del navegador (Ctrl+P o ⌘+P)",
          "setPdf": "Configurá \"Destino\" en \"Guardar como PDF\"",
          "paperSize": "Asegurate de que \"Tamaño de papel\" esté en \"A4\"",
          "margins": "Configurá \"Márgenes\" en \"Predeterminado\" o \"Ninguno\"",
          "graphics": "Habilitá la opción \"Gráficos de fondo\"",
          "clickSave": "Hacé clic en \"Guardar\" o \"Imprimir\""
        }
      }
    },
    wizard: {
      "steps": {
        "jobDetails": "Detalles del Puesto",
        "jobReview": "Revisión del Puesto",
        "candidates": "Candidatos",
        "aiAssessment": "Evaluación IA",
        "finalReport": "Informe Final"
      },
      "aiAssessment": {
        "title": "Evaluación Generada por IA",
        "subtitle": "Revisá las evaluaciones de candidatos generadas por IA. Podés ajustar puntajes, editar evaluaciones y personalizar puntos clave para el informe final.",
        "keyInsightsTitle": "Puntos Clave para el Informe Final",
        "decisionFactors": "Factores de Decisión",
        "editInsights": "Editar Puntos Clave",
        "editFactors": "Editar Factores",
        "doneEditing": "Terminar Edición",
        "addDecisionFactor": "Agregar Factor de Decisión",
        "selectCandidate": "Seleccioná un candidato para ver evaluación detallada",
        "assessmentDetails": "Detalles de Evaluación: {{candidateName}}",
        "overallAssessment": "Evaluación General",
        "editAssessment": "Editar Evaluación",
        "professionalProfile": "Perfil Profesional",
        "qualifications": "Calificaciones",
        "competencyScore": "Puntaje de Competencia:",
        "minimumRequirement": "Requisito mínimo: {{percentage}}%",
        "whyThisMatters": "Por Qué Esto Importa:",
        "parameterDescription": "Descripción del Parámetro:",
        "justification": "Justificación:",
        "assessmentQuestions": "Preguntas y Respuestas de Evaluación",
        "strengths": "Fortalezas",
        "developmentAreas": "Áreas de Desarrollo"
      },
      "finalReport": {
        "title": "Informe Final",
        "subtitle": "¡Tu informe está listo! Podés hacer ediciones finales antes de exportar o imprimir.",
        "executiveSummary": "Resumen Ejecutivo",
        "keyEvaluationCriteria": "Criterios Clave de Evaluación (KEC)",
        "calibrationProfiles": "Perfiles de Calibración",
        "competencyAnalysis": "Análisis de Competencias de Candidatos",
        "weightedScoringMatrix": "Matriz de Puntuación Ponderada",
        "competencyRadar": "Radar de Competencias",
        "areasToProbe": "Áreas a Explorar",
        "areasToProbeSubtitle": "Preguntas enfocadas para ayudarte a explorar posibles brechas y validar fortalezas durante la etapa final de entrevista.",
        "keyValidatedStrengths": "Fortalezas Clave Validadas",
        "interviewFocusAreas": "Áreas de Enfoque en Entrevista",
        "recommendedNextSteps": "Próximos Pasos Recomendados",
        "detailedAssessmentAnalysis": "Análisis Detallado de Evaluación",
        "selectCandidateForDetails": "Seleccioná un candidato para ver evaluación detallada de IA para cada parámetro.",
        "exportAsHTML": "Exportar como HTML",
        "printPreview": "Vista Previa de Impresión"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'wizard', 'reports'],
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;