// src/components/Dashboard.tsx - Updated with translations and share functionality
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, FileText, Edit2, Calendar, User, FilePenLine, LogOut, ChevronDown, Share2, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { listReports, listJobs } from '../services/supabaseService';

interface ReportItem {
  id: string;
  job_id: string;
  created_at: string;
  updated_at: string;
  report_reference: string;
  executive_summary: string | null;
  status: 'draft' | 'complete' | 'archived';
  jobs: {
    client_name: string;
    role_title: string;
  };
}

interface JobItem {
  id: string;
  created_at: string;
  client_name: string;
  role_title: string;
  status: 'draft' | 'complete' | 'archived';
}

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [draftJobs, setDraftJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrlCopied, setShareUrlCopied] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [reportsData, jobsData] = await Promise.all([
          listReports(),
          listJobs()
        ]);
        
        setReports(reportsData as unknown as ReportItem[]);
        
        const reportJobIds = reportsData.map(r => r.job_id);
        const draftJobsFiltered = jobsData
          .filter(job => 
            job.status === 'draft' && 
            !reportJobIds.includes(job.id)
          );
        
        setDraftJobs(draftJobsFiltered as unknown as JobItem[]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(t('dashboard:errors.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-AR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const handleCreateNew = () => {
    navigate('/wizard/new');
  };
  
  const handleContinueDraft = (jobId: string) => {
    navigate(`/wizard/job/${jobId}`);
  };
  
  const handleEditReport = (reportId: string, jobId: string) => {
    navigate(`/wizard/report/${reportId}/job/${jobId}`);
  };
  
  const handleViewReport = (reportId: string, jobId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleLogout = async () => {
    if (window.confirm(t('auth:logout.confirm'))) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    setShowLanguageDropdown(false);
  };

  // Generate shareable URL for report
  const generateShareUrl = (reportId: string) => {
    // Create a base64 encoded share token
    const shareToken = btoa(reportId);
    const baseUrl = window.location.origin;
    return `${baseUrl}/public/report/${shareToken}`;
  };

  // Handle share button click
  const handleShareReport = (reportId: string) => {
    const url = generateShareUrl(reportId);
    setShareUrl(url);
    setShowShareModal(true);
    setShareUrlCopied(false);
  };

  // Copy share URL to clipboard
  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareUrlCopied(true);
      setTimeout(() => setShareUrlCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Close share modal
  const closeShareModal = () => {
    setShowShareModal(false);
    setShareUrl('');
    setShareUrlCopied(false);
  };

  // Flag component
  const FlagIcon: React.FC<{ country: 'us' | 'ar'; className?: string }> = ({ country, className = "w-5 h-5" }) => {
    if (country === 'us') {
      return (
        <svg className={className} viewBox="0 0 24 16" fill="none">
          <rect width="24" height="16" rx="2" fill="#B22234"/>
          <rect width="24" height="1.23" y="1.23" fill="white"/>
          <rect width="24" height="1.23" y="3.69" fill="#B22234"/>
          <rect width="24" height="1.23" y="6.15" fill="white"/>
          <rect width="24" height="1.23" y="8.62" fill="#B22234"/>
          <rect width="24" height="1.23" y="11.08" fill="white"/>
          <rect width="24" height="1.23" y="13.54" fill="#B22234"/>
          <rect width="10.46" height="8.62" fill="#3C3B6E"/>
        </svg>
      );
    } else {
      return (
        <svg className={className} viewBox="0 0 24 16" fill="none">
          <rect width="24" height="16" rx="2" fill="#74ACDF"/>
          <rect width="24" height="5.33" y="5.33" fill="white"/>
          <rect width="24" height="5.33" y="10.67" fill="#74ACDF"/>
          <circle cx="6" cy="8" r="2" fill="#FCDD09"/>
          <path d="M6 6.5 L6.5 7.5 L7.5 7.5 L6.8 8.2 L7 9.2 L6 8.7 L5 9.2 L5.2 8.2 L4.5 7.5 L5.5 7.5 Z" fill="#8D4B10"/>
        </svg>
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-pink-600" />
              <h1 className="ml-3 text-2xl font-medium text-gray-900">
                {t('common:appName')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Flag-based Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <FlagIcon country={i18n.language === 'es' ? 'ar' : 'us'} />
                  <span className="hidden sm:inline">
                    {i18n.language === 'es' ? 'Español' : 'English'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 ${
                        i18n.language === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <FlagIcon country="us" className="w-5 h-5" />
                      <span>English</span>
                      {i18n.language === 'en' && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 ${
                        i18n.language === 'es' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <FlagIcon country="ar" className="w-5 h-5" />
                      <span>Español (AR)</span>
                      {i18n.language === 'es' && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                    </button>
                  </div>
                )}
              </div>
              
              {user && (
                <div className="flex items-center text-sm text-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth:logout.button')}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('dashboard:title')}
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                {t('dashboard:subtitle')}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('dashboard:newAssessment')}
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          )}
          
          {/* Incomplete Assessments */}
          {!isLoading && draftJobs.length > 0 && (
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {t('dashboard:incompleteAssessments.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {t('dashboard:incompleteAssessments.subtitle')}
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {draftJobs.map(job => (
                  <li key={job.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FilePenLine className="h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{job.role_title}</p>
                          <p className="text-sm text-gray-500">{job.client_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-4">
                          {t('common:status.draft')}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(job.created_at)}
                        </div>
                        <button
                          onClick={() => handleContinueDraft(job.id)}
                          className="ml-6 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                          {t('dashboard:incompleteAssessments.continueButton')}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Completed Reports */}
          {!isLoading && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {t('dashboard:assessmentReports.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {t('dashboard:assessmentReports.subtitle')}
                </p>
              </div>
              {reports.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    {t('dashboard:assessmentReports.noReports')}
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('dashboard:assessmentReports.createFirst')}
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {reports.map(report => (
                    <li key={report.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{report.jobs.role_title}</p>
                            <p className="text-xs text-gray-500">
                              {report.report_reference} • {report.jobs.client_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium mr-4 
                            ${report.status === 'complete' 
                              ? 'bg-green-100 text-green-800' 
                              : report.status === 'draft' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {t(`common:status.${report.status}`)}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(report.updated_at)}
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <button
                              onClick={() => handleShareReport(report.id)}
                              className="bg-white py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                              title={i18n.language === 'es' ? 'Compartir informe' : 'Share report'}
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditReport(report.id, report.job_id)}
                              className="bg-white py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleViewReport(report.id, report.job_id)}
                              className="bg-pink-600 py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                              {t('common:buttons.view')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {i18n.language === 'es' ? 'Compartir Informe' : 'Share Report'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  {i18n.language === 'es' 
                    ? 'Cualquier persona con este enlace podrá ver el informe:'
                    : 'Anyone with this link will be able to view the report:'
                  }
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyShareUrl}
                    className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm"
                  >
                    {shareUrlCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {shareUrlCopied && (
                  <p className="text-sm text-green-600 mb-4">
                    {i18n.language === 'es' ? '¡Enlace copiado!' : 'Link copied!'}
                  </p>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={closeShareModal}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600"
                >
                  {i18n.language === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside handler for language dropdown */}
      {showLanguageDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLanguageDropdown(false)}
        />
      )}
      
      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Albany Partners. {i18n.language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;