'use client';

import { useEffect, useRef, useState } from 'react';
import CompassContent from './CompassContent';

export default function UserCompass() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = overflow;
      triggerRef.current?.focus();
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
        ref={triggerRef}
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
              <button
                type="button"
                className="btn"
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                aria-label="Close User Compass"
              >
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
