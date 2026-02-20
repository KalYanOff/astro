/* =========================================
   COMPONENT: RoomCard
   Wide card: photo slider with price badge + CTA badge,
   vertical amenity list, total price in footer
   ========================================= */
import { useState, useCallback } from 'react';
import { Share2, Users, Wifi, Wind, Snowflake, Tv, Droplet, ChevronLeft, ChevronRight, Flame, AlertCircle } from 'lucide-react';
import { updateBooking } from '../../stores/bookingStore';

const AMENITY_ICONS = {
  'Wi-Fi': Wifi,
  'Вентиляторы': Wind,
  'Кондиционер': Snowflake,
  'Телевизор': Tv,
  'Индивидуальный санузел': Droplet,
  'Душ и туалет общего пользования': Droplet,
};

/*
  CTA_BADGES — promotional labels per room id.
  Edit here to add/change/remove badges for any room.
  Set to null to show no badge for that room.
  Supported icons: 'flame', 'alert'
*/
const CTA_BADGES = {
  '1': null,
  '2': { label: 'Осталось 2 номера', icon: 'alert', color: 'bg-red-500' },
  '3': { label: 'Популярный', icon: 'flame', color: 'bg-accent-500' },
  '4': { label: 'Популярный', icon: 'flame', color: 'bg-accent-500' },
  '5': { label: 'Осталось 2 номера', icon: 'alert', color: 'bg-red-500' },
};

export default function RoomCard({ room, nights }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const images =
    room.images && room.images.length > 0
      ? room.images
      : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const badge = CTA_BADGES[room.id] ?? null;
  const totalPrice = room.base_price * (nights || 1);

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

  const handleBooking = () => {
    updateBooking({ selectedRoomId: room.id, selectedRoomName: room.name });
    const el = document.querySelector('#booking-request');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const guestsLabel =
    room.capacity === 1
      ? '1 гость'
      : room.capacity < 5
      ? `${room.capacity} гостя`
      : `${room.capacity} гостей`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">

      {/* ---- photo slider ---- */}
      <div className="relative h-64 flex-shrink-0 overflow-hidden">

        {/* slider track: width = 100% * count, each slide = 100% / count */}
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

        {/* top-left: CTA badge */}
        {badge && (
          <div
            className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 ${badge.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}
          >
            {badge.icon === 'flame' && <Flame className="w-3.5 h-3.5" />}
            {badge.icon === 'alert' && <AlertCircle className="w-3.5 h-3.5" />}
            {badge.label}
          </div>
        )}

        {/* top-right: share */}
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform"
          aria-label="Поделиться"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
        </button>

        {/* bottom-right: price badge */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 text-right leading-none">
          <span className="block text-[10px] text-white/70 mb-1">от</span>
          <span className="block text-lg font-bold text-white">
            {room.base_price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="block text-[10px] text-white/70 mt-1">/ ночь</span>
        </div>

        {/* slider arrows + dots */}
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

        {/* amenities: vertical single-column list */}
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

        {/* footer: total + book button */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          {nights > 0 && (
            <p className="text-sm text-slate-500 mb-3">
              Итого за {nights}{' '}
              {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}:{' '}
              <span className="font-bold text-slate-800">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </span>
            </p>
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
