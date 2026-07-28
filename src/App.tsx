import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import locationPinIcon from './assets/location-06.svg';

function ToastCheckmark() {
  return (
    <svg width="26" height="26" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M9.59493 1.74423C9.85509 1.6406 10.1443 1.6406 10.4044 1.74423C11.2431 2.07822 11.4069 3.36437 12.3965 3.43597C13.0934 3.48639 13.7771 2.90548 14.4764 3.07962C14.7584 3.14986 15.002 3.32966 15.1547 3.58031C15.6223 4.34837 15.0188 5.47727 15.7816 6.11457C16.3115 6.55714 17.1872 6.49987 17.648 7.04242C17.842 7.27095 17.9373 7.56903 17.9124 7.86959C17.8387 8.76371 16.6987 9.32281 16.9493 10.2864C17.1226 10.9534 17.854 11.4223 17.9124 12.1301C17.9373 12.4307 17.842 12.7288 17.648 12.9573C17.069 13.6389 15.817 13.4144 15.456 14.3383C15.2025 14.9868 15.528 15.8063 15.1547 16.4193C15.002 16.67 14.7584 16.8498 14.4764 16.9201C13.6082 17.1362 12.7269 16.2036 11.8914 16.7297C11.2949 17.1052 11.0812 17.9861 10.4044 18.2554C10.1443 18.3591 9.85509 18.3591 9.59493 18.2554C8.91817 17.9861 8.70442 17.1052 8.10792 16.7297C7.28277 16.2101 6.37645 17.1326 5.52293 16.9201C5.2409 16.8498 4.99734 16.67 4.84472 16.4193C4.37706 15.6513 4.98054 14.5224 4.21776 13.8851C3.68786 13.4425 2.81213 13.4999 2.35138 12.9573C2.15735 12.7288 2.06204 12.4307 2.08688 12.1301C2.14538 11.4223 2.87667 10.9534 3.05009 10.2864C3.29807 9.3329 2.15971 8.75062 2.08688 7.86959C2.06204 7.56903 2.15735 7.27095 2.35138 7.04242C2.93031 6.36054 4.18217 6.58528 4.54333 5.66136C4.79685 5.01283 4.47141 4.1934 4.84472 3.58031C4.99734 3.32966 5.2409 3.14986 5.52293 3.07962C6.22222 2.90548 6.90599 3.48639 7.60283 3.43597C8.59239 3.36439 8.75627 2.07822 9.59493 1.74423Z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.5 11.1112C7.5 11.1112 8.22917 11.1112 8.95833 12.5002C8.95833 12.5002 11.2745 9.02791 13.3333 8.3335" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

import Auth from './Auth';
import TopHeader from './components/TopHeader';
import MapControls from './components/MapControls';
import BottomNav from './components/BottomNav';
import FeedScreen from './components/FeedScreen';
import AlertsScreen from './components/AlertsScreen';
import ProfileScreen from './components/ProfileScreen';
import PersonalInfoScreen from './components/PersonalInfoScreen';
import PrivacySecurityScreen from './components/PrivacySecurityScreen';
import ChangePasswordScreen from './components/ChangePasswordScreen';
import DeleteAccountModal from './components/DeleteAccountModal';
import LogoutModal from './components/LogoutModal';
import WeatherModal from './components/WeatherModal';
import type { ConditionData } from './components/WeatherModal';
import { fetchWeather } from './lib/weather';
import CameraCaptureScreen from './components/CameraCaptureScreen';
import LocationPreferencesScreen from './components/LocationPreferencesScreen';
import LocationAccessScreen from './components/LocationAccessScreen';
import DefaultZoneScreen from './components/DefaultZoneScreen';
import HelpSupportScreen from './components/HelpSupportScreen';
import UsernameEditScreen from './components/UsernameEditScreen';
import PhoneEditScreen from './components/PhoneEditScreen';
import EmailEditScreen from './components/EmailEditScreen';
import PhotoPermissionModal from './components/PhotoPermissionModal';
import LocationPermissionModal from './components/LocationPermissionModal';
import NotificationPermissionModal from './components/NotificationPermissionModal';
import type { FloodReport } from './type';


const MAPTILER_KEY = 'kaeXCvS4tEksnniL7N1x';
const VERIFICATION_THRESHOLD = 3;
const REPORTS_API_URL = 'https://floodwatch-backend-82y3.onrender.com/api/reports';
const FALLBACK_REPORT_IMAGE = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400';
// If the app is backgrounded (tab hidden / browser minimized) longer than
// this, require signing in again instead of silently resuming the session.
const BACKGROUND_LOGOUT_MS = 5 * 60 * 1000;

// On Android, skip the app's custom iOS-styled permission sheets and trigger
// the real browser APIs instead, so the OS's own system permission dialog
// shows up (as it would in a native Android app).
const isAndroidDevice = () => /android/i.test(navigator.userAgent);

// Shape returned by the shared backend's GET /api/reports.
interface BackendReport {
  _id: string;
  location: { type: string; coordinates: [number, number] };
  confirmations: { yes: number; no: number; notSure: number };
  // New reports come back as "waterLevel"; some older documents on the
  // backend still use the legacy field name "severity".
  waterLevel?: 'Low' | 'Medium' | 'High';
  severity?: 'Low' | 'Medium' | 'High';
  description?: string;
  photoUrl?: string;
  status?: string;
  // The backend populates the creator field with the full user object.
  creator?: string | { _id: string; name?: string };
  createdAt: string;
}

// The backend keys reports by Mongo ObjectId (a string); our FloodReport
// shape uses numeric ids, so hash the ObjectId into a stable number.
function hashIdToNumber(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// The backend has no way to resolve another user's chosen username from
// their id, so derive a short, stable, honestly-generic handle from it —
// the same reporter always shows the same handle, instead of a random
// rotating placeholder name that looks like it belongs to a specific person.
function reporterHandleFromCreatorId(creatorId: string): string {
  return `Reporter-${creatorId.slice(-4).toUpperCase()}`;
}

function timeActiveFrom(createdAtMs: number): string {
  const diffMins = Math.max(0, Math.floor((Date.now() - createdAtMs) / 60000));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min`;
  const hrs = Math.floor(diffMins / 60);
  if (hrs < 24) return `${hrs}hr ${diffMins % 60}m`;
  return `${Math.floor(hrs / 24)}d`;
}

// A captured photo is a blob: URL that only exists in this browser's memory,
// so it has to be re-read as real file bytes before it can be uploaded.
// Downscale it first so a full-resolution phone photo doesn't take forever
// to upload. The backend expects an actual multipart file (field "photo"),
// which it uploads to Cloudinary itself and returns a real photoUrl for.
function dataURLtoBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(',');
  const mime = header.slice(5, header.indexOf(';'));
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

async function compressImageToBlob(objectUrl: string, maxDim = 1280, quality = 0.8): Promise<Blob> {
  const sourceBlob = objectUrl.startsWith('data:')
    ? dataURLtoBlob(objectUrl)
    : await (await fetch(objectUrl)).blob();
  const bitmap = await createImageBitmap(sourceBlob);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/jpeg', quality);
  });
}

// 1. Extend your MapTilerFeature interface to include place_type
interface MapTilerFeature {
  text?: string;
  place_name?: string;
  place_type?: string[]; // <--- Add this!
  center?: [number, number];
}

interface MapTilerResponse {
  features?: MapTilerFeature[];
}

// interface MapTilerFeature {
//   text?: string;
//   place_name?: string;
//   center?: [number, number];
// }

// interface MapTilerResponse {
//   features?: MapTilerFeature[];
// }

const INITIAL_FLOOD_REPORTS: FloodReport[] = [
  {
    id: 1,
    locationName: "Chevron Drive",
    area: "Ajah",
    description: "Water is rising near the roundabout, be careful out there.",
    coordinates: [3.5358, 6.4430],
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400",
    images: ["https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400"],
    waterLevel: "Medium",
    status: "Unverified",
    confirmations: 0,
    photosCount: 1,
    timeActive: "1hr 20m",
    createdAt: Date.now() - 80 * 60 * 1000
  },
  {
    id: 2,
    locationName: "Admiralty Way",
    area: "Lekki Phase 1",
    description: "Knee-deep water outside the estate gate, cars are turning back. Been like this since the rain started.",
    coordinates: [3.5720, 6.4380],
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600",
      "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=600",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600",
      "https://images.unsplash.com/photo-1504751823-c0dfea8c2c1e?q=80&w=600",
    ],
    waterLevel: "Medium",
    status: "Unverified",
    confirmations: 0,
    photosCount: 4,
    timeActive: "22 min",
    createdAt: Date.now() - 22 * 60 * 1000
  }
];

type TabType = 'maps' | 'feed' | 'report' | 'alerts' | 'profile';
type ConfirmStep = 'initial' | 'add_photo' | 'confirmed_view';

export default function App() {
  // Restore the session from a previous sign-in so a page refresh doesn't
  // bounce the user back to the Auth screen.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('currentUser') || '');
  const [accountPhone, setAccountPhone] = useState<string>(() => localStorage.getItem('accountPhone') || '');
  const [accountEmail, setAccountEmail] = useState<string>(() => localStorage.getItem('accountEmail') || '');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const geolocateControlRef = useRef<maplibregl.GeolocateControl | null>(null);
  
  const [reports, setReports] = useState<FloodReport[]>(INITIAL_FLOOD_REPORTS);
  const reportsRef = useRef<FloodReport[]>(reports);
  const [selectedReport, setSelectedReport] = useState<FloodReport | null>(null);
  const [viewingOwnReport, setViewingOwnReport] = useState<FloodReport | null>(null);
  const [editingReportId, setEditingReportId] = useState<number | null>(null);
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabType>('maps');
  const [profileSubPage, setProfileSubPage] = useState<'main' | 'personalInfo' | 'username' | 'phone' | 'email' | 'privacySecurity' | 'changePassword' | 'locationPreferences' | 'locationAccess' | 'defaultZone' | 'helpSupport'>('main');
  const [defaultZone, setDefaultZone] = useState<string>('Ajah, Lagos State');
  const [reportingStage, setReportingStage] = useState<'form' | 'adjust' | 'review'>('form');

  const [confirmStep, setConfirmStep] = useState<ConfirmStep>('initial');
  const [userAddedPhoto, setUserAddedPhoto] = useState<boolean>(false);
  const [showCommunityPhotos, setShowCommunityPhotos] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showReportPostedToast, setShowReportPostedToast] = useState<boolean>(false);
  const [reportPostedIsEdit, setReportPostedIsEdit] = useState<boolean>(false);
  const [showLocationUpdatedToast, setShowLocationUpdatedToast] = useState<boolean>(false);
  const [showPasswordUpdatedToast, setShowPasswordUpdatedToast] = useState<boolean>(false);
  const [showDefaultZoneUpdatedToast, setShowDefaultZoneUpdatedToast] = useState<boolean>(false);
  const [showReportDeletedToast, setShowReportDeletedToast] = useState<boolean>(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showWeatherModal, setShowWeatherModal] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<ConditionData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [displayedLocation, setDisplayedLocation] = useState('Locating...');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newLocationName, setNewLocationName] = useState('Locating...');
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const currentCoordsRef = useRef<[number, number] | null>(null);
  // True once the user searches/browses away from their own location, so late
  // geolocation callbacks don't snap the map + name back to "current location".
  const userNavigatedRef = useRef<boolean>(false);
  const [isManualLocation, setIsManualLocation] = useState<boolean>(false);
  
  useEffect(() => {
    currentCoordsRef.current = currentCoords;
  }, [currentCoords]);

  useEffect(() => {
    reportsRef.current = reports;
  }, [reports]);

  useEffect(() => {
    if (currentTab !== 'profile') setProfileSubPage('main');
  }, [currentTab]);

  // Merge a batch of backend reports into local state: refresh confirmation
  // counts on ones we already know, reverse-geocode and add the new ones.
  // Shared by the periodic global poll and by location-scoped searches.
  const mergeBackendReports = async (backendReports: BackendReport[]) => {
    const knownByBackendId = new Map(
      reportsRef.current.filter(r => r.backendId).map(r => [r.backendId as string, r])
    );

    const updates = new Map<string, FloodReport>();
    for (const b of backendReports) {
      const existing = knownByBackendId.get(b._id);
      if (!existing) continue;
      updates.set(b._id, {
        ...existing,
        confirmations: b.confirmations.yes,
        status: b.confirmations.yes >= VERIFICATION_THRESHOLD ? 'Verified' : 'Unverified',
      });
    }

    const myUserId = localStorage.getItem('userId');
    const toAdd = backendReports.filter(b => !knownByBackendId.has(b._id));
    const added = await Promise.all(
      toAdd.map(async (b): Promise<FloodReport> => {
        const [lng, lat] = b.location.coordinates;
        const locationName = await fetchLocationName(lng, lat);
        const createdAtMs = Date.parse(b.createdAt) || Date.now();
        // Backend populates creator as an object {_id, name}; older records
        // may leave it as a plain id string or omit it entirely.
        const creatorId = typeof b.creator === 'object' ? b.creator?._id : b.creator;
        const creatorName = typeof b.creator === 'object' ? b.creator?.name : undefined;
        const reportedBy = creatorId
          ? (creatorId === myUserId
            ? currentUser
            : (creatorName || reporterHandleFromCreatorId(creatorId)))
          : undefined;
        return {
          id: hashIdToNumber(b._id),
          backendId: b._id,
          locationName,
          description: b.description,
          reportedBy,
          coordinates: [lng, lat],
          imageUrl: b.photoUrl || FALLBACK_REPORT_IMAGE,
          images: [b.photoUrl || FALLBACK_REPORT_IMAGE],
          waterLevel: b.waterLevel || b.severity || 'Medium',
          status: b.confirmations.yes >= VERIFICATION_THRESHOLD ? 'Verified' : 'Unverified',
          confirmations: b.confirmations.yes,
          photosCount: b.photoUrl ? 1 : 0,
          timeActive: timeActiveFrom(createdAtMs),
          createdAt: createdAtMs,
        };
      })
    );

    if (updates.size === 0 && added.length === 0) return;
    setReports(prev => {
      const withUpdates = prev.map(r => (r.backendId && updates.has(r.backendId) ? updates.get(r.backendId)! : r));
      return added.length > 0 ? [...withUpdates, ...added] : withUpdates;
    });
  };

  // Fetch reports near a specific place the user picked (search result),
  // rather than their live GPS position.
  const fetchReportsNearLocation = async (lng: number, lat: number) => {
    try {
      const res = await fetch(`${REPORTS_API_URL}/search?longitude=${lng}&latitude=${lat}`);
      if (!res.ok) return;
      const backendReports: BackendReport[] = await res.json();
      await mergeBackendReports(backendReports);
    } catch (error) {
      console.error('Failed to fetch reports near searched location:', error);
    }
  };

  // Pull in flood reports other users have made on the shared backend, so
  // they show up on the map, in search, and in the Feed alongside local
  // ones — including ones created by someone else while this session is
  // already open, via periodic polling.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const syncReports = async () => {
      try {
        const res = await fetch(REPORTS_API_URL);
        if (!res.ok || cancelled) return;
        const backendReports: BackendReport[] = await res.json();
        if (cancelled) return;
        await mergeBackendReports(backendReports);
      } catch (error) {
        console.error('Failed to fetch community reports:', error);
      }
    };

    syncReports();
    const intervalId = setInterval(syncReports, 5000);

    return () => { cancelled = true; clearInterval(intervalId); };
  }, [isAuthenticated]);

  const [commentNotifMessage, setCommentNotifMessage] = useState<string | null>(null);

  const handleNewCommentOnMyReport = (locationName: string) => {
    const body = `Someone commented on your report at ${locationName}`;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New comment on your report', { body });
    }
    setCommentNotifMessage(body);
    setTimeout(() => setCommentNotifMessage(null), 6000);
  };

  // Poll comment counts app-wide (not inside FeedScreen) so notifications fire
  // even when the user is on a different tab.
  const commentPrevCountsRef = useRef<Record<string, number>>({});
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchCounts = () => {
      const myReports = reports.filter(r => r.backendId && r.reportedBy === currentUser);
      myReports.forEach(r => {
        fetch(`https://floodwatch-backend-82y3.onrender.com/api/comments/${r.backendId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.ok ? res.json() : [])
          .then((data: unknown) => {
            const count = Array.isArray(data) ? data.length : 0;
            const prev = commentPrevCountsRef.current[r.backendId!];
            if (prev !== undefined && count > prev) {
              handleNewCommentOnMyReport(r.locationName);
            }
            commentPrevCountsRef.current[r.backendId!] = count;
          })
          .catch(() => {});
      });
    };

    fetchCounts();
    const id = setInterval(fetchCounts, 10000);
    return () => clearInterval(id);
  }, [isAuthenticated, reports, currentUser]);

  const [newWaterLevel, setNewWaterLevel] = useState<'Low' | 'Medium' | 'High' | null>(null);
  const [description, setDescription] = useState('');
  
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const confirmFileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [photoLibraryGranted, setPhotoLibraryGranted] = useState<boolean>(false);
  const [pendingPhotoTarget, setPendingPhotoTarget] = useState<'report' | 'confirm' | null>(null);
  const [showCameraCapture, setShowCameraCapture] = useState<boolean>(false);
  const [showLocationPermissionModal, setShowLocationPermissionModal] = useState<boolean>(false);
  const [showNotificationPermissionModal, setShowNotificationPermissionModal] = useState<boolean>(false);

  const requestPhotoAccess = (target: 'report' | 'confirm') => {
    if (photoLibraryGranted) {
      (target === 'report' ? fileInputRef : confirmFileInputRef).current?.click();
    } else {
      setPendingPhotoTarget(target);
    }
  };

  const handlePhotoPermissionResolved = (granted: boolean) => {
    const target = pendingPhotoTarget;
    setPendingPhotoTarget(null);
    if (granted) {
      setPhotoLibraryGranted(true);
      (target === 'report' ? fileInputRef : confirmFileInputRef).current?.click();
    }
  };

  // Android: skip the custom photo-permission sheet and go straight to the
  // system's own file/photo picker, which is already a native Android dialog.
  useEffect(() => {
    if (!pendingPhotoTarget || !isAndroidDevice()) return;
    handlePhotoPermissionResolved(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPhotoTarget]);

  // Android: skip the custom location-permission sheet and trigger the real
  // geolocation prompt, which the OS renders as its own system dialog.
  useEffect(() => {
    if (!showLocationPermissionModal || !isAndroidDevice()) return;
    setShowLocationPermissionModal(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setShowNotificationPermissionModal(true),
        () => setShowNotificationPermissionModal(true),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setShowNotificationPermissionModal(true);
    }
  }, [showLocationPermissionModal]);

  // Android: skip the custom notification-permission sheet and trigger the
  // real Notification API, which the OS renders as its own system dialog.
  useEffect(() => {
    if (!showNotificationPermissionModal || !isAndroidDevice()) return;
    setShowNotificationPermissionModal(false);
    if ('Notification' in window) {
      Notification.requestPermission().catch(() => {});
    }
  }, [showNotificationPermissionModal]);

  const [userVotes, setUserVotes] = useState<Record<number, 'yes' | 'no'>>({});

  const handleAuthComplete = (username: string, isNewSignup?: boolean, email?: string) => {
    const resolvedUsername = username || 'User';
    setCurrentUser(resolvedUsername);
    localStorage.setItem('currentUser', resolvedUsername);
    if (email) {
      setAccountEmail(email);
      localStorage.setItem('accountEmail', email);
    }
    setIsAuthenticated(true);
    setCurrentTab('maps');
    if (isNewSignup) setShowLocationPermissionModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accountEmail');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setCurrentUser('');
    setCurrentTab('maps');
    setIsReporting(false);
  };

  // If the app sits backgrounded (tab hidden, browser minimized) for more
  // than BACKGROUND_LOGOUT_MS, require signing in again on return instead of
  // silently resuming — covers both switching away and coming back, and
  // reopening the app later after it was fully closed while backgrounded.
  useEffect(() => {
    if (!isAuthenticated) return;

    const backgroundedAt = localStorage.getItem('backgroundedAt');
    if (backgroundedAt && Date.now() - Number(backgroundedAt) > BACKGROUND_LOGOUT_MS) {
      localStorage.removeItem('backgroundedAt');
      handleLogout();
      return;
    }
    localStorage.removeItem('backgroundedAt');

    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.setItem('backgroundedAt', String(Date.now()));
        return;
      }
      const hiddenSince = localStorage.getItem('backgroundedAt');
      localStorage.removeItem('backgroundedAt');
      if (hiddenSince && Date.now() - Number(hiddenSince) > BACKGROUND_LOGOUT_MS) {
        handleLogout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Open the weather modal and fetch live weather for the currently-viewed map area.
  const handleOpenWeather = async () => {
    setShowWeatherModal(true);
    setWeatherData(null);
    setWeatherLoading(true);
    try {
      const center = mapRef.current?.getCenter();
      const lat = center ? center.lat : (currentCoordsRef.current ? currentCoordsRef.current[1] : 6.47);
      const lng = center ? center.lng : (currentCoordsRef.current ? currentCoordsRef.current[0] : 3.58);
      const data = await fetchWeather(lat, lng);
      setWeatherData(data);
    } catch {
      setWeatherData(null); // falls back to the static preview inside the modal
    } finally {
      setWeatherLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.trim().slice(0, 2).toUpperCase();
  };

  const getSeverityColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#22C55E';
      default: return '#EF4444';
    }
  };

  // 2. Do NOT add explicit types (like f: any) inside the .find() callback
const fetchLocationName = async (lng: number, lat: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}&types=locality,place,neighbourhood,address`
    );
    const data = (await response.json()) as MapTilerResponse;

    if (data.features && data.features.length > 0) {
      // TypeScript automatically infers `f` as `MapTilerFeature` here—no `any` needed!
      const localityMatch = data.features.find((f) =>
        f.place_type?.includes('locality') ||
        f.place_type?.includes('place') ||
        f.place_type?.includes('neighbourhood')
      );

      const targetFeature = localityMatch || data.features[0];
      const rawName = targetFeature.text || targetFeature.place_name;

      if (rawName) {
        return rawName.split(',')[0].trim();
      }
    }
  } catch (error) {
    console.error("Geocoding fetch error:", error);
  }
  return "Current Location";
};

  const handleRecenterLocation = () => {
    userNavigatedRef.current = false; // user explicitly wants their own location back
    if (geolocateControlRef.current) {
      geolocateControlRef.current.trigger();
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          setCurrentCoords([longitude, latitude]);
          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 15, essential: true });
          const placeName = await fetchLocationName(longitude, latitude);
          setDisplayedLocation(placeName);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (userNavigatedRef.current) return; // user already searched/browsed away
          const { longitude, latitude } = position.coords;
          setCurrentCoords([longitude, latitude]);
          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
          const placeName = await fetchLocationName(longitude, latitude);
          if (userNavigatedRef.current) return;
          setDisplayedLocation(placeName);
          setNewLocationName(placeName);
        },
        async () => {
          if (userNavigatedRef.current) return;
          const fallbackCoords: [number, number] = [7.33, 5.29];
          setCurrentCoords(fallbackCoords);
          const placeName = await fetchLocationName(fallbackCoords[0], fallbackCoords[1]);
          if (userNavigatedRef.current) return;
          setDisplayedLocation(placeName);
          setNewLocationName(placeName);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!mapRef.current || !isReporting || reportingStage !== 'adjust') return;
    const map = mapRef.current;
    const handleMapMoveContinuous = () => {
      const center = map.getCenter();
      if (center) {
        setCurrentCoords([center.lng, center.lat]);
        setIsManualLocation(true);
      }
    };
    const handleMapMoveEnd = async () => {
      const center = map.getCenter();
      if (center) {
        const name = await fetchLocationName(center.lng, center.lat);
        setNewLocationName(name);
      }
    };
    map.on('move', handleMapMoveContinuous);
    map.on('moveend', handleMapMoveEnd);
    return () => {
      map.off('move', handleMapMoveContinuous);
      map.off('moveend', handleMapMoveEnd);
    };
  }, [isReporting, reportingStage]);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (capturedImages.length >= 2) {
        alert("Maximum limit reached.");
        return;
      }
      const localImageUrl = URL.createObjectURL(files[0]);
      setCapturedImages(prev => [...prev, localImageUrl]);
      if (mapRef.current) {
        const center = mapRef.current.getCenter();
        setCurrentCoords([center.lng, center.lat]);
      }
      setIsReporting(true);
      setCurrentTab('report');
    }
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setCapturedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Initial Map Setup
  useEffect(() => {
    if (!isAuthenticated || !mapContainerRef.current || mapRef.current) return;
    
    const initialCoords = currentCoordsRef.current || [7.33, 5.29];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
      center: initialCoords,
      zoom: currentCoordsRef.current ? 14 : 12
    });

    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: false,
      showUserLocation: true,
      showAccuracyCircle: true
    });

    geolocateControlRef.current = geolocateControl;
    map.addControl(geolocateControl);

    // Strongly typed callback replacing explicit `any`
    geolocateControl.on('geolocate', async (position: unknown) => {
      if (userNavigatedRef.current) return; // don't override a searched/browsed place
      const posObj = position as GeolocationPosition;
      if (posObj?.coords) {
        const { longitude, latitude } = posObj.coords;
        setCurrentCoords([longitude, latitude]);
        const name = await fetchLocationName(longitude, latitude);
        if (userNavigatedRef.current) return;
        setDisplayedLocation(name);
        setNewLocationName(name);
      }
    });

    map.on('load', () => {
      geolocateControl.trigger();
    });

    mapRef.current = map;

    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !mapRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    reports.forEach((report) => {
      const color = getSeverityColor(report.waterLevel);
      const isVerified = report.status === 'Verified';
      const glyphEl = document.createElement('div');

      if (isVerified) {
        glyphEl.className = 'photo-marker-wrapper';

        const badgeEl = document.createElement('div');
        badgeEl.className = 'photo-marker-badge';
        badgeEl.style.backgroundImage = `url(${report.imageUrl})`;
        badgeEl.style.border = `4px solid ${color}`;

        const countEl = document.createElement('div');
        countEl.className = 'photo-marker-count';
        countEl.innerText = `${report.confirmations}`;
        badgeEl.appendChild(countEl);

        const arrowEl = document.createElement('div');
        arrowEl.className = 'photo-marker-arrow';
        arrowEl.style.borderTopColor = color;

        glyphEl.appendChild(badgeEl);
        glyphEl.appendChild(arrowEl);
      } else {
        glyphEl.style.cssText = 'width:48px;height:48px;position:relative;display:flex;align-items:center;justify-content:center;';

        const haloEl = document.createElement('div');
        haloEl.style.cssText = `position:absolute;width:100%;height:100%;border-radius:50%;background-color:${color}26;animation:mapPulse 2.4s infinite ease-out;`;

        const ringEl = document.createElement('div');
        ringEl.style.cssText = `position:relative;z-index:1;width:30px;height:30px;border-radius:50%;border:4px solid ${color};background:#FFFFFF;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.15);`;

        const coreEl = document.createElement('div');
        coreEl.style.cssText = `width:14px;height:14px;border-radius:50%;background-color:${color};`;

        ringEl.appendChild(coreEl);
        glyphEl.appendChild(haloEl);
        glyphEl.appendChild(ringEl);
      }

      const glyphWrapEl = document.createElement('div');
      glyphWrapEl.style.position = 'relative';
      glyphWrapEl.style.display = 'inline-block';
      glyphWrapEl.appendChild(glyphEl);

      if (userVotes[report.id]) {
        const checkEl = document.createElement('div');
        checkEl.style.position = 'absolute';
        checkEl.style.bottom = isVerified ? '6px' : '-2px';
        checkEl.style.right = '-3px';
        checkEl.style.width = '16px';
        checkEl.style.height = '16px';
        checkEl.style.borderRadius = '50%';
        checkEl.style.backgroundColor = '#16A34A';
        checkEl.style.border = '2px solid #FFFFFF';
        checkEl.style.display = 'flex';
        checkEl.style.alignItems = 'center';
        checkEl.style.justifyContent = 'center';
        checkEl.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        checkEl.innerHTML = '<svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        glyphWrapEl.appendChild(checkEl);
      }

      const columnEl = document.createElement('div');
      columnEl.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;';
      columnEl.appendChild(glyphWrapEl);

      const labelEl = document.createElement('div');
      labelEl.innerText = report.locationName;
      labelEl.style.cssText = 'margin-top:8px;font-family:"Outfit",-apple-system,BlinkMacSystemFont,sans-serif;font-weight:700;font-size:14px;line-height:1.2;color:#111827;text-align:center;white-space:nowrap;text-shadow:0 0 6px #FFFFFF, 0 0 6px #FFFFFF, 0 0 6px #FFFFFF;';
      columnEl.appendChild(labelEl);

      if (!isVerified) {
        const pillEl = document.createElement('div');
        pillEl.innerText = `${report.confirmations}/${VERIFICATION_THRESHOLD} confirmed`;
        pillEl.style.cssText = 'margin-top:8px;background:#FFFFFF;border-radius:999px;padding:7px 16px;font-family:"Outfit",-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;font-weight:700;color:#111827;box-shadow:0 4px 10px rgba(0,0,0,0.15);white-space:nowrap;';
        columnEl.appendChild(pillEl);
      }

      columnEl.addEventListener('click', () => {
        if (report.reportedBy === currentUser) {
          setViewingOwnReport(report);
        } else {
          setSelectedReport(report);
          setConfirmStep('initial');
          setUserAddedPhoto(false);
          setShowCommunityPhotos(true);
        }
        mapRef.current?.flyTo({
          center: report.coordinates,
          zoom: 15,
          essential: true
        });
      });

      const newMarker = new maplibregl.Marker({ element: columnEl, anchor: 'bottom' })
        .setLngLat(report.coordinates)
        .addTo(mapRef.current!);

      markersRef.current.push(newMarker);
    });
  }, [reports, isAuthenticated, userVotes, currentUser]);

  const handleMapsTabClick = () => {
    setCurrentTab('maps');
    setIsReporting(false);
    mapRef.current?.flyTo({ center: currentCoords || [7.33, 5.29], zoom: 14 });
  };

  const handleMainSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainSearchQuery.trim()) return;
    userNavigatedRef.current = true; // pin to the searched place; ignore late geolocation
    try {
      const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(mainSearchQuery)}.json?key=${MAPTILER_KEY}`);
      const data = (await response.json()) as MapTilerResponse;
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.center && feature.place_name) {
          const placeName = (feature.text || feature.place_name).split(',')[0].trim();
          setDisplayedLocation(placeName);
          setCurrentCoords(feature.center);
          mapRef.current?.flyTo({ center: feature.center, zoom: 14 });
          setMainSearchQuery('');
          // Pull in reports near the place the user just searched for,
          // rather than relying only on their live GPS position.
          fetchReportsNearLocation(feature.center[0], feature.center[1]);
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleManualSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_KEY}`);
      const data = (await response.json()) as MapTilerResponse;
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.center && feature.place_name) {
          const placeName = (feature.text || feature.place_name).split(',')[0].trim();
          setNewLocationName(placeName);
          setCurrentCoords(feature.center);
          setIsManualLocation(true);
          mapRef.current?.flyTo({ center: feature.center, zoom: 16.5 });
        }
      }
    } catch (err) { console.error(err); }
  };

  const selectQuickTag = async (tag: string) => {
    setSearchQuery(tag);
    setIsManualLocation(true);
    try {
      const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(tag)}.json?key=${MAPTILER_KEY}`);
      const data = (await response.json()) as MapTilerResponse;
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.center && feature.place_name) {
          const placeName = (feature.text || feature.place_name).split(',')[0].trim();
          setNewLocationName(placeName);
          setCurrentCoords(feature.center);
          mapRef.current?.flyTo({ center: feature.center, zoom: 16.5 });
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newWaterLevel) {
      alert("Please select severity level");
      return;
    }
    setIsSubmitting(true);
    const targetCoordinates: [number, number] = currentCoords || [0, 0];
    const imageList = capturedImages.length > 0 ? capturedImages : ["https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400"];

    if (editingReportId !== null) {
      setReports(prev => prev.map(rep => rep.id === editingReportId ? {
        ...rep,
        locationName: newLocationName,
        description: description || rep.description,
        coordinates: targetCoordinates,
        imageUrl: imageList[0],
        images: imageList,
        waterLevel: newWaterLevel,
        photosCount: imageList.length,
      } : rep));

      mapRef.current?.flyTo({ center: targetCoordinates, zoom: 15 });
      setIsSubmitting(false); setDescription(''); setCapturedImages([]); setIsReporting(false);
      setIsManualLocation(false); setReportingStage('form'); setSearchQuery(''); setCurrentTab('maps');
      setNewWaterLevel(null); setEditingReportId(null);
      setReportPostedIsEdit(true);
      setShowReportPostedToast(true);
      setTimeout(() => setShowReportPostedToast(false), 4000);
      return;
    }

    const newReport: FloodReport = {
      id: Date.now(),
      locationName: newLocationName,
      description: description || undefined,
      reportedBy: currentUser,
      coordinates: targetCoordinates,
      imageUrl: imageList[0],
      images: imageList,
      waterLevel: newWaterLevel,
      status: "Unverified",
      confirmations: 0,
      photosCount: imageList.length,
      timeActive: "Just now",
      createdAt: Date.now()
    };

    setReports(prev => [...prev, newReport]);
    mapRef.current?.flyTo({ center: targetCoordinates, zoom: 15 });
    setIsSubmitting(false); setDescription(''); setCapturedImages([]); setIsReporting(false);
    setIsManualLocation(false); setReportingStage('form'); setSearchQuery(''); setCurrentTab('maps');
    setNewWaterLevel(null);
    // Show the "Report posted" notification
    setReportPostedIsEdit(false);
    setShowReportPostedToast(true);
    setTimeout(() => setShowReportPostedToast(false), 4000);

    // Sync to the shared backend in the background so other users can see
    // this report too. Local UX above is unaffected either way. The backend
    // takes the photo as an actual multipart file upload (field "photo") and
    // hosts it on Cloudinary itself — it does not accept a photoUrl string.
    const token = localStorage.getItem('token');
    (async () => {
      const formData = new FormData();
      formData.append('longitude', String(targetCoordinates[0]));
      formData.append('latitude', String(targetCoordinates[1]));
      formData.append('waterLevel', newWaterLevel);
      if (description) formData.append('description', description);
      if (imageList[0]?.startsWith('blob:') || imageList[0]?.startsWith('data:')) {
        try {
          const photoBlob = await compressImageToBlob(imageList[0]);
          formData.append('photo', photoBlob, 'report.jpg');
        } catch (error) {
          console.error('Failed to prepare photo for upload:', error);
        }
      }
      return fetch(REPORTS_API_URL, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
    })()
      .then(async (res) => {
        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);
          console.error('Failed to sync report to backend:', res.status, errorBody);
          showToast("Saved on this device, but couldn't share it with the community — check your connection.");
          return;
        }
        const created = await res.json().catch(() => null);
        if (created?._id) {
          setReports(prev => prev.map(rep => rep.id === newReport.id ? {
            ...rep,
            backendId: created._id,
            // Replace the local data:/blob: URL with the permanent Cloudinary URL
            ...(created.photoUrl ? { imageUrl: created.photoUrl, images: [created.photoUrl] } : {}),
          } : rep));
        }
      })
      .catch((error) => {
        console.error('Failed to sync report to backend:', error);
        showToast("Saved on this device, but couldn't share it with the community — check your connection.");
      });
  };

  const handleInitiateConfirm = () => {
    setConfirmStep('add_photo');
  };

  // Sync a vote to the shared backend in the background, for reports that
  // exist there (i.e. came from another user). Purely local reports have no
  // backendId and are skipped — nothing to sync.
  const syncVoteToBackend = (reportId: number, vote: 'yes' | 'no') => {
    const report = reports.find(r => r.id === reportId);
    if (!report?.backendId) return;
    const token = localStorage.getItem('token');
    fetch(`${REPORTS_API_URL}/${report.backendId}/confirm`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ vote }),
    }).catch((error) => console.error('Failed to sync vote to backend:', error));
  };

  const applyConfirmation = (reportId: number, newPhotoUrl?: string) => {
    if (userVotes[reportId] !== 'yes') {
      syncVoteToBackend(reportId, 'yes');
    }
    setReports(prevReports =>
      prevReports.map(rep => {
        if (rep.id === reportId) {
          // Never count past the verification threshold — once 3 people have
          // confirmed, no other user's vote can push the count higher.
          const alreadyCounted = userVotes[reportId] === 'yes' || rep.confirmations >= VERIFICATION_THRESHOLD;
          const updatedConfirmations = alreadyCounted ? rep.confirmations : rep.confirmations + 1;
          const isNowVerified = updatedConfirmations >= VERIFICATION_THRESHOLD;
          const updatedPhotos = newPhotoUrl ? [...(rep.images || [rep.imageUrl]), newPhotoUrl] : (rep.images || [rep.imageUrl]);

          const updatedReport: FloodReport = {
            ...rep,
            confirmations: updatedConfirmations,
            photosCount: updatedPhotos.length,
            images: updatedPhotos,
            imageUrl: updatedPhotos[0],
            status: isNowVerified ? 'Verified' : 'Unverified'
          };

          if (selectedReport?.id === reportId) {
            setSelectedReport(updatedReport);
          }
          return updatedReport;
        }
        return rep;
      })
    );

    setUserVotes(prev => ({ ...prev, [reportId]: 'yes' }));
  };

  const handleSkipPhotoAndConfirm = (reportId: number) => {
    applyConfirmation(reportId);
    setUserAddedPhoto(false);
    setConfirmStep('confirmed_view');
  };

  const handleConfirmPhotoCaptured = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && selectedReport) {
      const newImageUrl = URL.createObjectURL(files[0]);
      applyConfirmation(selectedReport.id, newImageUrl);
      setUserAddedPhoto(true);
      setConfirmStep('confirmed_view');
    }
    e.target.value = '';
  };

  const handleBackToMap = () => {
    setSelectedReport(null);
    setConfirmStep('initial');

    if (userAddedPhoto) {
      showToast("Confirmed, your photo was added to the gallery");
    } else {
      showToast("Confirmed, your feedback was recorded");
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleDeclineReport = (reportId: number) => {
    syncVoteToBackend(reportId, 'no');
    setUserVotes(prev => ({ ...prev, [reportId]: 'no' }));
  };

  // Whether the currently-open report can take a first-time vote right now —
  // once 3 people have confirmed it, nobody new can add a 4th.
  const canVoteOnReport = (report: FloodReport) => {
    if (userVotes[report.id]) return true;
    return report.confirmations < VERIFICATION_THRESHOLD;
  };

  const lockedVoteReason = (report: FloodReport): string | null => {
    if (canVoteOnReport(report)) return null;
    return 'This report has already been confirmed by the community.';
  };

  // Same flow whether opened from the map or an Alert. Once a user has
  // confirmed a report, further taps on either button are just an
  // acknowledgement — no re-voting, no re-counting confirmations.
  const handleConfirmTap = (report: FloodReport) => {
    if (userVotes[report.id] === 'yes') {
      showToast('Thanks!');
      setSelectedReport(null);
      setConfirmStep('initial');
      return;
    }
    handleInitiateConfirm();
  };

  const handleDeclineTap = (report: FloodReport) => {
    if (userVotes[report.id] !== 'yes') {
      handleDeclineReport(report.id);
    }
    showToast('Thanks!');
    setSelectedReport(null);
    setConfirmStep('initial');
  };

  const handleEditOwnReport = () => {
    if (!viewingOwnReport) return;
    setEditingReportId(viewingOwnReport.id);
    setCapturedImages(viewingOwnReport.images && viewingOwnReport.images.length > 0 ? viewingOwnReport.images : [viewingOwnReport.imageUrl]);
    setNewWaterLevel(viewingOwnReport.waterLevel);
    setDescription(viewingOwnReport.description || '');
    setNewLocationName(viewingOwnReport.locationName);
    setCurrentCoords(viewingOwnReport.coordinates);
    setIsManualLocation(true);
    setViewingOwnReport(null);
    setReportingStage('form');
    setIsReporting(true);
    setCurrentTab('report');
  };

  const handleDeleteOwnReport = () => {
    if (!viewingOwnReport) return;
    if (window.confirm(`Delete your report for ${viewingOwnReport.locationName}? This can't be undone.`)) {
      setReports(prev => prev.filter(r => r.id !== viewingOwnReport.id));
      setViewingOwnReport(null);
    }
  };

  if (!isAuthenticated) return <Auth onAuthComplete={handleAuthComplete} />;

  return (
    <div className="mobile-frame-viewport" style={{
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#091b29',
    }}>
    <main className="mobile-frame" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <input type="file" accept="image/*" capture="environment" ref={fileInputRef} style={{ display: 'none' }} onChange={handleCameraCapture} />
      <input type="file" accept="image/*" capture="environment" ref={confirmFileInputRef} style={{ display: 'none' }} onChange={handleConfirmPhotoCaptured} />

      {pendingPhotoTarget && !isAndroidDevice() && (
        <PhotoPermissionModal
          onSelectPhotos={() => handlePhotoPermissionResolved(true)}
          onAllowAll={() => handlePhotoPermissionResolved(true)}
          onDontAllow={() => handlePhotoPermissionResolved(false)}
        />
      )}

      {showLocationPermissionModal && !isAndroidDevice() && (
        <LocationPermissionModal
          onAllowOnce={() => { setShowLocationPermissionModal(false); setShowNotificationPermissionModal(true); }}
          onAllowWhileUsing={() => { setShowLocationPermissionModal(false); setShowNotificationPermissionModal(true); }}
          onDontAllow={() => { setShowLocationPermissionModal(false); setShowNotificationPermissionModal(true); }}
        />
      )}

      {showNotificationPermissionModal && !isAndroidDevice() && (
        <NotificationPermissionModal
          onDontAllow={() => setShowNotificationPermissionModal(false)}
          onOk={() => setShowNotificationPermissionModal(false)}
        />
      )}

      {showDeleteAccountModal && (
        <DeleteAccountModal
          onDelete={() => { setShowDeleteAccountModal(false); handleLogout(); }}
          onKeep={() => setShowDeleteAccountModal(false)}
        />
      )}

      {showLogoutModal && (
        <LogoutModal
          onLogout={() => { setShowLogoutModal(false); handleLogout(); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {showWeatherModal && (
        <WeatherModal
          location={displayedLocation && displayedLocation !== 'Locating...' ? displayedLocation : 'Ajah, Lagos'}
          onClose={() => setShowWeatherModal(false)}
          weather={weatherData}
          loading={weatherLoading}
        />
      )}

      {showCameraCapture && (
        <CameraCaptureScreen
          maxPhotos={2}
          onComplete={(photos) => {
            setCapturedImages(photos);
            setShowCameraCapture(false);
          }}
          onBack={() => {
            setShowCameraCapture(false);
            setIsReporting(false);
            setCapturedImages([]);
            setCurrentTab('maps');
            setNewWaterLevel(null);
          }}
        />
      )}

      <div ref={mapContainerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
      
      {isReporting && reportingStage === 'adjust' && (
        <div style={{ position: 'absolute', top: 'calc(50% - 55px)', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 2, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ transform: 'translateY(-4px)', animation: 'pinBounce 2s ease-in-out infinite alternate' }}>
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15))' }}>
              <path d="M20 0C8.954 0 0 8.954 0 20C0 32.5 20 48 20 48C20 48 40 32.5 40 20C40 8.954 31.046 0 20 0Z" fill="#E11D48" />
              <circle cx="20" cy="18" r="7" fill="white" /><circle cx="20" cy="18" r="3.5" fill="#E11D48" />
            </svg>
          </div>
          <div style={{ width: '12px', height: '4px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '50%', marginTop: '-2px', animation: 'shadowScale 2s ease-in-out infinite alternate' }} />
          <style>{`@keyframes pinBounce { 0% { transform: translateY(-4px); } 100% { transform: translateY(-10px); } } @keyframes shadowScale { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(0.6); opacity: 0.4; } }`}</style>
        </div>
      )}

      {!isReporting && currentTab === 'maps' && !selectedReport && !viewingOwnReport
        && !showReportPostedToast && !showLocationUpdatedToast && !showDefaultZoneUpdatedToast && (
        <MapControls handleRecenterLocation={handleRecenterLocation} />
      )}

      {!isReporting && currentTab === 'maps' && (
        <div style={{
          position: 'absolute',
          left: '20px',
          bottom: '108px',
          zIndex: 2,
          pointerEvents: 'none',
          fontFamily: '"Pacifico", cursive',
          fontWeight: 400,
          fontSize: '20px',
          color: '#1F2430',
          textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.9)',
        }}>
          Flood-watch
        </div>
      )}

      {currentTab === 'feed' && !isReporting && (
        <FeedScreen
          reports={reports}
          mainSearchQuery={mainSearchQuery}
          setMainSearchQuery={setMainSearchQuery}
          handleMainSearchSubmit={handleMainSearchSubmit}
          currentUser={currentUser}
          onDeleteReport={(id) => {
            setReports(prev => prev.filter(r => r.id !== id));
            setShowReportDeletedToast(true);
            setTimeout(() => setShowReportDeletedToast(false), 4000);
          }}
        />
      )}

      {currentTab === 'alerts' && !isReporting && (
        <AlertsScreen
          reports={reports}
          currentUser={currentUser}
          onOpenReport={(report) => {
            setCurrentTab('maps');
            setSelectedReport(report);
            setConfirmStep('initial');
            setUserAddedPhoto(false);
            setShowCommunityPhotos(true);
            mapRef.current?.flyTo({ center: report.coordinates, zoom: 15, essential: true });
          }}
        />
      )}

      {currentTab === 'profile' && !isReporting && (
        profileSubPage === 'username' ? (
          <UsernameEditScreen
            currentUser={currentUser}
            onBack={() => setProfileSubPage('personalInfo')}
            onSave={(newUsername) => setCurrentUser(newUsername)}
          />
        ) : profileSubPage === 'phone' ? (
          <PhoneEditScreen
            currentPhone={accountPhone}
            onBack={() => setProfileSubPage('personalInfo')}
            onSave={(phone) => { setAccountPhone(phone); localStorage.setItem('accountPhone', phone); }}
          />
        ) : profileSubPage === 'email' ? (
          <EmailEditScreen
            currentEmail={accountEmail}
            onBack={() => setProfileSubPage('personalInfo')}
            onSave={(newEmail) => setAccountEmail(newEmail)}
          />
        ) : profileSubPage === 'personalInfo' ? (
          <PersonalInfoScreen
            onBack={() => setProfileSubPage('main')}
            onOpenUsername={() => setProfileSubPage('username')}
            onOpenPhone={() => setProfileSubPage('phone')}
            onOpenEmail={() => setProfileSubPage('email')}
          />
        ) : profileSubPage === 'changePassword' ? (
          <ChangePasswordScreen
            onBack={() => setProfileSubPage('privacySecurity')}
            onSubmit={() => {
              setProfileSubPage('privacySecurity');
              setShowPasswordUpdatedToast(true);
              setTimeout(() => setShowPasswordUpdatedToast(false), 3200);
            }}
          />
        ) : profileSubPage === 'privacySecurity' ? (
          <PrivacySecurityScreen
            onBack={() => setProfileSubPage('main')}
            onChangePassword={() => setProfileSubPage('changePassword')}
            onDeleteAccount={() => setShowDeleteAccountModal(true)}
          />
        ) : profileSubPage === 'locationAccess' ? (
          <LocationAccessScreen
            onBack={() => setProfileSubPage('locationPreferences')}
          />
        ) : profileSubPage === 'defaultZone' ? (
          <DefaultZoneScreen
            initialZone={defaultZone}
            onBack={() => setProfileSubPage('locationPreferences')}
            onSave={(zone) => {
              setDefaultZone(zone);
              setProfileSubPage('locationPreferences');
              setShowDefaultZoneUpdatedToast(true);
              setTimeout(() => setShowDefaultZoneUpdatedToast(false), 3200);
            }}
          />
        ) : profileSubPage === 'locationPreferences' ? (
          <LocationPreferencesScreen
            onBack={() => setProfileSubPage('main')}
            defaultZone={defaultZone}
            onOpenLocationAccess={() => setProfileSubPage('locationAccess')}
            onOpenDefaultZone={() => setProfileSubPage('defaultZone')}
          />
        ) : profileSubPage === 'helpSupport' ? (
          <HelpSupportScreen
            onBack={() => setProfileSubPage('main')}
          />
        ) : (
          <ProfileScreen
            currentUser={currentUser}
            location={displayedLocation}
            reportsCount={reports.filter(r => r.reportedBy === currentUser).length}
            confirmationsCount={Object.values(userVotes).filter(v => v === 'yes').length}
            verifiedCount={reports.filter(r => r.reportedBy === currentUser && r.status === 'Verified').length}
            areasCount={new Set(reports.filter(r => r.reportedBy === currentUser).map(r => r.locationName)).size}
            getUserInitials={getUserInitials}
            onEditUsername={() => setProfileSubPage('username')}
            onOpenPersonalInfo={() => setProfileSubPage('personalInfo')}
            onOpenPrivacySecurity={() => setProfileSubPage('privacySecurity')}
            onOpenLocationPreferences={() => setProfileSubPage('locationPreferences')}
            onOpenHelpSupport={() => setProfileSubPage('helpSupport')}
            onLogout={() => setShowLogoutModal(true)}
          />
        )
      )}

      <div style={{ position: 'relative', zIndex: 3, pointerEvents: 'none', width: '100%', height: '100%' }}>

        {currentTab !== 'feed' && currentTab !== 'alerts' && currentTab !== 'profile' && !isReporting && (
          <TopHeader
            isReporting={isReporting} reportingStage={reportingStage} setIsReporting={setIsReporting} 
            setCapturedImages={setCapturedImages} setCurrentTab={setCurrentTab} setReportingStage={setReportingStage}
            handleMainSearchSubmit={handleMainSearchSubmit} displayedLocation={displayedLocation}
            mainSearchQuery={mainSearchQuery} setMainSearchQuery={setMainSearchQuery} currentUser={currentUser} getUserInitials={getUserInitials}
            onOpenWeather={handleOpenWeather}
          />
        )}

        {!(currentTab === 'profile' && profileSubPage === 'defaultZone') && (
          <BottomNav
            currentTab={currentTab} handleMapsTabClick={handleMapsTabClick} setCurrentTab={setCurrentTab}
            openReportingWorkflow={async () => {
              if (mapRef.current) {
                const center = mapRef.current.getCenter();
                setCurrentCoords([center.lng, center.lat]);
                setNewLocationName(await fetchLocationName(center.lng, center.lat));
              }
              setCurrentTab('report');
              setIsReporting(true);
              setNewWaterLevel(null);
              setCapturedImages([]);
              setShowCameraCapture(true);
            }}
          />
        )}

        {toastMessage && (
          <div
            style={{
              position: 'absolute',
              bottom: '100px',
              left: '16px',
              right: '16px',
              backgroundColor: '#0D2B4E',
              borderRadius: '999px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 2000,
              pointerEvents: 'auto',
              animation: 'reportToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1.3' }}>
              {toastMessage}
            </p>
            <ToastCheckmark />
          </div>
        )}

        {/* Comment notification banner — appears at the top like a system notification */}
        {commentNotifMessage && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              left: '12px',
              right: '12px',
              backgroundColor: '#1C1C1E',
              borderRadius: '18px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0px 8px 24px rgba(0,0,0,0.35)',
              zIndex: 3000,
              animation: 'reportToastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              backgroundColor: '#0F2A4A',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>New comment on your report</p>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {commentNotifMessage}
              </p>
            </div>
            <button
              onClick={() => setCommentNotifMessage(null)}
              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Report Posted Notification */}
        {showReportPostedToast && (
          <div
            style={{
              position: 'absolute',
              bottom: '105px',
              left: '16px',
              right: '16px',
              backgroundColor: '#0D2B4E',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.35)',
              zIndex: 2000,
              pointerEvents: 'auto',
              animation: 'reportToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
                {reportPostedIsEdit ? 'Changes saved' : 'Report posted'}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '400', color: 'rgba(255,255,255,0.75)', lineHeight: '1.45' }}>
                {reportPostedIsEdit ? 'Your report has been updated' : 'Now visible in the Feed, unverified until 3 confirmations'}
              </p>
            </div>
            {/* Badge verified icon */}
            <ToastCheckmark />
          </div>
        )}

        {/* Location Updated Notification */}
        {showLocationUpdatedToast && (
          <div
            style={{
              position: 'absolute',
              bottom: '130px',
              left: '16px',
              right: '16px',
              backgroundColor: '#0D2B4E',
              borderRadius: '18px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.35)',
              zIndex: 2000,
              pointerEvents: 'auto',
              animation: 'reportToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
              Location updated
            </p>
            <ToastCheckmark />
          </div>
        )}

        {/* Password Updated Notification */}
        {showPasswordUpdatedToast && (
          <div
            style={{
              position: 'absolute',
              bottom: '130px',
              left: '16px',
              right: '16px',
              backgroundColor: '#0E3D5C',
              borderRadius: '999px',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.35)',
              zIndex: 2000,
              pointerEvents: 'auto',
              animation: 'reportToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <p style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
              Password Updated
            </p>
            <ToastCheckmark />
          </div>
        )}

        {/* Report Deleted Notification */}
        {showReportDeletedToast && (
          <div
            style={{
              position: 'absolute',
              bottom: '105px',
              left: '16px',
              right: '16px',
              backgroundColor: '#0D2B4E',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.35)',
              zIndex: 2000,
              pointerEvents: 'auto',
              animation: 'reportToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
                Report deleted
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '400', color: 'rgba(255,255,255,0.75)', lineHeight: '1.45' }}>
                Your report has been removed
              </p>
            </div>
            <ToastCheckmark />
          </div>
        )}

        {/* Default Zone Updated Notification */}
        {showDefaultZoneUpdatedToast && (
          <div
            style={{
              position: 'absolute',
              bottom: '130px',
              left: '16px',
              right: '16px',
              backgroundColor: '#0E3D5C',
              borderRadius: '999px',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.35)',
              zIndex: 2000,
              pointerEvents: 'auto',
              animation: 'reportToastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
              Default Zone Updated
            </p>
            <ToastCheckmark />
          </div>
        )}

        {selectedReport && (
          <div
            style={{
              pointerEvents: 'auto',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              maxHeight: '92vh',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              overflow: 'hidden',
              overflowY: 'auto',
              boxShadow: '0px -12px 32px rgba(0, 0, 0, 0.18)',
              zIndex: 10,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              animation: 'sheetSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px 0' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#E5E7EB' }} />
            </div>

            <div style={{ width: '100%', height: '220px', padding: '0 16px', boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden' }}>
              <img
                src={selectedReport.imageUrl}
                alt="Flood Report"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <button
                onClick={() => { setSelectedReport(null); setConfirmStep('initial'); }}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '16px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>

              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(55, 65, 81, 0.55)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', border: `2px solid ${getSeverityColor(selectedReport.waterLevel)}` }} />
                {selectedReport.waterLevel} Severity
              </span>
            </div>
            </div>

            <div style={{ padding: '18px 20px 36px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#111827' }}>
                    {selectedReport.locationName}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9CA3AF' }}>
                    {selectedReport.area ? `${selectedReport.area} • ` : ''}reported {selectedReport.timeActive} ago
                  </p>
                </div>

                {selectedReport.status === 'Verified' ? (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: '#D3F3E1',
                      color: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      flexShrink: 0,
                      marginLeft: '10px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#16A34A" />
                      <path d="M7.5 12.3l3 3 6-6.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      backgroundColor: '#F3F4F6',
                      color: '#9CA3AF',
                      flexShrink: 0,
                      marginLeft: '10px'
                    }}
                  >
                    Unverified
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  margin: '18px 0',
                  padding: '14px 8px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '16px'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Confirmations</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{selectedReport.confirmations}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Photos</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="#F97316" strokeWidth="1.8" />
                      <circle cx="12" cy="13" r="3.2" stroke="#F97316" strokeWidth="1.8" />
                      <path d="M8 6l1.2-2h5.6L16 6" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{selectedReport.photosCount}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '1px' }}>
                      <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Time Active</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="13" r="7.5" stroke="#3B82F6" strokeWidth="1.8" />
                      <path d="M12 9.5V13l3 2" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 2.5h4M12 2.5v2.3" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{selectedReport.timeActive}</span>
                  </div>
                </div>
              </div>

              {confirmStep === 'initial' && (
                selectedReport.status === 'Verified' ? (
                  <>
                    <div style={{ marginBottom: '18px' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#111827' }}>
                        What people are reporting
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9CA3AF', lineHeight: '1.5' }}>
                        "{selectedReport.description || 'No community reports yet.'}"
                      </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#111827' }}>
                        Is this still accurate?
                      </p>

                      {canVoteOnReport(selectedReport) ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleDeclineTap(selectedReport)}
                            style={{
                              flex: 1,
                              padding: '14px',
                              borderRadius: '50px',
                              backgroundColor: userVotes[selectedReport.id] === 'no' ? '#E5E7EB' : '#F3F4F6',
                              border: 'none',
                              color: '#111827',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            No, it's cleared
                          </button>

                          <button
                            onClick={() => handleConfirmTap(selectedReport)}
                            style={{
                              flex: 1,
                              padding: '14px',
                              borderRadius: '50px',
                              backgroundColor: '#003366',
                              border: 'none',
                              color: '#FFFFFF',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Yes, still flooded
                          </button>
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF', backgroundColor: '#F3F4F6', borderRadius: '14px', padding: '14px' }}>
                          {lockedVoteReason(selectedReport)}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: '#111827' }}>
                      Can you confirm this?
                    </p>

                    {canVoteOnReport(selectedReport) ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleDeclineTap(selectedReport)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '50px',
                            backgroundColor: userVotes[selectedReport.id] === 'no' ? '#E5E7EB' : '#F3F4F6',
                            border: 'none',
                            color: '#111827',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          No, looks clear
                        </button>

                        <button
                          onClick={() => handleConfirmTap(selectedReport)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '50px',
                            backgroundColor: '#003366',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Yes, I see it too
                        </button>
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF', backgroundColor: '#F3F4F6', borderRadius: '14px', padding: '14px' }}>
                        {lockedVoteReason(selectedReport)}
                      </p>
                    )}
                  </div>
                )
              )}

              {confirmStep === 'add_photo' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>Submitted by the community</span>
                    <button
                      onClick={() => setShowCommunityPhotos(v => !v)}
                      style={{ border: 'none', background: 'none', padding: 0, fontSize: '13px', color: '#9CA3AF', fontWeight: '500', cursor: 'pointer' }}
                    >
                      {showCommunityPhotos ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showCommunityPhotos && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
                      {(selectedReport.images || [selectedReport.imageUrl]).map((img, i) => (
                        <div key={i} style={{ aspectRatio: '1 / 1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                          <img src={img} alt="community capture" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ backgroundColor: '#F3F4F6', borderRadius: '18px', padding: '16px' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '500', color: '#6B7280' }}>
                      Want to add a photo? <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                    </p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleSkipPhotoAndConfirm(selectedReport.id)}
                        style={{
                          flex: 1,
                          padding: '13px',
                          borderRadius: '50px',
                          backgroundColor: '#FFFFFF',
                          border: 'none',
                          color: '#111827',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Skip, just confirm
                      </button>

                      <button
                        onClick={() => requestPhotoAccess('confirm')}
                        style={{
                          flex: 1,
                          padding: '13px',
                          borderRadius: '50px',
                          backgroundColor: '#003366',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '7px'
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="#FFFFFF" strokeWidth="1.8" />
                          <circle cx="12" cy="13" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" />
                          <path d="M8 6l1.2-2h5.6L16 6" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Add Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {confirmStep === 'confirmed_view' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>Submitted by the community</span>
                    <button
                      onClick={() => setShowCommunityPhotos(v => !v)}
                      style={{ border: 'none', background: 'none', padding: 0, fontSize: '13px', color: '#9CA3AF', fontWeight: '500', cursor: 'pointer' }}
                    >
                      {showCommunityPhotos ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showCommunityPhotos && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
                      {(selectedReport.images || [selectedReport.imageUrl]).map((img, i) => (
                        <div key={i} style={{ aspectRatio: '1 / 1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                          <img src={img} alt="community capture" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleBackToMap}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '50px',
                      backgroundColor: '#003366',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Back to Map
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {viewingOwnReport && (
          <div
            style={{
              pointerEvents: 'auto',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              maxHeight: '92vh',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              overflow: 'hidden',
              overflowY: 'auto',
              boxShadow: '0px -12px 32px rgba(0, 0, 0, 0.18)',
              zIndex: 10,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              animation: 'sheetSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) both',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px 0' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#E5E7EB' }} />
            </div>

            <div style={{ width: '100%', height: '220px', padding: '0 16px', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden' }}>
                <img
                  src={viewingOwnReport.imageUrl}
                  alt="Your report"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <button
                  onClick={() => setViewingOwnReport(null)}
                  style={{
                    position: 'absolute', top: '14px', right: '16px', width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.4)', color: '#FFF', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                  }}
                >
                  ✕
                </button>

                <span
                  style={{
                    position: 'absolute', top: '14px', left: '16px', fontSize: '12px', fontWeight: '600',
                    padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(55, 65, 81, 0.55)', color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', border: `2px solid ${getSeverityColor(viewingOwnReport.waterLevel)}` }} />
                  {viewingOwnReport.waterLevel} Severity
                </span>

                <span
                  style={{
                    position: 'absolute', bottom: '14px', left: '16px', fontSize: '11px', fontWeight: '700',
                    padding: '5px 12px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#111827',
                  }}
                >
                  Your report
                </span>
              </div>
            </div>

            <div style={{ padding: '18px 20px 36px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#111827' }}>
                    {viewingOwnReport.locationName}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#9CA3AF' }}>
                    {viewingOwnReport.area ? `${viewingOwnReport.area} • ` : ''}reported {viewingOwnReport.timeActive} ago
                  </p>
                </div>

                {viewingOwnReport.status === 'Verified' ? (
                  <span
                    style={{
                      fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '20px',
                      backgroundColor: '#D3F3E1', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '5px',
                      flexShrink: 0, marginLeft: '10px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#16A34A" />
                      <path d="M7.5 12.3l3 3 6-6.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '20px',
                      backgroundColor: '#F3F4F6', color: '#9CA3AF', flexShrink: 0, marginLeft: '10px'
                    }}
                  >
                    Unverified
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', margin: '18px 0',
                  padding: '14px 8px', backgroundColor: '#F9FAFB', borderRadius: '16px'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Confirmations</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{viewingOwnReport.confirmations}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Photos</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="#F97316" strokeWidth="1.8" />
                      <circle cx="12" cy="13" r="3.2" stroke="#F97316" strokeWidth="1.8" />
                      <path d="M8 6l1.2-2h5.6L16 6" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{viewingOwnReport.photosCount}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Time Active</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="13" r="7.5" stroke="#3B82F6" strokeWidth="1.8" />
                      <path d="M12 9.5V13l3 2" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 2.5h4M12 2.5v2.3" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>{viewingOwnReport.timeActive}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <button
                  onClick={handleEditOwnReport}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '50px', backgroundColor: '#F3F4F6', border: 'none',
                    color: '#111827', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Edit
                </button>

                <button
                  onClick={handleDeleteOwnReport}
                  aria-label="Delete report"
                  style={{
                    width: '52px', flexShrink: 0, padding: '14px', borderRadius: '50px', backgroundColor: '#FDECEA',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6M14 11v6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => { setViewingOwnReport(null); setCurrentTab('feed'); }}
                style={{
                  width: '100%', padding: '15px', borderRadius: '999px', backgroundColor: '#003366',
                  color: '#FFFFFF', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                View on Feed
              </button>
            </div>
          </div>
        )}

        {/* Report Floods Modal */}
        {isReporting && (
          <>
            {reportingStage === 'form' && (
              <div
                style={{
                  pointerEvents: 'auto',
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#FFFFFF',
                  zIndex: 10,
                  fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1, overflowY: 'auto', padding: '52px 20px 0 20px' }}>
                  <button
                    type="button"
                    onClick={() => { setIsReporting(false); setCapturedImages([]); setCurrentTab('maps'); setNewWaterLevel(null); setEditingReportId(null); setDescription(''); }}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                      cursor: 'pointer',
                      marginBottom: '28px'
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '600', color: '#111827', letterSpacing: '-0.01em' }}>Report flooding</h2>
                  <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#9CA3AF' }}>Takes about 15 seconds</p>

                  <form onSubmit={handleReportSubmit}>
                    <div style={{ margin: '32px 0' }}>
                      <label style={{ display: 'block', fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
                        Photos <span style={{ fontWeight: '400', color: '#9CA3AF', fontSize: '15px' }}>({capturedImages.length}/2)</span>
                      </label>
                      <div style={{ display: 'flex', gap: '14px' }}>
                        {capturedImages.map((imgUrl, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={imgUrl} alt="evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#FFF', border: 'none', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {capturedImages.length < 2 && (
                          <button
                            type="button"
                            onClick={() => requestPhotoAccess('report')}
                            style={{ width: '140px', height: '140px', borderRadius: '18px', border: '1.5px dashed #D1D5DB', backgroundColor: '#F9FAFB', color: '#9CA3AF', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
                        How bad is it?
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setNewWaterLevel('Low')}
                          style={{
                            flex: 1,
                            padding: '14px 10px',
                            borderRadius: '999px',
                            fontSize: '15px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            border: newWaterLevel === 'Low' ? '1.5px solid #CA8A04' : '1.5px solid #E5E7EB',
                            backgroundColor: newWaterLevel === 'Low' ? '#FEF9C3' : '#FFFFFF',
                            color: newWaterLevel === 'Low' ? '#854D0E' : '#374151'
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EAB308' }} />
                          Low
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewWaterLevel('Medium')}
                          style={{
                            flex: 1,
                            padding: '14px 10px',
                            borderRadius: '999px',
                            fontSize: '15px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            border: newWaterLevel === 'Medium' ? '1.5px solid #EA580C' : '1.5px solid #E5E7EB',
                            backgroundColor: newWaterLevel === 'Medium' ? '#FFEDD5' : '#FFFFFF',
                            color: newWaterLevel === 'Medium' ? '#9A3412' : '#374151'
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F97316' }} />
                          Medium
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewWaterLevel('High')}
                          style={{
                            flex: 1,
                            padding: '14px 10px',
                            borderRadius: '999px',
                            fontSize: '15px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            border: newWaterLevel === 'High' ? '1.5px solid #DC2626' : '1.5px solid #E5E7EB',
                            backgroundColor: newWaterLevel === 'High' ? '#FEE2E2' : '#FFFFFF',
                            color: newWaterLevel === 'High' ? '#991B1B' : '#374151'
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                          High
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>
                        Description <span style={{ fontWeight: '400', color: '#9CA3AF', fontSize: '15px' }}>(optional)</span>
                      </label>
                      <textarea
                        placeholder="e.g. Water is knee-deep, cars are turning back."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '16px', borderRadius: '20px', border: 'none', fontSize: '15px', resize: 'none', outline: 'none', boxSizing: 'border-box', backgroundColor: '#F5F6F7', color: '#111827', fontFamily: 'inherit' }}
                      />
                    </div>

                    <label style={{ display: 'block', fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
                      Location
                    </label>

                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={locationPinIcon} alt="" width={28} height={28} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                          {newLocationName}
                        </div>
                        <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '4px' }}>
                          {isManualLocation ? 'Set manually' : 'Captured automatically'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setReportingStage('adjust'); if (mapRef.current && currentCoords) mapRef.current.flyTo({ center: currentCoords, zoom: 16.5 }); }}
                      style={{ border: 'none', background: 'none', color: '#111827', fontSize: '15px', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                    >
                      Not your location? Adjust
                    </button>

                    <div style={{ height: '24px' }} />
                  </form>
                </div>

                <div style={{ borderTop: '1px solid #F0F1F3', padding: '20px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
                  <button
                    onClick={() => {
                      if (!newWaterLevel) {
                        alert('Please select severity level');
                        return;
                      }
                      setReportingStage('review');
                    }}
                    style={{ width: '100%', padding: '17px', borderRadius: '999px', backgroundColor: '#003366', color: '#FFFFFF', border: 'none', fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {editingReportId !== null ? 'Keep changes' : 'Continue'}
                  </button>
                </div>
              </div>
            )}

            {reportingStage === 'review' && (
              <div
                style={{
                  pointerEvents: 'auto',
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#FFFFFF',
                  zIndex: 10,
                  fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1, overflowY: 'auto', padding: '52px 20px 0 20px' }}>
                  <button
                    type="button"
                    onClick={() => setReportingStage('form')}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                      cursor: 'pointer',
                      marginBottom: '28px'
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '600', color: '#111827', letterSpacing: '-0.01em' }}>Review report</h2>
                  <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#9CA3AF' }}>Make sure everything looks right</p>

                  {capturedImages.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: capturedImages.length === 1 ? '1fr' : '1fr 1fr',
                      gap: '14px',
                      margin: '28px 0',
                    }}>
                      {capturedImages.map((imgUrl, idx) => (
                        <div key={idx} style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4 / 5', backgroundColor: '#F3F4F6' }}>
                          <img src={imgUrl} alt="evidence" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                    <span style={{ fontSize: '16px', color: '#9CA3AF' }}>Severity</span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '999px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827',
                    }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: newWaterLevel ? getSeverityColor(newWaterLevel) : '#D1D5DB' }} />
                      {newWaterLevel || '—'}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #EEF0F2' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 0', gap: '20px' }}>
                    <span style={{ fontSize: '16px', color: '#9CA3AF', flexShrink: 0 }}>Location</span>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827', textAlign: 'right' }}>{newLocationName}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #EEF0F2' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 0', gap: '20px' }}>
                    <span style={{ fontSize: '16px', color: '#9CA3AF', flexShrink: 0 }}>Description</span>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827', textAlign: 'right' }}>
                      {description || 'No description added'}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #EEF0F2' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                    <span style={{ fontSize: '16px', color: '#9CA3AF' }}>Photos</span>
                    <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>
                      {capturedImages.length > 0 ? `Live camera · ${capturedImages.length} photo${capturedImages.length > 1 ? 's' : ''}` : 'No photos added'}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #EEF0F2' }} />

                  <p style={{ margin: '24px 0', fontSize: '15px', color: '#9CA3AF', lineHeight: '1.6' }}>
                    This report will show as <strong style={{ color: '#111827', fontWeight: '700' }}>Unverified</strong> until 3 nearby users confirm it. Your identity stays anonymous to other users.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F0F1F3', padding: '20px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
                  <button
                    onClick={handleReportSubmit}
                    style={{ width: '100%', padding: '17px', borderRadius: '999px', backgroundColor: '#003366', color: '#FFFFFF', border: 'none', fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {editingReportId !== null ? 'Save changes' : 'Post'}
                  </button>
                </div>
              </div>
            )}

            {reportingStage === 'adjust' && (
              <>
                <div style={{ pointerEvents: 'auto', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '52px 20px 0 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setReportingStage('form')}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '600', color: '#111827', textAlign: 'center' }}>
                      Adjust location
                    </h2>
                    <div />
                  </div>

                  <form onSubmit={handleManualSearchSubmit} style={{ marginTop: '18px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '999px',
                      padding: '14px 18px',
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
                        onChange={(e) => { setSearchQuery(e.target.value); setNewLocationName(e.target.value); setIsManualLocation(true); }}
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#111827', backgroundColor: 'transparent', fontFamily: 'inherit' }}
                      />
                    </div>
                  </form>
                </div>

                <div style={{
                  pointerEvents: 'auto',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  backgroundColor: '#FFFFFF',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  padding: '20px 20px max(20px, env(safe-area-inset-bottom)) 20px',
                  boxShadow: '0px -8px 24px rgba(0, 0, 0, 0.08)',
                }}>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '18px' }}>
                    {['Admiralty Way', 'Chevron Drive', 'Freedom Way'].map((tag) => {
                      const selected = searchQuery === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => selectQuickTag(tag)}
                          style={{
                            flexShrink: 0,
                            padding: '10px 18px',
                            borderRadius: '999px',
                            fontSize: '14px',
                            fontWeight: '600',
                            border: selected ? 'none' : '1.5px solid #E5E7EB',
                            backgroundColor: selected ? '#003366' : '#FFFFFF',
                            color: selected ? '#FFFFFF' : '#374151',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>
                    {newLocationName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '3px', marginBottom: '18px' }}>
                    Pin location
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (mapRef.current) setCurrentCoords([mapRef.current.getCenter().lng, mapRef.current.getCenter().lat]);
                      setReportingStage('form');
                      setShowLocationUpdatedToast(true);
                      setTimeout(() => setShowLocationUpdatedToast(false), 3200);
                    }}
                    style={{ width: '100%', padding: '17px', borderRadius: '999px', backgroundColor: '#003366', color: '#FFFFFF', border: 'none', fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
    </div>
  );
}