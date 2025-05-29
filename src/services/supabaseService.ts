// src/services/supabaseService.ts - Complete version with user authentication
import { supabase } from './supabaseClient';
import { EvaluationParameter, CandidateEvaluation } from '../types';
import { extractKECWithGPT } from './enhancedAiService';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Usuario no autenticado');
  }
  return user.id;
};

// Job Services - Updated with user filtering
export const createJob = async (jobData: {
  clientName: string;
  roleTitle: string;
  jobDescription: string;
  clientRequirements?: string;
  meetingNotes?: string;
  recruiterNotes?: string;
  additionalNotes?: string;
}) => {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase.from('jobs').insert({
      id: uuidv4(),
      user_id: userId,
      client_name: jobData.clientName,
      role_title: jobData.roleTitle,
      job_description: jobData.jobDescription,
      client_requirements: jobData.clientRequirements || null,
      meeting_notes: jobData.meetingNotes || null,
      recruiter_notes: jobData.recruiterNotes || null,
      additional_notes: jobData.additionalNotes || null,
      status: 'draft'
    }).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const getJob = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

export const updateJob = async (
  jobId: string,
  jobData: Partial<{
    clientName: string;
    roleTitle: string;
    jobDescription: string;
    clientRequirements: string;
    meetingNotes: string;
    recruiterNotes: string;
    additionalNotes: string;
    kecItems: string;
    insightFlags: string;
    status: 'draft' | 'complete' | 'archived';
  }>
) => {
  try {
    const updateData: any = {};
    
    if (jobData.clientName) updateData.client_name = jobData.clientName;
    if (jobData.roleTitle) updateData.role_title = jobData.roleTitle;
    if (jobData.jobDescription) updateData.job_description = jobData.jobDescription;
    if (jobData.clientRequirements !== undefined) updateData.client_requirements = jobData.clientRequirements;
    if (jobData.meetingNotes !== undefined) updateData.meeting_notes = jobData.meetingNotes;
    if (jobData.recruiterNotes !== undefined) updateData.recruiter_notes = jobData.recruiterNotes;
    if (jobData.additionalNotes !== undefined) updateData.additional_notes = jobData.additionalNotes;
    if (jobData.kecItems) updateData.kec_items = jobData.kecItems;
    if (jobData.insightFlags) updateData.insight_flags = jobData.insightFlags;
    if (jobData.status) updateData.status = jobData.status;
    
    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const listJobs = async () => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing jobs:', error);
    throw error;
  }
};

// Candidate Services - Updated with user filtering
export const createCandidate = async (candidateData: {
  jobId: string;
  name: string;
  resume: string;
  recruiterNotes?: string;
  meetingNotes?: string;
  additionalInfo?: string;
}) => {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase.from('candidates').insert({
      id: uuidv4(),
      job_id: candidateData.jobId,
      user_id: userId,
      name: candidateData.name,
      resume: candidateData.resume,
      recruiter_notes: candidateData.recruiterNotes || null,
      meeting_notes: candidateData.meetingNotes || null,
      additional_info: candidateData.additionalInfo || null,
      status: 'draft'
    }).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

export const getCandidate = async (candidateId: string) => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting candidate:', error);
    throw error;
  }
};

export const updateCandidate = async (
  candidateId: string,
  candidateData: Partial<{
    name: string;
    resume: string;
    recruiterNotes: string;
    meetingNotes: string;
    additionalInfo: string;
    aiEvaluation: string;
    status: 'draft' | 'complete' | 'archived';
  }>
) => {
  try {
    const updateData: any = {};
    
    if (candidateData.name) updateData.name = candidateData.name;
    if (candidateData.resume !== undefined) updateData.resume = candidateData.resume;
    if (candidateData.recruiterNotes !== undefined) updateData.recruiter_notes = candidateData.recruiterNotes;
    if (candidateData.meetingNotes !== undefined) updateData.meeting_notes = candidateData.meetingNotes;
    if (candidateData.additionalInfo !== undefined) updateData.additional_info = candidateData.additionalInfo;
    if (candidateData.aiEvaluation) updateData.ai_evaluation = candidateData.aiEvaluation;
    if (candidateData.status) updateData.status = candidateData.status;
    
    const { data, error } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

export const listCandidates = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing candidates:', error);
    throw error;
  }
};

// Report Services - Updated with user filtering
export const createReport = async (reportData: {
  jobId: string;
  reportReference: string;
  executiveSummary?: string;
  reportData?: string;
}) => {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase.from('reports').insert({
      id: uuidv4(),
      job_id: reportData.jobId,
      user_id: userId,
      report_reference: reportData.reportReference,
      executive_summary: reportData.executiveSummary || null,
      report_data: reportData.reportData || null,
      status: 'draft'
    }).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const getReport = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting report:', error);
    throw error;
  }
};

export const updateReport = async (
  reportId: string,
  reportData: Partial<{
    executiveSummary: string;
    reportData: string;
    status: 'draft' | 'complete' | 'archived';
  }>
) => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (reportData.reportData !== undefined) updateData.report_data = reportData.reportData;
    if (reportData.executiveSummary !== undefined) updateData.executive_summary = reportData.executiveSummary;
    if (reportData.status) updateData.status = reportData.status;
    
    const { data, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

export const listReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        jobs:job_id (client_name, role_title)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing reports:', error);
    throw error;
  }
};

// AI Processing Services
export const processJobWithAI = async (jobId: string) => {
  try {
    const job = await getJob(jobId);
    if (!job) throw new Error('Job not found');
    
    const result = await extractKECWithGPT(
      job.job_description,
      job.client_requirements,
      job.meeting_notes,
      job.recruiter_notes,
      job.additional_notes
    );
    
    await updateJob(jobId, {
      kecItems: JSON.stringify(result.kecItems),
      insightFlags: JSON.stringify(result.insightFlags)
    });
    
    return result;
  } catch (error) {
    console.error('Error processing job with AI:', error);
    throw error;
  }
};

// User management functions
export const createUser = async (email: string, password: string, userData?: any) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userData
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Helper to convert Supabase data to app format
export const convertJobDataToAppFormat = (jobData: any) => {
  return {
    id: jobData.id,
    clientName: jobData.client_name,
    roleTitle: jobData.role_title,
    jobDescription: jobData.job_description,
    clientRequirements: jobData.client_requirements || '',
    meetingNotes: jobData.meeting_notes || '',
    recruiterNotes: jobData.recruiter_notes || '',
    additionalNotes: jobData.additional_notes || '',
    kecItems: jobData.kec_items ? JSON.parse(jobData.kec_items) : [],
    insightFlags: jobData.insight_flags ? JSON.parse(jobData.insight_flags) : []
  };
};

export const convertCandidateDataToAppFormat = (candidateData: any) => {
  return {
    id: candidateData.id,
    jobId: candidateData.job_id,
    name: candidateData.name,
    resume: candidateData.resume || '',
    recruiterNotes: candidateData.recruiter_notes || '',
    meetingNotes: candidateData.meeting_notes || '',
    additionalInfo: candidateData.additional_info || '',
    evaluation: candidateData.ai_evaluation ? JSON.parse(candidateData.ai_evaluation) : null
  };
};