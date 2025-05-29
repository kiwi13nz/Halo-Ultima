// src/App.tsx - Updated with public routes support
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Building2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { checkConnection } from './services/supabaseClient';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import components
import Dashboard from './components/Dashboard';
import SupabasePlacementWizard from './components/wizard/SupabasePlacementWizard';
import Report from './components/Report';
import PublicReport from './components/PublicReport';

// Import i18n configuration
import './i18n';

// Component to handle routing logic
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isPublicRoute = location.pathname.startsWith('/public/');

  // Public routes don't need authentication
  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/public/report/:shareToken" element={<PublicReport />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  // Protected routes require authentication
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wizard/new" element={<SupabasePlacementWizard />} />
        <Route path="/wizard/job/:jobId" element={<SupabasePlacementWizard />} />
        <Route path="/wizard/report/:reportId/job/:jobId" element={<SupabasePlacementWizard />} />
        <Route path="/report/:reportId" element={<Report />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
};

function App() {
  const { t } = useTranslation('common');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if we have the required environment variables
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setConnectionError(t('errors.configError', { 
        defaultValue: 'Falta configuración de Supabase. Por favor verifique sus variables de entorno.' 
      }));
      setIsCheckingConnection(false);
      return;
    }

    const verifyConnection = async () => {
      try {
        const isConnected = await checkConnection();
        if (!isConnected) {
          setConnectionError(t('errors.connectionError', {
            defaultValue: 'No se puede conectar a la base de datos. Por favor verifique su configuración e intente nuevamente.'
          }));
        }
      } catch (error) {
        console.error('Error checking Supabase connection:', error);
        setConnectionError(
          error instanceof Error 
            ? error.message 
            : t('errors.connectionError', {
                defaultValue: 'Error al conectar con la base de datos. Por favor verifique su configuración e intente nuevamente.'
              })
        );
      } finally {
        setIsCheckingConnection(false);
      }
    };
    
    verifyConnection();
  }, [t]);
  
  if (isCheckingConnection) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Building2 className="h-16 w-16 text-pink-600 mb-4" />
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {t('appName')}
        </h1>
        <div className="flex items-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin text-pink-600" />
          <p>{t('status.loading', { defaultValue: 'Conectando a la base de datos...' })}</p>
        </div>
      </div>
    );
  }
  
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Building2 className="h-16 w-16 text-pink-600 mb-4" />
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {t('appName')}
        </h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{connectionError}</p>
              <p className="mt-2 text-sm text-red-700">
                {t('errors.envVarsMessage', {
                  defaultValue: 'Por favor asegúrese de que sus variables de entorno de Supabase estén configuradas correctamente:'
                })}
                <ul className="list-disc ml-5 mt-1">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;