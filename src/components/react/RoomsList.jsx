import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { bookingStore, numberOfNights } from '../../stores/bookingStore';
import { supabase } from '../../lib/supabase';
import RoomCard from './RoomCard';

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const booking = useStore(bookingStore);
  const nights = useStore(numberOfNights);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const categoryMatch = filter === 'all' || room.category === filter;
    const capacityMatch = !booking.guestsCount || room.capacity >= booking.guestsCount;
    return categoryMatch && capacityMatch;
  });

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Загрузка номеров...</div>
        </div>
      </section>
    );
  }

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
