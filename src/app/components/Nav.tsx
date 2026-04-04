'use client'
import React, { useState, useEffect } from 'react';

import { navs } from '../data/data';
import './nav.css';

export default function Nav() {
  const [navlist, setNavlist] = useState(navs);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggleMenu = () => {
    setOpen(!open);
  };

  const handleScrollTo = (section: string) => {
    // function
  };

  const handleNavActive = () => {
    // function
  };

  return (
    <nav
      id="navbar"
      className={`navbar order-last order-lg-0 ${
        open ? 'navbar-mobile' : ''
      }`}
    >
      <ul>
  {navlist.map((nav) => (
    <li key={nav.id}>
      <a
        className={`nav-link scrollto ${nav.active ? 'active' : ''}`}
        onClick={() => {
          handleScrollTo(nav.target);
          setOpen(false);
        }}
      >
        {nav.name}
      </a>
    </li>
  ))}

  {/* 👇 BOTÓN AGREGADO */}
  {open && (
    <li className="mobile-app-btn">
      <a
        className="app-btn mobile-version"
        onClick={() => {
          handleScrollTo('contact'); // o la sección que quieras
          setOpen(false);
        }}
      >
        Agendar consulta
      </a>
    </li>
  )}
</ul>

    <i
    className={`bi ${open ? 'bi-x' : 'bi-list'} mobile-nav-toggle`}
    onClick={handleToggleMenu}
    />
    </nav>
  );
}