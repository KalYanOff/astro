import { atom, computed } from 'nanostores';
import { getDefaultBookingDates } from '../lib/bookingDates';

const defaultDates = getDefaultBookingDates();

export const bookingStore = atom({
  checkInDate: defaultDates.checkIn,
  checkOutDate: defaultDates.checkOut,
  guestsCount: 2,
  wishes: '',
  selectedRoomId: null,
  selectedRoomName: '',
  selectedRoomPrice: 0,
  searchActivated: false,
});

export const numberOfNights = computed(bookingStore, (booking) => {
  if (!booking.checkInDate || !booking.checkOutDate) return 1;

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const diffTime = checkOut - checkIn;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
});

export function updateBooking(updates) {
  bookingStore.set({ ...bookingStore.get(), ...updates });
}

export function resetBooking() {
  bookingStore.set({
    checkInDate: '',
    checkOutDate: '',
    guestsCount: 2,
    wishes: '',
    selectedRoomId: null,
    selectedRoomName: '',
    selectedRoomPrice: 0,
    searchActivated: false,
  });
}
