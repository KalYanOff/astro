/* =========================================
   COMPONENT: RoomCard
   Wide card: photo slider, amenities, CTA
   ========================================= */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Share2,
  Users,
} from 'lucide-react';
import { getNightPrice } from '../../lib/pricing';
import { getTravelLineRoomId } from '../../config/travelline.js';

const CTA_BADGES = {
  'standard-3': { label: 'Популярный', icon: 'flame', color: 'bg-accent-500' },
  'standard-2': { label: 'Осталось 2 комнаты', icon: 'alert', color: 'bg-red-500' },
};

function getGuestsLabel(capacity) {
  if (capacity === 1) return '1 гость';
  if (capacity < 5) return `${capacity} гостя`;
  return `${capacity} гостей`;
}

export default function RoomCard({ room, isActive = false }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartRef = useRef(null);

  const images =
    room.images && room.images.length > 0
      ? room.images
      : ['/img/rooms/standart/001.webp'];

  const badge = CTA_BADGES[room.roomCategoryId] ?? null;
  const tlRoomId = getTravelLineRoomId(room.roomCategoryId);
  const roomAnchor = `room${room.id}`;
  const today = new Date().toISOString().split('T')[0];
  const todayNightPrice = getNightPrice(room, today);

  const goToPrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(
    (event) => {
      event.stopPropagation();
      goToPrevSlide();
    },
    [goToPrevSlide],
  );

  const nextSlide = useCallback(
    (event) => {
      event.stopPropagation();
      goToNextSlide();
    },
    [goToNextSlide],
  );

  const handleTouchStart = useCallback((event) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      if (images.length <= 1 || !touchStartRef.current || event.changedTouches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const isSwipeEnough = Math.abs(deltaX) > 35;
      if (!isHorizontalSwipe || !isSwipeEnough) return;

      if (deltaX > 0) {
        goToPrevSlide();
      } else {
        goToNextSlide();
      }
    },
    [images.length, goToPrevSlide, goToNextSlide],
  );

  const handleShare = async () => {
    const url = `${window.location.origin}/#${roomAnchor}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  useEffect(() => {
    setActiveSlide(0);
  }, [room.id]);

  return (
    <div
      id={roomAnchor}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full ${
        isActive ? 'ring-4 ring-primary-500 bg-primary-100 shadow-2xl border-2 border-primary-400 -translate-y-1' : ''
      }`}
    >
      <div
        className="relative h-64 flex-shrink-0 overflow-hidden"
        onTouchStart={images.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={images.length > 1 ? handleTouchEnd : undefined}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(activeSlide * 100) / images.length}%)`,
          }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${room.name} - фото ${index + 1}`}
              className="h-full object-cover flex-shrink-0"
              style={{ width: `${100 / images.length}%` }}
              loading="lazy"
              decoding="async"
              width="1200"
              height="800"
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
          className="absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform"
          aria-label="Поделиться"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
        </button>

        <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 text-right leading-none">
          <span className="block text-[10px] text-white/70 mb-1">от</span>
          <span className="block text-lg font-bold text-white">
            {todayNightPrice.toLocaleString('ru-RU')} ₽
          </span>
          <span className="block text-[10px] text-white/70 mt-1">/ ночь</span>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all hover:scale-110"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all hover:scale-110"
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveSlide(index);
                  }}
                  className={`min-w-11 min-h-11 flex items-center justify-center rounded-full transition-all duration-200 ${
                    index === activeSlide ? 'bg-black/20' : 'bg-transparent'
                  }`}
                  aria-label={`Фото ${index + 1}`}
                >
                  <span
                    className={`rounded-full transition-all duration-200 ${
                      index === activeSlide ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
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

        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
          <Users className="w-4 h-4" />
          <span>{getGuestsLabel(room.capacity)}</span>
        </div>

        <p className="text-sm text-slate-600 mb-4 whitespace-pre-line">{room.description}</p>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <a
            href="#"
            data-tl-booking-open="true"
            {...(tlRoomId ? { 'data-tl-room': String(tlRoomId) } : {})}
            className="w-full inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg active:scale-95"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </div>
  );
}
