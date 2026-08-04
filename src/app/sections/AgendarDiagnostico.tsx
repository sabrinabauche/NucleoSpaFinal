import BookingSection from "../components/BookingSection";
import "./agendarDiagnostico.css";

export default function AgendarDiagnostico() {
  return (
    <section id="agendar" className="agendar-section">
      <div className="agendar-section__title">
        <h2>Agenda tu cita</h2>
        <div className="agendar-section__line" />
      </div>

      {/* Sin treatmentSlug → BookingSection muestra el selector multi-tratamiento */}
      <BookingSection showHeader={false} />
    </section>
  );
}
