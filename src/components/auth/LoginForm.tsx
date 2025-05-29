// src/components/auth/LoginForm.tsx  
import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('auth:login.errors.generic'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        // Map specific Supabase error messages to user-friendly translations
        switch (signInError.message) {
          case 'Invalid login credentials':
            setError(t('auth:login.errors.invalidCredentials'));
            break;
          case 'Email not confirmed':
            setError(t('auth:login.errors.emailNotConfirmed'));
            break;
          case 'Too many requests':
            setError(t('auth:login.errors.tooManyAttempts'));
            break;
          default:
            setError(t('auth:login.errors.generic'));
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth:login.errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="h-16 w-16 text-pink-600" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {t('common:appName')}
        </h1>
        <h2 className="mt-2 text-center text-xl text-gray-600">
          {t('auth:login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t('auth:login.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth:login.email')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder={t('auth:login.emailPlaceholder')}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth:login.password')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder={t('auth:login.passwordPlaceholder')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('auth:login.loggingIn')}
                  </>
                ) : (
                  t('auth:login.loginButton')
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <div className="text-xs text-gray-500">
              <p className="mb-2">Sistema de evaluación de candidatos</p>
              <p>© {new Date().getFullYear()} Albany Partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;