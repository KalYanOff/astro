/* =========================================
   COMPONENT: RoomsList
   Section #rooms — filter bar + responsive grid of RoomCard
   Capacity filter: exact match only (2, 3, or 4 people)
   ========================================= */
import { useState } from 'react';
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

export { ROOMS_DATA };

/* Capacity filters: exact person counts available in ROOMS_DATA */
const CAPACITY_FILTERS = [2, 3, 4];

/*
  Filter state shape:
    category: 'all' | 'econom' | 'standard'
    capacity: null | 2 | 3 | 4   (null = no capacity filter)
*/
const INITIAL_FILTER = { category: 'all', capacity: null };

function filterRooms(rooms, { category, capacity }) {
  return rooms.filter((room) => {
    const categoryOk = category === 'all' || room.category === category;
    /* Exact match: capacity filter shows only rooms with that exact seat count */
    const capacityOk = capacity === null || room.capacity === capacity;
    return categoryOk && capacityOk;
  });
}

export default function RoomsList() {
  const [filter, setFilter] = useState(INITIAL_FILTER);

  const setCategory = (category) => setFilter((f) => ({ ...f, category }));
  const setCapacity = (capacity) =>
    setFilter((f) => ({ ...f, capacity: f.capacity === capacity ? null : capacity }));

  const filteredRooms = filterRooms(ROOMS_DATA, filter);

  return (
    <section id="rooms" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">

        {/* section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Наши номера</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Выберите комфортный номер для вашего отдыха
          </p>

        </div>

        {/* filter bar */}
        <div className="flex flex-col items-center gap-3 mb-10">

          {/* row 1: category filters — horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex justify-start md:justify-center gap-3 px-1 min-w-max md:min-w-0">
              {[
                { value: 'all', label: 'Все номера' },
                { value: 'econom', label: 'Эконом' },
                { value: 'standard', label: 'Стандарт' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all ${
                    filter.category === value && filter.capacity === null
                      ? 'bg-primary-600 text-white shadow-lg'
                      : filter.category === value
                      ? 'bg-primary-100 text-primary-700 shadow'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* row 2: capacity filters — horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex justify-start md:justify-center items-center gap-3 px-1 min-w-max md:min-w-0">
              <span className="flex-shrink-0 text-sm text-slate-400 font-medium">Гостей:</span>
              {CAPACITY_FILTERS.map((cap) => (
                <button
                  key={cap}
                  onClick={() => setCapacity(cap)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                    filter.capacity === cap
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cap} {cap === 1 ? 'гость' : cap < 5 ? 'гостя' : 'гостей'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* room grid or empty state */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-slate-500">
              Нет номеров с выбранными параметрами
            </p>
            <button
              onClick={() => setFilter(INITIAL_FILTER)}
              className="mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition-all"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <div
                key={room.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className="animate-fade-in"
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-slate-400 mt-12">
          * Интерьер номеров может незначительно отличаться от фотографий
        </p>
      </div>
    </section>
  );
}
