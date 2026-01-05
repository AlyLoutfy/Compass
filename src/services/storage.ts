import { CompassData } from '../types';

const STORAGE_KEY = 'compass_db';

const INITIAL_DATA: CompassData = {
  ideas: [],
  requirements: [],
  tickets: [],
  sprints: [],
  shippedTickets: [],
  users: [],
  organizations: [],
  standupHistory: [],
  notifications: []
};

// Helper: Simulate delay for realistic feeling ?? No, local should be instant. 
// But we might want async signature to make Supabase swap easiest later.
// Let's stick to synchronous local storage for simplicity unless we want to "Await" everything.
// Better to make them async Promises now to future-proof completely.

export const storage = {
  getData: (): CompassData => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_DATA;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load data", e);
      return INITIAL_DATA;
    }
  },

  saveData: (data: CompassData): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data", e);
    }
  },
  
  // Future proofing methods (can be replaced by API calls later)
  async fetchAll(): Promise<CompassData> {
    return new Promise((resolve) => {
      // Small artificial delay to prove "loading" states in UI if we want? 
      // Nah, let's keep it snappy.
      resolve(this.getData());
    });
  },

  async saveAll(data: CompassData): Promise<void> {
    return new Promise((resolve) => {
      this.saveData(data);
      resolve();
    });
  }
};
