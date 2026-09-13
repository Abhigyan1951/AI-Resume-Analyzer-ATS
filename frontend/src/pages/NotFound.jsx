import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#1A2235] border border-[#1F2937] flex items-center justify-center text-[#EF4444]">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-[#F9FAFB]">404 - Page Not Found</h1>
        <p className="text-sm text-[#9CA3AF] max-w-md">
          The requested route does not exist or has been moved.
        </p>
      </div>
      <Button onClick={() => navigate('/')} variant="primary" leftIcon={<Home className="w-4 h-4" />}>
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
