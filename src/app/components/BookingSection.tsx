'use client';

import { useState, useRef, useEffect } from 'react';
import { treatments } from '../data/treatments';
import './bookingSection.css';

const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const TIME_SLOTS = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
const CLOSING_MINUTES = 19 * 60;

type BusySlot = { start: string; end: string };

function getCalendarDays(month: Date): (number | null)[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const offset = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const days: (number | null)[] = Array(offset === 0 ? 6 : offset - 1).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function toDateString(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function formatDate(s: string) {
  const [y, m, d] = s.split('-');
  return `${d} de ${MONTHS_ES[parseInt(m) - 1]} ${y}`;
}

function slotMin(slot: string) {
  const [h, m] = slot.split(':').map(Number);
  return h * 60 + m;
}

function minToTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2,'0')}:${String(min % 60).padStart(2,'0')}`;
}

type Props = { treatmentLabel?: string; treatmentSlug?: string; showHeader?: boolean; };

export default function BookingSection({ treatmentLabel, treatmentSlug, showHeader = true }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // String YYYY-MM-DD de hoy — comparar strings ISO evita problemas de timezone
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  const isSingleMode = Boolean(treatmentSlug && treatmentSlug !== 'diagnostico');

  const [view, setView]               = useState<'calendar' | 'form'>('calendar');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(isSingleMode && treatmentSlug ? [treatmentSlug] : []);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [currentMonth, setCurrentMonth]   = useState(new Date());
  const [selectedDate, setSelectedDate]   = useState('');
  const [selectedTime, setSelectedTime]   = useState('');
  const [busySlots, setBusySlots]         = useState<BusySlot[]>([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [availError, setAvailError]       = useState('');
  const [form, setForm]                   = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted]         = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOut = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  // Consultar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (!selectedDate) { setBusySlots([]); setAvailError(''); return; }
    setLoadingSlots(true);
    setAvailError('');
    fetch(`/api/availability?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => {
        setBusySlots(data.busy ?? []);
        if (data.error) setAvailError(data.error);
      })
      .catch(e => setAvailError(String(e)))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const totalDuration = selectedSlugs.length > 0
    ? selectedSlugs.reduce((s, slug) => s + (treatments.find(t => t.slug === slug)?.durationMinutes ?? 60), 0)
    : 60;

  const availableSlots = TIME_SLOTS.filter(slot => {
    const start = slotMin(slot);
    const end   = start + totalDuration;
    if (end > CLOSING_MINUTES) return false;
    // Excluir slots que se superponen con eventos existentes
    return !busySlots.some(b => {
      const bStart = slotMin(b.start);
      const bEnd   = slotMin(b.end);
      return start < bEnd && end > bStart;
    });
  });

  // Bloquear hoy y días anteriores — comparación de strings YYYY-MM-DD
  const isPast = (d: number) =>
    toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), d) <= todayStr;
  const isSelected = (d: number) => selectedDate === toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), d);
  const prevDisabled = () =>
    toDateString(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) <
    toDateString(today.getFullYear(), today.getMonth(), 1);

  const selectDay = (d: number) => {
    if (isPast(d)) return;
    setSelectedDate(toDateString(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    setSelectedTime('');
    setView('calendar');
  };

  const selectTime = (t: string) => { setSelectedTime(t); setView('form'); };
  const goBack     = () => setView('calendar');

  const toggleTreatment = (slug: string) => {
    setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
    setSelectedTime('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endTime = minToTime(slotMin(selectedTime) + totalDuration);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatments: selectedSlugs.map(s => treatments.find(t => t.slug === s)?.title ?? s),
          treatmentSlugs: selectedSlugs,
          date: selectedDate, startTime: selectedTime, endTime,
          durationMinutes: totalDuration,
          name: form.name, email: form.email, phone: form.phone,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch { setError('Hubo un problema al agendar. Intenta de nuevo.'); }
    finally  { setLoading(false); }
  };

  if (submitted) return (
    <div className="bs-success">
      <span className="bs-success__icon">✓</span>
      <h3>¡Solicitud enviada!</h3>
      <p>Recibirás un correo con la confirmación de tu cita.</p>
    </div>
  );

  const endPreview = selectedTime ? minToTime(slotMin(selectedTime) + totalDuration) : '';

  const triggerLabel = selectedSlugs.length === 0
    ? 'Selecciona tratamiento'
    : selectedSlugs.length === 1
      ? (treatments.find(t => t.slug === selectedSlugs[0])?.title ?? '')
      : `${selectedSlugs.length} tratamientos`;

  const selectedTreatmentLabel = selectedSlugs.length === 1
    ? (treatments.find(t => t.slug === selectedSlugs[0])?.title ?? '')
    : selectedSlugs.length > 1
      ? `${selectedSlugs.length} tratamientos · ${totalDuration} min`
      : '';

  return (
    <div className="bs-wrapper">

      {showHeader && treatmentLabel && (
        <div className="bs-header">
          <h2>Agenda tu cita</h2>
          <p>{treatmentLabel}</p>
        </div>
      )}

      {/* ── VISTA CALENDARIO ── */}
      {view === 'calendar' && (
        <div className="bs-body">

          <div className="bs-calendar">
            <div className="bs-cal-nav">
              <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))} disabled={prevDisabled()}>‹</button>
              <span>{MONTHS_ES[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
              <button onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>›</button>
            </div>
            <div className="bs-cal-grid">
              {WEEK_DAYS.map((d, i) => <div key={i} className="bs-weekday">{d}</div>)}
              {getCalendarDays(currentMonth).map((day, i) => (
                <div key={i}
                  className={['bs-day', !day?'empty':'', day&&isPast(day)?'past':'', day&&isSelected(day)?'selected':''].filter(Boolean).join(' ')}
                  onClick={() => day && selectDay(day)}
                >{day}</div>
              ))}
            </div>
          </div>

          <div className="bs-right-col">

            {!isSingleMode && (
              <div className="bs-dropdown" ref={dropdownRef}>
                <button
                  className={`bs-dropdown-trigger ${selectedSlugs.length > 0 ? 'has-value' : ''} ${dropdownOpen ? 'open' : ''}`}
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  <span>{triggerLabel}</span>
                  <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'}`} />
                </button>

                {dropdownOpen && (
                  <div className="bs-dropdown-list">
                    {treatments.map(t => (
                      <button
                        key={t.slug}
                        className={`bs-dropdown-item ${selectedSlugs.includes(t.slug) ? 'selected' : ''}`}
                        onClick={() => toggleTreatment(t.slug)}
                      >
                        <span>{t.title}</span>
                        {selectedSlugs.includes(t.slug) && <i className="bi bi-check2" />}
                      </button>
                    ))}
                    {selectedSlugs.length > 0 && (
                      <button className="bs-dropdown-done" onClick={() => setDropdownOpen(false)}>
                        Listo ✓
                      </button>
                    )}
                  </div>
                )}

                {selectedSlugs.length > 1 && !dropdownOpen && (
                  <p className="bs-dropdown-summary">
                    {selectedSlugs.length} tratamientos · {totalDuration} min
                  </p>
                )}
              </div>
            )}

            <div className={`bs-times ${selectedDate ? 'visible' : ''}`}>
              <p className="bs-times__label">{selectedDate ? formatDate(selectedDate) : ''}</p>
              {availError && <p className="bs-times__empty" style={{color:'#e07070'}}>Error: {availError}</p>}
              {loadingSlots ? (
                <p className="bs-times__loading">Verificando disponibilidad...</p>
              ) : (
                <div className="bs-times__grid">
                  {availableSlots.length === 0 && selectedDate && (
                    <p className="bs-times__empty">Sin horarios disponibles</p>
                  )}
                  {availableSlots.map(t => (
                    <button key={t} type="button"
                      className={`bs-time ${selectedTime === t ? 'selected' : ''}`}
                      onClick={() => selectTime(t)}
                    >
                      <span className="bs-time__start">{t}</span>
                      {selectedSlugs.length > 1 && (
                        <span className="bs-time__end">– {minToTime(slotMin(t) + totalDuration)}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── VISTA FORMULARIO ── */}
      {view === 'form' && (
        <div className="bs-form-view">

          <div className="bs-form-view__summary">
            {selectedTreatmentLabel && <span>{selectedTreatmentLabel}</span>}
            {selectedTreatmentLabel && <span>·</span>}
            <span>{formatDate(selectedDate)}</span>
            <span>·</span>
            <span>{selectedTime}{selectedSlugs.length > 0 ? ` – ${endPreview}` : ''} hrs</span>
          </div>

          <form className="bs-form" onSubmit={handleSubmit}>
            <div className="bs-form__fields">
              <div className="bs-form__field bs-form__field--full">
                <label>Nombre completo</label>
                <input type="text" required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Tu nombre completo" />
              </div>
              <div className="bs-form__field">
                <label>Correo electrónico</label>
                <input type="email" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="correo@ejemplo.com" />
              </div>
              <div className="bs-form__field">
                <label>Teléfono</label>
                <input type="tel" required value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="55 0000 0000" />
              </div>
            </div>
            {error && <p className="bs-error">{error}</p>}
            <div className="bs-form__actions">
              <button type="button" className="bs-back-btn" onClick={goBack}>
                <i className="bi bi-arrow-left" /> Volver
              </button>
              <button type="submit" className="bs-submit" disabled={loading || selectedSlugs.length === 0}>
                {loading ? 'Agendando...' : 'Solicitar cita'}
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}
