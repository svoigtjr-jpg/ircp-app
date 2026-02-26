'use client';

import { useEffect, useRef, useState } from 'react';
import CompassContent from './CompassContent';

export default function UserCompass() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="userCompassRoot">
      <button
        type="button"
        className="userCompassTab"
        onClick={() => setIsOpen(true)}
        aria-label="Open User Compass"
        aria-expanded={isOpen}
        aria-controls="user-compass-panel"
      >
        <span aria-hidden>🧭</span>
        <span>User Compass</span>
      </button>

      {isOpen && (
        <div className="userCompassOverlay" onClick={() => setIsOpen(false)} aria-hidden>
          <aside
            id="user-compass-panel"
            className="userCompassPanel"
            ref={panelRef}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="User Compass"
          >
            <div className="userCompassActions">
              <button type="button" className="btn" onClick={handlePrint}>
                Print Compass
              </button>
              <button type="button" className="btn" onClick={() => setIsOpen(false)} aria-label="Close User Compass">
                Close
              </button>
            </div>

            <CompassContent />
          </aside>
        </div>
      )}
    </div>
  );
}
