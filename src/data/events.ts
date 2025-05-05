export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  country: string;
  ticketLink?: string;
  soldOut?: boolean;
  featured?: boolean;
}

export const events: Event[] = [
  {
    id: 'event-1',
    title: 'Summer Electronic Festival',
    date: '2025-06-15',
    time: '20:00',
    venue: 'Skyline Arena',
    city: 'Los Angeles',
    country: 'USA',
    ticketLink: 'https://tickets.example.com/event1',
    featured: true
  },
  {
    id: 'event-2',
    title: 'Club Resonance',
    date: '2025-06-20',
    time: '22:00',
    venue: 'The Echo Loft',
    city: 'New York',
    country: 'USA',
    ticketLink: 'https://tickets.example.com/event2'
  },
  {
    id: 'event-3',
    title: 'Harmonic Convergence Tour',
    date: '2025-07-05',
    time: '19:30',
    venue: 'Quantum Hall',
    city: 'London',
    country: 'UK',
    ticketLink: 'https://tickets.example.com/event3',
    featured: true
  },
  {
    id: 'event-4',
    title: 'Synthetic Dreams Live',
    date: '2025-07-12',
    time: '21:00',
    venue: 'Digital Dreams Warehouse',
    city: 'Berlin',
    country: 'Germany',
    ticketLink: 'https://tickets.example.com/event4',
    featured: true
  },
  {
    id: 'event-5',
    title: 'Electronic Summit',
    date: '2025-07-25',
    time: '18:00',
    venue: 'The Apex',
    city: 'Tokyo',
    country: 'Japan',
    ticketLink: 'https://tickets.example.com/event5',
    soldOut: true
  },
  {
    id: 'event-6',
    title: 'Pulse Festival',
    date: '2025-08-02',
    time: '16:00',
    venue: 'Echo Park',
    city: 'Sydney',
    country: 'Australia',
    ticketLink: 'https://tickets.example.com/event6'
  },
  {
    id: 'event-7',
    title: 'Neon Nights',
    date: '2025-08-15',
    time: '22:30',
    venue: 'Club Nexus',
    city: 'Miami',
    country: 'USA',
    ticketLink: 'https://tickets.example.com/event7'
  },
  {
    id: 'event-8',
    title: 'Ethereal Experience',
    date: '2025-08-28',
    time: '20:00',
    venue: 'The Observatory',
    city: 'Amsterdam',
    country: 'Netherlands',
    ticketLink: 'https://tickets.example.com/event8'
  },
  {
    id: 'event-9',
    title: 'Digital Horizons',
    date: '2025-09-10',
    time: '19:00',
    venue: 'Tech Pavilion',
    city: 'San Francisco',
    country: 'USA',
    ticketLink: 'https://tickets.example.com/event9'
  }
]; 