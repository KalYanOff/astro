/* =========================================
   SECTION: FAQ  #faq
   Accordion FAQ list (static data) + contact block
   ========================================= */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CONTACT_LINKS } from '../../config/site.js';

/* ICON STUBS — replace SVG content with custom icons */
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

const IconPhone = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.59 5.59l.93-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const FAQ_DATA = [
  {
    id: '1',
    question: 'Во сколько заезд и выезд?',
    answer: 'Заезд с 14:00, выезд до 12:00. При наличии свободных номеров возможен ранний заезд или поздний выезд - уточняйте у администратора.',
  },
  {
    id: '2',
    question: 'Есть ли парковка?',
    answer: 'Да, у нас есть бесплатная парковка для гостей отеля прямо на территории.',
  },
  {
    id: '3',
    question: 'Можно ли с животными?',
    answer: 'Размещение с домашними животными возможно по предварительному согласованию. Пожалуйста, сообщите об этом при бронировании.',
  },
  {
    id: '4',
    question: 'Есть ли питание?',
    answer: 'В отеле питание не предоставляется, но в номерах категории "Стандарт" есть холодильники. В 5 минутах ходьбы множество кафе и ресторанов.',
  },
  {
    id: '5',
    question: 'Какие условия отмены бронирования?',
    answer: 'Бесплатная отмена возможна за 3 дня до заезда. При отмене позднее возвращается 50% предоплаты.',
  },
  {
    id: '6',
    question: 'Далеко ли до моря?',
    answer: 'Отель находится в 50 метрах от пляжа - всего 1-2 минуты пешком!',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Часто задаваемые вопросы</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ответы на самые популярные вопросы наших гостей
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          {FAQ_DATA.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-lg font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-slate-600 mb-6">
            Свяжитесь с нами удобным способом - мы всегда готовы помочь
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href={CONTACT_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <IconWhatsApp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
            </a>

            <a
              href={CONTACT_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <IconTelegram className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Telegram</span>
            </a>

            <a
              href={CONTACT_LINKS.max}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <IconMax className="w-6 h-6 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">MAX</span>
            </a>

            <a
              href={CONTACT_LINKS.phone}
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <IconPhone className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Позвонить</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
