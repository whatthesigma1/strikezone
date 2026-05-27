import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BADGE_STYLES = {
  new:  { label: 'Новинка', cls: 'bg-[#e8f216] text-[#0a0a0a]' },
  sale: { label: 'Скидка',  cls: 'bg-[#ff3c2e] text-white' },
  hit:  { label: 'Хит',     cls: 'bg-[#7c3aed] text-white' },
};

export default function ProductCard({ product, onAdded, onOpenAuth, onOpenProduct }) {
  const { addToCart } = useCart();
  const { isAuth } = useAuth();
  const [wished, setWished] = useState(false);

  const badge = product.badge ? BADGE_STYLES[product.badge] : null;

  function handleAdd(e) {
    e.stopPropagation();
    if (!isAuth) { onOpenAuth?.(); return; }
    addToCart(product);
    onAdded?.(product);
  }

  return (
    <div
      onClick={() => onOpenProduct?.(product)}
      className="bg-[#16181c] relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
    >
      {/* Image area */}
      <div className="h-64 flex items-center justify-center text-[100px] relative bg-[#111214]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f216]/[0.04] to-transparent" />
        <span>{product.emoji}</span>

        {/* Hover overlay — "Подробнее" */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase text-white border border-white px-5 py-2">
            Подробнее →
          </span>
        </div>

        {badge && (
          <span
            className={`absolute top-4 left-4 font-['Barlow_Condensed'] text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 z-10 ${badge.cls}`}
            style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}
          >{badge.label}</span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setWished(w => !w); }}
          className={`absolute top-4 right-4 w-9 h-9 border flex items-center justify-center text-base transition-all z-10 ${
            wished ? 'text-[#ff3c2e] border-[#ff3c2e]' : 'text-[#6b7280] border-[#2a2d35] hover:text-[#ff3c2e] hover:border-[#ff3c2e]'
          }`}
        >♥</button>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8f216] mb-1.5">{product.brand}</div>
        <div className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white leading-tight mb-2">{product.name}</div>
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-[#e8f216] text-xs tracking-widest">{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</span>
          <span className="text-[#6b7280] text-xs">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="font-['Barlow_Condensed'] font-black text-2xl text-white">
            {product.old_price && (
              <span className="block text-sm font-normal text-[#6b7280] line-through leading-none">{product.old_price.toLocaleString('ru')} ₽</span>
            )}
            {product.price.toLocaleString('ru')} ₽
          </div>
          <button
            onClick={handleAdd}
            className={`font-['Barlow_Condensed'] font-extrabold text-[13px] tracking-widest uppercase px-5 py-2.5 transition-all whitespace-nowrap ${
              isAuth
                ? 'bg-[#e8f216] text-[#0a0a0a] hover:bg-white hover:scale-105'
                : 'bg-[#2a2d35] text-[#6b7280] hover:bg-[#e8f216] hover:text-[#0a0a0a]'
            }`}
            style={{ clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}
            title={isAuth ? '' : 'Войдите для добавления в корзину'}
          >
            {isAuth ? 'В корзину' : '🔒 Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
