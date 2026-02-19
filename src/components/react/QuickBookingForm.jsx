import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { updateBooking } from '../../stores/bookingStore.js';

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year.slice(2)}`;
}

export default function QuickBookingForm() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [guestsCount, setGuestsCount] = useState(2);
  const [showDates, setShowDates] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBooking({ checkInDate, checkOutDate, guestsCount });
    const roomsSection = document.querySelector('#rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const dateRangeLabel =
    checkInDate && checkOutDate
      ? `${formatDateShort(checkInDate)} — ${formatDateShort(checkOutDate)}`
      : 'Выберите даты';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-4 py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              <Calendar className="w-3 h-3 inline mr-1" />
              Даты заезда — выезда
            </label>
            {showDates ? (
              <div className="flex gap-1 items-center">
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={today}
                  required
                  onBlur={() => checkInDate && checkOutDate && setShowDates(false)}
                  className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => { setCheckOutDate(e.target.value); setShowDates(false); }}
                  min={checkInDate || today}
                  required
                  className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDates(true)}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm bg-white hover:border-primary-400 transition-colors font-medium"
              >
                {dateRangeLabel}
              </button>
            )}
          </div>

          <div className="sm:w-40">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              <Users className="w-3 h-3 inline mr-1" />
              Гостей
            </label>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="sm:w-auto w-full bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm px-5 py-2 rounded-xl shadow-lg transition-all transform hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Проверить номера
          </button>
        </div>
      </div>
    </form>
  );
}
