'use client';

import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { treatments } from '../data/treatments';
import './bookingModal.css';

const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const TIME_SLOTS = [
  '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00',
];

const CLOSING_MINUTES = 19 * 60;

function getCalendarDays(month: Date): (number | null)[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstWeekDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const offset = firstWeekDay === 0 ? 6 : firstWeekDay - 1;

  const days: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d} de ${MONTHS_ES[parseInt(m) - 1]} ${y}`;
}

function slotMin(slot: string) {
  const [h, m] = slot.split(':').map(Number);
  return h * 60 + m;
}

function minToTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

export default function BookingModal() {
  const { isOpen, closeModal, selectedTreatment } = useBooking();

  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (selectedTreatment) {
      setSelectedSlugs([selectedTreatment]);
      setStep(2);
    } else {
      setSelectedSlugs([]);
      setStep(1);
    }
    setDate('');
    setTime('');
    setError('');
  }, [selectedTreatment, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalDuration = selectedSlugs.length > 0
    ? selectedSlugs.reduce((s, slug) => s + (treatments.find(t => t.slug === slug)?.durationMinutes ?? 60), 0)
    : 60;

  const availableSlots = TIME_SLOTS.filter(s => slotMin(s) + totalDuration <= CLOSING_MINUTES);

  const isPast = (day: number) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < today;

  const isSelectedDay = (day: number) =>
    date === toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);

  const selectDay = (day: number) => {
    if (isPast(day)) return;
    setDate(toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setTime('');
  };

  const isPrevMonthDisabled = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prev < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const toggleTreatment = (slug: string) => {
    setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
    setTime('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endTime = minToTime(slotMin(time) + totalDuration);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatments: selectedSlugs.map(s => treatments.find(t => t.slug === s)?.title ?? s),
          date, startTime: time, endTime,
          durationMinutes: totalDuration,
          name, email, phone,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al agendar');
      }
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hubo un problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const endTime = time ? minToTime(slotMin(time) + totalDuration) : '';

  return (
    <div className="booking-overlay" onClick={closeModal}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>

        <button className="booking-close" onClick={closeModal} aria-label="Cerrar">×</button>

        {step < 4 && (
          <div className="booking-steps">
            {[1, 2, 3].map(s => (
              <div key={s} className={`booking-step-dot ${step >= s ? 'active' : ''}`} />
            ))}
          </div>
        )}

        {/* ── STEP 1: Tratamientos (multi-select) ── */}
        {step === 1 && (
          <div className="booking-step">
            <h2 className="booking-title">Selecciona tu tratamiento</h2>
            <p className="booking-subtitle">Puedes elegir más de uno</p>
            <div className="treatment-options">
              {treatments.map(t => (
                <button
                  key={t.slug}
                  type="button"
                  className={`treatment-option ${selectedSlugs.includes(t.slug) ? 'selected' : ''}`}
                  onClick={() => toggleTreatment(t.slug)}
                >
                  {t.title}
                  {selectedSlugs.includes(t.slug) && <span className="treatment-check">✓</span>}
                </button>
              ))}
            </div>
            {selectedSlugs.length > 1 && (
              <p className="booking-duration-note">
                {selectedSlugs.length} tratamientos · {totalDuration} min en total
              </p>
            )}
            <div className="booking-nav">
              <a
                href="https://wa.me/525528425370?text=Hola%2C%20estoy%20interesada%20en%20agendar%20una%20cita%20en%20Nucleo%20Spa"
                target="_blank"
                rel="noopener noreferrer"
                className="booking-wa-btn"
              >
                <i className="bi bi-whatsapp" /> WhatsApp
              </a>
              <button
                className="booking-btn"
                onClick={() => setStep(2)}
                disabled={selectedSlugs.length === 0}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Calendario + Hora ── */}
        {step === 2 && (
          <div className="booking-step">
            <h2 className="booking-title">Selecciona fecha y hora</h2>

            <div className="booking-calendar">
              <div className="calendar-nav">
                <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))} disabled={isPrevMonthDisabled()}>‹</button>
                <span>{MONTHS_ES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>›</button>
              </div>
              <div className="calendar-grid">
                {WEEK_DAYS.map((d, i) => (
                  <div key={i} className="calendar-weekday">{d}</div>
                ))}
                {getCalendarDays(currentMonth).map((day, i) => (
                  <div
                    key={i}
                    className={[
                      'calendar-day',
                      !day ? 'empty' : '',
                      day && isPast(day) ? 'past' : '',
                      day && isSelectedDay(day) ? 'selected' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => day && selectDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {date && (
              <div className="time-slots">
                <p className="time-slots__label">Hora</p>
                <div className="time-slots__grid">
                  {availableSlots.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`time-slot ${time === t ? 'selected' : ''}`}
                      onClick={() => setTime(t)}
                    >
                      <span className="time-slot__start">{t}</span>
                      {selectedSlugs.length > 1 && (
                        <span className="time-slot__end">– {minToTime(slotMin(t) + totalDuration)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="booking-nav">
              <button className="booking-btn-ghost" onClick={() => setStep(1)}>← Atrás</button>
              <button
                className="booking-btn"
                onClick={() => setStep(3)}
                disabled={!date || !time}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Datos de contacto ── */}
        {step === 3 && (
          <div className="booking-step">
            <h2 className="booking-title">Tus datos</h2>
            <form className="booking-form" onSubmit={handleSubmit}>

              <div className="booking-summary">
                <p>
                  {selectedSlugs.length === 1
                    ? treatments.find(t => t.slug === selectedSlugs[0])?.title
                    : `${selectedSlugs.length} tratamientos`}
                </p>
                <p>
                  {formatDate(date)} · {time}{selectedSlugs.length > 1 ? ` – ${endTime}` : ''} hrs
                </p>
              </div>

              <div className="booking-field">
                <label>Nombre completo</label>
                <input
                  type="text" required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="booking-row">
                <div className="booking-field">
                  <label>Correo electrónico</label>
                  <input
                    type="email" required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="booking-field">
                  <label>Teléfono</label>
                  <input
                    type="tel" required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+52 55 0000 0000"
                  />
                </div>
              </div>

              {error && <p className="booking-error">{error}</p>}

              <div className="booking-nav">
                <button type="button" className="booking-btn-ghost" onClick={() => setStep(2)}>← Atrás</button>
                <button type="submit" className="booking-btn" disabled={loading}>
                  {loading ? 'Agendando...' : 'Solicitar cita'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ── STEP 4: Confirmación ── */}
        {step === 4 && (
          <div className="booking-success">
            <span className="booking-success__icon">✓</span>
            <h2>¡Solicitud enviada!</h2>
            <p>Recibirás un correo de confirmación con los detalles de tu cita.</p>
            <button className="booking-btn" onClick={closeModal}>Cerrar</button>
          </div>
        )}

      </div>
    </div>
  );
}
