/* =========================================
   COMPONENT: FloatingBar
   Mobile bottom CTA bar + scroll-to-top + messenger FAB
   floating-bar-mobile: phone + booking buttons (mobile only)
   floating-scroll-top: scroll-to-top button (appears after 500px)
   floating-messengers: expandable WhatsApp/Telegram/MAX FAB
   ========================================= */
import { useState, useEffect } from 'react';
import { Calendar, ArrowUp, X } from 'lucide-react';
import { CONTACT_LINKS } from '../../config/site.js';

/* ICON STUBS: inline SVG components — replace JSX content with custom SVGs */
const IconPhone = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.59 5.59l.93-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconWhatsApp = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const IconTelegram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const IconMax = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

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

  const scrollToBooking = () => {
    const el = document.querySelector('#booking-request');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white shadow-2xl border-t border-slate-200 animate-slide-up">
        <div className="h-16">
          <button
            onClick={scrollToBooking}
            className="flex items-center justify-center gap-2 w-full h-full bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Забронировать</span>
          </button>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 md:bottom-6 left-6 z-40 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 animate-fade-in"
          aria-label="Наверх"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div className="fixed bottom-24 md:bottom-24 right-6 z-40">
        {showMessengers && (
          <div className="mb-4 space-y-3 animate-slide-up">
            <a
              href={CONTACT_LINKS.phone}
              className="flex items-center justify-center w-14 h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="Позвонить"
            >
              <IconPhone className="w-6 h-6" />
            </a>
            <a
              href={CONTACT_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="WhatsApp"
              style={{ animationDelay: '50ms' }}
            >
              <IconWhatsApp className="w-6 h-6" />
            </a>
            <a
              href={CONTACT_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="Telegram"
              style={{ animationDelay: '100ms' }}
            >
              <IconTelegram className="w-6 h-6" />
            </a>
            <a
              href={CONTACT_LINKS.max}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="MAX"
              style={{ animationDelay: '150ms' }}
            >
              <IconMax className="w-6 h-6" />
            </a>
          </div>
        )}

        <button
          onClick={() => setShowMessengers(!showMessengers)}
          className={`flex items-center justify-center gap-2 px-4 h-16 rounded-full shadow-2xl transition-all transform hover:scale-110 ${
            showMessengers
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-accent-500 hover:bg-accent-600 animate-bounce-soft'
          } text-white`}
          aria-label={showMessengers ? 'Закрыть' : 'Связаться'}
        >
          {showMessengers ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              <span className="text-sm font-medium whitespace-nowrap">Связаться с нами</span>
              <IconWhatsApp className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
