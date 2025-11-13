import { Timestamp } from 'firebase/firestore';

export type Location = {
  id: string; // Add id field
  latitude: number;
  longitude: number;
  timestamp: Date | Timestamp; // Allow both Date and Timestamp
  address?: string;
  deviceId?: string;
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
      timestamp: new Date(),
      address: '123 Main St, Los Angeles, CA',
    },
    locationHistory: [
      { id: 'hist1', deviceId: '1', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 3600000) },
      { id: 'hist2', deviceId: '1', latitude: 34.0550, longitude: -118.2500, timestamp: new Date(Date.now() - 7200000) },
      { id: 'hist3', deviceId: '1', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 86400000) },
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
      timestamp: new Date(Date.now() - 4 * 3600000),
      address: '456 Office Ave, New York, NY',
    },
    locationHistory: [
      { id: 'hist4', deviceId: '2', latitude: 40.7128, longitude: -74.0060, timestamp: new Date(Date.now() - 4 * 3600000) },
      { id: 'hist5', deviceId: '2', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 2 * 86400000) },
      { id: 'hist6', deviceId: '2', latitude: 40.7128, longitude: -74.0060, timestamp: new Date(Date.now() - 3 * 86400000) },
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
      timestamp: new Date(),
      address: 'You have this item with you.',
    },
    locationHistory: [
      { id: 'hist7', deviceId: '3', latitude: 34.0525, longitude: -118.2440, timestamp: new Date() },
      { id: 'hist8', deviceId: '3', latitude: 34.0522, longitude: -118.2437, timestamp: new Date(Date.now() - 172800000) },
    ],
    image: "tag-wallet",
  },
];
