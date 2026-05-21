import { useCart } from '../context/CartContext';

export default function Header({ onOpenCart }) {
  const { totalItems } = useCart();

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
    </header>
  );
}
