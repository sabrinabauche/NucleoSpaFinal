export type Treatment = {
  image: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  machinery?: string[];
  benefits: string[];
  warning?: string;
};

export const treatments: Treatment[] = [
  {
    image: "/assets/images/limpieza.jpg",
    title: "Limpieza Profunda",
    description: "Purifica tu piel a profundidad, eliminando impurezas y devolviéndole frescura y luminosidad.",
    slug: "limpieza-profunda",
    duration: "60 min",
    machinery: ["Vapor ozono", "Ultrasonido"],
    benefits: ["Limpia profundamente los poros", "Reduce exceso de grasa", "Mejora textura de la piel"],
    warning: "No recomendado para piel extremadamente sensible.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Hidratación Intensiva",
    description: "Recupera la humedad esencial de tu piel y mejora su textura desde la primera sesión.",
    slug: "hidratacion-intensiva",
    duration: "50 min",
    machinery: ["Radiofrecuencia"],
    benefits: ["Hidrata profundamente", "Mejora elasticidad", "Da luminosidad"],
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Anti-Acne",
    description: "Purifica y equilibra tu piel, ayudando a prevenir brotes y a recuperar su claridad natural.",
    slug: "anti-acne",
    duration: "70 min",
    machinery: ["Alta frecuencia", "Ultrasonido"],
    benefits: ["Reduce inflamación", "Controla grasa", "Ayuda con marcas"],
    warning: "Evitar en piel irritada o lastimada.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Anti-Aging",
    description: "Ayuda a reducir líneas de expresión y mejora la firmeza para una piel más suave y luminosa.",
    slug: "anti-aging",
    duration: "60 min",
    machinery: ["Radiofrecuencia", "Ultrasonido"],
    benefits: ["Mejora firmeza", "Reduce líneas finas", "Da luminosidad"],
    warning: "No recomendado para piel irritada.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Lifting Facial",
    description: "Restaura la arquitectura facial y redefine la firmeza de tu piel.",
    slug: "lifting-facial",
    duration: "75 min",
    machinery: ["Radiofrecuencia"],
    benefits: ["Efecto lifting", "Mejora elasticidad", "Tonifica el rostro"],
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Luminous Glow",
    description: "Devuelve luminosidad y frescura inmediata a la piel.",
    slug: "luminous-glow",
    duration: "50 min",
    machinery: ["Oxigenoterapia"],
    benefits: ["Da glow inmediato", "Mejora textura", "Hidrata profundamente"],
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Piel Sensible",
    description: "Reconstruye el escudo natural de tu rostro con nuestro protocolo de reparación celular.",
    slug: "piel-sensible",
    duration: "45 min",
    benefits: ["Reduce irritación", "Calma rojeces", "Fortalece la piel"],
    warning: "Tratamiento especializado para piel reactiva.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Exfoliante Enzimático",
    description: "Exfolia suavemente, mejora la textura y ayuda a unificar el tono para una piel más lisa y luminosa.",
    slug: "exfoliante-enzimatico",
    duration: "40 min",
    machinery: ["Peeling enzimático"],
    benefits: ["Mejora textura", "Da luminosidad", "Unifica tono"],
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Microneedling",
    description: "Estimula la producción de colágeno y mejora la textura y las marcas de la piel.",
    slug: "microneedling",
    duration: "80 min",
    machinery: ["Microneedling pen"],
    benefits: ["Estimula colágeno", "Reduce marcas", "Mejora textura"],
    warning: "No recomendado en acné activo severo.",
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Oxigenoterapia",
    description: "Mejora la oxigenación y la hidratación de la piel, ayudando a que se vea más fresca y saludable.",
    slug: "oxigenoterapia",
    duration: "50 min",
    machinery: ["Oxígeno presurizado"],
    benefits: ["Revitaliza", "Hidrata", "Da luminosidad"],
  },
];
