import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sprout, Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const { user, signIn, signUp, loading } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, fullName);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <h1 className="malayalam-text text-2xl text-primary">
              {t('appName')}
            </h1>
          </div>
          
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="mb-4"
          >
            {language === 'malayalam' ? 'English' : 'മലയാളം'}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="malayalam-text">
                {language === 'malayalam' ? 'പേര്' : 'Full Name'}
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'malayalam' ? 'നിങ്ങളുടെ പേര്' : 'Your full name'}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="malayalam-text">
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'malayalam' ? 'നിങ്ങളുടെ ഇമെയിൽ' : 'your@email.com'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="malayalam-text">
              {t('password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'malayalam' ? 'പാസ്‌വേഡ്' : 'Password'}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full language-toggle text-lg py-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              <span className="malayalam-text">
                {isLogin ? t('signIn') : t('signUp')}
              </span>
            )}
          </Button>
        </form>

        {/* Toggle Sign In/Up */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary-glow transition-colors duration-200"
          >
            <span className="malayalam-text">
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
};