export const BOOKING_MONTH_START = 3;
export const BOOKING_MONTH_END = 10;

const MS_PER_DAY = 86400000;

function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function createDate(year, month, day) {
  return new Date(year, month, day);
}

export function getSeasonStartForYear(year) {
  return createDate(year, BOOKING_MONTH_START, 1);
}

export function getSeasonEndForYear(year) {
  return createDate(year, BOOKING_MONTH_END + 1, 0);
}

export function isDateInBookingSeason(isoDate) {
  if (!isoDate) return false;
  const month = Number(isoDate.slice(5, 7)) - 1;
  return month >= BOOKING_MONTH_START && month <= BOOKING_MONTH_END;
}

export function getDefaultBookingDates(now = new Date()) {
  const year = now.getFullYear();
  const seasonStart = getSeasonStartForYear(year);
  const seasonEnd = getSeasonEndForYear(year);

  let checkInDate;
  if (now < seasonStart) {
    checkInDate = seasonStart;
  } else if (now > seasonEnd) {
    checkInDate = getSeasonStartForYear(year + 1);
  } else {
    checkInDate = createDate(year, now.getMonth(), now.getDate());
  }

  const checkInEndLimit = getSeasonEndForYear(checkInDate.getFullYear());
  if (formatISO(checkInDate) === formatISO(checkInEndLimit)) {
    checkInDate = new Date(checkInDate.getTime() - MS_PER_DAY);
  }

  const checkOutDate = new Date(checkInDate.getTime() + MS_PER_DAY);

  return {
    checkIn: formatISO(checkInDate),
    checkOut: formatISO(checkOutDate),
  };
}

export function getMinAllowedDate(todayIso) {
  const today = todayIso ? new Date(todayIso) : new Date();
  const currentYear = today.getFullYear();
  const seasonStart = getSeasonStartForYear(currentYear);

  if (today < seasonStart) return formatISO(seasonStart);

  const seasonEnd = getSeasonEndForYear(currentYear);
  if (today > seasonEnd) return formatISO(getSeasonStartForYear(currentYear + 1));

  return formatISO(today);
}

export function getMaxAllowedDate(todayIso) {
  const today = todayIso ? new Date(todayIso) : new Date();
  const currentYear = today.getFullYear();
  const seasonEnd = getSeasonEndForYear(currentYear);
  if (today > seasonEnd) return formatISO(getSeasonEndForYear(currentYear + 1));
  return formatISO(seasonEnd);
}

export function getInitialCalendarPage(todayIso) {
  const minAllowed = getMinAllowedDate(todayIso);
  const date = new Date(minAllowed);
  return { year: date.getFullYear(), month: date.getMonth() };
}
