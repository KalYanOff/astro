/* =========================================
   COMPONENT: QuickBookingForm
   Hero date-range picker + guests selector + search button
   date-range-button: shows current date range, opens calendar on click
   date-range-calendar: single inline month calendar with range highlight
   date-range-input: manual text input (DD.MM.YY-DD.MM.YY)
   guests-select: dropdown 2-4 guests
   ========================================= */
import { useState, useRef, useEffect } from 'react';
import { Calendar, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { updateBooking } from '../../stores/bookingStore.js';

const MONTH_NAMES = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function toISO(d) {
  if (!d) return '';
  const [day, mon, yr] = d.split('.');
  if (!day || !mon || !yr) return '';
  const fullYear = yr.length === 2 ? '20' + yr : yr;
  return `${fullYear}-${mon.padStart(2,'0')}-${day.padStart(2,'0')}`;
}

function toShort(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y.slice(2)}`;
}

function parseRangeInput(val) {
  const match = val.match(/^(\d{2}\.\d{2}\.\d{2,4})-(\d{2}\.\d{2}\.\d{2,4})$/);
  if (match) {
    return { checkIn: toISO(match[1]), checkOut: toISO(match[2]) };
  }
  return { checkIn: '', checkOut: '' };
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function isoToDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function QuickBookingForm() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [guestsCount, setGuestsCount] = useState(2);
  const [showCalendar, setShowCalendar] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selecting, setSelecting] = useState(null);
  const calRef = useRef(null);

  useEffect(() => {
    if (!showCalendar) return;
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCalendar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBooking({ checkInDate, checkOutDate, guestsCount });
    const roomsSection = document.querySelector('#rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleManualChange = (e) => {
    const val = e.target.value;
    setManualInput(val);
    const { checkIn, checkOut } = parseRangeInput(val);
    if (checkIn && checkOut && checkIn <= checkOut) {
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
    }
  };

  const handleManualBlur = () => {
    if (!manualInput) return;
    const { checkIn, checkOut } = parseRangeInput(manualInput);
    if (checkIn && checkOut && checkIn <= checkOut) {
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
    }
    setManualInput('');
  };

  const handleDayClick = (iso) => {
    if (selecting === 'out' && checkInDate && iso >= checkInDate) {
      setCheckOutDate(iso);
      setSelecting(null);
      setShowCalendar(false);
    } else {
      setCheckInDate(iso);
      setCheckOutDate('');
      setSelecting('out');
    }
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const dateRangeLabel =
    checkInDate && checkOutDate
      ? `${toShort(checkInDate)} — ${toShort(checkOutDate)}`
      : checkInDate
      ? `${toShort(checkInDate)} — ...`
      : 'Выберите даты';

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDow = getFirstDayOfWeek(calYear, calMonth);

  const inDate = isoToDate(checkInDate);
  const outDate = isoToDate(checkOutDate);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-4 py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">

          {/* date-range-field */}
          <div className="flex-1 min-w-0 relative" ref={calRef}>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              <Calendar className="w-3 h-3 inline mr-1" />
              Даты заезда — выезда
            </label>

            {/* date-range-button: opens/closes calendar */}
            <button
              type="button"
              onClick={() => {
                setShowCalendar(v => !v);
                if (!showCalendar) setSelecting('in');
              }}
              className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm bg-white hover:border-primary-400 transition-colors font-medium"
            >
              {dateRangeLabel}
            </button>

            {/* date-range-calendar: inline calendar dropdown */}
            {showCalendar && (
              <div className="absolute top-full left-0 mt-1 z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-72">

                {/* calendar-nav: month navigation */}
                <div className="flex items-center justify-between mb-2">
                  <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-semibold text-gray-800">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* calendar-hint: selection step hint */}
                <p className="text-center text-xs text-primary-600 mb-2 font-medium">
                  {selecting === 'out' ? 'Выберите дату выезда' : 'Выберите дату заезда'}
                </p>

                {/* calendar-weekdays */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                  ))}
                </div>

                {/* calendar-days: day buttons grid */}
                <div className="grid grid-cols-7 gap-px">
                  {Array.from({ length: firstDow }).map((_, i) => (
                    <div key={`e${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const iso = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isPast = iso < today;
                    const isCheckIn = iso === checkInDate;
                    const isCheckOut = iso === checkOutDate;
                    const cellDate = isoToDate(iso);
                    const inRange = inDate && outDate && cellDate > inDate && cellDate < outDate;

                    return (
                      <button
                        type="button"
                        key={iso}
                        disabled={isPast}
                        onClick={() => !isPast && handleDayClick(iso)}
                        className={[
                          'text-xs py-1.5 text-center transition-colors rounded-lg',
                          isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary-100 cursor-pointer text-gray-800',
                          (isCheckIn || isCheckOut) ? 'bg-primary-600 text-white font-bold hover:bg-primary-700 rounded-lg' : '',
                          inRange ? 'bg-primary-100 text-primary-800 rounded-none' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* date-range-input: manual text entry */}
                <div className="mt-3 border-t border-gray-100 pt-2">
                  <input
                    type="text"
                    placeholder="01.06.26-07.06.26"
                    value={manualInput}
                    onChange={handleManualChange}
                    onBlur={handleManualBlur}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-700"
                  />
                </div>
              </div>
            )}
          </div>

          {/* guests-select: 2-4 guests */}
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
              {[2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} гостя
                </option>
              ))}
            </select>
          </div>

          {/* search-button */}
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
