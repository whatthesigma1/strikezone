import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BADGE_STYLES = {
  new:  { label: 'Новинка', cls: 'bg-[#e8f216] text-[#0a0a0a]' },
  sale: { label: 'Скидка',  cls: 'bg-[#ff3c2e] text-white' },
  hit:  { label: 'Хит',     cls: 'bg-[#7c3aed] text-white' },
};

// Extended static info per category
const CATEGORY_SPECS = {
  'Маркеры': {
    specs: [
      { label: 'Тип привода',     value: 'Электропневматический' },
      { label: 'Калибр',          value: '.68' },
      { label: 'Скорострельность',value: 'до 30 шаров/сек' },
      { label: 'Давление',        value: '150–200 PSI' },
      { label: 'Вес',             value: '830 г' },
      { label: 'Материал корпуса',value: 'Авиационный алюминий' },
    ],
    features: [
      'Регулируемый спусковой крючок',
      'Совместим с лодером Rotor и Spire',
      'Быстросъёмный ствол',
      'Встроенный регулятор давления',
      'Эргономичная рукоятка',
    ],
    description: 'Профессиональный маркер для соревнований и тренировок. Сочетает высокую точность с надёжностью в любых условиях игры. Идеально подходит как для турнирной игры, так и для активного отдыха.',
  },
  'Маски': {
    specs: [
      { label: 'Тип линзы',       value: 'Термальная, двойная' },
      { label: 'Обзор',           value: '260°' },
      { label: 'Защита',          value: 'ASTM F1776' },
      { label: 'Вентиляция',      value: '14 вентиляционных отверстий' },
      { label: 'Вес',             value: '380 г' },
      { label: 'Крепление линзы', value: 'Безынструментальное' },
    ],
    features: [
      'Антизапотевающее покрытие',
      'Мягкий пенный уплотнитель',
      'Быстросъёмная линза без инструментов',
      'Совместима с линзами разных оттенков',
      'Вентилируемая трубка для микрофона',
    ],
    description: 'Профессиональная маска с широким углом обзора и надёжной защитой. Термальная двойная линза предотвращает запотевание даже при интенсивной игре. Удобная посадка благодаря мягкому пенному уплотнителю.',
  },
  'Баллоны': {
    specs: [
      { label: 'Объём',           value: '68 куб. дюйма' },
      { label: 'Давление',        value: '4500 PSI' },
      { label: 'Материал',        value: 'Карбон / Алюминий' },
      { label: 'Регулятор',       value: 'Встроенный, 800 PSI' },
      { label: 'Вес',             value: '680 г' },
      { label: 'Срок сертификации','value': '5 лет' },
    ],
    features: [
      'Лёгкий карбоновый корпус',
      'Встроенный регулятор давления',
      'Индикатор заполнения',
      'Защитная крышка в комплекте',
      'Совместим со всеми маркерами',
    ],
    description: 'Высококачественный баллон для сжатого воздуха с встроенным регулятором давления. Карбоновый корпус обеспечивает минимальный вес при максимальной надёжности.',
  },
  'Защита': {
    specs: [
      { label: 'Материал',        value: 'EVA + Лайкра' },
      { label: 'Защита',          value: 'Грудь, спина, рёбра' },
      { label: 'Размеры',         value: 'S / M / L / XL' },
      { label: 'Вес',             value: '420 г' },
      { label: 'Стирка',          value: 'Машинная, 30°C' },
      { label: 'Страна',          value: 'Германия' },
    ],
    features: [
      'Многозональная защита от попаданий',
      'Дышащий сетчатый материал',
      'Регулируемые ремни',
      'Не стесняет движений',
      'Быстрое надевание',
    ],
    description: 'Профессиональная защита для пейнтбола. Многослойные EVA-накладки поглощают энергию удара, а эргономичный крой обеспечивает свободу движений во время игры.',
  },
  'Аксессуары': {
    specs: [
      { label: 'Совместимость',   value: 'Универсальная' },
      { label: 'Материал',        value: 'Поликарбонат' },
      { label: 'Ёмкость',         value: '200 шаров' },
      { label: 'Скорость подачи', value: 'до 30 шаров/сек' },
      { label: 'Питание',         value: '9V батарейка' },
      { label: 'Вес',             value: '340 г' },
    ],
    features: [
      'Высокоскоростная подача шаров',
      'Бесшумная работа',
      'Индикатор заряда батареи',
      'Прозрачный корпус для контроля уровня',
      'Быстрая разборка для чистки',
    ],
    description: 'Высококачественный аксессуар для улучшения игровых характеристик. Надёжная конструкция и простота в обслуживании делают его идеальным выбором для игроков любого уровня.',
  },
};

