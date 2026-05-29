'use client'
import React, { useState, useEffect } from 'react';
import { navs } from '../data/data';
import './nav.css';

const SECTION_MAP: Record<string, string> = {
  treatments: 'tratamientos',
  reviews: 'resenas',
  contact: 'agendar',
};

const SECTIONS = [
  { id: 'tratamientos', target: 'treatments' },
  { id: 'resenas',      target: 'reviews'    },
  { id: 'agendar',      target: 'contact'    },
];

export default function Nav() {
  const [navlist, setNavlist] = useState(navs);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const detect = () => {
      const scrollY = window.scrollY;
      const trigger = 200; // px from top before a section is considered active

      let activeTarget = '';
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && scrollY >= el.offsetTop - trigger) {
          activeTarget = SECTIONS[i].target;
          break;
        }
      }

      setNavlist(prev => prev.map(nav => ({
        ...nav,
        active: nav.target === activeTarget,
      })));
    };

    window.addEventListener('scroll', detect, { passive: true });
    detect(); // set correct state on mount
    return () => window.removeEventListener('scroll', detect);
  }, []);

  const handleToggleMenu = () => setOpen(prev => !prev);

  const handleScrollTo = (target: string) => {
    const id = SECTION_MAP[target];
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav id="navbar" className={`navbar ${open ? 'navbar-mobile' : ''}`}>
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
        {open && (
          <li className="mobile-app-btn">
            <a
              className="app-btn mobile-version"
              onClick={() => {
                handleScrollTo('contact');
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
