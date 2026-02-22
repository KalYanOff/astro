export function getRoomPeriods(room, overrides = {}) {
  const periods = room.price_periods && room.price_periods.length > 0
    ? room.price_periods
    : [{ id: 'base', label: 'Базовый тариф', start: null, end: null, price: room.base_price }];

  return periods.map((period) => {
    const overridePrice = overrides?.[period.id];
    return {
      ...period,
      price: Number.isFinite(overridePrice) ? overridePrice : period.price,
    };
  });
}

export function getNightPrice(room, isoDate, overrides = {}) {
  const periods = getRoomPeriods(room, overrides);
  const matched = periods.find((period) => {
    if (!period.start || !period.end) return false;
    return isoDate >= period.start && isoDate <= period.end;
  });
  return matched ? matched.price : room.base_price;
}

export function calculateStayPrice(room, checkIn, checkOut, overrides = {}) {
  if (!room || !checkIn || !checkOut) return 0;

  let sum = 0;
  const current = new Date(checkIn);
  const end = new Date(checkOut);

  while (current < end) {
    const iso = current.toISOString().split('T')[0];
    sum += getNightPrice(room, iso, overrides);
    current.setDate(current.getDate() + 1);
  }

  return sum;
}
