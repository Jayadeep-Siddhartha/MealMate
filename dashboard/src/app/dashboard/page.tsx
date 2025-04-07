// dashboard/page.tsx
import React from 'react';
import CafeDashboard from '../../components/dashboard/CafeDashboard'; // Import the CafeDashboard component

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Render the CafeDashboard component here */}
      <CafeDashboard />
    </div>
  );
};

export default DashboardPage;
