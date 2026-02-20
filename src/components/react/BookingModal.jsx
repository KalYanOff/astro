/* =========================================
   COMPONENT: BookingModal
   Full-screen modal for booking (opened via 'openBookingModal' event)
   booking-modal-overlay: dark backdrop (click to close)
   booking-modal-card: white form card
   booking-modal-form: check-in / check-out / guests / wishes fields
   ========================================= */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { updateBooking } from '../../stores/bookingStore';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      checkInDate: '',
      checkOutDate: '',
      guestsCount: 2,
      wishes: 'Хотелось бы комнату с картиной зебры | Можно ли организовать трансфер?...',
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openBookingModal', handleOpen);
    return () => window.removeEventListener('openBookingModal', handleOpen);
  }, []);

  const handleClose = () => setIsOpen(false);

  const onSubmit = (data) => {
    updateBooking({
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      guestsCount: parseInt(data.guestsCount),
      wishes: data.wishes,
    });

    handleClose();

    setTimeout(() => {
      const roomsSection = document.querySelector('#rooms');
      if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Закрыть"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Проверить свободные комнаты
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Дата заезда
            </label>
            <input
              type="date"
              min={today}
              {...register('checkInDate', { required: 'Укажите дату заезда' })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            {errors.checkInDate && (
              <p className="text-red-500 text-sm mt-1">{errors.checkInDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Дата выезда
            </label>
            <input
              type="date"
              min={tomorrow}
              {...register('checkOutDate', { required: 'Укажите дату выезда' })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            {errors.checkOutDate && (
              <p className="text-red-500 text-sm mt-1">{errors.checkOutDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Количество гостей
            </label>
            <select
              {...register('guestsCount')}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="2">2 человека</option>
              <option value="3">3 человека</option>
              <option value="4">4 человека</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Пожелания к комнате
            </label>
            <textarea
              {...register('wishes')}
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg"
          >
            Посмотреть свободные комнаты
          </button>
        </form>
      </div>
    </div>
  );
}
