
import React from 'react';
import { Table, Racket, Partner } from './types';

export const COLORS = {
  primary: '#3362B5',
  deep: '#1B407F',
  accent: '#E03832',
  bg: '#F8F9FB',
  white: '#FFFFFF',
  gray: '#94A3B8'
};

export const TABLES: Table[] = [
  { id: 1, name: 'Стол №1' },
  { id: 2, name: 'Стол №2' },
  { id: 3, name: 'Стол №3' },
  { id: 4, name: 'Стол №4' },
];

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
  '20:00', '21:00', '22:00'
];

export const RACKETS: Racket[] = [
  {
    id: 'r1',
    name: 'Tenergy Elite Pro',
    type: 'attack',
    rating: 9.8,
    price: 350,
    image: 'https://picsum.photos/seed/racket1/200/200'
  },
  {
    id: 'r2',
    name: 'Control Master X',
    type: 'control',
    rating: 9.2,
    price: 250,
    image: 'https://picsum.photos/seed/racket2/200/200'
  },
  {
    id: 'r3',
    name: 'All-Rounder V2',
    type: 'universal',
    rating: 8.5,
    price: 200,
    image: 'https://picsum.photos/seed/racket3/200/200'
  }
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Дмитрий С.', rating: 420, gamesCount: 156, avatar: 'https://i.pravatar.cc/150?u=p1' },
  { id: 'p2', name: 'Анна М.', rating: 380, gamesCount: 89, avatar: 'https://i.pravatar.cc/150?u=p2' },
  { id: 'p3', name: 'Игорь К.', rating: 510, gamesCount: 230, avatar: 'https://i.pravatar.cc/150?u=p3' },
  { id: 'p4', name: 'Елена В.', rating: 450, gamesCount: 45, avatar: 'https://i.pravatar.cc/150?u=p4' },
];
