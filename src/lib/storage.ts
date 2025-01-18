import { WorkoutSession, WorkoutTemplate } from "@/types/workout";

const STORAGE_KEYS = {
  ACTIVE_WORKOUT: 'active_workout',
  RECENT_TEMPLATES: 'recent_templates',
  SYNC_QUEUE: 'sync_queue',
  USER_PREFERENCES: 'user_preferences'
} as const;

export interface SyncQueueItem {
  id: string;
  type: 'workout_session' | 'template';
  data: any;
  attempts: number;
  last_attempt?: Date;
}

export const storage = {
  getActiveWorkout: (): WorkoutSession | null => {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (!data) return null;
    
    const workout = JSON.parse(data);
    // Convert the string back to Date object
    workout.started_at = new Date(workout.started_at);
    if (workout.completed_at) {
      workout.completed_at = new Date(workout.completed_at);
    }
    return workout;
  },

  saveActiveWorkout: (workout: WorkoutSession): void => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
  },

  clearActiveWorkout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  },

  getRecentTemplates: (): WorkoutTemplate[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_TEMPLATES);
    return data ? JSON.parse(data) : [];
  },

  saveRecentTemplates: (templates: WorkoutTemplate[]): void => {
    localStorage.setItem(STORAGE_KEYS.RECENT_TEMPLATES, JSON.stringify(templates));
  },

  getSyncQueue: (): SyncQueueItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return data ? JSON.parse(data) : [];
  },

  addToSyncQueue: (item: Omit<SyncQueueItem, 'attempts' | 'last_attempt'>): void => {
    const queue = storage.getSyncQueue();
    queue.push({
      ...item,
      attempts: 0,
      last_attempt: new Date(),
    });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },

  updateSyncQueue: (queue: SyncQueueItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },
}; 