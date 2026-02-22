function toShortDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}.${month}.${year.slice(2)}`;
}

function asCleanString(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean || fallback;
}

function asPrice(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 'Не рассчитана';
  return `${num.toLocaleString('ru-RU')} ₽`;
}

function normalizePhone(phone) {
  const digitsOnly = String(phone || '').replace(/\D/g, '');
  if (!digitsOnly) return '';

  let normalized = digitsOnly;
  if (normalized.length === 10) normalized = `7${normalized}`;
  if (normalized.length === 11 && normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`;
  }

  if (!/^7\d{10}$/.test(normalized)) return '';
  return normalized;
}

function buildContactLink(contactMethod, normalizedPhone, phoneLink) {
  const method = String(contactMethod || '').toLowerCase();
  if (!normalizedPhone) return '';

  if (method.includes('whatsapp')) {
    return `https://wa.me/${normalizedPhone}`;
  }
  if (method.includes('telegram')) {
    return `https://t.me/+${normalizedPhone}`;
  }
  if (method.includes('звон') || method.includes('phone')) {
    return phoneLink;
  }
  if (method.includes('max')) {
    return '';
  }
  return '';
}

export async function POST({ request }) {
  const webhookUrl = import.meta.env.MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/hpmckws8tr685rrflpbndcnqjxrn76vp';

  if (!webhookUrl) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Make webhook is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid JSON payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const guestName = asCleanString(body?.guestName);
  const phone = asCleanString(body?.phone);
  const contactMethod = asCleanString(body?.contactMethod, 'Не выбран');
  const category = asCleanString(body?.category, 'Не выбрана');
  const wishes = asCleanString(body?.wishes, 'Нет');
  const checkInDate = asCleanString(body?.checkInDate);
  const checkOutDate = asCleanString(body?.checkOutDate);
  const dates = `${toShortDate(checkInDate)} - ${toShortDate(checkOutDate)}`;
  const price = asPrice(body?.totalCost);
  const normalizedPhone = normalizePhone(phone);
  const phoneDisplay = normalizedPhone ? `+${normalizedPhone}` : phone;
  const phoneLink = normalizedPhone ? `tel:+${normalizedPhone}` : '';
  const contactLink = buildContactLink(contactMethod, normalizedPhone, phoneLink);
  const contactMethodLine =
    contactMethod === 'MAX' && !contactLink
      ? `${contactMethod} (в MAX нет публичной ссылки на чат по номеру)`
      : contactMethod;

  if (!guestName || !phone || !checkInDate || !checkOutDate) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Missing required booking fields' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const text = [
    'Заявка с Delfinstay',
    `Даты: ${dates}`,
    `Категория: ${category}`,
    '',
    `Цена: ${price}`,
    `Пожелания: ${wishes}`,
    '',
    `Контакт: ${phoneDisplay} - ${guestName}`,
    `Связаться в ${contactMethod}: ${contactLink || 'ссылка недоступна'}`,
  ].join('\n');

  try {
    const hookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Заявка с Delfinstay',
        dates,
        category,
        price,
        wishes,
        phone,
        phoneDisplay,
        phoneLink,
        guestName,
        contactMethod,
        contactLink,
        text,
        message: text,
        formattedMessage: text,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!hookResponse.ok) {
      throw new Error('make_webhook_send_failed');
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Booking make webhook send failed:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Make webhook send failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
