'use client';

import './heroBtn.css';
import { useBooking } from '../context/BookingContext';

type HeroBtnProps = {
  name: string;
  target: string;
};

export default function HeroBtn({ name, target }: HeroBtnProps) {
  const { openModal } = useBooking();

  const handleClick = () => {
    openModal(target === 'contact' ? 'diagnostico' : '');
  };

  return (
    <a
      onClick={handleClick}
      className={`btn-hero animated fadeInUp ${target === 'contact' ? 'ms-4' : ''}`}
    >
      {name}
    </a>
  );
}
