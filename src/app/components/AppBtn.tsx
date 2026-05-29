'use client';

import './appBtn.css';

export default function AppBtn({ name }: { name: string }) {
  const handleClick = () => {
    const el = document.getElementById('agendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#agendar';
    }
  };

  return (
    <a className="app-btn" onClick={handleClick}>
      {name}
    </a>
  );
}
