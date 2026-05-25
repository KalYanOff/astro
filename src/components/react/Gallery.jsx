/* =========================================
   SECTION: Gallery  #gallery
   Фильтрация фото по кнопкам + lightbox
   ========================================= */
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

const TERRITORY_PATHS = [
  '/img/photo/terrytory/2.png',
  '/img/photo/terrytory/7.webp',
  '/img/photo/terrytory/9.webp',
  '/img/photo/terrytory/DSC_0002.webp',
  '/img/photo/terrytory/DSC_0006.webp',
  '/img/photo/terrytory/DSC_0008.webp',
  '/img/photo/terrytory/DSC_0009.webp',
  '/img/photo/terrytory/DSC_0032.webp',
  '/img/photo/terrytory/DSC_0033.webp',
  '/img/photo/terrytory/DSC_0034.webp',
  '/img/photo/terrytory/DSC_0053.webp',
  '/img/photo/terrytory/DSC_0060.webp',
  '/img/photo/terrytory/DSC_0068.webp',
  '/img/photo/terrytory/DSC_0070.webp',
  '/img/photo/terrytory/DSC_0074.webp',
  '/img/photo/terrytory/DSC_0081.webp',
  '/img/photo/terrytory/IMG_0658.webp',
  '/img/photo/terrytory/IMG_0668.webp',
  '/img/photo/terrytory/IMG_0670.webp',
  '/img/photo/terrytory/IMG_0692.webp',
  '/img/photo/terrytory/IMG_0714.webp',
  '/img/photo/kitchen/IMG_5535.JPG',
  '/img/photo/kitchen/IMG_5581.JPG',
  '/img/photo/kitchen/IMG_5686.JPG',
  '/img/photo/kitchen/IMG_5694.JPG',
  '/img/photo/kitchen/IMG_5704.JPG',
  '/img/photo/kitchen/IMG_5737.jpg',
];

const BEACH_PATHS = ['/img/photo/beach/beach.webp'];

const ROOM_PATHS = [
  '/img/rooms/econom/2/DSC_0033.webp',
  '/img/rooms/econom/2/bezh-1.webp',
  '/img/rooms/econom/2/bezh-2.webp',
  '/img/rooms/econom/2/bezh-3.webp',
  '/img/rooms/econom/2/seraya-1.webp',
  '/img/rooms/econom/2/seraya-2.webp',
  '/img/rooms/econom/2/seraya-3.webp',
  '/img/rooms/econom/2/siren-1.webp',
  '/img/rooms/econom/2/siren-2.webp',
  '/img/rooms/econom/2/siren-3.webp',
  '/img/rooms/econom/3/dsc0017.webp',
  '/img/rooms/econom/3/dsc0019.webp',
  '/img/rooms/econom/3/_DSC0026.webp',
  '/img/rooms/econom/3/bk-2.webp',
  '/img/rooms/econom/3/k4-1.webp',
  '/img/rooms/econom/3/k4-2.webp',
  '/img/rooms/econom/3/k4-3.webp',
  '/img/rooms/econom/3/ser-1.webp',
  '/img/rooms/econom/3/ser-2.webp',
  '/img/rooms/econom/4/4m-1.webp',
  '/img/rooms/econom/4/4m-2.webp',
  '/img/rooms/standart/001.webp',
  '/img/rooms/standart/002.webp',
  '/img/rooms/standart/2/12-1.webp',
  '/img/rooms/standart/2/13-1.webp',
  '/img/rooms/standart/2/13-2.webp',
  '/img/rooms/standart/2/14-1.webp',
  '/img/rooms/standart/2/14-2.webp',
  '/img/rooms/standart/2/15-1.webp',
  '/img/rooms/standart/2/15-2.webp',
  '/img/rooms/standart/3/1-1.webp',
  '/img/rooms/standart/3/1-2.webp',
  '/img/rooms/standart/3/2-1.webp',
  '/img/rooms/standart/3/2-2.webp',
  '/img/rooms/standart/3/3-1.webp',
];

function createImageEntries(paths, category, label) {
  return paths.map((src, index) => ({
    src,
    alt: `${label} ${index + 1}`,
    category,
  }));
}

const galleryImages = [
  ...createImageEntries(TERRITORY_PATHS, 'territory', 'Фото территории'),
  ...createImageEntries(BEACH_PATHS, 'beach', 'Фото пляжа'),
  ...createImageEntries(ROOM_PATHS, 'room', 'Фото номеров'),
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
  const [category, setCategory] = useState('all');

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
            Галерея
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Посмотрите сами</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Реальные фотографии номеров, территории и пляжа
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { value: 'all', label: 'Все' },
            { value: 'territory', label: 'Территория' },
            { value: 'beach', label: 'Пляж' },
            { value: 'room', label: 'Номера' },
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

        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {(showAllMobile
              ? filteredImages
              : filteredImages.slice(0, MOBILE_INITIAL)
            ).map((image, index) => (
              <button
                type="button"
                key={image.src}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => openLightbox(index)}
                aria-label={`Открыть фото: ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width="900"
                  height="900"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <Search className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                </div>
              </button>
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

        <div className="hidden sm:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllDesktop
              ? filteredImages
              : filteredImages.slice(0, DESKTOP_INITIAL)
            ).map((image, index) => (
              <button
                type="button"
                key={image.src}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(index)}
                aria-label={`Открыть фото: ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width="900"
                  height="900"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                </div>
              </button>
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

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={filteredImages}
          index={lightboxIndex}
          plugins={[Zoom, Fullscreen]}
        />
      )}
    </section>
  );
}

