/* =========================================
   COMPONENT: BookingRequestForm
   Booking section with:
   - Combined date range field (DD.MM.YY-DD.MM.YY) + calendar popup
   - Room dropdown grouped by category
   - Contact method selector
   - Guest name + phone
   - Wishes textarea
   ========================================= */
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { createPortal } from 'react-dom';
import { bookingStore, numberOfNights, updateBooking } from '../../stores/bookingStore';
import { ROOMS_DATA } from './RoomsList';
import {
  Mail, User, CheckCircle, AlertCircle,
  Calendar, Users, Pencil, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { CONTACT_LINKS } from '../../config/site.js';

/* ---- contact method icons ---- */
const IconWhatsApp = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const IconTelegram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);
const IconMax = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconPhone = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.59 5.59l.93-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const CONTACT_METHODS = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: IconWhatsApp, color: 'bg-green-500', hoverColor: 'hover:bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-600' },
  { id: 'telegram', label: 'Telegram', Icon: IconTelegram, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-600' },
  { id: 'max', label: 'MAX', Icon: IconMax, color: 'bg-slate-600', hoverColor: 'hover:bg-slate-50', borderColor: 'border-slate-500', textColor: 'text-slate-600' },
  { id: 'phone', label: 'Звонок', Icon: IconPhone, color: 'bg-teal-500', hoverColor: 'hover:bg-teal-50', borderColor: 'border-teal-500', textColor: 'text-teal-600' },
];

/* ---- room options grouped by category ---- */
const ROOM_OPTIONS = [
  {
    group: 'Стандарт',
    rooms: [
      { id: '4', name: 'Стандарт 2-местный' },
      { id: '5', name: 'Стандарт 3-местный' },
    ],
  },
  {
    group: 'Эконом',
    rooms: [
      { id: '1', name: 'Эконом 2-местный' },
      { id: '2', name: 'Эконом 3-местный' },
      { id: '3', name: 'Эконом 4-местный' },
    ],
  },
];

/* ---- calendar helpers ---- */
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
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function isoToDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/* ---- phone formatter ---- */
function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  let formatted = '+7';
  if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
  if (digits.length > 4) formatted += ') ' + digits.slice(4, 7);
  if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
  if (digits.length > 9) formatted += '-' + digits.slice(9, 11);
  return formatted;
}

