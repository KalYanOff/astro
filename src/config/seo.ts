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
};

export const SITE_URL = 'https://delfinstay.ru';
export const ORG_NAME = 'Дельфин';
export const DEFAULT_OG_IMAGE = '/img/photo/beach/beach.webp';
export const DEFAULT_TITLE = 'Дельфин, Джубга - отдых у моря в 50 метрах от пляжа';
export const DEFAULT_DESCRIPTION =
  'Уютный семейный отдых в Джубге рядом с морем: спокойная атмосфера, комфорт, зелёная территория и забота о гостях.';

export const SEO_PROFILES: Record<SeoProfileId, SeoProfile> = {
  home_hotel_cluster: {
    id: 'home_hotel_cluster',
    title: 'Отели Джубги у моря - Дельфин, отдых в 50 метрах от пляжа',
    description:
      'Отели и гостиницы Джубги у моря: спокойный отдых в 50 метрах от пляжа, удобное расположение, комфорт и быстрый доступ к набережной.',
    canonicalPath: '/',
    ogTitle: 'Отели Джубги у моря - Дельфин',
    ogDescription:
      'Гостиницы и отели Джубги рядом с пляжем: удобное расположение, комфортные условия и отдых у моря.',
    focusKeywords: [
      'отели джубга',
      'гостиницы джубга',
      'отель джубга у моря',
      'гостиница джубга первая линия',
      'отели джубга цены',
      'забронировать отель джубга',
    ],
  },
  oteli_dzhubga: {
    id: 'oteli_dzhubga',
    title: 'Отели Джубги - варианты отдыха рядом с морем | Дельфин',
    description:
      'Отели Джубги у моря с удобным расположением: первая линия, шаговая доступность пляжа, комфортные условия и быстрый отклик по бронированию.',
    canonicalPath: '/oteli-dzhubga',
    ogTitle: 'Отели Джубги у моря | Дельфин',
    ogDescription:
      'Подборка отдыха в формате отелей Джубги рядом с морем: удобное расположение, комфорт и тишина.',
    focusKeywords: [
      'отели джубга',
      'отели джубга у моря',
      'отели в джубге первая линия',
      'отели джубга цены',
      'отели джубга забронировать',
    ],
  },
  gostinicy_dzhubga: {
    id: 'gostinicy_dzhubga',
    title: 'Гостиницы Джубги у моря - комфортный отдых | Дельфин',
    description:
      'Гостиницы Джубги рядом с морем: удобный доступ к пляжу, спокойная атмосфера, комфортные условия и помощь с заселением.',
    canonicalPath: '/gostinicy-dzhubga',
    ogTitle: 'Гостиницы Джубги у моря | Дельфин',
    ogDescription:
      'Гостиницы в Джубге рядом с пляжем: комфортный отдых, удобное расположение и быстрая обратная связь.',
    focusKeywords: [
      'гостиницы джубга',
      'гостиницы джубга у моря',
      'гостиница джубга первая линия',
      'гостиницы джубга цены',
      'забронировать гостиницу джубга',
    ],
  },
  otel_u_morya: {
    id: 'otel_u_morya',
    title: 'Отель в Джубге у моря - первая линия и комфорт | Дельфин',
    description:
      'Отель в Джубге у моря: 50 метров до пляжа, удобная локация, комфортные условия для отдыха и оперативная связь по заезду.',
    canonicalPath: '/otel-dzhubga-u-morya',
    ogTitle: 'Отель в Джубге у моря | Дельфин',
    ogDescription:
      'Отдых у моря в Джубге: первая линия, комфортная атмосфера и удобное бронирование.',
    focusKeywords: [
      'отель джубга у моря',
      'отель в джубге первая линия',
      'отель джубга цены',
      'отель рядом с пляжем джубга',
      'забронировать отель джубга',
    ],
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
