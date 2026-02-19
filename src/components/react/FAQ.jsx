/* =========================================
   SECTION: FAQ  #faq
   Accordion FAQ list from Supabase + contact block
   ========================================= */
import { useState, useEffect } from 'react';
import { ChevronDown, MessageCircle, Send, Bot, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setFaqs(data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <section id="faq" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Загрузка вопросов...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-slate-500 text-sm">Не удалось загрузить вопросы.</p>
        </div>
      </section>
    );
  }

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
          {faqs.map((faq, index) => (
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
