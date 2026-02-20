/* =========================================
   SECTION: Gallery  #gallery
   8-photo grid with lightbox (yet-another-react-lightbox)
   Mobile: 2 photos initially, rest behind "Show all" button
   Desktop: 3 photos initially, rest behind "Show all" button
   ========================================= */
import { useState } from 'react';
import { Search, Images } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Стандартный номер',
  },
  {
    src: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Вид на море',
  },
  {
    src: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Эконом номер',
  },
  {
    src: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Санузел',
  },
  {
    src: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Пляж рядом',
  },
  {
    src: 'https://images.pexels.com/photos/277572/pexels-photo-277572.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Территория отеля',
  },
  {
    src: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Номер с кондиционером',
  },
  {
    src: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Парковка',
  },
];

const MOBILE_INITIAL = 2;
const DESKTOP_INITIAL = 3;

function PhotoGrid({ images, showAll, onOpen, mobileInitial, desktopInitial, isMobile }) {
  const initial = isMobile ? mobileInitial : desktopInitial;
  const visible = showAll ? images : images.slice(0, initial);

  return (
    <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3 gap-4'}`}>
      {visible.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => onOpen(index)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <Search className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [showAllDesktop, setShowAllDesktop] = useState(false);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Галерея</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Посмотрите фотографии наших номеров и территории
          </p>
        </div>

        {/* Mobile layout: 2 columns, 2 initial photos */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {(showAllMobile ? galleryImages : galleryImages.slice(0, MOBILE_INITIAL)).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
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

          <div className="text-center mt-6">
            {!showAllMobile ? (
              <button
                onClick={() => setShowAllMobile(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Images className="w-5 h-5" />
                Все фото ({galleryImages.length})
              </button>
            ) : (
              <button
                onClick={() => setShowAllMobile(false)}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Свернуть
              </button>
            )}
          </div>
        </div>

        {/* Desktop/tablet layout: 2-3 columns, 3 initial photos */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllDesktop ? galleryImages : galleryImages.slice(0, DESKTOP_INITIAL)).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
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

          <div className="text-center mt-10">
            {!showAllDesktop ? (
              <button
                onClick={() => setShowAllDesktop(true)}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Показать все фото ({galleryImages.length})
              </button>
            ) : (
              <button
                onClick={() => setShowAllDesktop(false)}
                className="px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Свернуть
              </button>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={galleryImages}
        index={lightboxIndex}
        plugins={[Zoom, Fullscreen]}
      />
    </section>
  );
}
