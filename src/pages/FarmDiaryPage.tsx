import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useFarmDiarySupabase } from '@/hooks/useFarmDiarySupabase';
import { useVoiceLogging } from '@/hooks/useVoiceLogging';
import { ArrowLeft, Calendar, Plus, Book, Volume2, Bell, X, Check, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import background image
import farmBackgroundImage from '@/assets/farm-background.jpg';

export const FarmDiaryPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isPlaying } = useTextToSpeech();
  const { 
    entries, 
    addEntry, 
    getDueReminders, 
    markReminderCompleted, 
    getUpcomingReminders,
    loading: diaryLoading,
    error: diaryError 
  } = useFarmDiarySupabase();
  
  const {
    isRecording,
    isProcessing,
    error: voiceError,
    startVoiceLogging,
    stopVoiceLogging,
    clearError
  } = useVoiceLogging();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    crop: '',
    area: '',
    notes: ''
  });

  const dueReminders = getDueReminders();
  const upcomingReminders = getUpcomingReminders();

  const handleAddEntry = async () => {
    if (newEntry.activity.trim() && newEntry.crop.trim()) {
      try {
        await addEntry(newEntry);
        setNewEntry({
          date: new Date().toISOString().split('T')[0],
          activity: '',
          crop: '',
          area: '',
          notes: ''
        });
        setShowAddForm(false);
      } catch (error) {
        console.error('Failed to add entry:', error);
      }
    }
  };

  const handleVoiceEntry = async () => {
    try {
      clearError();
      if (isRecording) {
        const voiceText = await stopVoiceLogging();
        
        // Create a voice entry with current date and voice text as notes
        const voiceEntry = {
          date: new Date().toISOString().split('T')[0],
          activity: 'Voice Entry',
          crop: 'Various',
          area: '',
          notes: `[Voice Log ${new Date().toLocaleTimeString()}] ${voiceText}`
        };
        
        await addEntry(voiceEntry);
        
        // Speak confirmation
        const confirmText = language === 'malayalam' 
          ? 'വോയ്സ് എൻട്രി സേവ് ചെയ്തു'
          : 'Voice entry saved';
        speak(confirmText);
      } else {
        await startVoiceLogging();
      }
    } catch (error) {
      console.error('Voice logging error:', error);
      const errorText = language === 'malayalam' 
        ? 'വോയ്സ് റെക്കോർഡിംഗിൽ പ്രശ്നം'
        : 'Voice recording failed';
      speak(errorText);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return language === 'malayalam' ? 'ഇന്ന്' : 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return language === 'malayalam' ? 'ഇന്നലെ' : 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    const pageText = language === 'malayalam' 
      ? `കൃഷി ദിനപതി പേജ്. ഇവിടെ നിങ്ങൾക്ക് ദൈനംദിന കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താം. ${entries.length} എൻട്രികൾ ഉണ്ട്. ${dueReminders.length} റിമൈൻഡറുകൾ കാലാവധി കഴിഞ്ഞു. പുതിയ എൻട്രി ചേർക്കാൻ പ്ലസ് ബട്ടൺ അമർത്തുക.`
      : `Farm diary page. You can record daily farming activities here. You have ${entries.length} entries. ${dueReminders.length} reminders are due. Press the plus button to add new entries.`;
    
    setTimeout(() => speak(pageText), 500);
  }, [language, speak, entries.length, dueReminders.length]);

  const handleReadPage = () => {
    const entriesText = entries.map(entry => 
      `${formatDate(entry.date)} ${entry.activity} ${entry.crop} ${entry.area} ${entry.notes}`
    ).join('. ');
    
    const reminderText = dueReminders.map(reminder => reminder.message).join('. ');
    
    const fullPageText = language === 'malayalam' 
      ? `കൃഷി ദിനപതി വിവരങ്ങൾ. ${entries.length} എൻട്രികൾ. ${entriesText}. ${dueReminders.length} റിമൈൻഡറുകൾ. ${reminderText}`
      : `Farm diary information. ${entries.length} entries. ${entriesText}. ${dueReminders.length} reminders. ${reminderText}`;
    
    speak(fullPageText);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 248, 240, 0.9), rgba(255, 248, 240, 0.85)), url(${farmBackgroundImage})`,
      }}
    >
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm">
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
            <h1 className="malayalam-text text-xl text-primary font-bold">
              {t('farmDiary')}
            </h1>
            <p className="text-muted-foreground font-medium">
              {t('farmDiaryDesc')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceEntry}
              disabled={isProcessing || isPlaying}
              className={isRecording ? 'bg-red-100 border-red-300' : ''}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4 text-red-600" />
              ) : (
                <Mic className={`h-4 w-4 ${isProcessing ? 'animate-pulse' : ''}`} />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReadPage}
              disabled={isPlaying}
            >
              <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Voice Status */}
        {(isRecording || isProcessing || voiceError) && (
          <Card className={`farmer-card mb-6 ${isRecording ? 'border-red-300 bg-red-50' : isProcessing ? 'border-yellow-300 bg-yellow-50' : 'border-red-300 bg-red-50'}`}>
            <div className="flex items-center gap-3">
              {isRecording && (
                <>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Mic className="h-5 w-5 text-red-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="malayalam-text font-medium text-red-800">
                      {language === 'malayalam' ? 'റെക്കോർഡിംഗ്...' : 'Recording...'}
                    </p>
                    <p className="text-sm text-red-600">
                      {language === 'malayalam' ? 'സംസാരിച്ച് കഴിഞ്ഞാൽ മൈക് ബട്ടൺ അമർത്തുക' : 'Press mic button when done speaking'}
                    </p>
                  </div>
                </>
              )}
              
              {isProcessing && (
                <>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Volume2 className="h-5 w-5 text-yellow-600 animate-pulse" />
                  </div>
                  <p className="malayalam-text font-medium text-yellow-800">
                    {language === 'malayalam' ? 'പ്രോസസ്സിംഗ്...' : 'Processing voice...'}
                  </p>
                </>
              )}
              
              {voiceError && (
                <>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="malayalam-text font-medium text-red-800">
                      {language === 'malayalam' ? 'വോയ്സ് എറർ' : 'Voice Error'}
                    </p>
                    <p className="text-sm text-red-600">{voiceError}</p>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Loading State */}
        {diaryLoading && (
          <Card className="farmer-card mb-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="malayalam-text">
                {language === 'malayalam' ? 'ഡയറി എൻട്രികൾ ലോഡ് ചെയ്യുന്നു...' : 'Loading diary entries...'}
              </p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {diaryError && (
          <Card className="farmer-card mb-6 border-red-200 bg-red-50">
            <div className="text-center py-8">
              <p className="text-red-600 malayalam-text">
                {language === 'malayalam' ? 'ഡയറി എൻട്രികൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല' : 'Failed to load diary entries'}
              </p>
              <p className="text-sm text-red-500 mt-2">{diaryError}</p>
            </div>
          </Card>
        )}
        {/* Reminders Section */}
        <Card className="farmer-card mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="malayalam-text text-xl font-semibold text-orange-800">
              {language === 'malayalam' ? 'റിമൈൻഡറുകൾ' : 'Reminders'}
            </h2>
          </div>

          {/* Due Reminders */}
          {dueReminders.length > 0 && (
            <div className="mb-4">
              <h3 className="malayalam-text text-lg flex items-center gap-2 mb-3 text-red-600">
                {language === 'malayalam' ? 'കാലാവധി കഴിഞ്ഞത്' : 'Overdue'}
              </h3>
              <div className="space-y-2">
                {dueReminders.map((reminder) => (
                  <div key={reminder.id} className="bg-red-100 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="malayalam-text text-sm font-medium text-red-800">{reminder.message}</p>
                        <p className="text-xs text-red-600 mt-1">
                          {language === 'malayalam' ? 'സമയം:' : 'Scheduled:'} {new Date(reminder.scheduledFor).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => markReminderCompleted(reminder.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <div className="mb-4">
              <h3 className="malayalam-text text-lg flex items-center gap-2 mb-3 text-blue-600">
                {language === 'malayalam' ? 'വരാനിരിക്കുന്നവ' : 'Upcoming'}
              </h3>
              <div className="space-y-2">
                {upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                    <p className="malayalam-text text-sm font-medium text-blue-800">{reminder.message}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {language === 'malayalam' ? 'സമയം:' : 'Scheduled:'} {new Date(reminder.scheduledFor).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dueReminders.length === 0 && upcomingReminders.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                {language === 'malayalam' ? 'റിമൈൻഡറുകൾ ഇല്ല' : 'No reminders at the moment'}
              </p>
            </div>
          )}
        </Card>


        {/* Add New Entry Button */}
        <Card className="farmer-card mb-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="malayalam-text text-xl mb-2">
                {language === 'malayalam' ? 'പുതിയ എൻട്രി ചേർക്കുക' : 'Add New Entry'}
              </h2>
              <p className="english-subtext opacity-90">
                {language === 'malayalam' ? 'ഇന്നത്തെ പ്രവർത്തനം രേഖപ്പെടുത്തുക' : 'Record today\'s activities'}
              </p>
            </div>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </Card>

        {/* Add Entry Form */}
        {showAddForm && (
          <Card className="farmer-card mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="malayalam-text text-lg font-semibold">
                  {language === 'malayalam' ? 'നൈ എൻട്രി' : 'New Entry'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="malayalam-text text-sm font-medium">
                    {language === 'malayalam' ? 'തീയതി' : 'Date'}
                  </label>
                  <Input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="malayalam-text text-sm font-medium">
                    {language === 'malayalam' ? 'പ്രവർത്തനം' : 'Activity'}
                  </label>
                  <Input
                    value={newEntry.activity}
                    onChange={(e) => setNewEntry({...newEntry, activity: e.target.value})}
                    placeholder={language === 'malayalam' ? 'വിത്ത് വിതക്കൽ' : 'Seed Sowing'}
                  />
                </div>
                <div>
                  <label className="malayalam-text text-sm font-medium">
                    {language === 'malayalam' ? 'വിള' : 'Crop'}
                  </label>
                  <Input
                    value={newEntry.crop}
                    onChange={(e) => setNewEntry({...newEntry, crop: e.target.value})}
                    placeholder={language === 'malayalam' ? 'നെല്ല്' : 'Rice'}
                  />
                </div>
                <div>
                  <label className="malayalam-text text-sm font-medium">
                    {language === 'malayalam' ? 'വിസ്തീർണ്ണം' : 'Area'}
                  </label>
                  <Input
                    value={newEntry.area}
                    onChange={(e) => setNewEntry({...newEntry, area: e.target.value})}
                    placeholder={language === 'malayalam' ? '2 ഏക്കർ' : '2 acres'}
                  />
                </div>
              </div>
              
              <div>
                <label className="malayalam-text text-sm font-medium">
                  {language === 'malayalam' ? 'കുറിപ്പുകൾ' : 'Notes'}
                </label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder={language === 'malayalam' ? 'കാലാവസ്ഥ, മണ്ണിന്റെ അവസ്ഥ മുതലായവ' : 'Weather, soil condition, etc.'}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddEntry} className="bg-orange-600 hover:bg-orange-700">
                  {language === 'malayalam' ? 'സേവ് ചെയ്യുക' : 'Save Entry'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  {language === 'malayalam' ? 'റദ്ദാക്കുക' : 'Cancel'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Entries */}
        <div className="space-y-4">
          <h2 className="malayalam-text text-xl flex items-center gap-2 mb-4">
            <Book className="h-6 w-6 text-orange-600" />
            {language === 'malayalam' ? 'സമീപകാല എൻട്രികൾ' : 'Recent Entries'}
          </h2>

          {entries.length === 0 ? (
            <Card className="farmer-card text-center py-8">
              <p className="malayalam-text text-gray-500">
                {language === 'malayalam' ? 'എൻട്രികൾ ഇല്ല' : 'No entries yet'}
              </p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="farmer-card">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="malayalam-text font-semibold">{entry.activity}</h3>
                      <span className="english-subtext text-sm">{formatDate(entry.date)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <p className="malayalam-text text-sm">
                        <span className="font-medium">
                          {language === 'malayalam' ? 'വിള: ' : 'Crop: '}
                        </span>
                        {entry.crop}
                      </p>
                      <p className="english-subtext text-sm">
                        <span className="font-medium">
                          {language === 'malayalam' ? 'വിസ്തീർണ്ണം: ' : 'Area: '}
                        </span>
                        {entry.area}
                      </p>
                    </div>
                    
                    {entry.notes && (
                      <p className="malayalam-text text-sm bg-orange-50 p-3 rounded-lg">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};