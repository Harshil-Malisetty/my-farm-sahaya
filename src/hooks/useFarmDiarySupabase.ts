import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DiaryEntry {
  id: string;
  date: string;
  activity: string;
  crop: string;
  area: string;
  notes: string;
  createdAt: string;
}

interface Reminder {
  id: string;
  entryId: string;
  message: string;
  scheduledFor: string;
  completed: boolean;
  createdAt: string;
}

export const useFarmDiarySupabase = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load entries from Supabase
  const loadEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('farm_diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEntries = data?.map(entry => ({
        id: entry.id,
        date: entry.date,
        activity: entry.activity,
        crop: entry.crop || '',
        area: entry.area || '',
        notes: entry.notes || '',
        createdAt: entry.created_at
      })) || [];

      setEntries(formattedEntries);
    } catch (err) {
      console.error('Error loading entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    }
  };

  // Add new entry
  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('farm_diary_entries')
        .insert({
          user_id: user.id,
          date: entry.date,
          activity: entry.activity,
          crop: entry.crop,
          area: entry.area,
          notes: entry.notes
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: DiaryEntry = {
        id: data.id,
        date: data.date,
        activity: data.activity,
        crop: data.crop || '',
        area: data.area || '',
        notes: data.notes || '',
        createdAt: data.created_at
      };

      setEntries(prev => [newEntry, ...prev]);
      createAutomaticReminders(newEntry);
      
      return newEntry;
    } catch (err) {
      console.error('Error adding entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to add entry');
      throw err;
    }
  };

  // Create automatic reminders based on activity
  const createAutomaticReminders = (entry: DiaryEntry) => {
    const activityReminders: Record<string, number[]> = {
      'Seed Sowing': [7, 14], // Water in 7 days, check in 14 days
      'വിത്ത് വിതക്കൽ': [7, 14],
      'Fertilizer Application': [15], // Next application in 15 days
      'വളം പ്രയോഗിക്കൽ': [15],
      'Irrigation': [3], // Next irrigation in 3 days
      'ജലസേചനം': [3],
      'Pesticide Spray': [10], // Next spray in 10 days
      'കീടനാശിനി തളിക്കൽ': [10],
      'Transplanting': [5, 15], // Check in 5 days, fertilize in 15 days
      'നടൽ': [5, 15],
    };

    const activity = entry.activity;
    const reminderDays = activityReminders[activity];

    if (reminderDays) {
      reminderDays.forEach(days => {
        const scheduledDate = new Date(entry.date);
        scheduledDate.setDate(scheduledDate.getDate() + days);

        const reminderMessage = days <= 7 
          ? `Follow up on ${activity} for ${entry.crop}`
          : `Next ${activity} for ${entry.crop} due`;

        const reminder: Reminder = {
          id: crypto.randomUUID(),
          entryId: entry.id,
          message: reminderMessage,
          scheduledFor: scheduledDate.toISOString(),
          completed: false,
          createdAt: new Date().toISOString()
        };

        setReminders(prev => [...prev, reminder]);
      });
    }
  };

  // Get due reminders (past scheduled time and not completed)
  const getDueReminders = (): Reminder[] => {
    const now = new Date();
    return reminders.filter(
      reminder => !reminder.completed && new Date(reminder.scheduledFor) < now
    );
  };

  // Get upcoming reminders (within next 24 hours and not completed)
  const getUpcomingReminders = (): Reminder[] => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return reminders.filter(
      reminder => !reminder.completed && 
      new Date(reminder.scheduledFor) >= now && 
      new Date(reminder.scheduledFor) <= tomorrow
    );
  };

  // Mark reminder as completed
  const markReminderCompleted = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, completed: true }
          : reminder
      )
    );
  };

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      loadEntries().finally(() => setLoading(false));
    } else {
      setEntries([]);
      setReminders([]);
      setLoading(false);
    }
  }, [user]);

  return {
    entries,
    reminders,
    loading,
    error,
    addEntry,
    getDueReminders,
    getUpcomingReminders,
    markReminderCompleted,
    refreshEntries: loadEntries
  };
};