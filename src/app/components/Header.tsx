'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './header.css';
import AppBtn from './AppBtn';
import Nav from './Nav';
import Logo from './Logo';

export default function Header() {
  const [scroll, setScroll] = useState(0);
  const pathname = usePathname();
  const isInnerPage = pathname !== '/';

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = isInnerPage || scroll > 100;

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
