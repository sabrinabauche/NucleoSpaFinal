'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./tratamientos.css";
import SectionTitle from "../components/SectionTitle";
import TreatmentCard from "../components/TarjetaTratamientos";
import { treatments } from "../data/treatments";

export default function Tratamientos() {
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;
      if (width <= 719) setCardsPerRow(1);
      else if (width <= 978) setCardsPerRow(2);
      else setCardsPerRow(3);
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  const visibleTreatments = treatments.slice(0, cardsPerRow);

  return (
    <section id="tratamientos">
      <div className="texto">
        <SectionTitle
          title="Tratamientos"
          subtitle="Cada tratamiento inicia con un diagnóstico gratuito"
        />
      </div>

      <div className="treatments-grid">
        {visibleTreatments.map((t, index) => (
          <TreatmentCard
            key={index}
            image={t.image}
            title={t.title}
            description={t.description}
            slug={t.slug}
          />
        ))}
      </div>

      <div className="ver-mas-container">
        <button
          onClick={() => router.push('/tratamientos')}
          className="ver-mas-btn"
        >
          Ver más
        </button>
      </div>
    </section>
  );
}
