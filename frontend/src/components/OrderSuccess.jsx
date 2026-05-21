export default function OrderSuccess({ result, onClose }) {
  if (!result) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
        <div className="bg-[#111214] border border-[#2a2d35] p-12 text-center max-w-md w-full">
          <div className="h-1 bg-gradient-to-r from-[#e8f216] to-[#c8d200] -mx-12 -mt-12 mb-12" />
          <div className="w-16 h-16 bg-[#e8f216] rounded-full flex items-center justify-center text-[#0a0a0a] text-3xl font-black mx-auto mb-6">
            ✓
          </div>
          <h2 className="font-['Barlow_Condensed'] font-black text-3xl uppercase text-white mb-3">
            Заказ оформлен!
          </h2>
          <p className="text-[#6b7280] mb-6">
            Спасибо за покупку в StrikeZone.<br />Мы отправим подтверждение на ваш email.
          </p>
          <div className="font-['Barlow_Condensed'] text-[11px] tracking-[0.2em] uppercase text-[#6b7280] mb-1">
            Номер заказа
          </div>
          <div className="font-['Barlow_Condensed'] font-black text-xl text-white mb-2">{result.order_number}</div>
          <div className="font-['Barlow_Condensed'] font-black text-4xl text-[#e8f216] mb-8">
            {result.total?.toLocaleString('ru')} ₽
          </div>
          <button
            onClick={onClose}
            className="font-['Barlow_Condensed'] font-black text-base tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] px-10 py-4 hover:bg-white transition-colors"
            style={{ clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
          >
            Продолжить покупки
          </button>
        </div>
      </div>
    </>
  );
}
