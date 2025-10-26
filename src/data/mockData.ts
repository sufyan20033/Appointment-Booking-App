import { User, Provider, Appointment } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
};

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@example.com',
    service: 'General Medicine',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Health St, New York, NY',
    },
    availability: [
      { id: 's1', date: '2025-11-01', startTime: '09:00', endTime: '10:00', isBooked: false },
      { id: 's2', date: '2025-11-01', startTime: '10:00', endTime: '11:00', isBooked: true },
      { id: 's3', date: '2025-11-01', startTime: '14:00', endTime: '15:00', isBooked: false },
    ],
  },
  {
    id: 'p2',
    name: 'Dr. Michael Chen',
    email: 'michael@example.com',
    service: 'Dentistry',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '456 Dental Ave, New York, NY',
    },
    availability: [
      { id: 's4', date: '2025-11-02', startTime: '09:00', endTime: '10:00', isBooked: false },
      { id: 's5', date: '2025-11-02', startTime: '11:00', endTime: '12:00', isBooked: false },
    ],
  },
  {
    id: 'p3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily@example.com',
    service: 'Physiotherapy',
    location: {
      lat: 40.7484,
      lng: -73.9857,
      address: '789 Wellness Blvd, New York, NY',
    },
    availability: [
      { id: 's6', date: '2025-11-03', startTime: '10:00', endTime: '11:00', isBooked: false },
      { id: 's7', date: '2025-11-03', startTime: '15:00', endTime: '16:00', isBooked: false },
    ],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    userId: '1',
    providerId: 'p1',
    providerName: 'Dr. Sarah Johnson',
    service: 'General Medicine',
    date: '2025-11-01',
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    location: '123 Health St, New York, NY',
  },
  {
    id: 'a2',
    userId: '1',
    providerId: 'p2',
    providerName: 'Dr. Michael Chen',
    service: 'Dentistry',
    date: '2025-11-05',
    startTime: '14:00',
    endTime: '15:00',
    status: 'pending',
    location: '456 Dental Ave, New York, NY',
  },
];
