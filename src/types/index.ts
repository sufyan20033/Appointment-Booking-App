export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  avatar?: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  service: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  avatar?: string;
  availability: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  location: string;
}
