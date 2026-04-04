import React from "react";
import "./tratamientos.css";
import SectionTitle from "../components/SectionTitle";
import TreatmentCard from "../components/TarjetaTratamientos";

export default function Tratamientos() {
  return (
    <section id="titulo">
      <div className="texto">
        <SectionTitle
          title="Tratamientos"
          subtitle="Cada tratamiento inicia con un diagnóstico gratuito"
        />
      </div>

      <div className="treatments-grid">
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Limpieza Profunda"
          description="Purifica tu piel a profundidad, eliminando impurezas y devolviéndole frescura y luminosidad."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Hidratación Intensiva"
          description="Recupera la humedad esencial de tu piel y mejora su textura desde la primera sesión."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Anti-Acne"
          description="Purifica y equilibra tu piel, ayudando a prevenir brotes y a recuperar su claridad natural."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Anti-Aging"
          description="Ayuda a reducir líneas de expresión y mejora la firmeza para una piel más suave y luminosa."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Lifting facial"
          description="Restaura la arquitectura facial y redefine la firmeza de tu piel."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Luminous Glow"
          description="Ayuda a recuperar el brillo natural de la piel mientras mejora su apariencia y uniformidad."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Piel sensible"
          description="Reconstruye el escudo natural de tu rostro con nuestro protocolo de reparación celular."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Exfoliante enzimático"
          description="Exfolia suavemente, mejora la textura y ayuda a unificar el tono para una piel más lisa y luminosa."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Microneedling"
          description="Estimula la producción de colágeno, mejora la textura y ayuda a reducir marcas e imperfecciones."
        />
        <TreatmentCard
          image="/assets/images/limpieza.jpg"
          title="Oxigenoterapia"
          description="Mejora la oxigenación y la hidratación de la piel, ayudando a que se vea más fresca y saludable."
        />
      </div>
    </section>
  );
}