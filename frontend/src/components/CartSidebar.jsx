import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartSidebar({ open, onClose, onCheckout, onOpenAuth }) {
  const { cart, changeQty, subtotal } = useCart();
  const { isAuth } = useAuth();

  function handleCheckout() {
    if (!isAuth) {
      onClose();
      onOpenAuth();
      return;
    }
    onCheckout();
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#111214] border-l border-[#2a2d35] z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2d35]">
          <div className="font-['Barlow_Condensed'] font-black text-xl uppercase text-white tracking-wider">Корзина</div>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white transition-colors text-lg">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#6b7280]">
              <div className="text-5xl mb-4">🛒</div>
              <div className="font-['Barlow_Condensed'] uppercase tracking-wider">Корзина пуста</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#2a2d35]">
                  <div className="w-12 h-12 bg-[#16181c] flex items-center justify-center text-2xl flex-shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-['Barlow_Condensed'] font-bold text-sm uppercase text-white truncate">{item.brand} {item.name}</div>
                    <div className="text-[#e8f216] text-sm font-semibold mt-0.5">{(item.price * item.qty).toLocaleString('ru')} ₽</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 border border-[#2a2d35] text-[#6b7280] hover:border-[#e8f216] hover:text-[#e8f216] transition-all flex items-center justify-center text-lg leading-none">−</button>
                    <span className="w-5 text-center text-white font-bold text-sm">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 border border-[#2a2d35] text-[#6b7280] hover:border-[#e8f216] hover:text-[#e8f216] transition-all flex items-center justify-center text-lg leading-none">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#2a2d35]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Barlow_Condensed'] uppercase text-[#6b7280] tracking-wider text-sm">Итого</span>
              <span className="font-['Barlow_Condensed'] font-black text-2xl text-white">{subtotal.toLocaleString('ru')} ₽</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full font-['Barlow_Condensed'] font-black text-base tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] py-4 hover:bg-white transition-colors"
              style={{ clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
            >
              {isAuth ? 'Оформить заказ' : '🔒 Войдите для оформления'}
            </button>
            {!isAuth && (
              <p className="text-center text-xs text-[#6b7280] mt-3">
                Необходима авторизация для оформления заказа
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
