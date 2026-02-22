/* =========================================
   COMPONENT: RoomCard
   Wide card: photo slider, amenities, inline
   date picker with real-time price calc, book CTA
   ========================================= */
import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Share2, Users, Wifi, Wind, Snowflake, Tv, Droplet,
  ChevronLeft, ChevronRight, Flame, AlertCircle, Calendar,
} from 'lucide-react';
import { useStore } from '@nanostores/react';
import { bookingStore, updateBooking } from '../../stores/bookingStore';
import { calculateStayPrice, getNightPrice } from '../../lib/pricing';

const AMENITY_ICONS = {
  'Wi-Fi': Wifi,
  'Вентиляторы': Wind,
  'Кондиционер': Snowflake,
  'Телевизор': Tv,
  'Индивидуальный санузел': Droplet,
  'Душ и туалет общего пользования': Droplet,
};

const CTA_BADGES = {
  '1': null,
  '2': { label: 'Осталось 2 номера', icon: 'alert', color: 'bg-red-500' },
  '3': { label: 'Популярный', icon: 'flame', color: 'bg-accent-500' },
  '4': { label: 'Популярный', icon: 'flame', color: 'bg-accent-500' },
  '5': { label: 'Осталось 2 номера', icon: 'alert', color: 'bg-red-500' },
};

