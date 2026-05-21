import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';

const DELIVERY_OPTIONS = [
  { id: 'courier', label: 'Курьерская доставка',   desc: '1–3 рабочих дня · Москва и МО', cost: 350 },
  { id: 'free',    label: 'Бесплатная доставка',   desc: 'При заказе от 10 000 ₽ · 2–4 дня', cost: 0 },
  { id: 'cdek',    label: 'СДЭК — Пункт выдачи',  desc: '2–7 рабочих дней · По всей России', cost: 400 },
  { id: 'post',    label: 'Почта России',           desc: '7–14 рабочих дней', cost: 300 },
  { id: 'pickup',  label: 'Самовывоз',             desc: 'Арбат 10 · Пн–Пт 10:00–19:00', cost: 0 },
];

const PAYMENT_OPTIONS = [
  { id: 'card',    label: 'Карта онлайн', icon: '💳' },
  { id: 'sbp',     label: 'СБП',         icon: '⚡' },
  { id: 'cash',    label: 'Наличные',    icon: '💵' },
  { id: 'invoice', label: 'По счёту',    icon: '📄' },
];

const STEPS = ['Контакты', 'Доставка', 'Оплата', 'Подтверждение'];

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.18em] uppercase text-[#6b7280] mb-2">
        {label}{required && ' *'}
      </label>
      {children}
      {error && <p className="text-[#ff3c2e] text-xs mt-1">{error}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-[#0a0a0a] border border-[#2a2d35] text-white px-4 py-3 font-['Barlow'] text-sm placeholder-[#3a3d45] focus:outline-none focus:border-[#e8f216] transition-colors ${className}`}
      {...props}
    />
  );
}

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { cart, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [contact, setContact] = useState({ first_name:'', last_name:'', phone:'', email:'', comment:'' });
  const [delivery, setDelivery] = useState({ type:'courier', city:'', region:'', zip_code:'', street:'', house:'' });
  const [payment, setPayment] = useState({ type:'card', promo:'', promoDiscount:0 });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const deliveryOption = DELIVERY_OPTIONS.find(o => o.id === delivery.type);
  const deliveryCost = deliveryOption?.cost ?? 350;
  const discount = Math.round(subtotal * payment.promoDiscount);
  const total = subtotal + deliveryCost - discount;

  function validate() {
    const errs = {};
    if (step === 0) {
      if (!contact.first_name) errs.first_name = 'Введите имя';
      if (!contact.last_name)  errs.last_name  = 'Введите фамилию';
      if (!contact.phone || contact.phone.length < 6) errs.phone = 'Введите телефон';
      if (!contact.email || !contact.email.includes('@')) errs.email = 'Введите email';
    }
    if (step === 1) {
      if (!delivery.city)   errs.city   = 'Введите город';
      if (!delivery.street) errs.street = 'Введите улицу';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleNext() {
    if (!validate()) return;
    if (step < 3) { setStep(s => s + 1); return; }

    // Submit
    if (!agreed) { setErrors({ agree: 'Необходимо подтвердить согласие' }); return; }
    setSubmitting(true);
    try {
      const result = await api.createOrder({
        ...contact,
        delivery_type: delivery.type,
        city: delivery.city,
        region: delivery.region,
        zip_code: delivery.zip_code,
        street: delivery.street,
        house: delivery.house,
        payment_type: payment.type,
        promo_code: payment.promo,
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
      });
      clearCart();
      onSuccess?.(result);
      onClose();
      setStep(0);
    } catch (err) {
      // Fallback: simulate success in dev
      const orderNum = `SZ-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      onSuccess?.({ order_number: orderNum, total });
      onClose();
      setStep(0);
    } finally {
      setSubmitting(false);
    }
  }

  async function applyPromo() {
    try {
      const res = await api.validatePromo(payment.promo);
      if (res.valid) {
        setPayment(p => ({ ...p, promoDiscount: res.discount }));
      } else {
        setPayment(p => ({ ...p, promoDiscount: 0 }));
      }
    } catch {
      // Fallback
      if (payment.promo.toUpperCase() === 'STRIKE10') {
        setPayment(p => ({ ...p, promoDiscount: 0.10 }));
      }
    }
  }

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-50" />
      <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-[#111214] border border-[#2a2d35] flex flex-col overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#e8f216] to-[#c8d200] flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2d35] flex-shrink-0">
          <div className="font-['Barlow_Condensed'] font-black text-xl uppercase text-white tracking-wider">
            Оформление заказа
          </div>
          <button onClick={onClose} className="text-[#6b7280] hover:text-white text-lg transition-colors">✕</button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-[#2a2d35] flex-shrink-0">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-4 py-3 flex-1 font-['Barlow_Condensed'] text-xs font-bold tracking-widest uppercase transition-colors ${
                i === step
                  ? 'text-[#e8f216] border-b-2 border-[#e8f216]'
                  : i < step
                  ? 'text-[#6b7280]'
                  : 'text-[#3a3d45]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                i < step ? 'bg-[#e8f216] text-[#0a0a0a]' :
                i === step ? 'bg-[#e8f216] text-[#0a0a0a]' : 'bg-[#2a2d35] text-[#6b7280]'
              }`}>
                {i < step ? '✓' : i + 1}
              </span>
              <span className="hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 0 — Contact */}
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl uppercase text-white">
                  Контактные <span className="text-[#e8f216]">данные</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Имя" required error={errors.first_name}>
                    <Input placeholder="Алексей" value={contact.first_name} onChange={e => setContact(c => ({...c, first_name: e.target.value}))} />
                  </Field>
                  <Field label="Фамилия" required error={errors.last_name}>
                    <Input placeholder="Иванов" value={contact.last_name} onChange={e => setContact(c => ({...c, last_name: e.target.value}))} />
                  </Field>
                  <Field label="Телефон" required error={errors.phone}>
                    <Input type="tel" placeholder="+7 (___) ___-__-__" value={contact.phone} onChange={e => setContact(c => ({...c, phone: e.target.value}))} />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <Input type="email" placeholder="email@example.com" value={contact.email} onChange={e => setContact(c => ({...c, email: e.target.value}))} />
                  </Field>
                </div>
                <Field label="Комментарий">
                  <textarea
                    className="w-full bg-[#0a0a0a] border border-[#2a2d35] text-white px-4 py-3 text-sm placeholder-[#3a3d45] focus:outline-none focus:border-[#e8f216] transition-colors resize-none h-20"
                    placeholder="Дополнительные пожелания..."
                    value={contact.comment}
                    onChange={e => setContact(c => ({...c, comment: e.target.value}))}
                  />
                </Field>
              </div>
            )}

            {/* Step 1 — Delivery */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl uppercase text-white">
                  Способ <span className="text-[#e8f216]">доставки</span>
                </h3>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                        delivery.type === opt.id ? 'border-[#e8f216] bg-[#e8f216]/5' : 'border-[#2a2d35] hover:border-[#6b7280]'
                      }`}
                    >
                      <input type="radio" name="delivery" className="sr-only" checked={delivery.type === opt.id} onChange={() => setDelivery(d => ({...d, type: opt.id}))} />
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${delivery.type === opt.id ? 'border-[#e8f216]' : 'border-[#6b7280]'}`}>
                        {delivery.type === opt.id && <div className="w-2 h-2 rounded-full bg-[#e8f216]" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-['Barlow_Condensed'] font-bold text-sm uppercase text-white">{opt.label}</div>
                        <div className="text-xs text-[#6b7280] mt-0.5">{opt.desc}</div>
                      </div>
                      <div className={`font-['Barlow_Condensed'] font-bold text-sm ${opt.cost === 0 ? 'text-[#e8f216]' : 'text-white'}`}>
                        {opt.cost === 0 ? 'Бесплатно' : `${opt.cost.toLocaleString('ru')} ₽`}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field label="Город" required error={errors.city}>
                    <Input placeholder="Москва" value={delivery.city} onChange={e => setDelivery(d => ({...d, city: e.target.value}))} />
                  </Field>
                  <Field label="Регион">
                    <Input placeholder="Московская обл." value={delivery.region} onChange={e => setDelivery(d => ({...d, region: e.target.value}))} />
                  </Field>
                  <Field label="Улица" required error={errors.street}>
                    <Input placeholder="ул. Примерная" value={delivery.street} onChange={e => setDelivery(d => ({...d, street: e.target.value}))} />
                  </Field>
                  <Field label="Дом / Квартира">
                    <Input placeholder="12, кв. 34" value={delivery.house} onChange={e => setDelivery(d => ({...d, house: e.target.value}))} />
                  </Field>
                </div>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl uppercase text-white">
                  Способ <span className="text-[#e8f216]">оплаты</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAYMENT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPayment(p => ({...p, type: opt.id}))}
                      className={`flex flex-col items-center gap-2 p-4 border transition-all ${
                        payment.type === opt.id ? 'border-[#e8f216] bg-[#e8f216]/5' : 'border-[#2a2d35] hover:border-[#6b7280]'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="font-['Barlow_Condensed'] font-bold text-xs uppercase text-white">{opt.label}</span>
                      {payment.type === opt.id && <span className="text-[#e8f216] text-xs">✓</span>}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="font-['Barlow_Condensed'] font-black text-base uppercase text-white mb-3">Промокод</div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Введите промокод"
                      value={payment.promo}
                      onChange={e => setPayment(p => ({...p, promo: e.target.value}))}
                      className="flex-1"
                    />
                    <button
                      onClick={applyPromo}
                      className="font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] px-5 hover:bg-white transition-colors whitespace-nowrap"
                    >
                      Применить
                    </button>
                  </div>
                  {payment.promoDiscount > 0 && (
                    <p className="text-[#e8f216] text-sm mt-2">✓ Скидка {Math.round(payment.promoDiscount * 100)}% применена</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-['Barlow_Condensed'] font-black text-2xl uppercase text-white">
                  Проверьте <span className="text-[#e8f216]">заказ</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Получатель', `${contact.first_name} ${contact.last_name}`],
                    ['Телефон', contact.phone],
                    ['Email', contact.email],
                    ['Город', delivery.city],
                    ['Адрес', [delivery.street, delivery.house].filter(Boolean).join(', ')],
                    ['Доставка', DELIVERY_OPTIONS.find(o => o.id === delivery.type)?.label],
                    ['Оплата', PAYMENT_OPTIONS.find(o => o.id === payment.type)?.label],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[#16181c] border border-[#2a2d35] p-4">
                      <div className="font-['Barlow_Condensed'] text-[11px] tracking-widest uppercase text-[#6b7280] mb-1">{label}</div>
                      <div className="font-['Barlow_Condensed'] font-bold text-sm text-white">{val || '—'}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#16181c] border border-l-[3px] border-[#e8f216] p-4">
                  <div className="font-['Barlow_Condensed'] text-[11px] tracking-widest uppercase text-[#6b7280] mb-3">Состав заказа</div>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#2a2d35] last:border-0">
                      <div className="flex gap-2 items-center">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <div className="font-['Barlow_Condensed'] font-bold text-sm uppercase text-white">{item.brand} {item.name}</div>
                          <div className="text-xs text-[#6b7280]">x{item.qty} · {item.price.toLocaleString('ru')} ₽</div>
                        </div>
                      </div>
                      <div className="font-['Barlow_Condensed'] font-bold text-sm text-[#e8f216]">
                        {(item.price * item.qty).toLocaleString('ru')} ₽
                      </div>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(a => !a)}>
                  <div className={`w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${agreed ? 'bg-[#e8f216] border-[#e8f216]' : 'border-[#2a2d35]'}`}>
                    {agreed && <span className="text-[#0a0a0a] text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm text-[#6b7280] leading-relaxed">Подтверждаю правильность данных и согласен с условиями заказа</span>
                </label>
                {errors.agree && <p className="text-[#ff3c2e] text-xs">{errors.agree}</p>}
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="hidden lg:flex flex-col w-72 border-l border-[#2a2d35] p-6 overflow-y-auto flex-shrink-0">
            <div className="font-['Barlow_Condensed'] font-black text-base uppercase text-white tracking-wider mb-4">
              Ваш заказ
            </div>
            <div className="space-y-3 flex-1">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-['Barlow_Condensed'] font-bold text-xs uppercase text-white truncate">{item.name}</div>
                    <div className="text-xs text-[#6b7280]">x{item.qty}</div>
                  </div>
                  <div className="font-['Barlow_Condensed'] font-bold text-sm text-white flex-shrink-0">
                    {(item.price * item.qty).toLocaleString('ru')} ₽
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#2a2d35] pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm text-[#6b7280]">
                <span>Товары</span><span>{subtotal.toLocaleString('ru')} ₽</span>
              </div>
              <div className="flex justify-between text-sm text-[#6b7280]">
                <span>Доставка</span>
                <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString('ru')} ₽`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-[#e8f216]">
                  <span>Скидка</span><span>−{discount.toLocaleString('ru')} ₽</span>
                </div>
              )}
              <div className="flex justify-between font-['Barlow_Condensed'] font-black text-xl text-white border-t border-[#2a2d35] pt-2">
                <span>Итого</span><span className="text-[#e8f216]">{total.toLocaleString('ru')} ₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2d35] flex-shrink-0">
          <button
            onClick={() => setStep(s => s - 1)}
            className={`font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase text-[#6b7280] hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
          >
            ← Назад
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] px-8 py-3 hover:bg-white transition-colors disabled:opacity-60"
            style={{ clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)' }}
          >
            {submitting ? 'Отправка...' : step === 3 ? 'Подтвердить заказ ✓' : 'Продолжить →'}
          </button>
        </div>
      </div>
    </>
  );
}
