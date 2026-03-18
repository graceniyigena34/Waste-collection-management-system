export interface SessionStop {
  id: string;
  householdId: string;
  householdName: string;
  address: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
  scheduledTime: string;
  actualTime?: string;
  notes?: string;
}

export interface Session {
  id: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  startTime: string;
  endTime?: string;
  totalStops: number;
  completedStops: number;
  currentLocation?: { lat: number; lng: number };
  stops: SessionStop[];
}

class SessionService {
  async getSessions(): Promise<Session[]> {
    try {
      // Mock data for now
      return [
        {
          id: '1',
          status: 'In Progress',
          startTime: '2024-03-15T08:00:00Z',
          totalStops: 45,
          completedStops: 23,
          currentLocation: { lat: -1.9501, lng: 30.0588 },
          stops: []
        }
      ];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  async getSessionById(id: string): Promise<Session | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find(session => session.id === id) || null;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }
}

const sessionService = new SessionService();
export default sessionService;