import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader } from './DashboardHeader';
import { VoiceNavigation } from './VoiceNavigation';
import { ServicesGrid } from './ServicesGrid';
import { FarmerHelpline } from '../FarmerHelpline';
import { Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="malayalam-text text-muted-foreground">
            {language === 'malayalam' ? 'ലോഡിംഗ്...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-green-50/20 to-yellow-50/30 relative overflow-hidden">
      {/* Enhanced Background with Farm Scenery */}
      <div className="absolute inset-0 opacity-10">
        {/* Farm field patterns */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-green-300 rounded-full blur-2xl"></div>
        
        {/* Additional farm-like elements */}
        <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-amber-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 left-10 w-20 h-20 bg-lime-400 rounded-full blur-xl"></div>
        <div className="absolute top-60 right-10 w-32 h-32 bg-teal-300 rounded-full blur-2xl"></div>
      </div>
      
      <DashboardHeader />
      <VoiceNavigation />
      
      <main className="container mx-auto px-4 pb-8 relative z-10">
        <ServicesGrid />
      </main>
      
      <FarmerHelpline />
    </div>
  );
};