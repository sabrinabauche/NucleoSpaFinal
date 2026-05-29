import Link from "next/link";
import BookingSection from "./BookingSection";
import "./treatmentDetail.css";

type TreatmentDetailProps = {
  slug: string;
  image: string;
  title: string;
  duration: string;
  description: string;
  machinery?: string[];
  benefits: string[];
  warning?: string;
};

export default function TreatmentDetail({
  slug,
  image,
  title,
  duration,
  description,
  machinery,
  benefits,
  warning,
}: TreatmentDetailProps) {
  return (
    <div className="td-page">

      {/* ── HERO ── */}
      <div className="td-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="td-hero__overlay" />
        <Link href="/#tratamientos" className="td-back">← Volver</Link>
        <div className="td-hero__title">
          <h1>{title}</h1>
          <div className="td-hero__line" />
          <p className="td-hero__duration">{duration}</p>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="td-stats">
        <div className="td-stat">
          <i className="bi bi-clock td-stat__icon" />
          <div className="td-stat__text">
            <span className="td-stat__label">Duración</span>
            <span className="td-stat__value">{duration}</span>
          </div>
        </div>
        {machinery && machinery.length > 0 && (
          <div className="td-stat">
            <i className="bi bi-cpu td-stat__icon" />
            <div className="td-stat__text">
              <span className="td-stat__label">Tecnología</span>
              <span className="td-stat__value">{machinery.join(' · ')}</span>
            </div>
          </div>
        )}
        <div className="td-stat">
          <i className="bi bi-check2-all td-stat__icon" />
          <div className="td-stat__text">
            <span className="td-stat__label">Resultados</span>
            <span className="td-stat__value">{benefits.length} beneficios clave</span>
          </div>
        </div>
        <div className="td-stat">
          <i className="bi bi-heart td-stat__icon" />
          <div className="td-stat__text">
            <span className="td-stat__label">Diagnóstico</span>
            <span className="td-stat__value">Gratuito incluido</span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="td-body">

        {/* DESCRIPTION */}
        <div className="td-section">
          <p className="td-section-label">Sobre este tratamiento</p>
          <p className="td-description">{description}</p>
          {warning && (
            <div className="td-warning">
              <span>{warning}</span>
            </div>
          )}
        </div>

        {/* BENEFITS */}
        <div className="td-section">
          <p className="td-section-label">Beneficios</p>
          <div className="td-benefits-grid">
            {benefits.map((item, i) => (
              <div key={i} className="td-benefit-card">
                <span className="td-benefit__text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNOLOGY */}
        {machinery && machinery.length > 0 && (
          <div className="td-section">
            <p className="td-section-label">Tecnología aplicada</p>
            <div className="td-chips">
              {machinery.map((item, i) => (
                <span key={i} className="td-chip">{item}</span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── BOOKING ── */}
      <div className="td-booking">
        <BookingSection treatmentSlug={slug} treatmentLabel={title} />
      </div>

    </div>
  );
}
