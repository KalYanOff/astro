/* =========================================
   SECTION: Gallery  #gallery
   Фильтрация фото по кнопкам + lightbox
   ========================================= */
import { useState, useMemo } from 'react';
import { Search, Images } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

// Добавили category каждому фото
const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Стандартный номер',
    category: 'room',
  },
  {
    src: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Вид на море',
    category: 'territory',
  },
  {
    src: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Эконом номер',
    category: 'room',
  },
  {
    src: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Санузел',
    category: 'room',
  },
  {
    src: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Пляж рядом',
    category: 'territory',
  },
  {
    src: 'https://images.pexels.com/photos/277572/pexels-photo-277572.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Территория отеля',
    category: 'territory',
  },
  {
    src: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Номер с кондиционером',
    category: 'room',
  },
  {
    src: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Парковка',
    category: 'territory',
  },
];

const MOBILE_INITIAL = 2;
const DESKTOP_INITIAL = 3;

function filterImages(images, category) {
  if (category === 'all') return images;
  return images.filter((img) => img.category === category);
}

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [showAllDesktop, setShowAllDesktop] = useState(false);
  const [category, setCategory] = useState('all'); // all | room | territory

  const filteredImages = useMemo(() => {
    return filterImages(galleryImages, category);
  }, [category]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
            Фотогалерея
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Посмотрите сами</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Реальные фотографии комнат и территории.
          </p>
        </div>

        {/* Кнопки фильтра */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { value: 'all', label: 'Все' },
            { value: 'room', label: 'Комнаты' },
            { value: 'territory', label: 'Территория' },
            { value: 'beach', label: 'Пляж' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                setCategory(value);
                setShowAllMobile(false);
                setShowAllDesktop(false);
              }}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                category === value
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {(showAllMobile
              ? filteredImages
              : filteredImages.slice(0, MOBILE_INITIAL)
            ).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <Search className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length > MOBILE_INITIAL && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-lg"
              >
                {showAllMobile ? 'Свернуть' : `Все фото (${filteredImages.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllDesktop
              ? filteredImages
              : filteredImages.slice(0, DESKTOP_INITIAL)
            ).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length > DESKTOP_INITIAL && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllDesktop(!showAllDesktop)}
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg shadow-lg"
              >
                {showAllDesktop ? 'Свернуть' : `Показать все (${filteredImages.length})`}
              </button>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={filteredImages}
        index={lightboxIndex}
        plugins={[Zoom, Fullscreen]}
      />
    </section>
  );
}
