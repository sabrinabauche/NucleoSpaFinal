import BookingSection from "../components/BookingSection";
import "./agendarDiagnostico.css";

export default function AgendarDiagnostico() {
  return (
    <section id="agendar" className="agendar-section">
      <div className="agendar-section__title">
        <h2>Agenda tu diagnóstico</h2>
        <div className="agendar-section__line" />
      </div>

      <BookingSection
        treatmentSlug="diagnostico"
        treatmentLabel="Diagnóstico Gratis"
        showHeader={false}
      />
    </section>
  );
}
