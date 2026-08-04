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


      </div>

      {/* ── BOOKING ── */}
      <div className="td-booking">
        <BookingSection treatmentSlug={slug} treatmentLabel={title} />
      </div>

    </div>
  );
}
