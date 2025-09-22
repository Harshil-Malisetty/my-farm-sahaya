import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader } from './DashboardHeader';
import { VoiceNavigation } from './VoiceNavigation';
import { ServicesGrid } from './ServicesGrid';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <DashboardHeader />
      <VoiceNavigation />
      
      <main className="container mx-auto px-4 pb-8">
        <ServicesGrid />
      </main>
    </div>
  );
};