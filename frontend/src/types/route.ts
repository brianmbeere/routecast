export type OptimizedStop = {
  address: string;
  location: [number, number]; // [lng, lat]
  eta_minutes: number;
  distance_miles: number;
};