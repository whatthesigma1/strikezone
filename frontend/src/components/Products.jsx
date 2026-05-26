import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

const FILTERS = ['Все', 'Маркеры', 'Маски', 'Баллоны', 'Защита', 'Аксессуары'];

export default function Products({ onProductAdded, onOpenAuth }) {
  const [activeFilter, setActiveFilter] = useState('Все');
  const { products, loading } = useProducts(activeFilter);

  return (
    <section id="products" className="py-24 px-10 md:px-20 bg-[#0a0a0a]">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.25em] uppercase text-[#e8f216] mb-3">Ассортимент</div>
          <h2 className="font-['Barlow_Condensed'] font-black text-[clamp(36px,4vw,56px)] uppercase text-white leading-none">Товары</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-12">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`font-['Barlow_Condensed'] font-semibold text-[13px] tracking-widest uppercase px-5 py-2 border transition-all ${
              activeFilter === f
                ? 'bg-[#e8f216] border-[#e8f216] text-[#0a0a0a]'
                : 'bg-transparent border-[#2a2d35] text-[#6b7280] hover:bg-[#e8f216] hover:border-[#e8f216] hover:text-[#0a0a0a]'
            }`}
          >{f}</button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-[#16181c] h-96 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdded={onProductAdded} onOpenAuth={onOpenAuth} />
          ))}
        </div>
      )}
    </section>
  );
}
