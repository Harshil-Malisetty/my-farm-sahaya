import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface DiaryEntry {
  id: string;
  date: string;
  activity: string;
  crop: string;
  area: string;
  notes: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  entryId: string;
  message: string;
  scheduledFor: string;
  completed: boolean;
  createdAt: string;
}

export const useFarmDiary = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedEntries = localStorage.getItem(`farmDiary_${user.id}`);
      const storedReminders = localStorage.getItem(`farmReminders_${user.id}`);
      
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
      
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    }
  }, [user]);

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (user && entries.length > 0) {
      localStorage.setItem(`farmDiary_${user.id}`, JSON.stringify(entries));
    }
  }, [entries, user]);

  // Save to localStorage whenever reminders change
  useEffect(() => {
    if (user && reminders.length > 0) {
      localStorage.setItem(`farmReminders_${user.id}`, JSON.stringify(reminders));
    }
  }, [reminders, user]);

  const addEntry = (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setEntries(prev => [newEntry, ...prev]);
    
    // Create automatic reminders based on activity
    createAutomaticReminders(newEntry);
    
    return newEntry;
  };

  const createAutomaticReminders = (entry: DiaryEntry) => {
    const now = new Date();
    const remindersByActivity: Record<string, Array<{ hours: number; message: string }>> = {
      'വിത്ത് വിതക്കൽ': [
        { hours: 72, message: `${entry.crop} വിത്ത് മുളച്ചിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുക` },
        { hours: 168, message: `${entry.crop} ചെടികൾക്ക് വള നൽകാനുള്ള സമയം` }
      ],
      'Seed Sowing': [
        { hours: 72, message: `Check if ${entry.crop} seeds have germinated` },
        { hours: 168, message: `Time to fertilize ${entry.crop} plants` }
      ],
      'വള നൽകൽ': [
        { hours: 336, message: `${entry.crop} വിളയ്ക്ക് അടുത്ത വള പ്രയോഗം` }
      ],
      'Fertilizer Application': [
        { hours: 336, message: `Next fertilizer application for ${entry.crop}` }
      ],
      'കളയെടുക്കൽ': [
        { hours: 240, message: `${entry.crop} വിളയിൽ വീണ്ടും കളയുണ്ടോ എന്ന് പരിശോധിക്കുക` }
      ],
      'Weeding': [
        { hours: 240, message: `Check for weeds in ${entry.crop} field again` }
      ]
    };

    const activityReminders = remindersByActivity[entry.activity] || [];
    
    activityReminders.forEach(({ hours, message }) => {
      const reminderTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
      
      const reminder: Reminder = {
        id: `${entry.id}_${hours}`,
        entryId: entry.id,
        message,
        scheduledFor: reminderTime.toISOString(),
        completed: false,
        createdAt: now.toISOString(),
      };
      
      setReminders(prev => [...prev, reminder]);
    });
  };

  const getDueReminders = () => {
    const now = new Date();
    return reminders.filter(reminder => 
      !reminder.completed && 
      new Date(reminder.scheduledFor) <= now
    );
  };

  const markReminderCompleted = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, completed: true }
          : reminder
      )
    );
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    
    return reminders.filter(reminder => 
      !reminder.completed && 
      new Date(reminder.scheduledFor) > now &&
      new Date(reminder.scheduledFor) <= next24Hours
    );
  };

  return {
    entries,
    reminders,
    addEntry,
    getDueReminders,
    markReminderCompleted,
    getUpcomingReminders,
  };
};