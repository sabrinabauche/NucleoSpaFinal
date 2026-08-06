'use client';
import { memberships } from '../data/memberships';
import './membresias.css';

export default function Membresias() {
  return (
    <section id="membresias" className="mem-section">

      <div className="mem-header">
        <span className="mem-header__label">Cuidado continuo</span>
        <h2 className="mem-header__title">Membresías</h2>
        <div className="mem-header__line" />
        <p className="mem-header__sub">
          Resultados que duran cuando el cuidado es constante.
        </p>
      </div>

      <div className="mem-grid">
        {memberships.map((m) => (
          <div
            key={m.id}
            className={`mem-card ${m.highlight ? 'mem-card--highlight' : ''}`}
          >
            {m.badge && (
              <span className="mem-card__badge">{m.badge}</span>
            )}

            <div className="mem-card__top">
              <p className="mem-card__name">{m.name}</p>
              <div className="mem-card__divider" />
            </div>

            <ul className="mem-card__features">
              {m.features.map((f, i) => (
                <li key={i} className="mem-card__feature">
                  <span className="mem-card__dot">◆</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              className="mem-card__cta"
              href={`https://wa.me/525528425370?text=${encodeURIComponent(`Hola, me interesa la membresía ${m.name} de Núcleo Clinique`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar
            </a>
          </div>
        ))}
      </div>


    </section>
  );
}
