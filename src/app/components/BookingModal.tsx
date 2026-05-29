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

function getCalendarDays(month: Date): (number | null)[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstWeekDay = new Date(year, m, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const offset = firstWeekDay === 0 ? 6 : firstWeekDay - 1; // Monday-first

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

export default function BookingModal() {
  const { isOpen, closeModal, selectedTreatment } = useBooking();

  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({
    treatment: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setForm(f => ({ ...f, treatment: selectedTreatment }));
    setStep(selectedTreatment ? 2 : 1);
  }, [selectedTreatment, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isPast = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d < today;
  };

  const isSelectedDay = (day: number) =>
    form.date === toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);

  const selectDay = (day: number) => {
    if (isPast(day)) return;
    setForm(f => ({
      ...f,
      date: toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day),
      time: '',
    }));
  };

  const isPrevMonthDisabled = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prev < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const prevMonth = () =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Google Calendar / Meet API — send form data to backend
    // Payload ready: form.treatment, form.date, form.time, form.name, form.email, form.phone
    setStep(4);
  };

  const selectedTreatmentLabel =
    treatments.find(t => t.slug === form.treatment)?.title ?? 'Diagnóstico Gratis';

  return (
    <div className="booking-overlay" onClick={closeModal}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>

        <button className="booking-close" onClick={closeModal} aria-label="Cerrar">×</button>

        {/* STEP INDICATOR */}
        {step < 4 && (
          <div className="booking-steps">
            {[1, 2, 3].map(s => (
              <div key={s} className={`booking-step-dot ${step >= s ? 'active' : ''}`} />
            ))}
          </div>
        )}

        {/* ── STEP 1: Treatment ── */}
        {step === 1 && (
          <div className="booking-step">
            <h2 className="booking-title">Selecciona tu tratamiento</h2>
            <div className="treatment-options">
              <button
                type="button"
                className={`treatment-option ${form.treatment === 'diagnostico' ? 'selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, treatment: 'diagnostico' }))}
              >
                Diagnóstico Gratis
              </button>
              {treatments.map(t => (
                <button
                  key={t.slug}
                  type="button"
                  className={`treatment-option ${form.treatment === t.slug ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, treatment: t.slug }))}
                >
                  {t.title}
                </button>
              ))}
            </div>
            <div className="booking-nav booking-nav--end">
              <button
                className="booking-btn"
                onClick={() => setStep(2)}
                disabled={!form.treatment}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Calendar + Time ── */}
        {step === 2 && (
          <div className="booking-step">
            <h2 className="booking-title">Selecciona fecha y hora</h2>

            <div className="booking-calendar">
              <div className="calendar-nav">
                <button onClick={prevMonth} disabled={isPrevMonthDisabled()}>‹</button>
                <span>{MONTHS_ES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                <button onClick={nextMonth}>›</button>
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
                    ].join(' ')}
                    onClick={() => day && selectDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {form.date && (
              <div className="time-slots">
                <p className="time-slots__label">Hora</p>
                <div className="time-slots__grid">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`time-slot ${form.time === t ? 'selected' : ''}`}
                      onClick={() => setForm(f => ({ ...f, time: t }))}
                    >
                      {t}
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
                disabled={!form.date || !form.time}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Contact info ── */}
        {step === 3 && (
          <div className="booking-step">
            <h2 className="booking-title">Tus datos</h2>
            <form className="booking-form" onSubmit={handleSubmit}>

              <div className="booking-summary">
                <p>{selectedTreatmentLabel}</p>
                <p>{formatDate(form.date)} · {form.time} hrs</p>
              </div>

              <div className="booking-field">
                <label>Nombre completo</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="booking-row">
                <div className="booking-field">
                  <label>Correo electrónico</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="booking-field">
                  <label>Teléfono</label>
                  <input
                    type="tel" required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+52 55 0000 0000"
                  />
                </div>
              </div>

              <div className="booking-nav">
                <button type="button" className="booking-btn-ghost" onClick={() => setStep(2)}>← Atrás</button>
                <button type="submit" className="booking-btn">Solicitar cita</button>
              </div>

            </form>
          </div>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <div className="booking-success">
            <span className="booking-success__icon">✓</span>
            <h2>¡Listo!</h2>
            <p>Recibirás un correo con tu enlace de Google Meet en las próximas 24 horas.</p>
            <button className="booking-btn" onClick={closeModal}>Cerrar</button>
          </div>
        )}

      </div>
    </div>
  );
}