function formatDateRu(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* =========================================
   SUB-COMPONENT: DateRangeField
   Combined date input with calendar popup
   ========================================= */
function DateRangeField({ checkInDate, checkOutDate, onChange }) {
  const today = new Date().toISOString().split('T')[0];

  const [showCal, setShowCal] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selecting, setSelecting] = useState('in');
  const [calPos, setCalPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef(null);
  const calRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  const calcPos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const calW = 308;
    const calH = 390;
    let top = rect.bottom + 6;
    let left = rect.left;
    if (left + calW > window.innerWidth - 8) left = window.innerWidth - calW - 8;
    if (left < 8) left = 8;
    if (top + calH > window.innerHeight - 8) top = rect.top - calH - 6;
    setCalPos({ top, left });
  };

  useEffect(() => {
    if (!showCal) return;
    const handleOutside = (e) => {
      if (
        calRef.current && !calRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setShowCal(false);
        setSelecting('in');
      }
    };
    const handleRepos = () => calcPos();
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('scroll', handleRepos, true);
    window.addEventListener('resize', handleRepos);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', handleRepos, true);
      window.removeEventListener('resize', handleRepos);
    };
  }, [showCal]);

  const openCal = () => {
    calcPos();
    setSelecting('in');
    setShowCal((v) => !v);
  };

  const applyDates = (ci, co) => {
    onChange(ci, co);
  };

  const handleDayClick = (iso) => {
    if (selecting === 'out' && checkInDate && iso > checkInDate) {
      applyDates(checkInDate, iso);
      setSelecting('in');
      setShowCal(false);
    } else {
      onChange(iso, '');
      setSelecting('out');
    }
  };

  const handleManualChange = (e) => {
    const val = e.target.value;
    setManualInput(val);
    const { checkIn, checkOut } = parseRangeInput(val);
    if (checkIn && checkOut && checkIn <= checkOut) applyDates(checkIn, checkOut);
  };

  const handleManualBlur = () => {
    if (!manualInput) return;
    const { checkIn, checkOut } = parseRangeInput(manualInput);
    if (checkIn && checkOut && checkIn <= checkOut) applyDates(checkIn, checkOut);
    setManualInput('');
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const displayValue =
    checkInDate && checkOutDate
      ? `${toShort(checkInDate)}-${toShort(checkOutDate)}`
      : checkInDate
      ? `${toShort(checkInDate)}-...`
      : '';

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDow = getFirstDayOfWeek(calYear, calMonth);
  const inDate = isoToDate(checkInDate);
  const outDate = isoToDate(checkOutDate);

  const calendarEl = showCal && mounted ? (
    <div
      ref={calRef}
      style={{ position: 'fixed', top: calPos.top, left: calPos.left, zIndex: 99999, width: 308 }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4"
    >
      <div className="flex items-center justify-between mb-3">
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
          const isCI = iso === checkInDate;
          const isCO = iso === checkOutDate;
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

      <div className="mt-3 border-t border-slate-100 pt-3">
        <input
          type="text"
          placeholder="21.02.26-23.02.26"
          value={manualInput}
          onChange={handleManualChange}
          onBlur={handleManualBlur}
          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-700"
        />
        <p className="text-[10px] text-slate-400 mt-1 text-center">формат: ДД.ММ.ГГ-ДД.ММ.ГГ</p>
      </div>
    </div>
  ) : null;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        <Calendar className="w-4 h-4 inline mr-1" />
        Дата заезда — выезда
      </label>
      <div className="flex items-stretch gap-0">
        <input
          type="text"
          value={manualInput || displayValue}
          onChange={handleManualChange}
          onBlur={handleManualBlur}
          onFocus={() => { if (!showCal) { calcPos(); setShowCal(true); } }}
          placeholder="21.02.26-23.02.26"
          className="flex-1 px-4 py-3 border border-r-0 border-slate-300 rounded-l-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
        <button
          ref={triggerRef}
          type="button"
          onClick={openCal}
          className={[
            'px-3 border border-l-0 border-slate-300 rounded-r-xl bg-white hover:bg-slate-50 transition-colors',
            showCal ? 'border-primary-500 ring-2 ring-primary-100' : '',
          ].join(' ')}
          aria-label="Открыть календарь"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
        </button>
      </div>
      {mounted && createPortal(calendarEl, document.body)}
    </div>
  );
}

/* =========================================
   SUB-COMPONENT: RoomSelect
   Dropdown grouped by Standard / Economy
   ========================================= */
function RoomSelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        <Users className="w-4 h-4 inline mr-1" />
        Номер
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
      >
        <option value="">— Выберите номер —</option>
        {ROOM_OPTIONS.map(({ group, rooms }) => (
          <optgroup key={group} label={`── ${group} ──`}>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

/* =========================================
   MAIN COMPONENT: BookingRequestForm
   ========================================= */
export default function BookingRequestForm() {
  const booking = useStore(bookingStore);
  const nights = useStore(numberOfNights);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(booking.checkInDate || today);
  const [checkOutDate, setCheckOutDate] = useState(booking.checkOutDate || tomorrow);
  const [selectedRoomId, setSelectedRoomId] = useState(booking.selectedRoomId || '');
  const [roomPricePerNight, setRoomPricePerNight] = useState(booking.selectedRoomPrice || 0);
  const [contactMethod, setContactMethod] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('+7');
  const [wishes, setWishes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (booking.checkInDate) setCheckInDate(booking.checkInDate);
    if (booking.checkOutDate) setCheckOutDate(booking.checkOutDate);
  }, [booking.checkInDate, booking.checkOutDate]);

  useEffect(() => {
    if (booking.selectedRoomId) setSelectedRoomId(booking.selectedRoomId);
    if (booking.selectedRoomPrice) setRoomPricePerNight(booking.selectedRoomPrice);
  }, [booking.selectedRoomId, booking.selectedRoomPrice]);

  useEffect(() => {
    if (booking.selectedRoomName) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(t);
    }
  }, [booking.selectedRoomName, booking.selectedRoomId]);

  const handleDatesChange = (ci, co) => {
    setCheckInDate(ci);
    setCheckOutDate(co);
    updateBooking({ checkInDate: ci, checkOutDate: co });
    setErrors((e) => ({ ...e, dates: undefined }));
  };

  const handleRoomChange = (roomId) => {
    setSelectedRoomId(roomId);
    const allRooms = ROOM_OPTIONS.flatMap((g) => g.rooms);
    const found = allRooms.find((r) => r.id === roomId);
    const roomData = ROOMS_DATA.find((r) => r.id === roomId);
    const price = roomData ? roomData.base_price : 0;
    setRoomPricePerNight(price);
    updateBooking({ selectedRoomId: roomId || null, selectedRoomName: found ? found.name : '', selectedRoomPrice: price });
    setErrors((e) => ({ ...e, room: undefined }));
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 0) { setPhone('+7'); return; }
    const digits = raw.startsWith('7') ? raw : '7' + raw;
    if (digits.length <= 11) setPhone(formatPhone(digits));
  };

  const localNights = (() => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = new Date(checkOutDate) - new Date(checkInDate);
    return Math.max(0, Math.ceil(diff / 86400000));
  })();

  const validate = () => {
    const errs = {};
    if (!checkInDate || !checkOutDate) errs.dates = 'Укажите даты заезда и выезда';
    if (!selectedRoomId) errs.room = 'Выберите номер';
    if (!contactMethod) errs.contactMethod = 'Выберите способ связи';
    if (!guestName.trim()) errs.guestName = 'Укажите ваше имя';
    if (phone.replace(/\D/g, '').length < 11) errs.phone = 'Введите полный номер телефона';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const allRooms = ROOM_OPTIONS.flatMap((g) => g.rooms);
  const selectedRoom = allRooms.find((r) => r.id === selectedRoomId);

  const totalCost = roomPricePerNight * Math.max(localNights, 0);

  const buildMessage = () => {
    const lines = [
      'Заявка на бронирование',
      '',
      `Имя: ${guestName.trim()}`,
      `Телефон: ${phone}`,
      `Номер: ${selectedRoom ? selectedRoom.name : 'Не выбран'}`,
      `Заезд: ${formatDateRu(checkInDate)}`,
      `Выезд: ${formatDateRu(checkOutDate)}`,
      `Ночей: ${localNights}`,
    ];
    if (totalCost > 0) lines.push(`Сумма: ${totalCost.toLocaleString('ru-RU')} ₽`);
    if (wishes.trim()) lines.push(`Пожелания: ${wishes.trim()}`);
    return lines.join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const msg = buildMessage();
    const enc = encodeURIComponent(msg);

    if (contactMethod === 'whatsapp') window.open(`${CONTACT_LINKS.whatsapp}?text=${enc}`, '_blank');
    else if (contactMethod === 'telegram') window.open(CONTACT_LINKS.telegram, '_blank');
    else if (contactMethod === 'max') window.open(CONTACT_LINKS.max, '_blank');
    else if (contactMethod === 'phone') window.open(CONTACT_LINKS.phone, '_self');

    if (wishes.trim()) updateBooking({ wishes: wishes.trim() });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const selectedMethod = CONTACT_METHODS.find((m) => m.id === contactMethod);

  if (submitted) {
    return (
      <section id="booking-request" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Заявка отправлена</h3>
            <p className="text-slate-600 text-lg">
              Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-request" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Оставить заявку</h2>
          <p className="text-lg text-slate-600">
            Заполните форму и мы свяжемся с вами для подтверждения бронирования
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-6 md:p-10 shadow-lg space-y-8">

          {/* ---- price summary banner ---- */}
          {selectedRoomId && localNights > 0 && roomPricePerNight > 0 && (
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-sm font-medium text-primary-200 mb-1 uppercase tracking-wide">Итоговая стоимость</p>
              <p className="text-4xl font-bold mb-3">
                {totalCost.toLocaleString('ru-RU')} ₽
              </p>
              <div className="flex items-center gap-2 text-primary-100 text-sm">
                <span>{localNights}</span>
                <span>{localNights === 1 ? 'ночь' : localNights < 5 ? 'ночи' : 'ночей'}</span>
                <span>×</span>
                <span>{roomPricePerNight.toLocaleString('ru-RU')} ₽</span>
                <span className="text-primary-300">/ ночь</span>
              </div>
              {booking.selectedRoomName && (
                <p className="text-primary-200 text-xs mt-2">{booking.selectedRoomName}</p>
              )}
            </div>
          )}

          {/* ---- booking params: dates + room ---- */}
          <div className="space-y-5">
            <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Параметры бронирования
            </p>

            {/* dates */}
            <DateRangeField
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onChange={handleDatesChange}
            />
            {errors.dates && (
              <p className="text-red-500 text-sm flex items-center gap-1 -mt-3">
                <AlertCircle className="w-4 h-4" /> {errors.dates}
              </p>
            )}

            {/* nights summary */}
            {checkInDate && checkOutDate && localNights > 0 && (
              <p className="text-xs text-slate-500 -mt-2">
                {localNights}{' '}
                {localNights === 1 ? 'ночь' : localNights < 5 ? 'ночи' : 'ночей'} — с{' '}
                {new Date(checkInDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} по{' '}
                {new Date(checkOutDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </p>
            )}

            {/* room dropdown */}
            <div className={highlight ? 'ring-2 ring-accent-400 rounded-xl' : ''}>
              <RoomSelect value={selectedRoomId} onChange={handleRoomChange} />
            </div>
            {errors.room && (
              <p className="text-red-500 text-sm flex items-center gap-1 -mt-3">
                <AlertCircle className="w-4 h-4" /> {errors.room}
              </p>
            )}
          </div>

          {/* ---- contact method ---- */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Как с вами связаться?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONTACT_METHODS.map((method) => {
                const Icon = method.Icon;
                const isSelected = contactMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => { setContactMethod(method.id); setErrors((e) => ({ ...e, contactMethod: undefined })); }}
                    className={[
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      isSelected
                        ? `${method.borderColor} bg-white shadow-md scale-105`
                        : `border-slate-200 bg-white ${method.hoverColor} hover:border-slate-300`,
                    ].join(' ')}
                  >
                    <div className={`w-10 h-10 rounded-full ${isSelected ? method.color : 'bg-slate-100'} flex items-center justify-center transition-colors`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <span className={`text-xs font-semibold ${isSelected ? method.textColor : 'text-slate-600'}`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.contactMethod && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.contactMethod}
              </p>
            )}
          </div>

          {/* ---- name + phone ---- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Ваше имя
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => { setGuestName(e.target.value); setErrors((err) => ({ ...err, guestName: undefined })); }}
                placeholder="Иван Иванов"
                className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${errors.guestName ? 'border-red-400' : 'border-slate-300'}`}
              />
              {errors.guestName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.guestName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <IconPhone className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__"
                className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-slate-300'}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* ---- wishes ---- */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Дополнительные пожелания
            </label>
            <textarea
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              rows="3"
              placeholder="Хотел бы тихий номер на втором этаже с видом на море..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
            />
          </div>

          {/* ---- submit ---- */}
          <button
            type="submit"
            className={[
              'w-full font-bold text-lg py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl text-white flex items-center justify-center gap-3',
              selectedMethod ? selectedMethod.color : 'bg-accent-500 hover:bg-accent-600',
            ].join(' ')}
          >
            {selectedMethod ? (
              <>
                {(() => { const Icon = selectedMethod.Icon; return <Icon className="w-5 h-5" />; })()}
                Забронировать через {selectedMethod.label}
              </>
            ) : (
              'Забронировать'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
