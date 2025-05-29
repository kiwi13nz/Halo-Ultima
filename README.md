# Albany Partners Assessment Platform

This application is a comprehensive assessment platform for Albany Partners, designed to streamline the process of evaluating job candidates. It leverages AI to analyze job requirements and candidate information, generating detailed reports that help make better hiring decisions.

## Features

- **Job Analysis**: Upload job descriptions and get AI-powered analysis of key evaluation criteria
- **Candidate Evaluation**: Process candidate resumes and information with AI to evaluate against job requirements
- **Interactive Reports**: Generate comprehensive reports with skills comparisons, gap analysis, and more
- **PDF Export**: Export reports as HTML/PDF for sharing and printing
- **Dashboard**: Manage all assessments from a central dashboard

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- Supabase for database
- OpenAI GPT-3.5 Turbo for AI processing
- React Router for navigation
- Various utility libraries (jsPDF, mammoth, etc.)

## Getting Started

### Prerequisites

- Node.js 16+ 
- A Supabase account and project
- An OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/albany-partners-assessment.git
   cd albany-partners-assessment
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your credentials:
   ```
   cp .env.example .env
   ```

4. Set up your Supabase database by running the SQL setup script found in `supabase/schema.sql` in your Supabase SQL editor.

5. Start the development server:
   ```
   npm run dev
   ```

## Database Setup

You'll need to create the following tables in your Supabase database:

1. `jobs` - Stores job information and AI analysis
2. `candidates` - Stores candidate information linked to jobs
3. `reports` - Stores final assessment reports

The schema for these tables is provided in the `supabase/schema.sql` file.

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_MAX_DOCUMENT_SIZE`: (Optional) Maximum document size in bytes (default: 10MB)

## Usage Flow

1. From the dashboard, click "New Assessment"
2. Enter job details and description
3. Review and edit the AI-generated assessment criteria
4. Enter candidate information and upload resumes
5. Review and edit the AI-generated candidate evaluations
6. Generate and export the final report

## License

[Your License Information]

## Support

For support, contact [your contact information]