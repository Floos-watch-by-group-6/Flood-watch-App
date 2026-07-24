import { useEffect, useRef, useState } from 'react';

interface CameraCaptureScreenProps {
  maxPhotos?: number;
  onComplete: (photos: string[]) => void;
  onBack: () => void;
}

export default function CameraCaptureScreen({ maxPhotos = 2, onComplete, onBack }: CameraCaptureScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const [captured, setCaptured] = useState<string[]>([]);
  const [mode, setMode] = useState<'live' | 'review'>('live');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [flashPulse, setFlashPulse] = useState(false);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (mode !== 'live') return;
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1920 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraError(false);
      } catch {
        setCameraError(true);
      }
    }
    start();
    return () => { cancelled = true; stopStream(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, mode]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    setFlashPulse(true);
    setTimeout(() => setFlashPulse(false), 180);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopStream();
    setCaptured((prev) => [...prev, dataUrl]);
    setMode('review');
  };

  const handleFallbackFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const url = URL.createObjectURL(files[0]);
    setCaptured((prev) => [...prev, url]);
    setMode('review');
    e.target.value = '';
  };

  const addAnother = () => {
    if (captured.length >= maxPhotos) return;
    setMode('live');
  };

  const roundBtn: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(120, 120, 128, 0.5)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
    flexShrink: 0,
  };

  const lastPhoto = captured[captured.length - 1];
  const atMax = captured.length >= maxPhotos;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {mode === 'live' ? (
        <>
          {/* Live camera */}
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraError ? 'none' : 'block' }}
            />

            {cameraError && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '32px', textAlign: 'center' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="7" width="18" height="13" rx="3" stroke="#FFFFFF" strokeWidth="1.6" />
                  <circle cx="12" cy="13.5" r="3.4" stroke="#FFFFFF" strokeWidth="1.6" />
                  <path d="M8.2 7l1.1-2.2h5.4L15.8 7" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ color: '#FFFFFF', fontSize: '15px', maxWidth: '260px', lineHeight: 1.5 }}>
                  Camera unavailable. Grant camera access, or pick a photo from your library.
                </div>
                <button
                  type="button"
                  onClick={() => fallbackInputRef.current?.click()}
                  style={{ padding: '13px 22px', borderRadius: '999px', backgroundColor: '#FD5F53', color: '#FFFFFF', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Choose from library
                </button>
              </div>
            )}

            {flashPulse && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#FFFFFF', opacity: 0.85 }} />}

            {/* Top controls */}
            <div style={{ position: 'absolute', top: '52px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <button type="button" onClick={() => { stopStream(); onBack(); }} style={roundBtn}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M15 5l-7 7 7 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={() => setFlashOn((v) => !v)} style={roundBtn}>
                {flashOn ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M3 3l18 18" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* LIVE CAPTURE badge */}
            <div style={{ position: 'absolute', top: '104px', left: '20px', display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: '#FD5F53', borderRadius: '999px', padding: '6px 14px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em' }}>LIVE CAPTURE</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            backgroundColor: '#48484A',
            padding: '30px 32px max(34px, env(safe-area-inset-bottom)) 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <button
              type="button"
              onClick={takePhoto}
              disabled={cameraError}
              style={{
                width: '72px', height: '72px', borderRadius: '50%', border: '4px solid #FFFFFF',
                backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: cameraError ? 'not-allowed' : 'pointer', opacity: cameraError ? 0.5 : 1, padding: 0,
              }}
            >
              <div style={{ width: '58px', height: '58px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
            </button>

            <button
              type="button"
              onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
              style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="3" stroke="#FFFFFF" strokeWidth="1.7" />
                <path d="M9.5 13.5a2.6 2.6 0 014.5-1.4M14.5 13.5a2.6 2.6 0 01-4.5 1.4" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M14 10.6l0.2 1.6-1.6-0.2M10 16.4l-0.2-1.6 1.6 0.2" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        /* Review of captured photo */
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#000000' }}>
          {lastPhoto && (
            <img src={lastPhoto} alt="captured" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}

          {/* Back */}
          <div style={{ position: 'absolute', top: '52px', left: '20px' }}>
            <button type="button" onClick={() => { onBack(); }} style={roundBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Photo captured badge */}
          <div style={{ position: 'absolute', top: '60px', right: '20px', display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: '#FD5F53', borderRadius: '999px', padding: '6px 14px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Photo {captured.length} captured</span>
          </div>

          {/* Thumbnail with count */}
          <div style={{ position: 'absolute', top: '104px', right: '20px', width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.85)', boxShadow: '0px 4px 12px rgba(0,0,0,0.3)' }}>
            {lastPhoto && <img src={lastPhoto} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{captured.length}</span>
            </div>
          </div>

          {/* Bottom actions */}
          <div style={{ position: 'absolute', bottom: 'max(30px, env(safe-area-inset-bottom))', left: '20px', right: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            <button
              type="button"
              onClick={addAnother}
              disabled={atMax}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.88)',
                border: 'none', borderRadius: '999px', padding: '12px 22px 12px 12px',
                cursor: atMax ? 'not-allowed' : 'pointer', opacity: atMax ? 0.5 : 1,
                fontFamily: 'inherit', backdropFilter: 'blur(6px)',
              }}
            >
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1F2430', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>+</span>
              <span style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <span style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: '#1F2430' }}>Add Another</span>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#5B5B66' }}>({captured.length}/{maxPhotos})</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onComplete(captured)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#0E3D5C', color: '#FFFFFF', border: 'none',
                borderRadius: '999px', padding: '17px 26px', cursor: 'pointer',
                fontSize: '17px', fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <input ref={fallbackInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFallbackFiles} />
    </div>
  );
}
