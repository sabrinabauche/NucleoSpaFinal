'use client';

import React, { useState } from "react";
import "./tratamientos.css";
import SectionTitle from "../components/SectionTitle";
import TreatmentCard from "../components/TarjetaTratamientos";

const treatments = [
  {
    image: "/assets/images/limpieza.jpg",
    title: "Limpieza Profunda",
    description: "Purifica tu piel a profundidad, eliminando impurezas y devolviéndole frescura y luminosidad.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Hidratación Intensiva",
    description: "Recupera la humedad esencial de tu piel y mejora su textura desde la primera sesión.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Anti-Acne",
    description: "Purifica y equilibra tu piel, ayudando a prevenir brotes y a recuperar su claridad natural.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Anti-Aging",
    description: "Ayuda a reducir líneas de expresión y mejora la firmeza para una piel más suave y luminosa.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Lifting facial",
    description: "Restaura la arquitectura facial y redefine la firmeza de tu piel.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Luminous Glow",
    description: "Restaura la arquitectura facial y redefine la firmeza de tu piel.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Piel sensible",
    description: "Reconstruye el escudo natural de tu rostro con nuestro protocolo de reparación celular.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Exfoliante enzimático",
    description: "Exfolia suavemente, mejora la textura y ayuda a unificar el tono para una piel más lisa y luminosa.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Microneedling",
    description: "Exfolia suavemente, mejora la textura y ayuda a unificar el tono para una piel más lisa y luminosa.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Oxigenoterapia",
    description: "Mejora la oxigenación y la hidratación de la piel, ayudando a que se vea más fresca y saludable.",
  },
];

export default function Tratamientos() {

  /*cambia el estatus a dar click en ver mas*/
  const [showAll, setShowAll] = useState(false);

  /*hace que solo se muestren 4 tarjetas al inicio*/
  const visibleTreatments = showAll ? treatments : treatments.slice(0, 3);

  return (
    <section id="titulo">
      <div className="texto">
        <SectionTitle
          title="Tratamientos"
          subtitle="Cada tratamiento inicia con un diagnóstico gratuito"
        />
      </div>

    
      <div className={`treatments-grid ${showAll ? "expanded" : "collapsed"}`}>
        {visibleTreatments.map((t, index) => (
          <TreatmentCard
            key={index}
            image={t.image}
            title={t.title}
            description={t.description}
          />
        ))}
      </div>

        
      <div className="ver-mas-container">        
        <button
          onClick={() => setShowAll(!showAll)}
          className="ver-mas-btn"
        >
          {showAll ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </section>
  );
}

/*button on click cambia el texto del boton ver mas o ver menos dependiendo si esta abierto o colapsado*/