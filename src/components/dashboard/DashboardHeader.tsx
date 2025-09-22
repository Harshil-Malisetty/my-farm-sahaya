import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Sprout, LogOut, Languages } from 'lucide-react';

export const DashboardHeader = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { signOut, user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'malayalam') {
      if (hour < 12) return 'സുപ്രഭാതം';
      if (hour < 17) return 'നമസ്കാരം';
      return 'സുസന്ധ്യ';
    } else {
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="malayalam-text text-xl text-primary font-bold">
                {t('appName')}
              </h1>
              <p className="english-subtext">
                {getGreeting()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'malayalam' ? 'EN' : 'മലയാളം'}
              </span>
            </Button>

            {/* Sign Out */}
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'malayalam' ? 'പുറത്തുകടക്കുക' : 'Sign Out'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};