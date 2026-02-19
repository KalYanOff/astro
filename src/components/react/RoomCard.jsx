/* =========================================
   COMPONENT: RoomCard
   Single room card with image carousel, amenities, price, book button
   room-card-swiper: image carousel (Swiper)
   room-card-share: native share button
   room-card-info: name, capacity, category badge
   room-card-amenities: icon grid of up to 4 amenities
   room-card-price: total price based on nights
   room-card-book: booking CTA button
   ========================================= */
import { useState } from 'react';
import { Share2, Users, Wifi, Wind, Snowflake, Tv, Droplet } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RoomCard({ room, nights }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const amenityIcons = {
    'Wi-Fi': Wifi,
    'Вентиляторы': Wind,
    'Кондиционер': Snowflake,
    'Телевизор': Tv,
    'Индивидуальный санузел': Droplet,
    'Душ и туалет общего пользования': Droplet,
  };

  const totalPrice = room.base_price * nights;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.name,
          text: room.description,
          url: window.location.href + '#room-' + room.id,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const handleBooking = async () => {
    alert('Функция бронирования будет добавлена в следующем этапе');
  };

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="h-64"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${room.name} - фото ${index + 1}`}
                className="w-full h-64 object-cover cursor-pointer"
                onClick={() => {
                  setLightboxIndex(index);
                  setShowLightbox(true);
                }}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>

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
              {totalPrice.toLocaleString('ru-RU')} ₽
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
