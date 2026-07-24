import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_KEY = 'kaeXCvS4tEksnniL7N1x';

interface DefaultZoneScreenProps {
  initialZone: string;
  onBack: () => void;
  onSave: (zone: string) => void;
}

interface MTFeature {
  text?: string;
  place_name?: string;
  place_type?: string[];
  center?: [number, number];
}
interface MTResponse { features?: MTFeature[]; }

const QUICK_TAGS: { label: string; fullName: string; coords: [number, number] }[] = [
  { label: 'Admiralty Way', fullName: 'Admiralty Way, Lekki Phase 1', coords: [3.4720, 6.4420] },
  { label: 'Chevron Drive', fullName: 'Chevron Drive, Lekki Phase 1', coords: [3.5358, 6.4430] },
  { label: 'Freedom Way', fullName: 'Freedom Way, Lekki', coords: [3.4735, 6.4360] },
];

async function reverseGeocode(lng: number, lat: number): Promise<string> {
  try {
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}&types=locality,place,neighbourhood,address`
    );
    const data = (await res.json()) as MTResponse;
    if (data.features && data.features.length > 0) {
      const match = data.features.find(
        (f) => f.place_type?.includes('locality') || f.place_type?.includes('place') || f.place_type?.includes('neighbourhood')
      );
      const target = match || data.features[0];
      const raw = target.place_name || target.text;
      if (raw) return raw.split(',').slice(0, 2).join(',').trim();
    }
  } catch { /* ignore */ }
  return 'Selected location';
}

export default function DefaultZoneScreen({ initialZone, onBack, onSave }: DefaultZoneScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const pendingNameRef = useRef<string | null>(null);
  const [locationName, setLocationName] = useState(initialZone);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
      center: [3.5852, 6.4698],
      zoom: 14,
      attributionControl: false,
    });
    mapRef.current = map;

    const handleMoveEnd = async () => {
      // If a search/pill just set a friendly name, keep it and skip reverse geocode.
      if (pendingNameRef.current) {
        setLocationName(pendingNameRef.current);
        pendingNameRef.current = null;
        return;
      }
      const c = map.getCenter();
      const name = await reverseGeocode(c.lng, c.lat);
      setLocationName(name);
    };
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const goToPlace = async (query: string) => {
    try {
      const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}`);
      const data = (await res.json()) as MTResponse;
      const f = data.features?.[0];
      if (f?.center) {
        const name = (f.place_name || f.text || query).split(',').slice(0, 2).join(',').trim();
        pendingNameRef.current = name;
        setLocationName(name);
        mapRef.current?.flyTo({ center: f.center, zoom: 15.5, essential: true });
      }
    } catch { /* ignore */ }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) goToPlace(searchQuery.trim());
  };

  const selectTag = (tag: { label: string; fullName: string; coords: [number, number] }) => {
    setSearchQuery(tag.label);
    pendingNameRef.current = tag.fullName;
    setLocationName(tag.fullName);
    mapRef.current?.flyTo({ center: tag.coords, zoom: 15.5, essential: true });
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 2,
      backgroundColor: '#E8E4DC',
      fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Center pin */}
      <div style={{ position: 'absolute', top: 'calc(50% - 55px)', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 3, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ animation: 'pinBounceDZ 2s ease-in-out infinite alternate' }}>
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15))' }}>
            <path d="M20 0C8.954 0 0 8.954 0 20C0 32.5 20 48 20 48C20 48 40 32.5 40 20C40 8.954 31.046 0 20 0Z" fill="#E11D48" />
            <circle cx="20" cy="18" r="7" fill="white" /><circle cx="20" cy="18" r="3.5" fill="#E11D48" />
          </svg>
        </div>
        <div style={{ width: '12px', height: '4px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '50%', marginTop: '-2px', animation: 'shadowScaleDZ 2s ease-in-out infinite alternate' }} />
        <style>{`@keyframes pinBounceDZ { 0% { transform: translateY(-4px); } 100% { transform: translateY(-10px); } } @keyframes shadowScaleDZ { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(0.6); opacity: 0.4; } }`}</style>
      </div>

      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '52px 20px 0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)', cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>
            Adjust location
          </h2>
          <div />
        </div>

        <form onSubmit={handleSearchSubmit} style={{ marginTop: '18px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: '#FFFFFF', borderRadius: '999px', padding: '14px 18px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search a street or area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#111827', backgroundColor: 'transparent', fontFamily: 'inherit', minWidth: 0 }}
            />
          </div>
        </form>
      </div>

      {/* Bottom panel */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: '#FFFFFF', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
        padding: '20px 20px max(20px, env(safe-area-inset-bottom)) 20px',
        boxShadow: '0px -8px 24px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '18px' }}>
          {QUICK_TAGS.map((tag) => {
            const selected = searchQuery === tag.label;
            return (
              <button
                key={tag.label}
                type="button"
                onClick={() => selectTag(tag)}
                style={{
                  flexShrink: 0, padding: '10px 18px', borderRadius: '999px',
                  fontSize: '14px', fontWeight: 600,
                  border: selected ? 'none' : '1.5px solid #E5E7EB',
                  backgroundColor: selected ? '#0E3D5C' : '#FFFFFF',
                  color: selected ? '#FFFFFF' : '#374151',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '17px', fontWeight: 700, color: '#111827' }}>
          {locationName}
        </div>
        <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '3px', marginBottom: '18px' }}>
          Pin location
        </div>

        <button
          type="button"
          onClick={() => onSave(locationName)}
          style={{ width: '100%', padding: '17px', borderRadius: '999px', backgroundColor: '#0E3D5C', color: '#FFFFFF', border: 'none', fontSize: '17px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
