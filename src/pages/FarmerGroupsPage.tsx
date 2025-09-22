import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ArrowLeft, Users, MessageCircle, Phone, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FarmerGroupsPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();

  const farmerGroups = [
    {
      name: language === 'malayalam' ? 'കേരള നെൽകർഷക സംഘം' : 'Kerala Rice Farmers Group',
      members: '234 അംഗങ്ങൾ / 234 members',
      location: language === 'malayalam' ? 'പാലക്കാട്' : 'Palakkad',
      specialty: language === 'malayalam' ? 'നെൽ കൃഷി' : 'Rice farming',
      status: language === 'malayalam' ? 'സജീവം' : 'Active',
      lastMessage: language === 'malayalam' ? '2 മിനിറ്റ് മുമ്പ്' : '2 minutes ago'
    },
    {
      name: language === 'malayalam' ? 'സ്പൈസ് ഫാർമേഴ്സ് കൂട്ടായ്മ' : 'Spice Farmers Collective',
      members: '156 അംഗങ്ങൾ / 156 members',
      location: language === 'malayalam' ? 'ഇടുക്കി' : 'Idukki',
      specialty: language === 'malayalam' ? 'മസാല വിളകൾ' : 'Spice crops',
      status: language === 'malayalam' ? 'സജീവം' : 'Active',
      lastMessage: language === 'malayalam' ? '15 മിനിറ്റ് മുമ്പ്' : '15 minutes ago'
    },
    {
      name: language === 'malayalam' ? 'പച്ചക്കറി കർഷക സംഘം' : 'Vegetable Farmers Union',
      members: '89 അംഗങ്ങൾ / 89 members',
      location: language === 'malayalam' ? 'വയനാട്' : 'Wayanad',
      specialty: language === 'malayalam' ? 'പച്ചക്കറികൾ' : 'Vegetables',
      status: language === 'malayalam' ? 'സജീവം' : 'Active',
      lastMessage: language === 'malayalam' ? '1 മണിക്കൂർ മുമ്പ്' : '1 hour ago'
    }
  ];

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `കൂട്ടായ്മ പേജ്. ഇവിടെ നിങ്ങൾക്ക് കർഷക സംഘങ്ങളുമായി ചാറ്റ് ചെയ്യാം. കേരള നെൽകർഷക സംഘത്തിൽ ഇരുന്നൂറ്റിമുപ്പത്തിനാലു അംഗങ്ങളുണ്ട്. പാലക്കാട് ജില്ലയിലാണ് സ്ഥിതി ചെയ്യുന്നത്. ശബ്ദത്തിലൂടെ സന്ദേശങ്ങൾ അയയ്ക്കാം.`
      : `Farmer groups page. Here you can chat with farmer communities. Kerala Rice Farmers Group has two hundred thirty four members located in Palakkad district. You can send voice messages to communicate.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak]);

  const handleReadPage = () => {
    const fullPageText = language === 'malayalam' 
      ? `കർഷക കൂട്ടായ്മ വിവരങ്ങൾ. കേരള നെൽകർഷക സംഘം. ഇരുന്നൂറ്റിമുപ്പത്തിനാലു അംഗങ്ങൾ. പാലക്കാട് ജില്ലയിൽ. നെൽ കൃഷിയിൽ വിശേഷജ്ഞർ. രണ്ട് മിനിറ്റ് മുമ്പ് അവസാന സന്ദേശം. സ്പൈസ് ഫാർമേഴ്സ് കൂട്ടായ്മ. നൂറ്റിയൻപത്തിയാറു അംഗങ്ങൾ. ഇടുക്കി ജില്ലയിൽ. മസാല വിളകളിൽ വിശേഷജ്ഞർ. പച്ചക്കറി കർഷക സംഘം. എൺപത്തിയൊമ്പത് അംഗങ്ങൾ. വയനാട് ജില്ലയിൽ.`
      : `Farmer collective information. Kerala Rice Farmers Group with two hundred thirty four members in Palakkad district specializing in rice farming with last message two minutes ago. Spice Farmers Collective with one hundred fifty six members in Idukki district specializing in spice crops. Vegetable Farmers Union with eighty nine members in Wayanad district.`;
    
    speak(fullPageText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          
          <div className="text-center">
            <h1 className="malayalam-text text-xl text-primary">
              {t('farmerGroups')}
            </h1>
            <p className="english-subtext">
              {t('farmerGroupsDesc')}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReadPage}
            disabled={isPlaying}
          >
            <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Voice Chat Notice */}
        <Card className="farmer-card mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center gap-4">
            <Phone className="h-12 w-12" />
            <div>
              <h2 className="malayalam-text text-xl mb-2">
                {language === 'malayalam' ? 'ശബ്ദ സന്ദേശം' : 'Voice Messaging'}
              </h2>
              <p className="english-subtext opacity-90">
                {language === 'malayalam' 
                  ? 'ശബ്ദത്തിലൂടെ കർഷകരുമായി ആശയവിനിമയം നടത്തുക'
                  : 'Communicate with farmers using voice messages'
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Active Groups */}
        <div className="space-y-4">
          <h2 className="malayalam-text text-xl flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            {language === 'malayalam' ? 'സജീവ കൂട്ടായ്മകൾ' : 'Active Groups'}
          </h2>

          {farmerGroups.map((group, index) => (
            <Card key={index} className="farmer-card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="malayalam-text text-lg mb-2">{group.name}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <p className="english-subtext text-sm">
                        <span className="font-medium">👥 </span>
                        {group.members}
                      </p>
                      <p className="malayalam-text text-sm">
                        <span className="font-medium">📍 </span>
                        {group.location}
                      </p>
                      <p className="malayalam-text text-sm">
                        <span className="font-medium">🌾 </span>
                        {group.specialty}
                      </p>
                      <p className="english-subtext text-sm">
                        <span className="font-medium">⏰ </span>
                        {group.lastMessage}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="malayalam-text text-sm text-green-600 font-medium">
                        {group.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="ml-4">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {language === 'malayalam' ? 'ചാറ്റ്' : 'Chat'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="farmer-card mt-8 bg-amber-50 border-amber-200">
          <div className="text-center py-4">
            <h3 className="malayalam-text text-lg mb-2">
              {language === 'malayalam' ? 'ഉടൻ വരുന്നു' : 'Coming Soon'}
            </h3>
            <p className="english-subtext">
              {language === 'malayalam' 
                ? 'ശബ്ദ ചാറ്റ് ഫീച്ചർ ഉടൻ ലഭ്യമാകും'
                : 'Voice chat feature will be available soon'
              }
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};