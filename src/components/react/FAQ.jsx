/* =========================================
   SECTION: FAQ  #faq
   Accordion FAQ list (static data) + contact block
   ========================================= */
import { useState } from 'react';
import { ChevronDown, MessageCircle, Send, Bot, Phone } from 'lucide-react';

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
              href="https://wa.me/79181929931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
            </a>

            <a
              href="https://t.me/+79181929931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Telegram</span>
            </a>

            <a
              href="https://max.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">MAX</span>
            </a>

            <a
              href="tel:+79181929931"
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Позвонить</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
