export type Location = {
  id: string; // Add id field
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
};

export type Tag = {
  id: string;
  name: string;
  status: 'Nearby' | 'Far' | 'With You';
  battery: number;
  currentLocation: Location;
  locationHistory: Location[];
  image: string;
};

export const tags: Tag[] = [
  {
    id: '1',
    name: 'Car Keys',
    status: 'Nearby',
    battery: 85,
    currentLocation: {
      id: 'loc1',
      latitude: 34.0522,
      longitude: -118.2437,
      timestamp: new Date().toISOString(),
      address: '123 Main St, Los Angeles, CA',
    },
    locationHistory: [
      { id: 'hist1', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'hist2', latitude: 34.0550, longitude: -118.2500, timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 'hist3', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 86400000).toISOString() },
    ],
    image: "tag-keys",
  },
  {
    id: '2',
    name: 'Work Backpack',
    status: 'Far',
    battery: 62,
    currentLocation: {
      id: 'loc2',
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      address: '456 Office Ave, New York, NY',
    },
    locationHistory: [
      { id: 'hist4', latitude: 40.7128, longitude: -74.0060, timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
      { id: 'hist5', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: 'hist6', latitude: 40.7128, longitude: -74.0060, timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
    ],
    image: "tag-backpack",
  },
  {
    id: '3',
    name: 'Wallet',
    status: 'With You',
    battery: 98,
    currentLocation: {
      id: 'loc3',
      latitude: 34.0525,
      longitude: -118.2440,
      timestamp: new Date().toISOString(),
      address: 'You have this item with you.',
    },
    locationHistory: [
      { id: 'hist7', latitude: 34.0525, longitude: -118.2440, timestamp: new Date().toISOString() },
      { id: 'hist8', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 172800000).toISOString() },
    ],
    image: "tag-wallet",
  },
];
