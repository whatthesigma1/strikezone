import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccess from './components/OrderSuccess';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';

function Categories({ onFilter }) {
  const cats = [
    { emoji: '🎯', name: 'Маркеры',    tag: 'Топ продаж', count: '48 моделей', span: true },
    { emoji: '🥽', name: 'Маски',      tag: 'Новинки',    count: '32 модели' },
    { emoji: '💨', name: 'Баллоны',    tag: 'Хиты',       count: '16 моделей' },
    { emoji: '🛡️', name: 'Защита',    tag: 'Бестселлеры',count: '24 модели' },
  ];
  return (
    <section id="categories" className="py-24 px-10 md:px-20 bg-[#111214]">
      <div className="mb-14">
        <div className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.25em] uppercase text-[#e8f216] mb-3">Каталог</div>
        <h2 className="font-['Barlow_Condensed'] font-black text-[clamp(36px,4vw,56px)] uppercase text-white leading-none">Категории</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        {cats.map((c) => (
          <div key={c.name} onClick={() => onFilter(c.name)}
            className={`relative bg-[#16181c] overflow-hidden cursor-pointer group h-64 ${c.span ? 'md:col-span-2 h-80' : ''}`}>
            <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-8 group-hover:opacity-14 group-hover:scale-110 transition-all duration-500">{c.emoji}</div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90" />
            <div className="absolute top-6 right-6 w-9 h-9 border border-[#2a2d35] flex items-center justify-center text-[#6b7280] group-hover:bg-[#e8f216] group-hover:text-[#0a0a0a] group-hover:border-[#e8f216] transition-all" style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>→</div>
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="inline-block bg-[#e8f216] text-[#0a0a0a] font-['Barlow_Condensed'] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 mb-2">{c.tag}</div>
              <div className="font-['Barlow_Condensed'] font-black text-2xl uppercase text-white leading-none">{c.name}</div>
              <div className="text-sm text-[#6b7280] mt-1">{c.count}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="pb-24 bg-[#0a0a0a] px-10 md:px-20">
      <div className="bg-[#e8f216] p-14 relative overflow-hidden flex items-center justify-between flex-wrap gap-8">
        <div className="absolute right-[-20px] top-[-20px] font-['Barlow_Condensed'] text-[200px] font-black text-black/8 leading-none pointer-events-none select-none">SALE</div>
        <div>
          <div className="font-['Barlow_Condensed'] text-xs font-bold tracking-[0.25em] uppercase text-black/50 mb-2">Ограниченное предложение</div>
          <div className="font-['Barlow_Condensed'] font-black text-[clamp(36px,4vw,64px)] uppercase text-[#0a0a0a] leading-[0.9] mb-4">СКИДКА<br />ДО 30%</div>
          <div className="text-base text-black/60">На весь сезонный ассортимент до конца месяца</div>
        </div>
        <button className="font-['Barlow_Condensed'] font-extrabold text-base tracking-widest uppercase bg-[#0a0a0a] text-[#e8f216] px-12 py-4 hover:bg-black hover:scale-105 transition-all"
          style={{ clipPath: 'polygon(14px 0%,100% 0%,calc(100% - 14px) 100%,0% 100%)' }}>
          Смотреть акции
        </button>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section id="brands" className="py-20 px-10 md:px-20 border-t border-[#2a2d35] bg-[#111214]">
      <div className="flex items-center gap-14 flex-wrap">
        <div className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.2em] uppercase text-[#6b7280] whitespace-nowrap">Бренды</div>
        <div className="flex gap-12 flex-wrap items-center">
          {['Dye', 'Planet Eclipse', 'Empire', 'Tippmann', 'HK Army', 'Proto', 'Virtue'].map(b => (
            <div key={b} className="font-['Barlow_Condensed'] font-black text-xl tracking-wider uppercase text-[#2a2d35] hover:text-[#e8f216] transition-colors cursor-pointer">{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const feats = [
    { icon: '🚀', title: 'Быстрая доставка',  text: 'Отправляем заказы в течение 24 часов. Доставка по всей России от 1 до 5 дней.' },
    { icon: '✅', title: 'Гарантия качества', text: 'Только оригинальное снаряжение от официальных дистрибьюторов. Гарантия 1 год.' },
    { icon: '🔧', title: 'Сервисный центр',   text: 'Профессиональное обслуживание и ремонт маркеров. Чистка, настройка, тюнинг.' },
    { icon: '💬', title: 'Экспертная помощь', text: 'Консультации от действующих игроков. Поможем выбрать снаряжение под ваш стиль.' },
  ];
  return (
    <section id="features" className="py-24 px-10 md:px-20 bg-[#0a0a0a]">
      <div className="mb-14">
        <div className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.25em] uppercase text-[#e8f216] mb-3">Почему мы</div>
        <h2 className="font-['Barlow_Condensed'] font-black text-[clamp(36px,4vw,56px)] uppercase text-white leading-none">Наши преимущества</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
        {feats.map(f => (
          <div key={f.title} className="bg-[#16181c] p-10 border-t-[3px] border-transparent hover:border-[#e8f216] transition-colors">
            <span className="text-4xl mb-5 block">{f.icon}</span>
            <div className="font-['Barlow_Condensed'] font-bold text-lg uppercase text-white mb-2.5">{f.title}</div>
            <div className="text-sm text-[#6b7280] leading-relaxed">{f.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111214] border-t border-[#2a2d35] pt-20 pb-10 px-10 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-14">
        <div>
          <div className="font-['Barlow_Condensed'] font-black text-3xl uppercase text-white mb-4">STRIKE<span className="text-[#e8f216]">ZONE</span></div>
          <p className="text-sm text-[#6b7280] leading-relaxed mb-7 max-w-[280px]">Ваш надёжный партнёр в мире пейнтбола.</p>
          <div className="flex gap-3">
            {['VK', 'TG', 'YT', 'WA'].map(s => (
              <a key={s} href="#" className="w-10 h-10 border border-[#2a2d35] flex items-center justify-center text-sm text-[#6b7280] hover:bg-[#e8f216] hover:text-[#0a0a0a] hover:border-[#e8f216] transition-all" style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>{s}</a>
            ))}
          </div>
        </div>
        {[
          { title: 'Каталог', links: ['Маркеры', 'Маски и очки', 'Баллоны', 'Защита', 'Аксессуары'] },
          { title: 'Информация', links: ['О компании', 'Доставка и оплата', 'Возврат товара', 'Гарантия', 'Контакты'] },
          { title: 'Контакты', links: ['+7 (800) 555-35-35', 'info@strikezone.ru', 'Москва, ул. Арбат, 10', 'Пн–Пт: 10:00–19:00'] },
        ].map(col => (
          <div key={col.title}>
            <div className="font-['Barlow_Condensed'] font-bold text-[13px] tracking-[0.2em] uppercase text-white mb-6">{col.title}</div>
            <ul className="space-y-3">
              {col.links.map(l => <li key={l}><a href="#" className="text-sm text-[#6b7280] hover:text-[#e8f216] transition-colors">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-10 border-t border-[#2a2d35] flex-wrap gap-4">
        <div className="text-sm text-[#6b7280]">© 2026 StrikeZone. Все права защищены.</div>
        <div className="text-sm text-[#6b7280]">Политика конфиденциальности · Условия использования</div>
      </div>
    </footer>
  );
}

function AppInner() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [toast, setToast] = useState('');

  function handleProductAdded(product) {
    setCartOpen(true);
    setToast(`${product.brand} ${product.name} добавлен в корзину`);
  }

  function handleFilter(cat) {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#e8e8e8]" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <Header onOpenCart={() => setCartOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
      <Hero />
      <Categories onFilter={handleFilter} />
      <Products onProductAdded={handleProductAdded} onOpenAuth={() => setAuthOpen(true)} />
      <PromoBanner />
      <Brands />
      <Features />
      <Footer />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        onOpenAuth={() => { setCartOpen(false); setAuthOpen(true); }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={(result) => setOrderResult(result)}
      />
      <OrderSuccess result={orderResult} onClose={() => setOrderResult(null)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {toast && <Toast message={toast} onDismiss={() => setToast('')} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
