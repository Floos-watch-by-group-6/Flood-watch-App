import type { Dispatch, SetStateAction } from 'react';
import type { TabType } from '../type';

interface BottomNavProps {
  currentTab: TabType;
  handleMapsTabClick: () => void;
  setCurrentTab: Dispatch<SetStateAction<TabType>> | ((tab: TabType) => void);
  openReportingWorkflow: () => void;
}

const ACTIVE = '#1F3A52';
const INACTIVE = '#5B5B66';

function MapsIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path d="M9 4.5L3.6 6.3a1 1 0 00-.6.9v11.4a1 1 0 001.3.95L9 18l6 2 5.1-1.7a1 1 0 00.6-.95V5.95a1 1 0 00-1.3-.95L15 6.5 9 4.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 4.5v13.5M15 6.5V20" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function MapsIconFilled() {
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.1332 2.7832V14.7249C6.84987 14.7332 6.56654 14.7999 6.3582 14.9249L4.39987 16.0415C3.0332 16.8249 1.9082 16.1749 1.9082 14.5915V6.4832C1.9082 5.9582 2.2832 5.3082 2.74987 5.04154L6.3582 2.97487C6.56654 2.8582 6.84987 2.79154 7.1332 2.7832Z" fill="#AFC1CC"/>
      <path d="M13.1083 5.27479V17.2165C12.8166 17.2248 12.5333 17.1748 12.3083 17.0665L7.9333 14.8748C7.7083 14.7665 7.42497 14.7165 7.1333 14.7248V2.78312C7.42497 2.77479 7.7083 2.82479 7.9333 2.93312L12.3083 5.12479C12.5333 5.23312 12.8166 5.28312 13.1083 5.27479Z" fill="#0E4567"/>
      <path d="M18.3334 5.40855V13.5169C18.3334 14.0419 17.9584 14.6919 17.4917 14.9586L13.8834 17.0252C13.6751 17.1419 13.3917 17.2086 13.1084 17.2169V5.27522C13.3917 5.26688 13.6751 5.20022 13.8834 5.07522L15.8417 3.95855C17.2084 3.17522 18.3334 3.82522 18.3334 5.40855Z" fill="#AFC1CC"/>
    </svg>
  );
}

function FeedIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path d="M8 6.5h11M4 12h15M4 17.5h9" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function FeedIconFilled() {
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.3335 4.1665L16.6668 4.1665" stroke="#0E4567" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.3335 10L16.6668 10" stroke="#AFC1CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.3335 15.8335L11.6668 15.8335" stroke="#0E4567" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AlertsIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path d="M18.5 16V10a6.5 6.5 0 10-13 0v6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16.5h16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.7 19.5a2 2 0 01-3.4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.8" stroke={color} strokeWidth="1.6" />
      <path d="M4.5 20c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIconFilled() {
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0002 9.99984C12.3013 9.99984 14.1668 8.13436 14.1668 5.83317C14.1668 3.53198 12.3013 1.6665 10.0002 1.6665C7.69898 1.6665 5.8335 3.53198 5.8335 5.83317C5.8335 8.13436 7.69898 9.99984 10.0002 9.99984Z" fill="#AFC1CC"/>
      <path d="M9.9998 12.0835C5.8248 12.0835 2.4248 14.8835 2.4248 18.3335C2.4248 18.5668 2.60814 18.7502 2.84147 18.7502H17.1581C17.3915 18.7502 17.5748 18.5668 17.5748 18.3335C17.5748 14.8835 14.1748 12.0835 9.9998 12.0835Z" fill="#0E4567"/>
    </svg>
  );
}

function ActiveDot() {
  return <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: ACTIVE }} />;
}

export default function BottomNav({
  currentTab,
  handleMapsTabClick,
  setCurrentTab,
  openReportingWorkflow,
}: BottomNavProps) {
  const itemStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    fontFamily: 'inherit',
    flex: 1,
  };

  const labelStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '11px',
    fontWeight: 500,
    color: active ? ACTIVE : INACTIVE,
  });

  return (
    <div className="navBar" style={{ pointerEvents: 'auto' }}>
      <button style={itemStyle} onClick={handleMapsTabClick}>
        {currentTab === 'maps' ? <MapsIconFilled /> : <MapsIcon color={INACTIVE} />}
        {currentTab === 'maps' ? <ActiveDot /> : <span style={{ height: '5px' }} />}
        <span style={labelStyle(currentTab === 'maps')}>Maps</span>
      </button>

      <button style={itemStyle} onClick={() => setCurrentTab('feed')}>
        {currentTab === 'feed' ? <FeedIconFilled /> : <FeedIcon color={INACTIVE} />}
        {currentTab === 'feed' ? <ActiveDot /> : <span style={{ height: '5px' }} />}
        <span style={labelStyle(currentTab === 'feed')}>Feed</span>
      </button>

      <button
        onClick={openReportingWorkflow}
        style={{
          flex: '0 0 auto',
          background: '#FD5F53',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '22.5px',
          padding: '9px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          boxShadow: 'inset 0 0 0 2px #FFFFFF, 0px 6px 14px rgba(253, 95, 83, 0.35)',
          fontFamily: 'inherit',
        }}
      >
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="18" height="13" rx="3" stroke="#FFFFFF" strokeWidth="1.7" />
          <circle cx="12" cy="13.5" r="3.4" stroke="#FFFFFF" strokeWidth="1.7" />
          <path d="M8.2 7l1.1-2.2h5.4L15.8 7" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>Report</span>
      </button>

      <button style={itemStyle} onClick={() => setCurrentTab('alerts')}>
        <AlertsIcon color={currentTab === 'alerts' ? ACTIVE : INACTIVE} />
        {currentTab === 'alerts' ? <ActiveDot /> : <span style={{ height: '5px' }} />}
        <span style={labelStyle(currentTab === 'alerts')}>Alerts</span>
      </button>

      <button style={itemStyle} onClick={() => setCurrentTab('profile')}>
        {currentTab === 'profile' ? <ProfileIconFilled /> : <ProfileIcon color={INACTIVE} />}
        {currentTab === 'profile' ? <ActiveDot /> : <span style={{ height: '5px' }} />}
        <span style={labelStyle(currentTab === 'profile')}>Profile</span>
      </button>
    </div>
  );
}
