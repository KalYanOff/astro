export const ROOM_PRICING = {
  '1': {
    base_price: 1000,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1000 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 1400 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 1200 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 1200 },
    ],
  },
  '2': {
    base_price: 1200,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1200 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 1700 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 1450 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 1450 },
    ],
  },
  '3': {
    base_price: 1500,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1500 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 2100 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 1800 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 1800 },
    ],
  },
  '4': {
    base_price: 1500,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1500 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 2200 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 1800 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 1800 },
    ],
  },
  '5': {
    base_price: 1800,
    price_periods: [
      { id: 'may', label: 'Май', start: '2026-04-01', end: '2026-05-31', price: 1800 },
      { id: 'mid', label: 'Июнь', start: '2026-06-01', end: '2026-06-30', price: 2600 },
      { id: 'high', label: 'Июль - 14 Сентября', start: '2026-07-01', end: '2026-09-14', price: 2200 },
      { id: 'low', label: '15 Сентября - Октябрь', start: '2026-09-15', end: '2026-11-30', price: 2450 },
    ],
  },
};

export function applyPricingToRoom(room) {
  const pricing = ROOM_PRICING[room.id];
  if (!pricing) return room;

  return {
    ...room,
    base_price: pricing.base_price,
    price_periods: pricing.price_periods,
  };
}
