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
    price_periods: [
      { id: 'low', label: 'Низкий сезон', start: '2026-01-01', end: '2026-05-31', price: 1000 },
      { id: 'high', label: 'Высокий сезон', start: '2026-06-01', end: '2026-08-31', price: 1400 },
      { id: 'mid', label: 'Бархатный сезон', start: '2026-09-01', end: '2026-12-31', price: 1200 },
    ],
    amenities: ['Душ и туалет общего пользования', 'Вентиляторы', 'Wi-Fi', 'Постельное белье'],
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'Уютный эконом-номер для двоих с базовыми удобствами',
  },
  {
    id: '2',
    name: 'Эконом 3-местный',
    category: 'econom',
    capacity: 3,
    base_price: 1200,
    price_periods: [
      { id: 'low', label: 'Низкий сезон', start: '2026-01-01', end: '2026-05-31', price: 1200 },
      { id: 'high', label: 'Высокий сезон', start: '2026-06-01', end: '2026-08-31', price: 1700 },
      { id: 'mid', label: 'Бархатный сезон', start: '2026-09-01', end: '2026-12-31', price: 1450 },
    ],
    amenities: ['Душ и туалет общего пользования', 'Вентиляторы', 'Wi-Fi', 'Постельное белье'],
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'Комфортный эконом-номер для небольшой компании',
  },
  {
    id: '3',
    name: 'Эконом 4-местный',
    category: 'econom',
    capacity: 4,
    base_price: 1500,
    price_periods: [
      { id: 'low', label: 'Низкий сезон', start: '2026-01-01', end: '2026-05-31', price: 1500 },
      { id: 'high', label: 'Высокий сезон', start: '2026-06-01', end: '2026-08-31', price: 2100 },
      { id: 'mid', label: 'Бархатный сезон', start: '2026-09-01', end: '2026-12-31', price: 1800 },
    ],
    amenities: ['Душ и туалет общего пользования', 'Вентиляторы', 'Wi-Fi', 'Постельное белье'],
    images: [
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'Просторный эконом-номер для семьи или компании друзей',
  },
  {
    id: '4',
    name: 'Стандарт 2-местный',
    category: 'standard',
    capacity: 2,
    base_price: 1500,
    price_periods: [
      { id: 'low', label: 'Низкий сезон', start: '2026-01-01', end: '2026-05-31', price: 1500 },
      { id: 'high', label: 'Высокий сезон', start: '2026-06-01', end: '2026-08-31', price: 2200 },
      { id: 'mid', label: 'Бархатный сезон', start: '2026-09-01', end: '2026-12-31', price: 1800 },
    ],
    amenities: ['Индивидуальный санузел', 'Кондиционер', 'Холодильник', 'Телевизор', 'Wi-Fi', 'Постельное белье'],
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    description: 'Комфортабельный стандартный номер с удобствами',
  },
  {
    id: '5',
    name: 'Стандарт 3-местный',
    category: 'standard',
    capacity: 3,
    base_price: 1800,
    price_periods: [
      { id: 'low', label: 'Низкий сезон', start: '2026-01-01', end: '2026-05-31', price: 1800 },
      { id: 'high', label: 'Высокий сезон', start: '2026-06-01', end: '2026-08-31', price: 2600 },
      { id: 'mid', label: 'Бархатный сезон', start: '2026-09-01', end: '2026-12-31', price: 2200 },
    ],
    amenities: ['Индивидуальный санузел', 'Кондиционер', 'Холодильник', 'Телевизор', 'Wi-Fi', 'Постельное белье'],
    images: [
      'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
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

  const setCategory = (category) =>
    setFilter((f) => ({
      category,
      capacity: null, // авто‑сброс количества гостей при смене категории
    }));
  const setCapacity = (capacity) =>
    setFilter((f) => ({ ...f, capacity: f.capacity === capacity ? null : capacity }));

  const filteredRooms = filterRooms(ROOMS_DATA, filter);

  return (
    <section id="rooms" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">

        {/* section header */}
        <div className="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
            </svg>
            Комнаты и цены
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Наши комнаты</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Выберите комфортный вариант для вашего отдыха
          </p>

        </div>

        {/* filter bar */
        <div className="flex flex-col items-stretch md:items-center gap-8 mb-10">

          {/* row 1: category filters */}
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:justify-center w-full md:w-auto">
            {[
              { value: 'all', label: 'Все комнаты' },
              { value: 'econom', label: 'Эконом' },
              { value: 'standard', label: 'Стандарт' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`w-full px-4 py-3 rounded-2xl font-medium text-center transform transition-all duration-200 ease-out active:scale-95 ${
                  filter.category === value && filter.capacity === null
                    ? 'bg-primary-600 text-white shadow-lg scale-105 ring-2 ring-primary-300'
                    : filter.category === value
                    ? 'bg-primary-100 text-primary-700 shadow scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                } md:w-auto md:px-6 md:py-3 md:rounded-full`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* row 2: capacity filters */}
          <div className="grid grid-cols-3 gap-3 md:flex md:flex-row md:justify-center md:items-center w-full md:w-auto">
            {CAPACITY_FILTERS.map((cap) => (
              <button
                key={cap}
                onClick={() => setCapacity(cap)}
                className={`w-full px-4 py-3 rounded-2xl font-medium text-sm text-center transform transition-all duration-200 ease-out active:scale-95 ${
                  filter.capacity === cap
                    ? 'bg-accent-500 text-white shadow-lg scale-105 ring-2 ring-accent-300'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                } md:w-auto md:px-5 md:py-2.5 md:rounded-full`}
              >
                {cap} {cap === 1 ? 'гость' : cap < 5 ? 'гостя' : 'гостей'}
              </button>
            ))}
          </div>
        </div>

        /* room grid or empty state */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-slate-500">
              Нет комнат с выбранными параметрами
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
          * Все наши комнаты оформлены в индивидуальном дизайне для вашего комфорта. При бронировании выбранный интерьер не гарантируется, но мы всегда стараемся учитывать ваши пожелания!
        </p>
      </div>
    </section>
  );
}
