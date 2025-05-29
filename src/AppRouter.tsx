import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Dashboard from './components/Dashboard';
import SupabasePlacementWizard from './components/wizard/SupabasePlacementWizard';
import Report from './components/Report';
import PublicReport from './components/PublicReport';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Wizard routes */}
        <Route path="/wizard/new" element={<SupabasePlacementWizard />} />
        <Route path="/wizard/job/:jobId" element={<SupabasePlacementWizard />} />
        <Route path="/wizard/report/:reportId/job/:jobId" element={<SupabasePlacementWizard />} />
        
        {/* Report view route */}
        <Route path="/report/:reportId" element={<Report />} />
        
        {/* Public report route - no authentication required */}
        <Route path="/public/report/:shareToken" element={<PublicReport />} />
        
        {/* Redirect to dashboard by default */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;