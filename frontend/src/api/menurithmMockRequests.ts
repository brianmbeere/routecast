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
    restaurantName: 'The Green Well',
    location: {
      address: '924 Cherry Street Southeast, Grand Rapids, Michigan 49506, United States',
      lat: 42.9561,
      lng: -85.6366,
    },
    produce: 'Tomatoes',
    quantity: '20kg',
    deliveryWindow: 'Today, 10am-12pm',
  },
  {
    id: 'req-2',
    restaurantName: 'The Old Goat',
    location: {
      address: '2434 Eastern Avenue Southeast, Grand Rapids, Michigan 49507, United States',
      lat: 42.9197,
      lng: -85.6476,
    },
    produce: 'Kale',
    quantity: '10kg',
    deliveryWindow: 'Today, 2pm-4pm',
  },
  {
    id: 'req-3',
    restaurantName: 'Snug Harbor',
    location: {
      address: '311 South Harbor Drive, Grand Haven, Michigan 49417, United States',
      lat: 43.0622,
      lng: -86.2471,
    },
    produce: 'Carrots',
    quantity: '15kg',
    deliveryWindow: 'Tomorrow, 9am-11am',
  },
];
