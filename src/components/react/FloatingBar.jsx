/* =========================================
   COMPONENT: FloatingBar
   Mobile bottom CTA bar + scroll-to-top + messenger FAB
   floating-bar-mobile: phone + booking buttons (mobile only)
   floating-scroll-top: scroll-to-top button (appears after 500px)
   floating-messengers: expandable WhatsApp/Telegram/MAX FAB
   ========================================= */
import { useState, useEffect } from 'react';
import { Phone, Calendar, ArrowUp, MessageCircle, Send, Bot, X } from 'lucide-react';

export default function FloatingBar() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMessengers, setShowMessengers] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBookingModal = () => {
    const event = new CustomEvent('openBookingModal');
    window.dispatchEvent(event);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white shadow-2xl border-t border-slate-200 animate-slide-up">
        <div className="grid grid-cols-2 h-16">
          <a
            href="tel:+79181929931"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Позвонить</span>
          </a>
          <button
            onClick={openBookingModal}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Забронировать</span>
          </button>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-6 right-6 z-40 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 animate-fade-in"
          aria-label="Наверх"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div className="fixed bottom-24 md:bottom-24 right-6 z-40">
        {showMessengers && (
          <div className="mb-4 space-y-3 animate-slide-up">
            <a
              href="https://wa.me/79181929931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="WhatsApp"
              style={{ animationDelay: '50ms' }}
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <a
              href="https://t.me/+79181929931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="Telegram"
              style={{ animationDelay: '100ms' }}
            >
              <Send className="w-6 h-6" />
            </a>
            <a
              href="https://max.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="MAX"
              style={{ animationDelay: '150ms' }}
            >
              <Bot className="w-6 h-6" />
            </a>
          </div>
        )}

        <button
          onClick={() => setShowMessengers(!showMessengers)}
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all transform hover:scale-110 ${
            showMessengers
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-accent-500 hover:bg-accent-600 animate-bounce-soft'
          } text-white`}
          aria-label={showMessengers ? 'Закрыть' : 'Связаться'}
        >
          {showMessengers ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </button>
      </div>
    </>
  );
}
