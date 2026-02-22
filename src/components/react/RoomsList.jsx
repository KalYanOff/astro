/* =========================================
   COMPONENT: RoomsList
   Section #rooms — filter bar + responsive grid of RoomCard
   Capacity filter: exact match only (2, 3, or 4 people)
   ========================================= */
import { useState } from 'react';
import RoomCard from './RoomCard';
import { applyPricingToRoom } from '../../config/roomPricing';

const RAW_ROOMS_DATA = [
  {
    id: '2-113',
    name: 'Стандарт для двоих',
    category: 'standart',
    capacity: 2,
    images: [
      'img/rooms/standart/2/13-1.webp',
      'img/rooms/standart/2/13-2.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Двухместный стандарт 12 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

  {
    id: '2-114',
    name: 'Стандарт для двоих',
    category: 'standart',
    capacity: 2,
    images: [
      'img/rooms/standart/2/14-1.webp',
      'img/rooms/standart/2/14-2.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Двухместный стандарт 12 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

  {
    id: '2-115',
    name: 'Стандарт для двоих',
    category: 'standart',
    capacity: 2,
    images: [
      'img/rooms/standart/2/15-1.webp',
      'img/rooms/standart/2/15-2.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Двухместный стандарт 12 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

  {
    id: '2-112',
    name: 'Стандарт для двоих',
    category: 'standart',
    capacity: 2,
    images: [
      'img/rooms/standart/2/12-1.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Двухместный стандарт 12 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

/* --- СТАНДАРТ 3 --- */

  {
    id: '3-101',
    name: 'Стандарт для троих',
    category: 'standard',
    capacity: 3,
    images: [
      'img/rooms/standart/3/1-1.webp',
      'img/rooms/standart/3/1-2.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Трехместный стандарт 15 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

  {
    id: '3-102',
    name: 'Стандарт для троих',
    category: 'standard',
    capacity: 3,
    images: [
      'img/rooms/standart/3/2-1.webp',
      'img/rooms/standart/3/2-2.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Трехместный стандарт 15 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

  {
    id: '3-103',
    name: 'Стандарт для троих',
    category: 'standard',
    capacity: 3,
    images: [
      'img/rooms/standart/3/3-1.webp',
      'img/rooms/standart/001.webp',
      'img/rooms/standart/002.webp',
    ],
    description: `🛌 Трехместный стандарт 15 м²

❄️ Кондиционер.
🚿 Личный санузел, полотенца, фен по запросу.
🧊 Личный холодильник
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, бра и розетки у изголовья.
☕️ Столик у входа на воздухе — идеален для утреннего кофе.`,
  },

/* --- ЭКОНОМ 2 --- */

  {
    id: '2-1',
    name: 'Эконом для двоих (Double)',
    category: 'econom',
    capacity: 2,
    images: [
      '/img/rooms/econom/2/Беж-1.jpg',
      '/img/rooms/econom/2/Беж-2.jpg',
      '/img/rooms/econom/2/Беж-3.jpg',
    ],
    description: `🛌 Двухместный эконом (Double) 8 м²

❄️ Напольный вентилятор.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200, розетки у изголовья.
🧊 Холодильник общего пользования.
☕️ Персональный столик у входа на воздухе.`,
  },

  {
    id: '2-2',
    name: 'Эконом для двоих (Twin)',
    category: 'econom',
    capacity: 2,
    images: [
      '/img/rooms/econom/2/Серая-1.jpg',
      '/img/rooms/econom/2/Серая-2.jpg',
      '/img/rooms/econom/2/Серая-3.jpg',
    ],
    description: `🛌 Двухместный эконом (Twin) 8 м²

❄️ Напольный вентилятор.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Две кровати 80×200, розетки у изголовья.
🧊 Холодильник общего пользования.
☕️ Персональный столик у входа на воздухе.`,
  },

  {
    id: '2-3',
    name: 'Эконом для двоих (Twin)',
    category: 'econom',
    capacity: 2,
    images: [
      '/img/rooms/econom/2/Сирень-1.jpg',
      '/img/rooms/econom/2/Сирень-2.jpg',
      '/img/rooms/econom/2/Сирень-3.jpg',
    ],
    description: `🛌 Двухместный эконом (Twin) 8 м²

❄️ Напольный вентилятор.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Две кровати 80×200, розетки у изголовья.
🧊 Холодильник общего пользования.
☕️ Персональный столик у входа на воздухе.`,
  },

  {
    id: '2-4',
    name: 'Эконом для двоих (Double)',
    category: 'econom',
    capacity: 2,
    images: [
      '/img/rooms/econom/2/DSC_0033.jpg',
    ],
    description: `🛌 Двухместный эконом (Double) 8 м²

❄️ Напольный вентилятор.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200, розетки у изголовья.
🧊 Холодильник общего пользования.
☕️ Персональный столик у входа на воздухе.`,
  },

/* --- ЭКОНОМ 3 --- */

  {
    id: '3-1',
    name: 'Эконом для троих',
    category: 'econom',
    capacity: 3,
    images: [
      '/img/rooms/econom/3/Сер-1.jpg',
      '/img/rooms/econom/3/Сер-2.jpg',
    ],
    description: `🛌 Трехместный эконом 12 м²

❄️ Напольный вентилятор.
🧊 Личный холодильник.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, розетки у изголовья.
☕️ Персональный столик у входа на воздухе.`,
  },

  {
    id: '3-2',
    name: 'Эконом для троих',
    category: 'econom',
    capacity: 3,
    images: [
      '/img/rooms/econom/3/БК-2.jpg',
    ],
    description: `🛌 Трехместный эконом 12 м²

❄️ Напольный вентилятор.
🧊 Личный холодильник.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, розетки у изголовья.
☕️ Персональный столик у входа на воздухе.`,
  },

  {
    id: '3-3',
    name: 'Эконом для троих',
    category: 'econom',
    capacity: 3,
    images: [
      '/img/rooms/econom/3/_DSC0017-Улучшено-Ум. шума.jpg',
      '/img/rooms/econom/3/_DSC0019-Улучшено-Ум. шума.jpg',
    ],
    description: `🛌 Трехместный эконом 12 м²

❄️ Напольный вентилятор.
🧊 Личный холодильник.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, розетки у изголовья.
☕️ Персональный столик у входа на воздухе.`,
  },

  {
    id: '3-4',
    name: 'Эконом для троих',
    category: 'econom',
    capacity: 3,
    images: [
      '/img/rooms/econom/3/К4-1.jpg',
      '/img/rooms/econom/3/К4-2.jpg',
      '/img/rooms/econom/3/К4-3.jpg',
    ],
    description: `🛌 Трехместный эконом 12 м²

❄️ Напольный вентилятор.
🧊 Личный холодильник.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + 80×200, розетки у изголовья.
☕️ Персональный столик у входа на воздухе.`,
  },

/* --- ЭКОНОМ 4 --- */

  {
    id: '4-1',
    name: 'Эконом для четверых',
    category: 'econom',
    capacity: 4,
    images: [
        '/img/rooms/econom/4/4м-1.jpg',
        '/img/rooms/econom/4/4м-2.jpg',
    ],
    description: `🛌 Четырехместный эконом 16 м²

❄️ Напольный вентилятор.
🧊 Личный холодильник.
🚿 Санузел общего пользования.
📺 ТВ и стабильный Wi‑Fi.
🛏 Кровать 140×200 + две 80×200, розетки у изголовья.
☕️ Персональный столик у входа на воздухе.`,
  },
];

const ROOMS_DATA = RAW_ROOMS_DATA.map(applyPricingToRoom);

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
              { value: 'standard', label: 'Стандарт' },
              { value: 'econom', label: 'Эконом' },
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
