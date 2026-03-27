/* =========================================
   COMPONENT: MobileMenu
   Hamburger toggle nav for mobile (in Header)
   mobile-menu-toggle: Menu/X icon button
   mobile-menu-dropdown: collapsible nav links
   ========================================= */
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Забронировать номер', href: '#', isBooking: true },
    { label: 'Номера', href: '#rooms' },
    { label: 'Преимущества', href: '#features' },
    { label: 'Отзывы', href: '#reviews' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleClick = (e, item) => {
    if (item.isBooking) {
      setIsOpen(false);
      return;
    }

    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-fit">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-11 min-h-11 p-2 text-gray-700 hover:text-primary-600 transition-colors"
        aria-label="Меню"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-dropdown"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        id="mobile-menu-dropdown"
        className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <nav className="py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item)}
                  {...(item.isBooking ? { 'data-tl-booking-open': 'true' } : {})}
                  className="block w-full text-center py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
