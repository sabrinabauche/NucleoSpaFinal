import SectionTitle from '../components/SectionTitle';
import './resenas.css';

const reviews = [
  {
    id: 1,
    text: 'El tratamiento de radiofrecuencia transformó mi piel. Resultados visibles desde la primera sesión y una atención completamente personalizada.',
    name: 'María G.',
    treatment: 'Radiofrecuencia Facial',
  },
  {
    id: 2,
    text: 'Llevo meses yendo y los cambios son notables. El equipo te explica cada paso del proceso y el ambiente es increíblemente relajante.',
    name: 'Valeria M.',
    treatment: 'Limpieza Facial Profunda',
  },
  {
    id: 3,
    text: 'Empecé con el diagnóstico gratis y desde ahí supe que estaba en el lugar correcto. Muy profesionales y los resultados superaron mis expectativas.',
    name: 'Carolina R.',
    treatment: 'Diagnóstico Personalizado',
  },
];

export default function Resenas() {
  return (
    <section id="resenas" className="resenas-section">
      <SectionTitle title="Reseñas" subtitle="Lo que dicen nuestros clientes" />
      <div className="resenas-grid">
        {reviews.map((r) => (
          <div key={r.id} className="resena-card">
            <div className="resena-stars">★★★★★</div>
            <p className="resena-text">"{r.text}"</p>
            <div className="resena-author">
              <span className="resena-name">{r.name}</span>
              <span className="resena-treatment">{r.treatment}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
