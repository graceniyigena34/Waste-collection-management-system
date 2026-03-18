import { apiRequest } from './api-services';

export interface Route {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  driverId?: string;
  driverName?: string;
  status: 'Active' | 'Inactive' | 'Completed';
  households: number;
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteData {
  name: string;
  zoneId: string;
  driverId?: string;
  households: number;
  estimatedDuration: number;
}

class RouteService {
  async getRoutes(): Promise<Route[]> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/routes');

      // Mock data for now
      return [
        {
          id: '1',
          name: 'Kicukiro Route A',
          zoneId: 'z1',
          zoneName: 'Kicukiro Zone A',
          driverId: 'd1',
          driverName: 'John Driver',
          status: 'Active',
          households: 45,
          estimatedDuration: 120,
          createdAt: '2024-03-01T08:00:00Z',
          updatedAt: '2024-03-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Gasabo Route B',
          zoneId: 'z2',
          zoneName: 'Gasabo Zone B',
          driverId: 'd2',
          driverName: 'Jane Driver',
          status: 'Active',
          households: 32,
          estimatedDuration: 90,
          createdAt: '2024-03-02T09:00:00Z',
          updatedAt: '2024-03-15T11:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  async getRouteById(id: string): Promise<Route | null> {
    try {
      const routes = await this.getRoutes();
      return routes.find(route => route.id === id) || null;
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  }

  async createRoute(routeData: CreateRouteData): Promise<Route> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/routes', 'POST', routeData);

      const newRoute: Route = {
        ...routeData,
        id: Date.now().toString(),
        zoneName: 'Zone Name', // This would be fetched from zone service
        driverName: routeData.driverId ? 'Driver Name' : undefined, // This would be fetched from driver service
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newRoute;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  async updateRoute(id: string, updates: Partial<Route>): Promise<Route> {
    try {
      // In a real app, this would call the API
      // return await apiRequest(`/routes/${id}`, 'PATCH', updates);

      const route = await this.getRouteById(id);
      if (!route) throw new Error('Route not found');

      const updatedRoute: Route = {
        ...route,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return updatedRoute;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  }

  async deleteRoute(id: string): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/routes/${id}`, 'DELETE');
      console.log(`Deleted route ${id}`);
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  async assignDriver(routeId: string, driverId: string): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/routes/${routeId}/assign-driver`, 'POST', { driverId });
      console.log(`Assigned driver ${driverId} to route ${routeId}`);
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  }
}

const routeService = new RouteService();
export default routeService;