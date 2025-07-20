// Mocked Menurithm produce requests for MVP integration
// Place in src/api/menurithmMockRequests.ts

export type ProduceRequest = {
  id: string;
  restaurantName: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  produce: string;
  quantity: string;
  deliveryWindow: string;
};

export const mockProduceRequests: ProduceRequest[] = [
  {
    id: 'req-1',
    restaurantName: 'Green Spoon Bistro',
    location: {
      address: '123 Main St, Springfield',
      lat: 40.7128,
      lng: -74.0060,
    },
    produce: 'Tomatoes',
    quantity: '20kg',
    deliveryWindow: 'Today, 10am-12pm',
  },
  {
    id: 'req-2',
    restaurantName: 'Urban Roots Food Truck',
    location: {
      address: '456 Market Ave, Springfield',
      lat: 40.7138,
      lng: -74.0020,
    },
    produce: 'Kale',
    quantity: '10kg',
    deliveryWindow: 'Today, 2pm-4pm',
  },
  {
    id: 'req-3',
    restaurantName: 'Harvest Table',
    location: {
      address: '789 Oak Rd, Springfield',
      lat: 40.7150,
      lng: -74.0100,
    },
    produce: 'Carrots',
    quantity: '15kg',
    deliveryWindow: 'Tomorrow, 9am-11am',
  },
];
