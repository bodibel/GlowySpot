import type { ServiceCategory } from '../types';

/**
 * Szolgáltatási kategóriák
 */
export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: 'hair', label: 'Fodrászat', icon: '💇' },
  { value: 'nails', label: 'Körmös', icon: '💅' },
  { value: 'cosmetics', label: 'Kozmetika', icon: '💄' },
  { value: 'barber', label: 'Borbély', icon: '💈' },
  { value: 'massage', label: 'Masszázs', icon: '💆' },
  { value: 'tattoo', label: 'Tetoválás', icon: '🎨' },
  { value: 'piercing', label: 'Piercing', icon: '📍' },
];

/**
 * Hét napjai
 */
export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Hétfő' },
  { key: 'tuesday', label: 'Kedd' },
  { key: 'wednesday', label: 'Szerda' },
  { key: 'thursday', label: 'Csütörtök' },
  { key: 'friday', label: 'Péntek' },
  { key: 'saturday', label: 'Szombat' },
  { key: 'sunday', label: 'Vasárnap' },
];

/**
 * Default keresési sugár (km)
 */
export const DEFAULT_SEARCH_RADIUS = 10;

/**
 * Maximum keresési sugár (km)
 */
export const MAX_SEARCH_RADIUS = 50;

/**
 * Default koordináták (Budapest)
 */
export const DEFAULT_COORDINATES = {
  lat: 47.4979,
  lng: 19.0402,
};
