import { useState } from 'react';
import { Share2, Users, Wifi, Wind, Snowflake, Tv, Droplet, ChevronLeft, ChevronRight } from 'lucide-react';
import { updateBooking } from '../../stores/bookingStore';

const amenityIcons = {
  'Wi-Fi': Wifi,
  'Вентиляторы': Wind,
  'Кондиционер': Snowflake,
  'Телевизор': Tv,
  'Индивидуальный санузел': Droplet,
  'Душ и туалет общего пользования': Droplet,
};

export default function RoomCard({ room, nights }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const totalPrice = room.base_price * nights;

  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.name,
          text: room.description,
          url: window.location.href + '#room-' + room.id,
        });
      } catch (err) {}
    }
  };

  const handleBooking = () => {
    updateBooking({
      selectedRoomId: room.id,
      selectedRoomName: room.name,
    });
    const el = document.querySelector('#booking-request');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${room.name} - фото ${index + 1}`}
              className="w-full h-64 object-cover cursor-pointer flex-shrink-0"
              onClick={() => {
                setLightboxIndex(index);
                setShowLightbox(true);
              }}
              loading="lazy"
            />
          ))}
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
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setActiveSlide(index); }}
                  className={`rounded-full transition-all duration-200 ${
                    index === activeSlide
                      ? 'w-4 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Фото ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={handleShare}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          aria-label="Поделиться"
        >
          <Share2 className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{room.name}</h3>
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">До {room.capacity} гостей</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            room.category === 'standard'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {room.category === 'standard' ? 'Стандарт' : 'Эконом'}
          </span>
        </div>

        <p className="text-sm text-slate-600 mb-4">{room.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {room.amenities && room.amenities.slice(0, 4).map((amenity, index) => {
            const Icon = amenityIcons[amenity] || Wifi;
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                <Icon className="w-4 h-4 text-primary-600" />
                <span className="truncate">{amenity}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500">Стоимость</p>
            <p className="text-3xl font-bold text-primary-600">
              {totalPrice.toLocaleString('ru-RU')} &#8381;
            </p>
            <p className="text-xs text-slate-500">за {nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</p>
          </div>
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg"
        >
          Забронировать номер
        </button>
      </div>
    </div>
  );
}
