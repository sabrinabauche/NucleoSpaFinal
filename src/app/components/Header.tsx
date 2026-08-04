'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './header.css';
import AppBtn from './AppBtn';
import Nav from './Nav';
import Logo from './Logo';

export default function Header() {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const pathname = usePathname();
  const isInnerPage = pathname !== '/';

  useEffect(() => {
    const handleScroll = () => setIsPastThreshold(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = isInnerPage || isPastThreshold;

  return (
    <header
      id="header"
      className={`fixed-top d-flex align-items-center ${scrolled ? 'header-scrolled' : ''}`}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="logo">
          <a href="/">
            <Logo className="header-logo" />
          </a>
        </div>
        <Nav />
        <AppBtn name="Agendar tratamiento" />
      </div>
    </header>
  );
}
