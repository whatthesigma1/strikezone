import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

// Fallback static data for development without backend
const FALLBACK_PRODUCTS = [
  { id:1,  name:'M3+',          brand:'Dye',            category:'Маркеры',    emoji:'🎯', price:89990, old_price:null,  badge:'hit',  rating:5, reviews:128 },
  { id:2,  name:'CS3',          brand:'Planet Eclipse', category:'Маркеры',    emoji:'🎯', price:74500, old_price:null,  badge:'new',  rating:5, reviews:64  },
  { id:3,  name:'Axe 2.0',      brand:'Empire',         category:'Маркеры',    emoji:'🎯', price:32900, old_price:41000, badge:'sale', rating:4, reviews:211 },
  { id:4,  name:'i5 Goggle',    brand:'Dye',            category:'Маски',      emoji:'🥽', price:22500, old_price:null,  badge:'hit',  rating:5, reviews:345 },
  { id:5,  name:'EVS',          brand:'Empire',         category:'Маски',      emoji:'🥽', price:18900, old_price:24000, badge:'sale', rating:4, reviews:89  },
  { id:6,  name:'HSTL',         brand:'HK Army',        category:'Маски',      emoji:'🥽', price:9990,  old_price:null,  badge:'new',  rating:4, reviews:52  },
  { id:7,  name:'SL2 68ci',     brand:'Ninja',          category:'Баллоны',    emoji:'💨', price:16500, old_price:null,  badge:null,   rating:5, reviews:73  },
  { id:8,  name:'Carbon Fiber', brand:'Empire',         category:'Баллоны',    emoji:'💨', price:12800, old_price:15000, badge:'sale', rating:4, reviews:41  },
  { id:9,  name:'Pad Set',      brand:'HK Army',        category:'Защита',     emoji:'🛡️', price:6500,  old_price:null,  badge:'new',  rating:4, reviews:167 },
  { id:10, name:'Primo Loader', brand:'Proto',          category:'Аксессуары', emoji:'📦', price:3200,  old_price:null,  badge:null,   rating:4, reviews:93  },
  { id:11, name:'Spire IV',     brand:'Virtue',         category:'Аксессуары', emoji:'📦', price:14900, old_price:null,  badge:'hit',  rating:5, reviews:208 },
  { id:12, name:'Cronus',       brand:'Tippmann',       category:'Маркеры',    emoji:'🎯', price:18500, old_price:null,  badge:null,   rating:4, reviews:512 },
];

export function useProducts(category = '') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = category && category !== 'Все' ? { category } : {};
      const data = await api.getProducts(params);
      setProducts(data);
    } catch {
      // Use fallback data when backend unavailable
      const filtered = category && category !== 'Все'
        ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
        : FALLBACK_PRODUCTS;
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  return { products, loading, error, refetch: load };
}
