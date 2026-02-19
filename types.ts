
export interface User {
  id: string;
  name: string;
  phone: string;
  rttfRating: number;
  balance: number;
  bonusPoints: number;
}

export interface Table {
  id: number;
  name: string;
}

export interface Racket {
  id: string;
  name: string;
  type: 'control' | 'universal' | 'attack';
  rating: number;
  price: number;
  image: string;
}

export interface Booking {
  id: string;
  tableId: number;
  date: string;
  timeSlot: string;
  rackets: Racket[];
  partner?: Partner;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface Partner {
  id: string;
  name: string;
  rating: number;
  gamesCount: number;
  avatar: string;
}

export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  BOOKING_DATE = 'BOOKING_DATE',
  BOOKING_TIME = 'BOOKING_TIME',
  BOOKING_RACKETS = 'BOOKING_RACKETS',
  BOOKING_SUMMARY = 'BOOKING_SUMMARY',
  PAYMENT = 'PAYMENT',
  PARTNERS = 'PARTNERS',
  ACTIVE_SESSION = 'ACTIVE_SESSION',
  PROFILE = 'PROFILE',
  HISTORY = 'HISTORY',
  MY_CARDS = 'MY_CARDS',
  SETTINGS = 'SETTINGS',
  SUPPORT = 'SUPPORT'
}
