import { useState } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface HelpSupportScreenProps {
  onBack: () => void;
}

const FAQS = [
  {
    q: 'How does report verification work?',
    a: 'When 3 different users confirm a report, it becomes Verified. This keeps flood information trustworthy.',
  },
  {
    q: 'Why do I need to use my camera?',
    a: 'Live photos keep reports genuine and up to date, so gallery uploads are turned off.',
  },
  {
    q: 'Is my identity visible to others?',
    a: 'No. Reports show a handle, not your real name or contact details.',
  },
  {
    q: 'What happens if a report is wrong?',
    a: 'Reports left unconfirmed or marked cleared are automatically removed over time.',
  },
];

function WatermarkLayer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        WebkitMaskImage: `url("${floodwatchLogo}")`,
        maskImage: `url("${floodwatchLogo}")`,
        WebkitMaskSize: '56px 56px',
        maskSize: '56px 56px',
        WebkitMaskRepeat: 'repeat',
        maskRepeat: 'repeat',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: '#F6F7F8',
      overflowY: 'auto',
      zIndex: 2,
      fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <WatermarkLayer />

      <div style={{ position: 'relative', padding: '52px 20px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: 'none',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827', textAlign: 'center', letterSpacing: '-0.01em' }}>
            Help &amp; Support
          </h2>
          <div />
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ padding: '24px 18px 24px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0px 6px 18px rgba(17, 24, 39, 0.05)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '20px 20px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#262537' }}>{faq.q}</span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.28s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{
                      margin: 0,
                      padding: '0 20px 20px 20px',
                      fontSize: '13.5px',
                      lineHeight: 1.55,
                      color: '#6B7280',
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
