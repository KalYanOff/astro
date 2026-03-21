export const TL_CONTEXT = 'TL-INT-delfinstay-ru_2026-03-20';
export const TL_LANG = 'ru';
export const TL_PROVIDER_ID = 64638;
export const TL_DEFAULT_ADULTS = 2;
export const TL_BOOKING_BASE_URL = 'https://ru-ibe.tlintegration.ru/booking2/hotel/index.gc.html';
export const TL_THEME = `${TL_PROVIDER_ID}_${TL_CONTEXT.split('_').pop()}`;

export const TL_ROOM_IDS_BY_CATEGORY = {
  'standard-2': 390807,
  'standard-3': 390808,
  'econom-2': 391022,
  'econom-3': 390809,
  'econom-4': 391017,
};

export function getTravelLineRoomId(categoryId) {
  if (!categoryId) return null;
  return TL_ROOM_IDS_BY_CATEGORY[categoryId] ?? null;
}

function normalizeIsoDate(dateValue) {
  if (!dateValue) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return '';

  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildTravelLineRoomBookingUrl({ roomId, checkInDate, nights, adults = TL_DEFAULT_ADULTS }) {
  if (!roomId) return '#';

  const safeNights = Number.isFinite(nights) ? Math.max(1, Math.round(nights)) : 1;
  const safeAdults = Number.isFinite(adults) ? Math.max(1, Math.min(Math.round(adults), 10)) : TL_DEFAULT_ADULTS;
  const safeDate = normalizeIsoDate(checkInDate);

  const params = new URLSearchParams({
    int: 'true',
    accommodationMode: 'auto',
    adults: String(safeAdults),
    fullScreenOnMobile: 'false',
    language: TL_LANG,
    providerId: String(TL_PROVIDER_ID),
    roomTypes: String(roomId),
    theme: TL_THEME,
    defaultAdults: String(TL_DEFAULT_ADULTS),
    date: safeDate,
    nights: String(safeNights),
  });

  return `${TL_BOOKING_BASE_URL}?${params.toString()}`;
}