const MONTH_NAMES = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function isoToDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function calcNights(ci, co) {
  if (!ci || !co) return 0;
  const diff = new Date(co) - new Date(ci);
  return Math.max(0, Math.ceil(diff / 86400000));
}
function toShort(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y.slice(2)}`;
}

/* ---- Mini inline calendar popup ---- */
function CardCalendar({ checkIn, checkOut, onChange, onClose, anchorRef }) {
  const today = new Date().toISOString().split('T')[0];
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selecting, setSelecting] = useState(checkIn && !checkOut ? 'out' : 'in');
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const calRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const calW = 300;
    const calH = 370;
    let top = rect.bottom + window.scrollY + 6;
    let left = rect.left + window.scrollX;
    if (left + calW > window.innerWidth - 8) left = window.innerWidth - calW - 8;
    if (left < 8) left = 8;
    const viewTop = rect.bottom + 6;
    if (viewTop + calH > window.innerHeight - 8) {
      top = rect.top + window.scrollY - calH - 6;
    }
    setPos({ top, left });
  }, [anchorRef]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        calRef.current && !calRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onClose, anchorRef]);

  const handleDayClick = (iso) => {
    if (selecting === 'out' && checkIn && iso > checkIn) {
      onChange(checkIn, iso);
      onClose();
    } else {
      onChange(iso, '');
      setSelecting('out');
    }
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDow = getFirstDayOfWeek(calYear, calMonth);
  const inDate = isoToDate(checkIn);
  const outDate = isoToDate(checkOut);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={calRef}
      style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 99999, width: 300 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="text-sm font-bold text-slate-800">{MONTH_NAMES[calMonth]} {calYear}</span>
        <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <p className="text-center text-xs text-primary-600 font-semibold mb-2">
        {selecting === 'out' ? '▸ Выберите дату выезда' : '▸ Выберите дату заезда'}
      </p>

      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const isPast = iso < today;
          const isCI = iso === checkIn;
          const isCO = iso === checkOut;
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
                isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-primary-50 cursor-pointer text-slate-800',
                (isCI || isCO) ? '!bg-primary-600 !text-white font-bold hover:!bg-primary-700' : '',
                inRange ? '!bg-primary-100 !text-primary-800 !rounded-none' : '',
              ].filter(Boolean).join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}

export default function RoomCard({ room }) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const booking = useStore(bookingStore);
  const [activeSlide, setActiveSlide] = useState(0);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [showCal, setShowCal] = useState(false);
  const calAnchorRef = useRef(null);
  const dateRangeBtnRef = useRef(null);

  const images =
    room.images && room.images.length > 0
      ? room.images
      : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const badge = CTA_BADGES[room.id] ?? null;
  const nights = calcNights(checkIn, checkOut);
  const periodOverrides = booking.periodPriceOverrides?.[room.id] || {};
  const currentNightPrice = getNightPrice(room, checkIn || today, periodOverrides);
  const totalPrice = calculateStayPrice(room, checkIn, checkOut, periodOverrides);

  const prevSlide = useCallback(
    (e) => {
      e.stopPropagation();
      setActiveSlide((p) => (p - 1 + images.length) % images.length);
    },
    [images.length]
  );

  const nextSlide = useCallback(
    (e) => {
      e.stopPropagation();
      setActiveSlide((p) => (p + 1) % images.length);
    },
    [images.length]
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.name,
          text: room.description,
          url: window.location.href + '#room-' + room.id,
        });
      } catch (_) {}
    }
  };

  const handleCalChange = (ci, co) => {
    setCheckIn(ci || today);
    setCheckOut(co || '');
  };

  useEffect(() => {
    setActiveSlide(0);
  }, [room.id]);

  const handleBooking = () => {
    updateBooking({
      selectedRoomId: room.id,
      selectedRoomName: room.name,
      selectedRoomPrice: currentNightPrice,
      checkInDate: checkIn,
      checkOutDate: checkOut || tomorrow,
      guestsCount: room.capacity,
    });
    const el = document.querySelector('#booking-request');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const guestsLabel =
    room.capacity === 1
      ? '1 гость'
      : room.capacity < 5
      ? `${room.capacity} гостя`
      : `${room.capacity} гостей`;

  const nightsLabel =
    nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">

      {/* ---- photo slider ---- */}
      <div className="relative h-64 flex-shrink-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(activeSlide * 100) / images.length}%)`,
          }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${room.name} — фото ${i + 1}`}
              className="h-full object-cover flex-shrink-0"
              style={{ width: `${100 / images.length}%` }}
              loading="lazy"
            />
          ))}
        </div>

        {badge && (
          <div
            className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 ${badge.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}
          >
            {badge.icon === 'flame' && <Flame className="w-3.5 h-3.5" />}
            {badge.icon === 'alert' && <AlertCircle className="w-3.5 h-3.5" />}
            {badge.label}
          </div>
        )}

        <button
          onClick={handleShare}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform"
          aria-label="Поделиться"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
        </button>

        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 text-right leading-none">
          <span className="block text-[10px] text-white/70 mb-1">от</span>
          <span className="block text-lg font-bold text-white">
            {currentNightPrice.toLocaleString('ru-RU')} ₽
          </span>
          <span className="block text-[10px] text-white/70 mt-1">/ ночь</span>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all hover:scale-110"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all hover:scale-110"
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide(i);
                  }}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeSlide ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Фото ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ---- card body ---- */}
      <div className="p-5 flex flex-col flex-1">

        {/* title + category badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{room.name}</h3>
          <span
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
              room.category === 'standard'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {room.category === 'standard' ? 'Стандарт' : 'Эконом'}
          </span>
        </div>

        {/* capacity */}
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
          <Users className="w-4 h-4" />
          <span>{guestsLabel}</span>
        </div>

        {/* description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{room.description}</p>

        {/* amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <ul className="flex flex-col gap-2 mb-4">
            {room.amenities.map((amenity, i) => {
              const Icon = AMENITY_ICONS[amenity] || Wifi;
              return (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon className="w-4 h-4 flex-shrink-0 text-primary-500" />
                  <span>{amenity}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* ---- date picker ---- */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Даты заезда / выезда
          </label>

          <button
            ref={dateRangeBtnRef}
            type="button"
            onClick={() => {
              calAnchorRef.current = dateRangeBtnRef.current;
              setShowCal((v) => !v);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm transition-all text-left mb-3 ${
              showCal
                ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="flex-1 text-slate-800 font-medium">
              {checkIn ? toShort(checkIn) : 'дд.мм.гг'}
            </span>
            <span className="text-slate-400 mx-0.5">→</span>
            <span className={checkOut ? 'text-slate-800 font-medium' : 'text-slate-400'}>
              {checkOut ? toShort(checkOut) : 'дд.мм.гг'}
            </span>
          </button>

          {/* calendar portal */}
          {showCal && (
            <CardCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={handleCalChange}
              onClose={() => setShowCal(false)}
              anchorRef={calAnchorRef}
            />
          )}

          {/* price breakdown */}
          {nights > 0 && checkOut ? (
            <div className="bg-primary-50 rounded-xl px-4 py-3 mb-3">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                <span>{nights} {nightsLabel} × от {currentNightPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Итого</span>
                <span className="text-xl font-bold text-primary-700">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center mb-3">
              Выберите даты для расчёта стоимости
            </div>
          )}

          <button
            onClick={handleBooking}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg active:scale-95"
          >
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
}
