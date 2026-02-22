import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Проверяем, давал ли пользователь согласие ранее
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Здесь можно инициализировать аналитику (GA4, FB Pixel и т.д.)
    window.location.reload(); // Опционально: перезагрузить для активации скриптов
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-screen-xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:flex md:items-center md:justify-between dark:bg-gray-900 dark:border-gray-800">
        <div className="flex-1 mr-8">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Мы используем файлы cookie для улучшения работы сайта и анализа трафика. 
            Продолжая использовать сайт, вы соглашаетесь с нашей 
            <a href="/docs/privacy" className="text-blue-600 underline ml-1 hover:text-blue-500">политикой конфиденциальности</a>.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 shrink-0 md:mt-0">
          <button
            onClick={declineCookies}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Отклонить
          </button>
          <button
            onClick={acceptCookies}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            Принять всё
          </button>
        </div>
      </div>
    </div>
  );
}