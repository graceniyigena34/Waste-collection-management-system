import { apiRequest } from './api-services';
import { Session, SessionStop } from '../lib/session-service';

export interface DriverSession extends Session {
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  routeId?: string;
  routeName?: string;
}

class DriverSessionService {
  async getDriverSessions(driverId?: string): Promise<DriverSession[]> {
    try {
      // In a real app, this would call the API
      // return await apiRequest(`/driver-sessions${driverId ? `?driverId=${driverId}` : ''}`);

      // Mock data for now
      const mockSessions: DriverSession[] = [
        {
          id: '1',
          driverId: 'd1',
          driverName: 'John Driver',
          vehicleId: 'v1',
          vehiclePlate: 'RAB 123 A',
          routeId: 'r1',
          routeName: 'Kicukiro Route A',
          status: 'In Progress',
          startTime: '2024-03-15T08:00:00Z',
          endTime: null,
          totalStops: 45,
          completedStops: 23,
          currentLocation: { lat: -1.9501, lng: 30.0588 },
          stops: [
            {
              id: 's1',
              householdId: 'h1',
              householdName: 'Household 1',
              address: '123 Main St',
              status: 'Completed',
              scheduledTime: '2024-03-15T08:00:00Z',
              actualTime: '2024-03-15T08:05:00Z',
              notes: 'Collected successfully'
            },
            {
              id: 's2',
              householdId: 'h2',
              householdName: 'Household 2',
              address: '456 Oak Ave',
              status: 'In Progress',
              scheduledTime: '2024-03-15T08:15:00Z',
              actualTime: null,
              notes: null
            }
          ]
        },
        {
          id: '2',
          driverId: 'd2',
          driverName: 'Jane Driver',
          vehicleId: 'v2',
          vehiclePlate: 'RAB 456 B',
          routeId: 'r2',
          routeName: 'Gasabo Route B',
          status: 'Completed',
          startTime: '2024-03-15T07:30:00Z',
          endTime: '2024-03-15T10:45:00Z',
          totalStops: 32,
          completedStops: 32,
          currentLocation: { lat: -1.9400, lng: 30.0600 },
          stops: [] // Would contain all completed stops
        }
      ];

      return driverId ? mockSessions.filter(s => s.driverId === driverId) : mockSessions;
    } catch (error) {
      console.error('Error fetching driver sessions:', error);
      throw error;
    }
  }

  async getDriverSessionById(id: string): Promise<DriverSession | null> {
    try {
      const sessions = await this.getDriverSessions();
      return sessions.find(session => session.id === id) || null;
    } catch (error) {
      console.error('Error fetching driver session:', error);
      throw error;
    }
  }

  async startSession(driverId: string, vehicleId: string, routeId?: string): Promise<DriverSession> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/driver-sessions', 'POST', { driverId, vehicleId, routeId });

      const newSession: DriverSession = {
        id: Date.now().toString(),
        driverId,
        driverName: 'Driver Name', // Would be fetched from driver service
        vehicleId,
        vehiclePlate: 'Vehicle Plate', // Would be fetched from vehicle service
        routeId,
        routeName: routeId ? 'Route Name' : undefined, // Would be fetched from route service
        status: 'In Progress',
        startTime: new Date().toISOString(),
        endTime: null,
        totalStops: 0,
        completedStops: 0,
        currentLocation: { lat: 0, lng: 0 },
        stops: []
      };
      return newSession;
    } catch (error) {
      console.error('Error starting driver session:', error);
      throw error;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/driver-sessions/${sessionId}/end`, 'POST');
      console.log(`Ended driver session ${sessionId}`);
    } catch (error) {
      console.error('Error ending driver session:', error);
      throw error;
    }
  }

  async updateLocation(sessionId: string, location: { lat: number; lng: number }): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/driver-sessions/${sessionId}/location`, 'PATCH', { location });
      console.log(`Updated location for session ${sessionId}`);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async completeStop(sessionId: string, stopId: string, notes?: string): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/driver-sessions/${sessionId}/stops/${stopId}/complete`, 'POST', { notes });
      console.log(`Completed stop ${stopId} in session ${sessionId}`);
    } catch (error) {
      console.error('Error completing stop:', error);
      throw error;
    }
  }
}

const driverSessionService = new DriverSessionService();
export default driverSessionService;