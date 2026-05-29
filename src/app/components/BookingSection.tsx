'use client';

import { useState } from 'react';
import './bookingSection.css';

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
  const [y, m, d] = dateStr.split('-');
  return `${d} de ${MONTHS_ES[parseInt(m) - 1]} ${y}`;
}

type BookingSectionProps = {
  treatmentLabel: string;
  treatmentSlug: string;
  showHeader?: boolean;
};

export default function BookingSection({ treatmentLabel, treatmentSlug, showHeader = true }: BookingSectionProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const isPast = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return d < today;
  };

  const isSelectedDay = (day: number) =>
    selectedDate === toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);

  const selectDay = (day: number) => {
    if (isPast(day)) return;
    setSelectedDate(toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setSelectedTime('');
  };

  const isPrevMonthDisabled = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prev < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Google Calendar / Meet API
    // Payload: { treatmentSlug, treatmentLabel, date: selectedDate, time: selectedTime, ...form }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bs-success">
        <span className="bs-success__icon">✓</span>
        <h3>¡Solicitud enviada!</h3>
        <p>Te contactaremos en breve para confirmar tu cita.</p>
      </div>
    );
  }

  return (
    <div className="bs-wrapper">

      {showHeader && (
        <div className="bs-header">
          <h2>Agenda tu cita</h2>
          <p>{treatmentLabel}</p>
        </div>
      )}

      <div className="bs-body">

        {/* CALENDAR */}
        <div className="bs-calendar">
          <div className="bs-cal-nav">
            <button
              onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              disabled={isPrevMonthDisabled()}
            >
              ‹
            </button>
            <span>{MONTHS_ES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
            <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>
              ›
            </button>
          </div>

          <div className="bs-cal-grid">
            {WEEK_DAYS.map((d, i) => (
              <div key={i} className="bs-weekday">{d}</div>
            ))}
            {getCalendarDays(currentMonth).map((day, i) => (
              <div
                key={i}
                className={[
                  'bs-day',
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

        {/* TIME SLOTS */}
        <div className={`bs-times ${selectedDate ? 'visible' : ''}`}>
          <p className="bs-times__label">
            {selectedDate ? formatDate(selectedDate) : ''}
          </p>
          <div className="bs-times__grid">
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                type="button"
                className={`bs-time ${selectedTime === t ? 'selected' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FORM — appears once date + time are selected */}
      {selectedDate && selectedTime && (
        <form className="bs-form" onSubmit={handleSubmit}>

          <div className="bs-form__selected">
            <span>{formatDate(selectedDate)}</span>
            <span>·</span>
            <span>{selectedTime} hrs</span>
          </div>

          <div className="bs-form__fields">
            <div className="bs-form__field bs-form__field--full">
              <label>Nombre completo</label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="bs-form__field">
              <label>Correo electrónico</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="bs-form__field">
              <label>Teléfono</label>
              <input
                type="tel" required
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+52 55 0000 0000"
              />
            </div>
          </div>

          <button type="submit" className="bs-submit">Solicitar cita</button>

        </form>
      )}

    </div>
  );
}
