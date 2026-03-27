/*
  =========================================
  SITE CONFIGURATION
  Edit contacts and official business details here.
  =========================================
*/

export const SITE_BRAND_NAME = 'Дельфин';
export const SITE_NAME = 'Гостевой дом «Дельфин»';
export const SITE_LEGAL_NAME = 'Индивидуальный предприниматель Кильян Олег Гамазович';
export const SITE_INN = '235500192294';
export const SITE_OGRNIP = '325237500266231';
export const SITE_OBJECT_STATUS = 'Классифицированный гостевой дом';
export const SITE_CLASSIFICATION_REGISTRY_ID = 'С232026023186';

export const SITE_PHONE_RAW = '79181929931';
export const SITE_PHONE_DISPLAY = '+7 (918) 192-99-31';
export const SITE_EMAIL = 'delfin.dzhubga@yandex.ru';
export const SITE_ADDRESS = 'Набережная 7, Джубга, Краснодарский край, 352844';
export const SITE_COORDS = '44.310395,38.700339';
export const SITE_CHECKIN_TIME = '12:00';
export const SITE_CHECKOUT_TIME = '10:00';
export const SITE_NUMBER_OF_ROOMS = 16;
export const SITE_PETS_ALLOWED = false;
export const SITE_AVAILABLE_LANGUAGE_CODES = ['ru-RU'];
export const SITE_CURRENCIES_ACCEPTED = 'RUB';
export const SITE_PAYMENT_ACCEPTED = 'Наличные, банковский перевод, карта';
export const SITE_MAP_URL = 'https://yandex.ru/maps/-/CPa86MY~';

export const CONTACT_LINKS = {
  phone: `tel:+${SITE_PHONE_RAW}`,
  whatsapp: `https://wa.me/${SITE_PHONE_RAW}?text=Здравствуйте!%20Мы%20нашли%20вас%20на%20сайте%20delfinstay.ru!`,
  telegram: `https://t.me/delfinstay?text=Здравствуйте!%20Мы%20нашли%20вас%20на%20сайте%20delfinstay.ru!`,
  max: 'https://max.ru/u/f9LHodD0cOLMTbxMiEW0AuGPg9aQNCHXPCh50xoKmW5Mg9RWyNspYDAbgJ8',
  email: `mailto:${SITE_EMAIL}`,
  map: SITE_MAP_URL,
};

export const SITE_REFERENCE_LINKS = [
  SITE_MAP_URL,
  'https://yandex.ru/maps/org/delfin/209725973823/reviews/',
  'https://www.kudanamore.ru/dzhubga/hotels/27479/',
  'https://2gis.ru/sochi/firm/70000001038105191/38.700372%2C44.310423/tab/reviews',
  CONTACT_LINKS.telegram,
  CONTACT_LINKS.max,
];
