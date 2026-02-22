import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { updateBooking } from '../../stores/bookingStore.js';
import {
  BOOKING_MONTH_START,
  BOOKING_MONTH_END,
  getDefaultBookingDates,
  getInitialCalendarPage,
  getMinAllowedDate,
  isDateInBookingSeason,
} from '../../lib/bookingDates';

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
  if (match) return { checkIn: toISO(match[1]), checkOut: toISO(match[2]) };
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
  const currentDateIso = new Date().toISOString().split('T')[0];
  const defaultDates = getDefaultBookingDates();
  const minAllowedDate = getMinAllowedDate(currentDateIso);
  const initialPage = getInitialCalendarPage(currentDateIso);

  const [checkInDate, setCheckInDate] = useState(defaultDates.checkIn);
  const [checkOutDate, setCheckOutDate] = useState(defaultDates.checkOut);
  const [guestsCount, setGuestsCount] = useState(2);
  const [showCalendar, setShowCalendar] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [calYear, setCalYear] = useState(initialPage.year);
  const [calMonth, setCalMonth] = useState(initialPage.month);
  const [selecting, setSelecting] = useState(null);
  const [calPosition, setCalPosition] = useState({ top: 0, left: 0 });
  const calRef = useRef(null);
  const buttonRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateBooking({ checkInDate: defaultDates.checkIn, checkOutDate: defaultDates.checkOut, guestsCount: 2 });
  }, []);

  const calcPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const calendarWidth = 296;
    const calendarHeight = 380;

    let top = rect.bottom + 6;
    let left = rect.left;

    if (left + calendarWidth > window.innerWidth - 8) {
      left = window.innerWidth - calendarWidth - 8;
    }
    if (left < 8) left = 8;

    if (rect.bottom + calendarHeight > window.innerHeight - 8) {
      top = rect.top - calendarHeight - 6;
    }

    setCalPosition({ top, left });
  };

  useEffect(() => {
    if (!showCalendar) return;

    const handleClickOutside = (e) => {
      if (
        calRef.current && !calRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
        setSelecting(null);
      }
    };

    const handleReposition = () => calcPosition();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [showCalendar]);

  const handleOpenCalendar = () => {
    calcPosition();
    setSelecting('in');
    setShowCalendar(v => !v);
  };

  const applyDates = (checkIn, checkOut) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    updateBooking({ checkInDate: checkIn, checkOutDate: checkOut });
  };

  const handleGuestsChange = (e) => {
    const val = Number(e.target.value);
    setGuestsCount(val);
    updateBooking({ guestsCount: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBooking({ checkInDate, checkOutDate, guestsCount, searchActivated: true });
    const roomsSection = document.querySelector('#rooms');
    if (roomsSection) roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleManualChange = (e) => {
    const val = e.target.value;
    setManualInput(val);
    const { checkIn, checkOut } = parseRangeInput(val);
    if (
      checkIn &&
      checkOut &&
      checkIn <= checkOut &&
      isDateInBookingSeason(checkIn) &&
      isDateInBookingSeason(checkOut) &&
      checkIn >= minAllowedDate
    ) {
      applyDates(checkIn, checkOut);
    }
  };

  const handleManualBlur = () => {
    if (!manualInput) return;
    const { checkIn, checkOut } = parseRangeInput(manualInput);
    if (
      checkIn &&
      checkOut &&
      checkIn <= checkOut &&
      isDateInBookingSeason(checkIn) &&
      isDateInBookingSeason(checkOut) &&
      checkIn >= minAllowedDate
    ) {
      applyDates(checkIn, checkOut);
    }
    setManualInput('');
  };

  const handleDayClick = (iso) => {
    if (selecting === 'out' && checkInDate && iso > checkInDate) {
      applyDates(checkInDate, iso);
      setSelecting(null);
      setShowCalendar(false);
    } else {
      setCheckInDate(iso);
      setCheckOutDate('');
      updateBooking({ checkInDate: iso, checkOutDate: '' });
      setSelecting('out');
    }
  };

  const moveMonth = (direction) => {
    let nextYear = calYear;
    let nextMonth = calMonth;

    do {
      nextMonth += direction;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      }
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }
    } while (nextMonth < BOOKING_MONTH_START || nextMonth > BOOKING_MONTH_END);

    setCalYear(nextYear);
    setCalMonth(nextMonth);
  };

  const prevMonth = () => moveMonth(-1);
  const nextMonth = () => moveMonth(1);

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

  const calendarEl = showCalendar && mounted ? (
    <div
      ref={calRef}
      style={{
        position: 'fixed',
        top: `${calPosition.top}px`,
        left: `${calPosition.left}px`,
        zIndex: 99999,
        width: '296px',
      }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-gray-800">
          {MONTH_NAMES[calMonth]} {calYear}
        </span>
        <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <p className="text-center text-xs text-primary-600 mb-2 font-semibold">
        {selecting === 'out' ? '▸ Выберите дату выезда' : '▸ Выберите дату заезда'}
      </p>

      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const isPast = iso < currentDateIso;
          const isOutsideSeason = !isDateInBookingSeason(iso);
          const isBeforeSeasonStart = iso < minAllowedDate;
          const isDisabled = isPast || isOutsideSeason || isBeforeSeasonStart;
          const isCheckIn = iso === checkInDate;
          const isCheckOut = iso === checkOutDate;
          const cellDate = isoToDate(iso);
          const inRange = inDate && outDate && cellDate > inDate && cellDate < outDate;

          return (
            <button
              type="button"
              key={iso}
              disabled={isDisabled}
              onClick={() => !isDisabled && handleDayClick(iso)}
              className={[
                'text-xs py-1.5 text-center transition-colors rounded-lg',
                isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-primary-50 cursor-pointer text-gray-800',
                (isCheckIn || isCheckOut) ? '!bg-primary-600 !text-white font-bold hover:!bg-primary-700' : '',
                inRange ? '!bg-primary-100 !text-primary-800 !rounded-none' : '',
              ].filter(Boolean).join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        <input
          type="text"
          placeholder="01.06.26-07.06.26"
          value={manualInput}
          onChange={handleManualChange}
          onBlur={handleManualBlur}
          className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-700"
        />
      </div>
    </div>
  ) : null;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-4 py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">

          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              <Calendar className="w-3 h-3 inline mr-1" />
              Даты заезда — выезда
            </label>
            <button
              ref={buttonRef}
              type="button"
              onClick={handleOpenCalendar}
              className={[
                'w-full text-left px-3 py-2 border rounded-lg text-sm bg-white font-medium transition-colors',
                showCalendar ? 'border-primary-500 ring-2 ring-primary-100 text-gray-900' : 'border-gray-300 hover:border-primary-400 text-gray-900',
              ].join(' ')}
            >
              {dateRangeLabel}
            </button>
          </div>

          <div className="sm:w-40">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              <Users className="w-3 h-3 inline mr-1" />
              Гостей
            </label>
            <select
              value={guestsCount}
              onChange={handleGuestsChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {[2, 3, 4].map((num) => (
                <option key={num} value={num}>{num} гостя</option>
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

      {mounted && createPortal(calendarEl, document.body)}
    </form>
  );
}
