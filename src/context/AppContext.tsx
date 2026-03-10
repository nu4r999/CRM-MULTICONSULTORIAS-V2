import React, { createContext, useContext, useState, useCallback } from 'react';
import { APP_SCHEMA } from '../data/schema';

// Use loose interfaces to avoid strict literal type conflicts from schema
interface Client {
  id: string; name: string; initials: string; phone: string | null;
  email: string | null; referred_by: string | null; stage_id: string;
  total_sales: number; display_sales: string;
  total_profit: number; display_profit: string;
  notes: string | null; created_at: string; updated_at: string;
}
interface Task {
  id: string; title: string; description: string | null; client_id: string | null;
  event_id: string | null; priority: string; category: string; status: string;
  due_date: string; days_overdue: number; status_display: string;
  created_at: string; completed_at: string | null;
}
interface CalEvent {
  id: string; title: string; type: string; date: string;
  time_start: string | null; time_end: string | null; all_day: boolean;
  color: string; client_id: string | null; description: string | null;
  completed: boolean; reminder: { enabled: boolean; minutes_before: number | null };
}

interface AppState {
  clients: Client[];
  tasks: Task[];
  events: CalEvent[];
  notifications: number;
}

interface AppContextType {
  state: AppState;
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  updateClientStage: (clientId: string, stageId: string) => void;
  updateClientNotes: (clientId: string, notes: string) => void;
  addSale: (clientId: string, amount: number, commission: number) => void;
  deleteClient: (clientId: string) => void;
  completeTask: (taskId: string) => void;
  addEvent: (event: Omit<CalEvent, 'id'>) => void;
  toggleEventComplete: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    clients: APP_SCHEMA.modules.clients.list as unknown as Client[],
    tasks: APP_SCHEMA.tasks.items as unknown as Task[],
    events: APP_SCHEMA.modules.calendar.events as unknown as CalEvent[],
    notifications: APP_SCHEMA.notifications.unread_count,
  });

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newClient: Client = { ...clientData, id: `cli_${Date.now()}`, created_at: now, updated_at: now };
    setState(prev => ({ ...prev, clients: [newClient, ...prev.clients] }));
  }, []);

  const updateClientStage = useCallback((clientId: string, stageId: string) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c =>
        c.id === clientId ? { ...c, stage_id: stageId, updated_at: new Date().toISOString() } : c
      ),
    }));
  }, []);

  const updateClientNotes = useCallback((clientId: string, notes: string) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c =>
        c.id === clientId ? { ...c, notes, updated_at: new Date().toISOString() } : c
      ),
    }));
  }, []);

  const addSale = useCallback((clientId: string, amount: number, commission: number) => {
    setState(prev => ({
      ...prev,
      clients: prev.clients.map(c => {
        if (c.id !== clientId) return c;
        const newSales = c.total_sales + amount;
        const newProfit = c.total_profit + commission;
        const formatM = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : `${(n/1e3).toFixed(0)}K`;
        return {
          ...c,
          total_sales: newSales,
          display_sales: formatM(newSales),
          total_profit: newProfit,
          display_profit: formatM(newProfit),
          updated_at: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    setState(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== clientId) }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, status: 'completed', completed_at: new Date().toISOString() } : t
      ),
    }));
  }, []);

  const addEvent = useCallback((eventData: Omit<CalEvent, 'id'>) => {
    const newEvent: CalEvent = { ...eventData, id: `evt_${Date.now()}` };
    setState(prev => ({ ...prev, events: [newEvent, ...prev.events] }));
  }, []);

  const toggleEventComplete = useCallback((eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e =>
        e.id === eventId ? { ...e, completed: !e.completed } : e
      ),
    }));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId),
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      state, addClient, updateClientStage, updateClientNotes,
      addSale, deleteClient, completeTask, addEvent,
      toggleEventComplete, deleteEvent
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    // In development, warn loudly. In production native builds, return a safe fallback
    // to prevent black screens. This can happen with Expo Router native pre-rendering.
    if (__DEV__) {
      console.warn('[AppContext] useApp called outside AppProvider — returning safe fallback');
    }
    // Return a safe no-op fallback so the app doesn't crash
    return {
      state: {
        clients: [],
        tasks: [],
        events: [],
        notifications: 0,
      },
      addClient: () => {},
      updateClientStage: () => {},
      updateClientNotes: () => {},
      addSale: () => {},
      deleteClient: () => {},
      completeTask: () => {},
      addEvent: () => {},
      toggleEventComplete: (eventId: string) => {},
      deleteEvent: (eventId: string) => {},
    };
  }
  return ctx;
}
