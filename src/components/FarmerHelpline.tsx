import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, MessageCircle, Clock } from 'lucide-react';

export const FarmerHelpline = () => {
  const { language } = useLanguage();

  const handleCall = () => {
    window.open('tel:1800-123-4567', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/918123456789', '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="malayalam-text text-lg font-bold mb-1">
                {language === 'malayalam' ? 'കർഷക സഹായ വിഭാഗം' : 'Farmer Helpline'}
              </h3>
              <p className="english-subtext opacity-90">
                {language === 'malayalam' 
                  ? '24/7 സഹായം ലഭ്യമാണ്'
                  : '24/7 Support Available'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-1 opacity-80" />
                <p className="english-subtext text-sm opacity-90">
                  {language === 'malayalam' ? '24 മണിക്കൂർ' : '24 Hours'}
                </p>
              </div>
              <div className="text-center">
                <Phone className="h-6 w-6 mx-auto mb-1 opacity-80" />
                <p className="english-subtext text-sm opacity-90">
                  {language === 'malayalam' ? 'സൗജന്യ കോൾ' : 'Free Calling'}
                </p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-6 w-6 mx-auto mb-1 opacity-80" />
                <p className="english-subtext text-sm opacity-90">
                  {language === 'malayalam' ? 'വാട്സ് ആപ്പ്' : 'WhatsApp'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCall}
                variant="secondary"
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 font-medium"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === 'malayalam' ? 'കോൾ ചെയ്യുക' : 'Call Now'}
                <span className="ml-2 font-mono">1800-123-4567</span>
              </Button>
              
              <Button
                onClick={handleWhatsApp}
                variant="secondary"
                size="lg"
                className="bg-green-500 text-white hover:bg-green-400 font-medium"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === 'malayalam' ? 'വാട്സ് ആപ്പ്' : 'WhatsApp'}
              </Button>
            </div>

            <div className="text-center mt-4">
              <p className="english-subtext text-sm opacity-80">
                {language === 'malayalam' 
                  ? 'കാർഷിക വിദഗ്ധരുമായി നേരിട്ട് സംസാരിക്കുക'
                  : 'Speak directly with agricultural experts'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};