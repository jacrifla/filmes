import React, { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  if (!showScroll) return null;

  return (
    <button
      className="btn btn-primary scroll-top-button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  );
}
