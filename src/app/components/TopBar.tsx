'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './topBar.css';

export default function TopBar() {
  const [scroll, setScroll] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname !== '/') return null;

  return (
    <div
      id="topbar"
      className={`d-flex align-items-center fixed-top ${scroll > 100 ? 'topbar-scrolled' : ''}`}
    >
      <div className="container d-flex justify-content-center justify-content-md-between">
        <div className="languages d-none d-md-flex align-items-center" />
      </div>
    </div>
  );
}
