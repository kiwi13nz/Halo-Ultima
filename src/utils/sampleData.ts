import { EvaluationParameter, CandidateEvaluation } from '../types';

export const sampleJobDescription = `
TechSaaS 200 is seeking a strategic Chief Product Officer to lead their product organization through a period of significant growth and international expansion.

Responsibilities:
- Define and execute product vision and strategy aligned with company goals
- Lead and grow a team of product managers, designers, and researchers
- Collaborate with engineering, marketing, and sales teams
- Drive data-informed product decisions
- Represent the company at industry events and with key clients

Requirements:
- Minimum 10 years of product leadership experience with at least 5 years at senior management level
- Track record of successfully developing and launching innovative technology products
- Experience scaling product teams (25+ team members) and managing substantial product budgets
- Strong technical understanding with ability to collaborate effectively with engineering teams
- Expertise in data-driven product development methodologies
- International experience, particularly in European and North American markets
- Cultural alignment with TechSaaS 200's values of innovation, collaboration, and customer-centricity
`;

export const sampleEvaluationParameters: EvaluationParameter[] = [
  {
    name: "Strategic Leadership",
    description: "Ability to develop and execute product vision aligned with business goals",
    requirementLevel: 85,
    icon: "🚀",
    assessmentQuestions: [
      {
        question: "Has the candidate demonstrated experience in defining product vision and strategy?",
        rationale: "Strategic leadership starts with the ability to define a compelling vision",
        idealAnswer: "Clear examples of defining and implementing successful product strategies"
      },
      {
        question: "How has the candidate aligned product strategy with business objectives?",
        rationale: "Product leaders must connect product decisions to business outcomes",
        idealAnswer: "Evidence of product decisions that directly supported business goals"
      },
      {
        question: "Has the candidate led significant product transformations or pivots?",
        rationale: "Strategic leaders must be able to drive major changes when needed",
        idealAnswer: "Examples of successfully pivoting product strategy in response to market changes"
      }
    ]
  },
  {
    name: "Technical Knowledge",
    description: "Understanding of technical concepts and ability to work with engineering teams",
    requirementLevel: 80,
    icon: "💻",
    assessmentQuestions: [
      {
        question: "What is the candidate's level of technical understanding?",
        rationale: "Technical knowledge is essential for product leadership in a SaaS company",
        idealAnswer: "Strong understanding of software development, data structures, and technical architecture"
      },
      {
        question: "How effectively has the candidate collaborated with engineering teams?",
        rationale: "Product leaders must work closely with engineering",
        idealAnswer: "Track record of successful partnerships with engineering teams"
      },
      {
        question: "Has the candidate demonstrated data-driven decision making?",
        rationale: "Modern product leadership requires analytical skills",
        idealAnswer: "Clear examples of using data to inform product decisions"
      }
    ]
  },
  {
    name: "Team Management",
    description: "Experience leading and scaling product teams, developing talent",
    requirementLevel: 85,
    icon: "👥",
    assessmentQuestions: [
      {
        question: "What size teams has the candidate led?",
        rationale: "We need someone who can manage our growing team",
        idealAnswer: "Experience leading teams of 25+ product professionals"
      },
      {
        question: "How has the candidate developed talent within their teams?",
        rationale: "Leadership includes growing team capabilities",
        idealAnswer: "Structured approach to mentoring and developing team members"
      },
      {
        question: "Has the candidate built or restructured product teams?",
        rationale: "We need someone who can scale our organization",
        idealAnswer: "Experience building teams from scratch or reorganizing for efficiency"
      }
    ]
  },
  {
    name: "Global Experience",
    description: "Experience with international markets and global product strategy",
    requirementLevel: 75,
    icon: "🌎",
    assessmentQuestions: [
      {
        question: "What international markets has the candidate worked in?",
        rationale: "We're expanding internationally and need relevant experience",
        idealAnswer: "Direct experience in European and North American markets"
      },
      {
        question: "How has the candidate adapted products for different markets?",
        rationale: "Global products require localization and adaptation",
        idealAnswer: "Examples of successfully adapting products for regional needs"
      },
      {
        question: "Has the candidate managed distributed global teams?",
        rationale: "Global expansion will require managing remote teams",
        idealAnswer: "Experience leading teams across multiple geographies"
      }
    ]
  },
  {
    name: "Time to Impact",
    description: "Ability to drive results and demonstrate impact quickly",
    requirementLevel: 80,
    icon: "⏱️",
    assessmentQuestions: [
      {
        question: "How quickly has the candidate made an impact in previous roles?",
        rationale: "We need someone who can deliver results relatively quickly",
        idealAnswer: "Evidence of meaningful impact within 3-6 months in new roles"
      },
      {
        question: "What approach does the candidate take to quickly understand a new business?",
        rationale: "Rapid onboarding is essential for quick impact",
        idealAnswer: "Structured approach to learning a new business and its dynamics"
      },
      {
        question: "Has the candidate balanced quick wins with long-term strategic goals?",
        rationale: "We need both short and long-term impact",
        idealAnswer: "Examples of delivering quick wins while building toward strategic goals"
      }
    ]
  }
];

