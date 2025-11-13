import { Timestamp } from 'firebase/firestore';

export type Location = {
  id: string; // Add id field
  latitude: number;
  longitude: number;
  timestamp: Date | Timestamp | string; // Allow both Date and Timestamp
  address?: string;
  deviceId?: string;
};
