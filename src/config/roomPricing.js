import { getRoomCategoryId, normalizeRoomCategory } from './roomCategories';

export const ROOM_PRICING = {
  'standard-2': {
    base_price: 3000,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 3000 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 4000 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 5000 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 3000 },
    ],
  },
  'standard-3': {
    base_price: 4000,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 4000 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 5000 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 6000 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 4000 },
    ],
  },
  'econom-2': {
    base_price: 1200,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1200 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 1500 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 2200 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 1200 },
    ],
  },
  'econom-3': {
    base_price: 1800,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1800 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 2500 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 3300 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 1800 },
    ],
  },
  'econom-4': {
    base_price: 2400,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 2400 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 3000 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 4000 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 2400 },
    ],
  },
};

export function getPricingByCategoryId(categoryId) {
  return ROOM_PRICING[categoryId] ?? null;
}

export function applyPricingToRoom(room) {
  const normalizedCategory = normalizeRoomCategory(room.category);
  const roomCategoryId = getRoomCategoryId(normalizedCategory, room.capacity);
  const pricing = roomCategoryId ? getPricingByCategoryId(roomCategoryId) : null;

  if (!pricing) {
    return {
      ...room,
      category: normalizedCategory,
      roomCategoryId,
    };
  }

  return {
    ...room,
    category: normalizedCategory,
    roomCategoryId,
    base_price: pricing.base_price,
    price_periods: pricing.price_periods,
  };
}
