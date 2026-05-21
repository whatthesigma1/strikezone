import { useEffect, useState } from 'react';

export default function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 2500);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#e8f216] text-[#0a0a0a] font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-6 py-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)' }}
    >
      {message}
    </div>
  );
}
