/* =========================================
   SECTION: Reviews  #reviews
   Auto-scrolling Swiper carousel of reviews (static data)
   ========================================= */
import { Star, ExternalLink } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const REVIEWS_DATA = [
  {
    id: '1',
    author_name: 'Анна Соколова',
    rating: 5,
    review_text: 'Прекрасный отель! Чистые номера, приветливый персонал. Очень близко к морю, буквально 2 минуты пешком. Обязательно вернемся!',
    source: 'Яндекс.Карты',
  },
  {
    id: '2',
    author_name: 'Дмитрий Петров',
    rating: 5,
    review_text: 'Отличное соотношение цена-качество. Номер был чистым, кондиционер работал отлично. Парковка прямо у отеля - очень удобно.',
    source: 'Яндекс.Карты',
  },
  {
    id: '3',
    author_name: 'Елена Иванова',
    rating: 5,
    review_text: 'Останавливались с семьей на неделю. Детям очень понравилась площадка. Хозяева отзывчивые, всегда готовы помочь. Рекомендую!',
    source: 'Яндекс.Карты',
  },
  {
    id: '4',
    author_name: 'Сергей Михайлов',
    rating: 4,
    review_text: 'Хороший отель для спокойного отдыха. Близко к морю и магазинам. Единственное - в эконом номерах общий душ, но это было указано при бронировании.',
    source: 'Яндекс.Карты',
  },
  {
    id: '5',
    author_name: 'Ольга Кузнецова',
    rating: 5,
    review_text: 'Чудесное место! Уютная атмосфера, чистота, до моря рукой подать. Цены адекватные. Спасибо за гостеприимство!',
    source: 'Яндекс.Карты',
  },
];

export default function Reviews() {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section id="reviews" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Отзывы наших гостей</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Более 100 довольных гостей уже оставили свои отзывы
          </p>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {REVIEWS_DATA.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow">
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

                <p className="text-slate-600 line-clamp-4 mb-4">{review.review_text}</p>

                <p className="text-xs text-slate-400">Источник: {review.source}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-8">
          <a
            href="https://yandex.ru/maps/org/delfin/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Все отзывы на Яндексе
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
