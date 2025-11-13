import { Timestamp } from 'firebase/firestore';

export type Location = {
  id: string; // Add id field
  latitude: number;
  longitude: number;
  timestamp: Date | Timestamp | string; // Allow both Date and Timestamp
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
      timestamp: '2024-07-28T10:00:00Z',
      address: '123 Main St, Los Angeles, CA',
    },
    locationHistory: [
      { id: 'hist1', deviceId: '1', latitude: 34.0522, longitude: -118.2437, timestamp: '2024-07-28T09:00:00Z' },
      { id: 'hist2', deviceId: '1', latitude: 34.0550, longitude: -118.2500, timestamp: '2024-07-28T08:00:00Z' },
      { id: 'hist3', deviceId: '1', latitude: 34.0522, longitude: -118.2437, timestamp: '2024-07-27T10:00:00Z' },
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
      timestamp: '2024-07-28T06:00:00Z',
      address: '456 Office Ave, New York, NY',
    },
    locationHistory: [
      { id: 'hist4', deviceId: '2', latitude: 40.7128, longitude: -74.0060, timestamp: '2024-07-28T06:00:00Z' },
      { id: 'hist5', deviceId: '2', latitude: 34.0522, longitude: -118.2437, timestamp: '2024-07-26T10:00:00Z' },
      { id: 'hist6', deviceId: '2', latitude: 40.7128, longitude: -74.0060, timestamp: '2024-07-25T10:00:00Z' },
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
      timestamp: '2024-07-28T10:00:00Z',
      address: 'You have this item with you.',
    },
    locationHistory: [
      { id: 'hist7', deviceId: '3', latitude: 34.0525, longitude: -118.2440, timestamp: '2024-07-28T10:00:00Z' },
      { id: 'hist8', deviceId: '3', latitude: 34.0522, longitude: -118.2437, timestamp: '2024-07-26T10:00:00Z' },
    ],
    image: "tag-wallet",
  },
];
