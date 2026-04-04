import React from 'react'
import './heroBtn.css';

type HeroBtnProps = {
  name: string;
  target: string;
};

export default function HeroBtn({ name, target }: HeroBtnProps) {
  const handleScrollTo = (section: string) => {};

  return (
    <a
      onClick={() => handleScrollTo(target)}
      className={`btn-hero animated fadeInUp scrollto ${
        name.toLowerCase().includes("book") ? "ms-4" : ""
      }`}
    >
      {name}
    </a>
  );
}
