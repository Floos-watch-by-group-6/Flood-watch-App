export interface FloodReport {
  id: number;
  // The shared backend's real Mongo _id, when this report exists there —
  // needed to sync confirm/decline votes back to it.
  backendId?: string;
  locationName: string;
  area?: string;
  description?: string;
  reportedBy?: string;
  coordinates: [number, number];
  imageUrl: string;
  images?: string[];         // <--- Add this property!
  waterLevel: 'Low' | 'Medium' | 'High';
  status: 'Verified' | 'Unverified';
  confirmations: number;
  photosCount: number;
  timeActive: string;
  createdAt: number;
}
export type TabType = 'maps' | 'feed' | 'report' | 'alerts' | 'profile';