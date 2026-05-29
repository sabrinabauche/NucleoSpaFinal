'use client';

import { useState } from "react";
import { treatments } from "../data/treatments";
import TreatmentCard from "../components/TarjetaTratamientos";
import SectionTitle from "../components/SectionTitle";
import "./tratamientosList.css";

export default function TratamientosPage() {
  const [query, setQuery] = useState('');

  const filtered = treatments.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="treatments-page">

      <div className="treatments-page__header">
        <SectionTitle
          title="Tratamientos"
          subtitle="Cada tratamiento inicia con un diagnóstico gratuito"
        />
        <div className="treatments-search">
          <i className="bi bi-search treatments-search__icon" />
          <input
            type="text"
            placeholder="Buscar tratamiento..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="treatments-page__grid">
        {filtered.length > 0 ? (
          filtered.map((t, i) => (
            <TreatmentCard key={i} image={t.image} title={t.title} description={t.description} slug={t.slug} />
          ))
        ) : (
          <p className="no-results">No se encontró ningún tratamiento.</p>
        )}
      </div>

    </main>
  );
}