export const sampleCandidateEvaluations: Record<string, CandidateEvaluation> = {
  "Sarah Mitchell": {
    candidateName: "Sarah Mitchell",
    overallAssessment: "Sarah demonstrates exceptional strategic leadership and team management skills with a proven track record of scaling product organizations. While her technical depth is slightly below requirements, her global experience and ability to drive results quickly compensate for this gap.",
    evaluationScores: [
      {
        parameterName: "Strategic Leadership",
        score: 95,
        assessment: [
          {
            question: "Has the candidate demonstrated experience in defining product vision and strategy?",
            answer: "Yes, Sarah has extensive experience defining product vision and strategy across multiple organizations.",
            evidence: "Led development of 5-year product roadmap at TechCorp that resulted in 40% market share growth."
          },
          {
            question: "How has the candidate aligned product strategy with business objectives?",
            answer: "Sarah has consistently aligned product decisions with business goals.",
            evidence: "Implemented OKR framework that tied product metrics directly to revenue goals, resulting in 28% revenue growth."
          },
          {
            question: "Has the candidate led significant product transformations or pivots?",
            answer: "Yes, Sarah has successfully led major product pivots.",
            evidence: "Transitioned flagship product from on-premise to SaaS model in 18 months, retaining 92% of customers."
          }
        ],
        justification: "Sarah's 12 years of product leadership experience, including successful product transformations and strategy alignment, demonstrate exceptional strategic leadership capabilities.",
        strengths: [
          "Proven experience developing successful product strategies",
          "Strong business alignment and executive presence",
          "Successful product transformation experience"
        ],
        limitations: [
          "May focus more on business than technical aspects"
        ]
      },
      {
        parameterName: "Technical Knowledge",
        score: 75,
        assessment: [
          {
            question: "What is the candidate's level of technical understanding?",
            answer: "Sarah has adequate technical understanding but not deep technical expertise.",
            evidence: "Background is business-focused with supplementary technical education; can communicate effectively with engineering but doesn't have hands-on development experience."
          },
          {
            question: "How effectively has the candidate collaborated with engineering teams?",
            answer: "Sarah has collaborated effectively with engineering teams through strong partnership approaches.",
            evidence: "Implemented dual-track agile methodology with engineering partners; regular participation in technical reviews."
          },
          {
            question: "Has the candidate demonstrated data-driven decision making?",
            answer: "Yes, Sarah shows strong data-driven decision making.",
            evidence: "Built analytics framework for product decisions; implemented A/B testing program that improved conversion by 32%."
          }
        ],
        justification: "While Sarah has sufficient technical understanding for collaboration and demonstrates strong data-driven decision making, her technical depth is not at the engineering level.",
        strengths: [
          "Strong data analytics capabilities",
          "Effective engineering collaboration methods"
        ],
        limitations: [
          "Lacks deep technical expertise",
          "Would need strong technical leadership support"
        ]
      },
      {
        parameterName: "Team Management",
        score: 90,
        assessment: [
          {
            question: "What size teams has the candidate led?",
            answer: "Sarah has led large product teams exceeding the requirement.",
            evidence: "Managed team of 42 product professionals at TechCorp; grew team from 18 to 35 at PrevCo."
          },
          {
            question: "How has the candidate developed talent within their teams?",
            answer: "Sarah has implemented robust talent development programs.",
            evidence: "Created PM career ladder with clear advancement criteria; 40% of senior PMs promoted from within; formal mentorship program."
          },
          {
            question: "Has the candidate built or restructured product teams?",
            answer: "Yes, Sarah has significant experience building and restructuring teams.",
            evidence: "Reorganized product team structure from feature to customer journey orientation; built user research team from scratch."
          }
        ],
        justification: "Sarah's experience leading large teams of 40+ members, combined with formalized talent development programs and successful reorganizations, demonstrates exceptional team management capabilities.",
        strengths: [
          "Experience with large team leadership (40+)",
          "Formal talent development programs",
          "Successful team reorganizations"
        ],
        limitations: [
          "No notable limitations in team management"
        ]
      },
      {
        parameterName: "Global Experience",
        score: 80,
        assessment: [
          {
            question: "What international markets has the candidate worked in?",
            answer: "Sarah has worked extensively in North American and European markets.",
            evidence: "Led product launches in US, UK, Germany, and France; 3 years based in London office."
          },
          {
            question: "How has the candidate adapted products for different markets?",
            answer: "Sarah has successful experience adapting products for regional markets.",
            evidence: "Created localization framework resulting in 40% higher adoption in European markets; adapted pricing models for regional differences."
          },
          {
            question: "Has the candidate managed distributed global teams?",
            answer: "Yes, Sarah has managed teams across multiple geographies.",
            evidence: "Led teams distributed across 3 countries; implemented timezone-friendly collaboration processes."
          }
        ],
        justification: "Sarah's experience with North American and European markets, along with her track record of successful localization and managing distributed teams, meets the global experience requirements.",
        strengths: [
          "Strong presence in key target markets",
          "Successful localization experience"
        ],
        limitations: [
          "Limited experience in APAC region"
        ]
      },
      {
        parameterName: "Time to Impact",
        score: 70,
        assessment: [
          {
            question: "How quickly has the candidate made an impact in previous roles?",
            answer: "Sarah typically takes 6-9 months to show significant impact.",
            evidence: "First major initiative at TechCorp launched after 8 months; strategic plan at PrevCo implemented after 7 months."
          },
          {
            question: "What approach does the candidate take to quickly understand a new business?",
            answer: "Sarah has a methodical approach to learning a new business.",
            evidence: "30-60-90 day plan emphasizing stakeholder interviews, customer research, and market analysis; comprehensive onboarding process."
          },
          {
            question: "Has the candidate balanced quick wins with long-term strategic goals?",
            answer: "Sarah tends to prioritize long-term strategic initiatives over quick wins.",
            evidence: "Focus on comprehensive planning before implementation; preference for thorough solutions over partial quick fixes."
          }
        ],
        justification: "Sarah's methodical approach results in thorough but somewhat slower impact, typically showing significant results within 6-9 months rather than the 3-6 month ideal timeframe.",
        strengths: [
          "Thorough business analysis process",
          "Sustainable long-term results"
        ],
        limitations: [
          "Longer time to first significant impact",
          "May prioritize thoroughness over speed"
        ]
      }
    ]
  },
  "James Wilson": {
    candidateName: "James Wilson",
    overallAssessment: "James brings strong technical expertise and demonstrates a proven ability to drive quick results. However, his strategic leadership skills and international experience are slightly below the requirements. He would benefit from additional coaching on scaling teams internationally.",
    evaluationScores: [
      {
        parameterName: "Strategic Leadership",
        score: 80,
        assessment: [
          {
            question: "Has the candidate demonstrated experience in defining product vision and strategy?",
            answer: "James has some experience defining product vision but has primarily operated within established strategic frameworks.",
            evidence: "Successfully executed product strategy at FastTech but strategy was initially defined by executive team; refined rather than created strategic visions."
          },
          {
            question: "How has the candidate aligned product strategy with business objectives?",
            answer: "James shows good alignment between product decisions and business goals.",
            evidence: "Implemented quarterly business review process to align product roadmap with sales targets; 85% of product initiatives tied directly to revenue goals."
          },
          {
            question: "Has the candidate led significant product transformations or pivots?",
            answer: "James has led incremental transformations rather than major pivots.",
            evidence: "Evolved product capabilities over time; added enterprise features to SMB product; gradual rather than revolutionary changes."
          }
        ],
        justification: "James has good strategic execution skills but less experience defining original strategic visions. His 8 years of product leadership show solid but not exceptional strategic leadership.",
        strengths: [
          "Strong execution of defined strategies",
          "Good business-product alignment process"
        ],
        limitations: [
          "Less experience creating original strategic vision",
          "More incremental than transformational approach"
        ]
      },
      {
        parameterName: "Technical Knowledge",
        score: 90,
        assessment: [
          {
            question: "What is the candidate's level of technical understanding?",
            answer: "James has exceptional technical understanding with a development background.",
            evidence: "Formal computer science degree; 5 years as a software engineer before moving to product; contributes to technical architecture decisions."
          },
          {
            question: "How effectively has the candidate collaborated with engineering teams?",
            answer: "James has outstanding engineering collaboration skills.",
            evidence: "Implemented joint product-engineering planning; reduced technical debt by 40% through collaborative prioritization; high satisfaction scores from engineering partners."
          },
          {
            question: "Has the candidate demonstrated data-driven decision making?",
            answer: "Yes, James shows strong data-driven decision making.",
            evidence: "Built custom analytics dashboard for feature performance; established metrics-driven development culture; regular A/B testing program."
          }
        ],
        justification: "James's technical background as a former developer, combined with his proven engineering collaboration and data-driven approaches, demonstrates exceptional technical knowledge.",
        strengths: [
          "Development background provides deep technical credibility",
          "Strong technical collaboration methods",
          "Data-driven decision framework"
        ],
        limitations: [
          "No notable limitations in technical knowledge"
        ]
      },
      {
        parameterName: "Team Management",
        score: 80,
        assessment: [
          {
            question: "What size teams has the candidate led?",
            answer: "James has led moderately sized product teams, slightly below the requirement.",
            evidence: "Managed team of 22 product professionals at current company; previously led team of 15."
          },
          {
            question: "How has the candidate developed talent within their teams?",
            answer: "James shows good informal talent development but limited formal programs.",
            evidence: "One-on-one coaching approach; peer feedback system; no formal career development framework."
          },
          {
            question: "Has the candidate built or restructured product teams?",
            answer: "James has experience building small teams but not large-scale restructuring.",
            evidence: "Built analytics team from 2 to 7 people; added specialized roles to existing team structure."
          }
        ],
        justification: "James's team management experience with teams of up to 22 members is solid but slightly below the 25+ requirement, and his team development approach is more informal than structured.",
        strengths: [
          "Hands-on coaching approach",
          "Strong individual mentorship"
        ],
        limitations: [
          "Limited experience with larger teams (25+)",
          "Less structured talent development approach"
        ]
      },
      {
        parameterName: "Global Experience",
        score: 60,
        assessment: [
          {
            question: "What international markets has the candidate worked in?",
            answer: "James has worked primarily in UK and limited European markets.",
            evidence: "Experience in UK market and some exposure to German market; limited North American experience through partnerships only."
          },
          {
            question: "How has the candidate adapted products for different markets?",
            answer: "James has limited experience adapting products for different markets.",
            evidence: "Some experience with legal compliance differences between UK and EU; minimal experience with fundamental market adaptations."
          },
          {
            question: "Has the candidate managed distributed global teams?",
            answer: "James has managed geographically distributed teams but not globally distributed teams.",
            evidence: "Led teams across multiple UK offices; some remote team members in EU; no significant global team management."
          }
        ],
        justification: "James's experience is primarily UK-focused with limited European exposure and minimal North American market experience, falling significantly short of the global experience requirement.",
        strengths: [
          "Strong understanding of UK market"
        ],
        limitations: [
          "Limited North American experience",
          "Minimal experience adapting products for different markets",
          "Limited global team management"
        ]
      },
      {
        parameterName: "Time to Impact",
        score: 95,
        assessment: [
          {
            question: "How quickly has the candidate made an impact in previous roles?",
            answer: "James consistently demonstrates rapid impact in new roles.",
            evidence: "Launched first feature improvement within 6 weeks at current role; implemented new development process within 2 months at previous company; consistent pattern of quick results."
          },
          {
            question: "What approach does the candidate take to quickly understand a new business?",
            answer: "James has a highly effective rapid onboarding approach.",
            evidence: "Intensive stakeholder interview process in first 2 weeks; data deep-dive in first month; hands-on product usage from day one."
          },
          {
            question: "Has the candidate balanced quick wins with long-term strategic goals?",
            answer: "James excels at delivering quick wins while building toward strategic goals.",
            evidence: "90-day plan with specific milestone achievements; parallel tracks for quick improvements and strategic initiatives; effective prioritization framework."
          }
        ],
        justification: "James's consistent pattern of rapid results within the first 90 days, combined with his structured approach to balancing quick wins and strategic goals, demonstrates exceptional time-to-impact capabilities.",
        strengths: [
          "Rapid results orientation",
          "Effective quick onboarding process",
          "Balanced approach to short and long-term goals"
        ],
        limitations: [
          "No notable limitations in time to impact"
        ]
      }
    ]
  },
  "Emily Chen": {
    candidateName: "Emily Chen",
    overallAssessment: "Emily excels in technical knowledge and global experience, having led product teams across multiple international markets. Her strategic leadership skills meet the requirements, and she has demonstrated strong team management. Her balanced profile makes her a strong contender for the role.",
    evaluationScores: [
      {
        parameterName: "Strategic Leadership",
        score: 85,
        assessment: [
          {
            question: "Has the candidate demonstrated experience in defining product vision and strategy?",
            answer: "Emily has substantial experience defining product vision and strategy.",
            evidence: "Led complete product vision overhaul at GlobeTech; created 3-year strategic roadmap that achieved 85% of objectives; established product principles framework."
          },
          {
            question: "How has the candidate aligned product strategy with business objectives?",
            answer: "Emily shows consistent alignment between product strategy and business goals.",
            evidence: "Created product-business alignment framework; quarterly business review process; product metrics directly tied to revenue and growth goals."
          },
          {
            question: "Has the candidate led significant product transformations or pivots?",
            answer: "Emily has led substantial product transformations.",
            evidence: "Pivoted product strategy in response to new market entrant; led transition from on-premise to cloud offering; repositioned product for enterprise market."
          }
        ],
        justification: "Emily's 11 years of product leadership with successful strategic planning and execution, including major transformations, meets the strategic leadership requirements.",
        strengths: [
          "Strong strategic planning framework",
          "Successful product transformations",
          "Effective business alignment process"
        ],
        limitations: [
          "Some strategies more reactive than proactive"
        ]
      },
      {
        parameterName: "Technical Knowledge",
        score: 95,
        assessment: [
          {
            question: "What is the candidate's level of technical understanding?",
            answer: "Emily has exceptional technical understanding with formal computer science education.",
            evidence: "PhD in Computer Science; published research on distributed systems; maintains technical currency through continued learning and engagement."
          },
          {
            question: "How effectively has the candidate collaborated with engineering teams?",
            answer: "Emily demonstrates outstanding engineering collaboration.",
            evidence: "Led joint product-engineering team structure; regular participation in architecture reviews; consistently high satisfaction scores from engineering partners."
          },
          {
            question: "Has the candidate demonstrated data-driven decision making?",
            answer: "Emily shows sophisticated data-driven decision making approaches.",
            evidence: "Implemented comprehensive metrics framework; led machine learning initiative to predict feature impact; established experimentation culture."
          }
        ],
        justification: "Emily's computer science PhD background, continued technical engagement, and sophisticated data-driven approaches demonstrate exceptional technical knowledge that exceeds requirements.",
        strengths: [
          "Advanced technical education and knowledge",
          "Continued technical currency",
          "Sophisticated data analysis approaches"
        ],
        limitations: [
          "No notable limitations in technical knowledge"
        ]
      },
      {
        parameterName: "Team Management",
        score: 85,
        assessment: [
          {
            question: "What size teams has the candidate led?",
            answer: "Emily has led teams at the required size threshold.",
            answer: "Emily has led teams at the required size threshold.",
            evidence: "Currently manages team of 28 product professionals; previously led team of 24 at prior company."
          },
          {
            question: "How has the candidate developed talent within their teams?",
            answer: "Emily has implemented structured talent development programs.",
            evidence: "Established formal mentorship program; created skills development framework; regular career development discussions; 35% internal promotion rate."
          },
          {
            question: "Has the candidate built or restructured product teams?",
            answer: "Emily has significant experience building and restructuring teams.",
            evidence: "Built product organization at startup from 3 to 24 people; reorganized team from technology to customer journey focus; created specialized roles."
          }
        ],
        justification: "Emily's experience leading teams of 25+ members, combined with formal talent development programs and proven team building experience, meets the team management requirements.",
        strengths: [
          "Experience with required team size",
          "Structured talent development approach",
          "Proven team building capability"
        ],
        limitations: [
          "Less experience with very large teams (40+)"
        ]
      },
      {
        parameterName: "Global Experience",
        score: 95,
        assessment: [
          {
            question: "What international markets has the candidate worked in?",
            answer: "Emily has extensive global market experience exceeding requirements.",
            evidence: "Work experience across North America, Europe, and Asia-Pacific; led product launches in 12 countries; 3 years based in Singapore, 2 years in London."
          },
          {
            question: "How has the candidate adapted products for different markets?",
            answer: "Emily has sophisticated product adaptation experience for global markets.",
            evidence: "Created global product strategy with regional adaptation framework; successful localization in 8 languages; adapted pricing and packaging for regional market differences."
          },
          {
            question: "Has the candidate managed distributed global teams?",
            answer: "Emily has extensive experience managing globally distributed teams.",
            evidence: "Led product teams distributed across 5 countries; implemented global-friendly processes and communication structures; effective management across time zones."
          }
        ],
        justification: "Emily's experience across North America, Europe, and Asia-Pacific, combined with her proven product adaptation framework and global team management, significantly exceeds the global experience requirements.",
        strengths: [
          "True global experience across three continents",
          "Sophisticated regional adaptation framework",
          "Multilingual capabilities (English, Mandarin, French)"
        ],
        limitations: [
          "No notable limitations in global experience"
        ]
      },
      {
        parameterName: "Time to Impact",
        score: 80,
        assessment: [
          {
            question: "How quickly has the candidate made an impact in previous roles?",
            answer: "Emily typically demonstrates impact within 4-6 months.",
            evidence: "First major initiative implemented at 5 months in current role; process improvements at 4 months in previous role; consistent pattern of methodical but steady progress."
          },
          {
            question: "What approach does the candidate take to quickly understand a new business?",
            answer: "Emily has a thorough, systematic approach to learning a new business.",
            evidence: "Structured stakeholder interview process; data analysis phase; customer interviews; comprehensive market analysis; typically 3-month orientation period."
          },
          {
            question: "Has the candidate balanced quick wins with long-term strategic goals?",
            answer: "Emily shows good balance between short and long-term initiatives.",
            evidence: "Parallel tracks for immediate improvements and strategic initiatives; 30-60-90 day planning framework; prioritization matrix for balancing impact timelines."
          }
        ],
        justification: "Emily's 4-6 month timeframe for significant impact, combined with her systematic approach to business understanding, meets but does not exceed the time-to-impact requirements.",
        strengths: [
          "Thorough business analysis approach",
          "Balanced short and long-term focus"
        ],
        limitations: [
          "Methodical approach may delay initial impact",
          "Focus on understanding before action"
        ]
      }
    ]
  }
};