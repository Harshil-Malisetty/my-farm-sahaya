import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAzureChatBot } from '@/hooks/useAzureChatBot';
import { Loader2, Sprout } from 'lucide-react';

export const ModernFarmingForm = () => {
  const { language } = useLanguage();
  const { sendMessage, isLoading } = useAzureChatBot();
  const [formData, setFormData] = useState({
    cropName: '',
    season: '',
    areaOfLand: ''
  });
  const [techniques, setTechniques] = useState<string>('');

  const seasons = language === 'malayalam' 
    ? [
        { value: 'kharif', label: 'ഖാരിഫ് (ജൂൺ-ഒക്ടോബർ)' },
        { value: 'rabi', label: 'റാബി (നവംബർ-ഏപ്രിൽ)' },
        { value: 'zaid', label: 'സൈദ് (മാർച്ച്-ജൂൺ)' }
      ]
    : [
        { value: 'kharif', label: 'Kharif (June-October)' },
        { value: 'rabi', label: 'Rabi (November-April)' },
        { value: 'zaid', label: 'Zaid (March-June)' }
      ];

  const generateTechniques = async () => {
    if (!formData.cropName || !formData.season || !formData.areaOfLand) {
      return;
    }

    const prompt = language === 'malayalam'
      ? `${formData.cropName} വിളയ്ക്ക് ${formData.season} സീസണിൽ ${formData.areaOfLand} ഏക്കർ സ്ഥലത്ത് ആധുനിക കൃഷി രീതികൾ വിശദമായി പറയുക. മണ്ണ് തയ്യാറാക്കൽ, നനയ്ക്കൽ, വളപ്രയോഗം, കീടനിയന്ത്രണം, വിളവെടുപ്പ് ടിപ്പുകൾ ഉൾപ്പെടുത്തുക.`
      : `Provide detailed modern farming techniques for ${formData.cropName} crop in ${formData.season} season for ${formData.areaOfLand} acres of land. Include soil preparation, irrigation, fertilizer application, pest management, and harvesting tips.`;

    try {
      await sendMessage(prompt, 'modern-farming');
      // The response will be handled by the chat system
    } catch (error) {
      console.error('Error generating techniques:', error);
    }
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center gap-3 mb-6">
        <Sprout className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold malayalam-text">
          {language === 'malayalam' ? 'കൃഷി പദ്ധതി ഫോം' : 'Farming Plan Form'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="cropName" className="malayalam-text">
            {language === 'malayalam' ? 'വിളയുടെ പേര്' : 'Crop Name'}
          </Label>
          <Input
            id="cropName"
            value={formData.cropName}
            onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
            placeholder={language === 'malayalam' ? 'ഉദാ: നെല്ല്, കുരുമുളക്' : 'e.g., Rice, Pepper'}
            className="malayalam-text"
          />
        </div>

        <div className="space-y-2">
          <Label className="malayalam-text">
            {language === 'malayalam' ? 'സീസൺ' : 'Season'}
          </Label>
          <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
            <SelectTrigger className="malayalam-text">
              <SelectValue placeholder={language === 'malayalam' ? 'സീസൺ തിരഞ്ഞെടുക്കുക' : 'Select season'} />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.value} value={season.value} className="malayalam-text">
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaOfLand" className="malayalam-text">
            {language === 'malayalam' ? 'സ്ഥലത്തിന്റെ വിസ്തീർണ്ണം (ഏക്കർ)' : 'Area of Land (Acres)'}
          </Label>
          <Input
            id="areaOfLand"
            value={formData.areaOfLand}
            onChange={(e) => setFormData(prev => ({ ...prev, areaOfLand: e.target.value }))}
            placeholder={language === 'malayalam' ? 'ഉദാ: 2.5' : 'e.g., 2.5'}
            type="number"
            step="0.1"
          />
        </div>
      </div>

      <Button 
        onClick={generateTechniques}
        disabled={!formData.cropName || !formData.season || !formData.areaOfLand || isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {language === 'malayalam' ? 'സൃഷ്ടിക്കുന്നു...' : 'Generating...'}
          </>
        ) : (
          <>
            <Sprout className="h-4 w-4 mr-2" />
            {language === 'malayalam' ? 'കൃഷി ടെക്നിക്കുകൾ സൃഷ്ടിക്കുക' : 'Generate Farming Techniques'}
          </>
        )}
      </Button>

      <p className="text-sm text-muted-foreground mt-3 malayalam-text">
        {language === 'malayalam' 
          ? 'AI അസിസ്റ്റന്റിൽ നിന്ന് വിശദമായ കൃഷി ടെക്നിക്കുകൾ ലഭിക്കും'
          : 'Detailed farming techniques will be provided by the AI Assistant'
        }
      </p>
    </Card>
  );
};