/* =========================================
   SECTION: RoomsList  #rooms
   Shows filter tabs + room cards grid (static data)
   ========================================= */
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { bookingStore, numberOfNights } from '../../stores/bookingStore';
import RoomCard from './RoomCard';

const ROOMS_DATA = [
  {
    id: '1',
    name: 'Эконом 2-местный',
    category: 'econom',
    capacity: 2,
    base_price: 1000,
    amenities: ['Душ и туалет общего пользования', 'Вентиляторы', 'Wi-Fi', 'Постельное белье'],
    images: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'],
    description: 'Уютный эконом-номер для двоих с базовыми удобствами',
  },
  {
    id: '2',
    name: 'Эконом 3-местный',
    category: 'econom',
    capacity: 3,
    base_price: 1200,
    amenities: ['Душ и туалет общего пользования', 'Вентиляторы', 'Wi-Fi', 'Постельное белье'],
    images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'],
    description: 'Комфортный эконом-номер для небольшой компании',
  },
  {
    id: '3',
    name: 'Эконом 4-местный',
    category: 'econom',
    capacity: 4,
    base_price: 1500,
    amenities: ['Душ и туалет общего пользования', 'Вентиляторы', 'Wi-Fi', 'Постельное белье'],
    images: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800'],
    description: 'Просторный эконом-номер для семьи или компании друзей',
  },
  {
    id: '4',
    name: 'Стандарт 2-местный',
    category: 'standard',
    capacity: 2,
    base_price: 1500,
    amenities: ['Индивидуальный санузел', 'Кондиционер', 'Холодильник', 'Телевизор', 'Wi-Fi', 'Постельное белье'],
    images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'],
    description: 'Комфортабельный стандартный номер с удобствами',
  },
  {
    id: '5',
    name: 'Стандарт 3-местный',
    category: 'standard',
    capacity: 3,
    base_price: 1800,
    amenities: ['Индивидуальный санузел', 'Кондиционер', 'Холодильник', 'Телевизор', 'Wi-Fi', 'Постельное белье'],
    images: ['https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800'],
    description: 'Просторный стандартный номер для троих гостей',
  },
];

export default function RoomsList() {
  const [filter, setFilter] = useState('all');
  const booking = useStore(bookingStore);
  const nights = useStore(numberOfNights);

  const filteredRooms = ROOMS_DATA.filter((room) => {
    const categoryMatch = filter === 'all' || room.category === filter;
    const capacityMatch = !booking.guestsCount || room.capacity === booking.guestsCount;
    return categoryMatch && capacityMatch;
  });

  return (
    <section id="rooms" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Наши номера</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Выберите комфортный номер для вашего отдыха
          </p>
          {booking.checkInDate && booking.checkOutDate && (
            <div className="mt-4 inline-block bg-primary-100 text-primary-800 px-6 py-3 rounded-full">
              <p className="font-semibold">
                {new Date(booking.checkInDate).toLocaleDateString('ru-RU')} - {new Date(booking.checkOutDate).toLocaleDateString('ru-RU')} • {booking.guestsCount} {booking.guestsCount === 1 ? 'гость' : booking.guestsCount < 5 ? 'гостя' : 'гостей'}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Все номера
          </button>
          <button
            onClick={() => setFilter('econom')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              filter === 'econom'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Эконом
          </button>
          <button
            onClick={() => setFilter('standard')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              filter === 'standard'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Стандарт
          </button>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">
              К сожалению, нет номеров с выбранными параметрами
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
              <div
                key={room.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-in"
              >
                <RoomCard room={room} nights={nights} />
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-12">
          * Интерьер номеров может незначительно отличаться от фотографий
        </p>
      </div>
    </section>
  );
}
