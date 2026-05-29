'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const selectors = [
      '.texto',
      '.treatments-grid',
      '.ver-mas-container',
      '.agendar-section__title',
      '.bs-wrapper',
      '.treatment-detail__image',
      '.treatment-detail__content',
      '.treatment-detail-booking',
      '.treatments-page__header',
      '.treatments-page__grid',
    ];

    const targets = document.querySelectorAll(selectors.join(', '));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => {
      el.classList.add('will-reveal');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
