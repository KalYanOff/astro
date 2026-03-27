/* =========================================
   SECTION: Reviews  #reviews
   Auto-scrolling Swiper carousel of reviews (static data)
   Each review supports expand/collapse for long text
   ======================================== */
import { useState } from 'react';
import { Star, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const REVIEWS_DATA = [
  {
    id: '1',
    author_name: 'Владислав К.',
    rating: 5,
    review_text: 'Отличное место для отдыха в Джубге! Очень довольны отдыхом в этом гостевом доме. Главный плюс – идеальное расположение: до моря буквально пара минут. Номера очень уютные и комфортные, есть все необходимое. Двор просто восхитительный – утопает в зелени, приятно проводить там время. Хозяева очень приветливые и внимательные. Рекомендуем всем, кто ищет спокойный и комфортный отдых у моря!',
    source: 'Яндекс.Карты',
  },
  {
    id: '2',
    author_name: 'Екатерина З.',
    rating: 5,
    review_text: 'Долго подходила к выбору жилья для отдыха. Остановилась на этом гостевом доме. Цена отличная, все в шаговой доступности, рядом есть продуктовый магазин круглосуточный. Все чистенько и ухожено, хозяева отличные, на все вопросы отвечали всегда подробно, все условия есть на любой кошелек. До моря идти буквально 1-2 минуты, что еще немаловажно, по ночам на набережной всегда играет музыка, но ее НЕ СЛЫШНО в номерах, это радует. Гостевой дом отличный 🫶🏻',
    source: 'Яндекс.Карты',
  },
  {
    id: '3',
    author_name: 'Евгения К.',
    rating: 5,
    review_text: 'Отличный гостевой дом. Отдыхали в конце июля и с уверенностью могу сказать если еще приеду отдыхать в Джубгу то обязательно остановлюсь именно здесь. Чистые уютные номера, столики около каждого номера, очень удобно посидеть вечером. Территория чистая, зеленая, видно что все ухожено. Бесплатная парковка на территории, машина стоит прямо под окнами. На территории очень тихо, спокойно. До моря 70 метров. ',
    source: 'Яндекс.Карты',
  },
  {
    id: '4',
    author_name: 'Инна М.',
    rating: 5,
    review_text: 'Хочу выразить благодарность за гостеприимство гостевому дому Дельфин. Проездом оказались в Джубге и захотели остаться на несколько дней, случайно попали на свободные места в этом доме. Очень чисто, уютно во дворе и номере. Отдохнули с комфортом и позитивными эмоциями. Обязательно будем рекомендовать отдых здесь знакомым и друзьям. Море в минуте ходьбы, первая линия.',
    source: 'Яндекс.Карты',
  },
  {
    id: '5',
    author_name: 'Наталья С.',
    rating: 5,
    review_text: 'Хочу выразить благодарность Наталье с Олегом за гостевой дом "Дельфин"!!! Территория ВСЯ озеленена , фантастическое оформление каждого уголка двора,есть небольшая детская площадка, парковка для автомобилей,уютная и чистая кухня (где есть всё необходимое для приготовления пищи) переходящая в столовую.На территории несколько беседок для комфортного отдыха ,есть шашлычная зона .Мы гостили в номере "Комфорт"-очень уютный !!! Несмотря на то,что до моря 50 метров, вообще не слышали шума музыки в своем номере из баров на побережье,так как и окна и двери очень плотно закрывались. Низкий поклон администратору ВЕНЕРЕ-чуткая ,заботливая ,отзывчивая,приветливая !!! Обязательно вернёмся в следующем году именно на Набережную 7!!! Всем своим друзьям и знакомым рекомендую!!!',
    source: 'Яндекс.Карты',
  },
  {
    id: '6',
    author_name: 'Александр',
    rating: 5,
    review_text: 'Очень хорошее место для отдыха. Цены адекватные. Море в пяти минутах ходьбы. Очень приветливые и доброжелательные хозяева. Вся инфраструктура чистая ухоженная. Вместительная парковка. Все вопросы возникающие решаются быстро и без проволочек. Для детишек есть песочница, качели. За все время отдыха чувствовали себя как дома. Номера хорошие. На терассах возле каждого номера свой столик. Рекомендую для отдыха.',
    source: 'Яндекс.Карты',
  },
  {
    id: '7',
    author_name: 'Галина',
    rating: 5,
    review_text: 'В гостевом доме «Дельфин» отдыхали впервые. Очень уютно, красиво, современно. Двор утопает в разнообразных кустарниках и цветах. Много зон отдыха, оформленных оригинально с любовью. Комнаты поражают уютом, чистотой, оформлением и современной мебелью. Респект хозяйке Наталье, за творческий подход в организации отдыха. Огромное спасибо за радушный прием Венере. Ее доброта и отзывчивость надолго запомнится. Буду всем друзьям рассказывать о таком чудесном «райском уголке» под названием «Дельфин». До новых встреч! В будущем году обязательно приедем.',
    source: 'kudanamore.ru',
  },
  {
    id: '8',
    author_name: 'Елена Чехова',
    rating: 5,
    review_text: 'Очень уютное, чистое и комфортное место для отдыха. Расположение отличное - в двух шагах от моря и всей набережной. Персонал всегда приветливый и отзывчивый, быстро решают любые вопросы. Территория ухоженная, много зелени. Номера просторные, свежий ремонт, всё необходимое для проживания есть. Рекомендую всем, кто хочет хорошо отдохнуть!',
    source: '2Гис',
  },
];

const TRUNCATE_LENGTH = 120;

function ReviewCard({ review, expandedReviewId, onToggleExpand }) {
  const isExpanded = expandedReviewId === review.id;
  const needsTruncation = review.review_text.length > TRUNCATE_LENGTH;
  const displayText =
    !needsTruncation || isExpanded
      ? review.review_text
      : review.review_text.slice(0, TRUNCATE_LENGTH).trimEnd() + '…';

  const getInitials = (name) =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const handleToggle = () => {
    onToggleExpand(isExpanded ? null : review.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
            {getInitials(review.author_name)}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{review.author_name}</h4>
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-slate-600 leading-relaxed mb-2">{displayText}</p>
        {needsTruncation && (
          <button
            onClick={handleToggle}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors mt-1"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>Свернуть <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Читать полностью <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
        Источник: {review.source}
      </p>
    </div>
  );
}

export default function Reviews() {
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  return (
    <section id="reviews" className="py-20 bg-slate-50">
      <style>{`
        .reviews-swiper .swiper-button-next,
        .reviews-swiper .swiper-button-prev {
          width: 30px !important;
          height: 30px !important;
          background: white;
          border-radius: 50%;
          box-shadow: 0 1px 6px rgba(0,0,0,0.12);
          color: #475569;
          top: calc(50% - 24px);
        }
        .reviews-swiper .swiper-button-next::after,
        .reviews-swiper .swiper-button-prev::after {
          font-size: 11px !important;
          font-weight: 800;
        }
        .reviews-swiper .swiper-button-disabled {
          opacity: 0.25 !important;
        }
        .reviews-swiper {
          padding-bottom: 2rem !important; /* отступ снизу для теней */
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Отзывы гостей
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Что говорят наши гости</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-2xl font-display font-bold text-brand-dark">4.9</span>
            <span className="text-slate-500">из 5 на основе 250+ отзывов</span>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
          }}
          onSlideChange={() => setExpandedReviewId(null)}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="reviews-swiper pb-4"
        >
          {REVIEWS_DATA.map((review) => (
            <SwiperSlide key={review.id} className="!h-auto self-stretch">
              <ReviewCard 
                review={review} 
                expandedReviewId={expandedReviewId}
                onToggleExpand={setExpandedReviewId}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-10">
          <a
            href="https://yandex.ru/maps/org/delfin/209725973823/reviews/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Все отзывы на Яндексе
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        <div className="text-center mt-10">
          <a
            href="https://www.kudanamore.ru/dzhubga/hotels/27479/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Все отзывы на kudanamore.ru
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        <div className="text-center mt-10">
          <a
            href="https://2gis.ru/sochi/firm/70000001038105191/38.700372%2C44.310423/tab/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Все отзывы на 2Гис
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
