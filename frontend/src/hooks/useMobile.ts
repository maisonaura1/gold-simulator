'use client';
import { useState, useEffect } from 'react';

export function useMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    const mq = window.matchMedia('(max-width: 767px)');
    mq.addEventListener('change', (e) => setMobile(e.matches));
    return () => mq.removeEventListener('change', (e) => setMobile(e.matches));
  }, []);

  return mobile;
}
