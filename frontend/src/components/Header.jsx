import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onOpenCart, onOpenAuth }) {
  const { totalItems } = useCart();
  const { user, logout, isAuth } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/92 backdrop-blur-md border-b border-[#2a2d35] h-16 flex items-center justify-between px-10">
      {/* Logo */}
      <div className="font-['Barlow_Condensed'] font-black text-2xl tracking-wider uppercase text-white">
        STRIKE<span className="text-[#e8f216] inline-block -skew-x-2">ZONE</span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-9">
        {['Категории', 'Товары', 'Бренды', 'О нас'].map((label, i) => (
          <a
            key={label}
            href={['#categories', '#products', '#brands', '#features'][i]}
            className="font-['Barlow_Condensed'] font-semibold text-sm tracking-widest uppercase text-[#6b7280] hover:text-[#e8f216] transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Auth */}
        {isAuth ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:block font-['Barlow_Condensed'] text-sm text-[#6b7280]">
              👤 {user.username}
            </span>
            <button
              onClick={logout}
              className="font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase border border-[#2a2d35] text-[#6b7280] px-4 py-2 hover:border-[#ff3c2e] hover:text-[#ff3c2e] transition-all"
            >
              Выйти
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase border border-[#2a2d35] text-[#6b7280] px-4 py-2 hover:border-[#e8f216] hover:text-[#e8f216] transition-all"
          >
            Войти
          </button>
        )}

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative bg-[#e8f216] text-[#0a0a0a] font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase px-5 py-2 hover:bg-white hover:scale-105 transition-all"
          style={{ clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}
        >
          🛒 Корзина
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#ff3c2e] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
