import { atom, computed } from 'nanostores';

const todayISO = new Date().toISOString().split('T')[0];
const tomorrowISO = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const bookingStore = atom({
  checkInDate: todayISO,
  checkOutDate: tomorrowISO,
  guestsCount: 2,
  wishes: '',
  selectedRoomId: null,
  selectedRoomName: '',
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
    searchActivated: false,
  });
}
