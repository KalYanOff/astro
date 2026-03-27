import { SITE_BRAND_NAME, SITE_NAME } from './site.js';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type SeoProfileId =
  | 'home_hotel_cluster'
  | 'oteli_dzhubga'
  | 'gostinicy_dzhubga'
  | 'otel_u_morya';

export type SeoProfile = {
  id: SeoProfileId;
  title: string;
  description: string;
  canonicalPath: string;
  ogTitle: string;
  ogDescription: string;
  focusKeywords: string[];
  includeHotelSchema?: boolean;
};

export const SITE_URL = 'https://delfinstay.ru';
export const ORG_NAME = SITE_NAME;
export const DEFAULT_OG_IMAGE = '/img/photo/beach/beach.webp';
export const DEFAULT_TITLE =
  'Гостевой дом «Дельфин» в Джубге | Официальный сайт | 50 метров до моря';
export const DEFAULT_DESCRIPTION =
  'Гостевой дом «Дельфин» в Джубге: официальный сайт, номера у моря, первая линия, 50 метров до пляжа, бесплатная парковка, Wi-Fi и бронирование напрямую без посредников.';

export const SEO_PROFILES: Record<SeoProfileId, SeoProfile> = {
  home_hotel_cluster: {
    id: 'home_hotel_cluster',
    title:
      'Гостевой дом «Дельфин» в Джубге | Официальный сайт | Номера у моря, бронирование без посредников',
    description:
      'Гостевой дом «Дельфин» в Джубге: 50 метров до моря, номера Эконом и Стандарт, семейный отдых, парковка, Wi-Fi, кухня и бронирование напрямую на официальном сайте.',
    canonicalPath: '/',
    ogTitle: 'Гостевой дом «Дельфин» в Джубге | Официальный сайт',
    ogDescription:
      'Номера у моря в Джубге: первая линия, спокойный семейный отдых, удобное бронирование и прямой контакт с гостевым домом «Дельфин».',
    focusKeywords: [
      'гостевой дом джубга',
      'гостевой дом джубга у моря',
      'официальный сайт гостевого дома дельфин',
      'джубга жилье у моря',
      'забронировать номер джубга',
      'первая линия джубга',
      'семейный отдых джубга',
      'номера джубга',
      'отдых джубга',
      'гостевой дом дельфин джубга',
      'отели джубга',
      'гостиницы джубга',
      'жилье джубга',
    ],
    includeHotelSchema: false,
  },
  oteli_dzhubga: {
    id: 'oteli_dzhubga',
    title:
      'Отели Джубги у моря | Гостевой дом «Дельфин» на первой линии',
    description:
      'Ищете отель в Джубге у моря? Гостевой дом «Дельфин» предлагает номера в 50 метрах от пляжа, спокойную атмосферу, парковку и прямое бронирование на официальном сайте.',
    canonicalPath: '/oteli-dzhubga',
    ogTitle: 'Отели Джубги у моря | Гостевой дом «Дельфин»',
    ogDescription:
      'Первая линия в Джубге, номера у моря и удобное бронирование напрямую без посредников.',
    focusKeywords: [
      'отели джубга',
      'отели джубга у моря',
      'отель в джубге первая линия',
      'отели джубга цены',
      'отели джубга официальный сайт',
      'отель джубга забронировать',
    ],
    includeHotelSchema: true,
  },
  gostinicy_dzhubga: {
    id: 'gostinicy_dzhubga',
    title:
      'Гостиницы Джубги у моря | Гостевой дом «Дельфин» — официальный сайт',
    description:
      'Среди гостиниц Джубги у моря гостевой дом «Дельфин» выделяется близостью к пляжу, семейным форматом, благоустроенной территорией и бронированием напрямую.',
    canonicalPath: '/gostinicy-dzhubga',
    ogTitle: 'Гостиницы Джубги у моря | «Дельфин»',
    ogDescription:
      'Комфортное размещение у моря в Джубге: номера, парковка, кухня, Wi-Fi и спокойный отдых для семьи.',
    focusKeywords: [
      'гостиницы джубга',
      'гостиницы джубга у моря',
      'гостиница джубга первая линия',
      'гостиницы джубга цены',
      'гостиница джубга официальный сайт',
      'забронировать гостиницу джубга',
    ],
    includeHotelSchema: true,
  },
  otel_u_morya: {
    id: 'otel_u_morya',
    title:
      'Отель в Джубге у моря | Гостевой дом «Дельфин», 50 метров до пляжа',
    description:
      'Гостевой дом «Дельфин» подходит тем, кто ищет отель в Джубге у моря: 50 метров до пляжа, первая линия, номера разных категорий и официальный сайт для прямого бронирования.',
    canonicalPath: '/otel-dzhubga-u-morya',
    ogTitle: 'Отель в Джубге у моря | «Дельфин»',
    ogDescription:
      'Первая береговая линия, комфортные номера и прямое бронирование в гостевом доме «Дельфин».',
    focusKeywords: [
      'отель джубга у моря',
      'отель в джубге первая линия',
      'отель рядом с пляжем джубга',
      'отель джубга цены',
      'отель у моря джубга официальный сайт',
      `${SITE_BRAND_NAME.toLowerCase()} джубга`,
    ],
    includeHotelSchema: true,
  },
};

export function getSeoProfile(profileId?: SeoProfileId): SeoProfile | null {
  if (!profileId) return null;
  return SEO_PROFILES[profileId] ?? null;
}

export function toCanonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const sanitized = normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
  return `${SITE_URL}${sanitized}`;
}
