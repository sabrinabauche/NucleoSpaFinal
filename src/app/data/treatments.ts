export type Treatment = {
  image: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  durationMinutes: number;
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
    durationMinutes: 60,
    machinery: ["Vapor ozono", "Ultrasonido"],
    benefits: ["Limpia profundamente los poros", "Reduce exceso de grasa", "Mejora textura de la piel"],
    warning: "No recomendado para piel extremadamente sensible.",
  },
  {
    image: "/assets/images/hidratacion.jpg",
    title: "Hidratación Intensiva",
    description: "Recupera la humedad esencial de tu piel y mejora su textura desde la primera sesión.",
    slug: "hidratacion-intensiva",
    duration: "50 min",
    durationMinutes: 60,
    machinery: ["Radiofrecuencia"],
    benefits: ["Hidrata profundamente", "Mejora elasticidad", "Da luminosidad"],
  },
  {
    image: "/assets/images/acne.jpg",
    title: "Anti-Acne",
    description: "Purifica y equilibra tu piel, ayudando a prevenir brotes y a recuperar su claridad natural.",
    slug: "anti-acne",
    duration: "70 min",
    durationMinutes: 60,
    machinery: ["Alta frecuencia", "Ultrasonido"],
    benefits: ["Reduce inflamación", "Controla grasa", "Ayuda con marcas"],
    warning: "Evitar en piel irritada o lastimada.",
  },
  {
    image: "/assets/images/aging.jpg",
    title: "Anti-Aging",
    description: "Suaviza las líneas de expresión y devuelve a la piel su luminosidad y tersura, para un aspecto más joven y descansado.",
    slug: "anti-aging",
    duration: "60 min",
    durationMinutes: 60,
    machinery: ["Radiofrecuencia", "Ultrasonido"],
    benefits: ["Suaviza líneas de expresión", "Restaura luminosidad y tersura", "Aspecto más joven y descansado"],
    warning: "No recomendado para piel irritada.",
  },
  {
    image: "/assets/images/lifting.jpg",
    title: "Lifting Facial",
    description: "Estimula la producción natural de colágeno y elastina para devolverte una piel visiblemente más firme, definida y rejuvenecida.",
    slug: "lifting-facial",
    duration: "75 min",
    durationMinutes: 60,
    machinery: ["Radiofrecuencia"],
    benefits: ["Estimula colágeno y elastina", "Piel más firme y definida", "Efecto rejuvenecedor visible"],
  },
  {
    image: "/assets/images/luminous.jpg",
    title: "Luminous Glow",
    description: "Hidrata en profundidad y despierta el brillo natural de tu piel, dejándola fresca, radiante e inmediatamente transformada.",
    slug: "luminous-glow",
    duration: "50 min",
    durationMinutes: 60,
    machinery: ["Oxigenoterapia"],
    benefits: ["Hidratación profunda", "Brillo natural inmediato", "Piel fresca y radiante"],
  },
  {
    image: "/assets/images/sensible.jpg",
    title: "Piel Sensible",
    description: "Restaura el equilibrio natural de tu piel, fortalece su barrera protectora y la calma desde adentro para una piel sana, cómoda y resiliente.",
    slug: "piel-sensible",
    duration: "45 min",
    durationMinutes: 60,
    benefits: ["Restaura el equilibrio natural", "Fortalece la barrera protectora", "Calma la irritación y rojeces"],
    warning: "Tratamiento especializado para piel reactiva.",
  },
  {
    image: "/assets/images/exfoliante.jpg",
    title: "Exfoliante Enzimático",
    description: "Exfolia suavemente, mejora la textura y ayuda a unificar el tono para una piel más lisa y luminosa.",
    slug: "exfoliante-enzimatico",
    duration: "40 min",
    durationMinutes: 60,
    machinery: ["Peeling enzimático"],
    benefits: ["Mejora textura", "Da luminosidad", "Unifica tono"],
  },
  {
    image: "/assets/images/micron.jpg",
    title: "Microneedling",
    description: "Estimula la producción de colágeno y mejora la textura y las marcas de la piel.",
    slug: "microneedling",
    duration: "80 min",
    durationMinutes: 60,
    machinery: ["Microneedling pen"],
    benefits: ["Estimula colágeno", "Reduce marcas", "Mejora textura"],
    warning: "No recomendado en acné activo severo.",
  },
  {
    image: "/assets/images/oxigeno.jpg",
    title: "Oxigenoterapia",
    description: "Mejora la oxigenación y la hidratación de la piel, ayudando a que se vea más fresca y saludable.",
    slug: "oxigenoterapia",
    duration: "50 min",
    durationMinutes: 60,
    machinery: ["Oxígeno presurizado"],
    benefits: ["Revitaliza", "Hidrata", "Da luminosidad"],
  },
  {
    image: "/assets/images/limpieza.jpg",
    title: "Pre Evento",
    description: "Este tratamiento está diseñado para darte resultados inmediatos: tono uniforme, luminosidad instantánea y rojeces reducidas para que llegues a tu evento con una piel impecable y radiante.",
    slug: "pre-evento",
    duration: "45 min",
    durationMinutes: 45,
    benefits: ["Tono uniforme al instante", "Luminosidad instantánea", "Reduce rojeces visiblemente"],
  },
];
