export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          created_at: string
          client_name: string
          role_title: string
          job_description: string
          client_requirements: string | null
          meeting_notes: string | null
          recruiter_notes: string | null
          additional_notes: string | null
          ai_analysis: string | null
          kec_items: string | null
          insight_flags: string | null
          status: 'draft' | 'complete' | 'archived'
        }
        Insert: {
          id?: string
          created_at?: string
          client_name: string
          role_title: string
          job_description: string
          client_requirements?: string | null
          meeting_notes?: string | null
          recruiter_notes?: string | null
          additional_notes?: string | null
          ai_analysis?: string | null
          kec_items?: string | null
          insight_flags?: string | null
          status?: 'draft' | 'complete' | 'archived'
        }
        Update: {
          id?: string
          created_at?: string
          client_name?: string
          role_title?: string
          job_description?: string
          client_requirements?: string | null
          meeting_notes?: string | null
          recruiter_notes?: string | null
          additional_notes?: string | null
          ai_analysis?: string | null
          kec_items?: string | null
          insight_flags?: string | null
          status?: 'draft' | 'complete' | 'archived'
        }
      }
      candidates: {
        Row: {
          id: string
          job_id: string
          created_at: string
          name: string
          resume: string
          recruiter_notes: string | null
          meeting_notes: string | null
          additional_info: string | null
          ai_evaluation: string | null
          status: 'draft' | 'complete' | 'archived'
        }
        Insert: {
          id?: string
          job_id: string
          created_at?: string
          name: string
          resume: string
          recruiter_notes?: string | null
          meeting_notes?: string | null
          additional_info?: string | null
          ai_evaluation?: string | null
          status?: 'draft' | 'complete' | 'archived'
        }
        Update: {
          id?: string
          job_id?: string
          created_at?: string
          name?: string
          resume?: string
          recruiter_notes?: string | null
          meeting_notes?: string | null
          additional_info?: string | null
          ai_evaluation?: string | null
          status?: 'draft' | 'complete' | 'archived'
        }
      }
      reports: {
        Row: {
          id: string
          job_id: string
          created_at: string
          updated_at: string
          report_reference: string
          executive_summary: string | null
          status: 'draft' | 'complete' | 'archived'
        }
        Insert: {
          id?: string
          job_id: string
          created_at?: string
          updated_at?: string
          report_reference: string
          executive_summary?: string | null
          status?: 'draft' | 'complete' | 'archived'
        }
        Update: {
          id?: string
          job_id?: string
          created_at?: string
          updated_at?: string
          report_reference?: string
          executive_summary?: string | null
          status?: 'draft' | 'complete' | 'archived'
        }
      }
    }
  }
}