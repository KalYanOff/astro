export type BreadcrumbItem = {
  name: string;
  path: string;
};

export const SITE_URL = 'https://delfinstay.ru';
export const ORG_NAME = 'Дельфин';
export const DEFAULT_OG_IMAGE = '/img/photo/beach/beach.webp';
export const DEFAULT_TITLE = 'Дельфин, Джубга - отдых у моря в 50 метрах от пляжа';
export const DEFAULT_DESCRIPTION =
  'Уютный семейный отдых в Джубге рядом с морем: спокойная атмосфера, комфорт, зелёная территория и забота о гостях.';

export function toCanonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const sanitized = normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
  return `${SITE_URL}${sanitized}`;
}
