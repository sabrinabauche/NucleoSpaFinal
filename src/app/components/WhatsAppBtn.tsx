'use client';
import './whatsAppBtn.css';

export default function WhatsAppBtn() {
  return (
    <a
      href="https://wa.me/525528425370?text=Hola%2C%20estoy%20interesada%20en%20agendar%20una%20cita%20en%20N%C3%BAcleo%20Clinique"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn d-flex align-items-center justify-content-center"
      aria-label="Contactar por WhatsApp"
    >
      <i className="bi bi-whatsapp" />
    </a>
  );
}