const REVIEWS_DATA = [
  { name: 'Алексей М.',  rating: 5, date: '15 марта 2025',   text: 'Отличный товар! Полностью соответствует описанию. Доставка быстрая, упаковка надёжная. Рекомендую всем.' },
  { name: 'Дмитрий К.',  rating: 5, date: '2 апреля 2025',   text: 'Купил для соревнований — не пожалел. Качество на высоте, удобно в использовании. Буду брать ещё.' },
  { name: 'Сергей В.',   rating: 4, date: '18 апреля 2025',  text: 'Хорошее качество за свои деньги. Небольшие нюансы при настройке, но в целом доволен покупкой.' },
  { name: 'Иван П.',     rating: 5, date: '5 мая 2025',      text: 'Превзошёл ожидания. Очень доволен покупкой, советую всем любителям пейнтбола.' },
];

export default function ProductPage({ product, onClose, onOpenAuth, onAdded }) {
  const { addToCart } = useCart();
  const { isAuth } = useAuth();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return null;

  const badge = product.badge ? BADGE_STYLES[product.badge] : null;
  const info = CATEGORY_SPECS[product.category] || CATEGORY_SPECS['Аксессуары'];
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  function handleAdd() {
    if (!isAuth) { onOpenAuth?.(); return; }
    for (let i = 0; i < qty; i++) addToCart(product);
    onAdded?.(product);
    onClose();
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/75 z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <div className="bg-[#111214] border border-[#2a2d35] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-[#e8f216] to-[#c8d200] sticky top-0 z-10" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 border border-[#2a2d35] text-[#6b7280] hover:text-white hover:border-white flex items-center justify-center transition-all"
          >✕</button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left — image */}
            <div className="relative bg-[#0d0f14] flex items-center justify-center min-h-[320px] md:min-h-[480px] p-12">
              {/* Pattern bg */}
              <div className="absolute inset-0" style={{
                background: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(232,242,22,0.015) 20px,rgba(232,242,22,0.015) 21px)',
              }} />
              {/* Glow */}
              <div className="absolute w-72 h-72 rounded-full pointer-events-none" style={{
                background: 'radial-gradient(circle,rgba(232,242,22,0.1) 0%,transparent 70%)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              }} />

              {/* Badge */}
              {badge && (
                <span className={`absolute top-6 left-6 font-['Barlow_Condensed'] text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 z-10 ${badge.cls}`}
                  style={{ clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
                  {badge.label}
                </span>
              )}
              {discount && (
                <span className="absolute top-6 right-6 bg-[#ff3c2e] text-white font-['Barlow_Condensed'] font-black text-lg px-3 py-1">
                  −{discount}%
                </span>
              )}

              <span className="text-[160px] relative z-10 drop-shadow-2xl select-none" style={{
                filter: 'drop-shadow(0 0 40px rgba(232,242,22,0.15))',
              }}>
                {product.emoji}
              </span>
            </div>

            {/* Right — info */}
            <div className="p-8 md:p-10 flex flex-col">
              {/* Brand + category */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.2em] uppercase text-[#e8f216]">
                  {product.brand}
                </span>
                <span className="text-[#2a2d35]">·</span>
                <span className="font-['Barlow_Condensed'] text-[11px] tracking-widest uppercase text-[#6b7280]">
                  {product.category}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-['Barlow_Condensed'] font-black text-[clamp(28px,3vw,42px)] uppercase text-white leading-none mb-4">
                {product.brand} {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={`text-base ${i <= product.rating ? 'text-[#e8f216]' : 'text-[#2a2d35]'}`}>★</span>
                  ))}
                </div>
                <span className="text-[#6b7280] text-sm">{product.rating}.0</span>
                <span className="text-[#2a2d35]">·</span>
                <span className="text-[#6b7280] text-sm">{product.reviews} отзывов</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-[#2a2d35]">
                <div className="font-['Barlow_Condensed'] font-black text-5xl text-white leading-none">
                  {product.price.toLocaleString('ru')} ₽
                </div>
                {product.old_price && (
                  <div>
                    <div className="font-['Barlow_Condensed'] text-xl text-[#6b7280] line-through leading-none">
                      {product.old_price.toLocaleString('ru')} ₽
                    </div>
                    <div className="text-[#e8f216] text-xs font-bold mt-1">
                      Экономия {(product.old_price - product.price).toLocaleString('ru')} ₽
                    </div>
                  </div>
                )}
              </div>

              {/* Qty + Add */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-[#2a2d35]">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-12 text-[#6b7280] hover:text-[#e8f216] transition-colors text-xl flex items-center justify-center"
                  >−</button>
                  <span className="w-10 text-center text-white font-['Barlow_Condensed'] font-bold text-lg">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-12 text-[#6b7280] hover:text-[#e8f216] transition-colors text-xl flex items-center justify-center"
                  >+</button>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex-1 font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase py-4 transition-all ${
                    isAuth
                      ? 'bg-[#e8f216] text-[#0a0a0a] hover:bg-white'
                      : 'bg-[#2a2d35] text-[#6b7280] hover:bg-[#e8f216] hover:text-[#0a0a0a]'
                  }`}
                  style={{ clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)' }}
                >
                  {isAuth ? `В корзину · ${(product.price * qty).toLocaleString('ru')} ₽` : '🔒 Войдите для покупки'}
                </button>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-[#6b7280]">В наличии · Отправка в течение 24 часов</span>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-2">
                {info.specs.slice(0, 4).map(s => (
                  <div key={s.label} className="bg-[#16181c] px-3 py-2.5">
                    <div className="font-['Barlow_Condensed'] text-[10px] tracking-widest uppercase text-[#6b7280] mb-0.5">{s.label}</div>
                    <div className="font-['Barlow_Condensed'] font-bold text-sm text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-[#2a2d35]">
            <div className="flex border-b border-[#2a2d35] px-8">
              {[
                { id: 'description', label: 'Описание' },
                { id: 'specs',       label: 'Характеристики' },
                { id: 'features',    label: 'Особенности' },
                { id: 'reviews',     label: `Отзывы (${product.reviews})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase py-4 px-6 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#e8f216] border-[#e8f216]'
                      : 'text-[#6b7280] border-transparent hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 md:p-10">
              {/* Description */}
              {activeTab === 'description' && (
                <div className="max-w-2xl">
                  <p className="text-[#a0a8b8] leading-relaxed text-base mb-6">{info.description}</p>
                  <p className="text-[#6b7280] leading-relaxed text-sm">
                    Снаряжение прошло многоступенчатый контроль качества перед отправкой.
                    Мы гарантируем оригинальность и соответствие заявленным характеристикам.
                    В комплект входит официальная гарантийная карта производителя.
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {[
                      { icon: '🛡️', title: 'Гарантия 1 год',      sub: 'Официальная гарантия' },
                      { icon: '📦', title: 'Быстрая доставка',    sub: 'от 1 до 5 дней' },
                      { icon: '↩️', title: 'Возврат 30 дней',     sub: 'Без вопросов' },
                    ].map(item => (
                      <div key={item.title} className="bg-[#16181c] p-4 text-center border border-[#2a2d35]">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div className="font-['Barlow_Condensed'] font-bold text-xs uppercase text-white mb-1">{item.title}</div>
                        <div className="text-xs text-[#6b7280]">{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs */}
              {activeTab === 'specs' && (
                <div className="max-w-lg">
                  <div className="divide-y divide-[#2a2d35]">
                    {info.specs.map((s, i) => (
                      <div key={s.label} className={`flex justify-between py-3.5 ${i % 2 === 0 ? '' : 'bg-[#16181c]/30'} px-2`}>
                        <span className="font-['Barlow_Condensed'] text-sm uppercase tracking-wider text-[#6b7280]">{s.label}</span>
                        <span className="font-['Barlow_Condensed'] font-bold text-sm text-white">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {activeTab === 'features' && (
                <div className="max-w-lg">
                  <ul className="space-y-3">
                    {info.features.map(f => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="text-[#e8f216] mt-0.5 flex-shrink-0 font-bold">✓</span>
                        <span className="font-['Barlow_Condensed'] font-semibold text-base text-white">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews */}
              {activeTab === 'reviews' && (
                <div className="max-w-2xl space-y-4">
                  {/* Summary */}
                  <div className="flex items-center gap-6 bg-[#16181c] border border-[#2a2d35] p-6 mb-6">
                    <div className="text-center">
                      <div className="font-['Barlow_Condensed'] font-black text-6xl text-[#e8f216] leading-none">{product.rating}.0</div>
                      <div className="flex justify-center gap-0.5 mt-2">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className={`text-lg ${i <= product.rating ? 'text-[#e8f216]' : 'text-[#2a2d35]'}`}>★</span>
                        ))}
                      </div>
                      <div className="text-xs text-[#6b7280] mt-1">{product.reviews} отзывов</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(star => {
                        const pct = star === product.rating ? 68 : star === product.rating - 1 ? 22 : star > product.rating ? 0 : 5;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-[#6b7280] w-3">{star}</span>
                            <div className="flex-1 bg-[#2a2d35] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#e8f216] h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-[#6b7280] w-6">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review cards */}
                  {REVIEWS_DATA.map((r, i) => (
                    <div key={i} className="bg-[#16181c] border border-[#2a2d35] p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#e8f216] flex items-center justify-center font-['Barlow_Condensed'] font-black text-sm text-[#0a0a0a]">
                            {r.name[0]}
                          </div>
                          <div>
                            <div className="font-['Barlow_Condensed'] font-bold text-sm uppercase text-white">{r.name}</div>
                            <div className="text-xs text-[#6b7280]">{r.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <span key={i} className={`text-sm ${i <= r.rating ? 'text-[#e8f216]' : 'text-[#2a2d35]'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#a0a8b8] leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
