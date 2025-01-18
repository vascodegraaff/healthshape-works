import { storage, SyncQueueItem } from './storage';

export const syncManager = {
  async processQueue() {
    const queue = storage.getSyncQueue();
    const updatedQueue: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        if (item.attempts >= 3) continue; // Skip after 3 attempts

        await this.syncItem(item);
      } catch (error) {
        updatedQueue.push({
          ...item,
          attempts: item.attempts + 1,
          last_attempt: new Date(),
        });
      }
    }

    storage.updateSyncQueue(updatedQueue);
  },

  async syncItem(item: SyncQueueItem) {
    switch (item.type) {
      case 'workout_session':
        await this.syncWorkoutSession(item.data);
        break;
      case 'template':
        await this.syncTemplate(item.data);
        break;
    }
  },

  async syncWorkoutSession(session: any) {
    // TODO: Implement API call
    console.log('Syncing workout session:', session);
  },

  async syncTemplate(template: any) {
    // TODO: Implement API call
    console.log('Syncing template:', template);
  },

  initialize() {
    // Process queue when coming online
    window.addEventListener('online', () => {
      this.processQueue();
    });

    // Initial process if online
    if (navigator.onLine) {
      this.processQueue();
    }
  },
}; 