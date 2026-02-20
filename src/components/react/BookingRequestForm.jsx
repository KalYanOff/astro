import { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { bookingStore, numberOfNights, updateBooking } from '../../stores/bookingStore';
import { MessageCircle, Send, Mail, Phone, User, CheckCircle, AlertCircle, Calendar, Users, Pencil, X } from 'lucide-react';

const CONTACT_METHODS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', hoverColor: 'hover:bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-600' },
  { id: 'telegram', label: 'Telegram', icon: Send, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-600' },
  { id: 'email', label: 'Email', icon: Mail, color: 'bg-amber-500', hoverColor: 'hover:bg-amber-50', borderColor: 'border-amber-500', textColor: 'text-amber-600' },
  { id: 'phone', label: 'Звонок', icon: Phone, color: 'bg-teal-500', hoverColor: 'hover:bg-teal-50', borderColor: 'border-teal-500', textColor: 'text-teal-600' },
];

function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  let formatted = '+7';
  if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
  if (digits.length > 4) formatted += ') ' + digits.slice(4, 7);
  if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
  if (digits.length > 9) formatted += '-' + digits.slice(9, 11);
  return formatted;
}

function formatDateRu(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BookingRequestForm() {
  const booking = useStore(bookingStore);
  const nights = useStore(numberOfNights);

  const [contactMethod, setContactMethod] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('+7');
  const [wishes, setWishes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [editingParams, setEditingParams] = useState(false);
  const [editDraft, setEditDraft] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (booking.selectedRoomName) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(t);
    }
  }, [booking.selectedRoomName, booking.selectedRoomId]);

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 0) { setPhone('+7'); return; }
    const digits = raw.startsWith('7') ? raw : '7' + raw;
    if (digits.length <= 11) setPhone(formatPhone(digits));
  };

  const validate = () => {
    const errs = {};
    if (!contactMethod) errs.contactMethod = 'Выберите способ связи';
    if (!guestName.trim()) errs.guestName = 'Укажите ваше имя';
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 11) errs.phone = 'Введите полный номер телефона';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildMessage = () => {
    const lines = [
      `Заявка на бронирование`,
      ``,
      `Имя: ${guestName.trim()}`,
      `Телефон: ${phone}`,
      `Номер: ${booking.selectedRoomName || 'Не выбран'}`,
      `Заезд: ${formatDateRu(booking.checkInDate)}`,
      `Выезд: ${formatDateRu(booking.checkOutDate)}`,
      `Ночей: ${nights}`,
      `Гостей: ${booking.guestsCount}`,
    ];
    if (wishes.trim()) lines.push(`Пожелания: ${wishes.trim()}`);
    return lines.join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const msg = buildMessage();
    const encodedMsg = encodeURIComponent(msg);
    const hotelPhone = '79181929931';

    if (contactMethod === 'whatsapp') {
      window.open(`https://wa.me/${hotelPhone}?text=${encodedMsg}`, '_blank');
    } else if (contactMethod === 'telegram') {
      window.open(`https://t.me/+${hotelPhone}`, '_blank');
    } else if (contactMethod === 'email') {
      const subject = encodeURIComponent('Заявка на бронирование — Отель Дельфин');
      window.open(`mailto:info@delfinstay.ru?subject=${subject}&body=${encodedMsg}`, '_blank');
    } else if (contactMethod === 'phone') {
      window.open(`tel:+${hotelPhone}`, '_self');
    }

    if (wishes.trim()) {
      updateBooking({ wishes: wishes.trim() });
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const selectedMethod = CONTACT_METHODS.find(m => m.id === contactMethod);

  if (submitted) {
    return (
      <section id="booking-request" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Заявка отправлена</h3>
            <p className="text-slate-600 text-lg">
              Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-request" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Оставить заявку</h2>
          <p className="text-lg text-slate-600">
            Заполните форму и мы свяжемся с вами для подтверждения бронирования
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-slate-50 rounded-2xl p-6 md:p-10 shadow-lg space-y-8"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Как с вами связаться?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONTACT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = contactMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => { setContactMethod(method.id); setErrors(prev => ({ ...prev, contactMethod: undefined })); }}
                    className={[
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      isSelected
                        ? `${method.borderColor} bg-white shadow-md scale-105`
                        : `border-slate-200 bg-white ${method.hoverColor} hover:border-slate-300`,
                    ].join(' ')}
                  >
                    <div className={`w-10 h-10 rounded-full ${isSelected ? method.color : 'bg-slate-100'} flex items-center justify-center transition-colors`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <span className={`text-xs font-semibold ${isSelected ? method.textColor : 'text-slate-600'}`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.contactMethod && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.contactMethod}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Ваше имя
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => { setGuestName(e.target.value); setErrors(prev => ({ ...prev, guestName: undefined })); }}
                placeholder="Иван Иванов"
                className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${errors.guestName ? 'border-red-400' : 'border-slate-300'}`}
              />
              {errors.guestName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.guestName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__"
                className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-slate-300'}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          {booking.selectedRoomId ? (
            <div className={`rounded-xl border-2 p-5 transition-all duration-500 ${highlight && !editingParams ? 'border-accent-400 bg-accent-50 shadow-md' : editingParams ? 'border-primary-400 bg-primary-50 shadow-md' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Параметры бронирования
                </p>
                {!editingParams ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditDraft({
                        checkInDate: booking.checkInDate,
                        checkOutDate: booking.checkOutDate,
                        guestsCount: booking.guestsCount,
                        selectedRoomId: booking.selectedRoomId,
                        selectedRoomName: booking.selectedRoomName,
                      });
                      setEditingParams(true);
                    }}
                    className="flex items-center gap-1.5 text-primary-600 hover:text-primary-800 text-xs font-semibold border border-primary-300 hover:border-primary-500 px-3 py-1.5 rounded-full transition-all hover:bg-primary-50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Изменить
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateBooking({
                          checkInDate: editDraft.checkInDate,
                          checkOutDate: editDraft.checkOutDate,
                          guestsCount: editDraft.guestsCount,
                          selectedRoomId: editDraft.selectedRoomId,
                          selectedRoomName: editDraft.selectedRoomName,
                        });
                        setEditingParams(false);
                      }}
                      className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingParams(false)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold border border-slate-300 hover:border-slate-400 px-3 py-1.5 rounded-full transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      Отмена
                    </button>
                  </div>
                )}
              </div>

              {!editingParams ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Номер</span>
                    <p className="font-bold text-slate-900 mt-0.5">{booking.selectedRoomName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Даты</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {booking.checkInDate && booking.checkOutDate
                        ? `${new Date(booking.checkInDate).toLocaleDateString('ru-RU')} — ${new Date(booking.checkOutDate).toLocaleDateString('ru-RU')}`
                        : 'Не выбраны'}
                    </p>
                    {nights > 0 && booking.checkInDate && booking.checkOutDate && (
                      <span className="text-slate-500 text-xs">{nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500">Гостей</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {booking.guestsCount} {booking.guestsCount < 5 ? 'гостя' : 'гостей'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        Дата заезда
                      </label>
                      <input
                        type="date"
                        value={editDraft.checkInDate || ''}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEditDraft(d => ({ ...d, checkInDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        Дата выезда
                      </label>
                      <input
                        type="date"
                        value={editDraft.checkOutDate || ''}
                        min={editDraft.checkInDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEditDraft(d => ({ ...d, checkOutDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        <Users className="w-3.5 h-3.5 inline mr-1" />
                        Гостей
                      </label>
                      <select
                        value={editDraft.guestsCount || 2}
                        onChange={(e) => setEditDraft(d => ({ ...d, guestsCount: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      >
                        <option value="2">2 гостя</option>
                        <option value="3">3 гостя</option>
                        <option value="4">4 гостя</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Выбранный номер</label>
                    <div className="flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg bg-white">
                      <span className="text-sm text-slate-800 font-medium">{editDraft.selectedRoomName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditDraft(d => ({ ...d, selectedRoomId: null, selectedRoomName: '' }));
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        title="Снять выбор номера"
                      >
                        <X className="w-3.5 h-3.5" />
                        Снять выбор
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Если снять выбор — выберите номер заново в списке выше</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-slate-200 bg-white p-5 space-y-4">
              <p className="text-sm font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                Параметры бронирования
              </p>
              <p className="text-xs text-slate-500 mb-2">
                Тип номера можно уточнить в мессенджере при подтверждении
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Дата заезда
                  </label>
                  <input
                    type="date"
                    value={booking.checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateBooking({ checkInDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Дата выезда
                  </label>
                  <input
                    type="date"
                    value={booking.checkOutDate}
                    min={booking.checkInDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateBooking({ checkOutDate: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Гостей
                  </label>
                  <select
                    value={booking.guestsCount}
                    onChange={(e) => updateBooking({ guestsCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  >
                    <option value="2">2 гостя</option>
                    <option value="3">3 гостя</option>
                    <option value="4">4 гостя</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Дополнительные пожелания
            </label>
            <textarea
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              rows="3"
              placeholder="Хотел бы тихий номер на втором этаже с видом на море..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className={[
              'w-full font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] hover:shadow-xl text-white flex items-center justify-center gap-3',
              selectedMethod ? selectedMethod.color : 'bg-accent-500 hover:bg-accent-600',
            ].join(' ')}
          >
            {selectedMethod ? (
              <>
                {(() => { const Icon = selectedMethod.icon; return <Icon className="w-5 h-5" />; })()}
                Забронировать через {selectedMethod.label}
              </>
            ) : (
              'Забронировать'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
