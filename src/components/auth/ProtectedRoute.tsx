// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import { Loader2, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { t } = useTranslation('common');
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Building2 className="h-16 w-16 text-pink-600 mb-4" />
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Albany Partners</h1>
        <div className="flex items-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin text-pink-600" />
          <p>{t('status.checkingAuth', { defaultValue: 'Verificando autenticación...' })}</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;