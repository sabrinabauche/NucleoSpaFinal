'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './topBar.css';

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname !== '/') return null;

  return (
    <div
      id="topbar"
      className={`d-flex align-items-center fixed-top ${scrolled ? 'topbar-scrolled' : ''}`}
    >
      <div className="container d-flex justify-content-center justify-content-md-between">
        <div className="languages d-none d-md-flex align-items-center" />
      </div>
    </div>
  );
}
