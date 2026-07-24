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

function FeedIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path d="M8 6.5h11M4 12h15M4 17.5h9" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
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
        <MapsIcon color={currentTab === 'maps' ? ACTIVE : INACTIVE} />
        {currentTab === 'maps' ? <ActiveDot /> : <span style={{ height: '5px' }} />}
        <span style={labelStyle(currentTab === 'maps')}>Maps</span>
      </button>

      <button style={itemStyle} onClick={() => setCurrentTab('feed')}>
        <FeedIcon color={currentTab === 'feed' ? ACTIVE : INACTIVE} />
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
          borderRadius: '18px',
          padding: '9px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          boxShadow: '0px 6px 14px rgba(253, 95, 83, 0.35)',
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
        <ProfileIcon color={currentTab === 'profile' ? ACTIVE : INACTIVE} />
        {currentTab === 'profile' ? <ActiveDot /> : <span style={{ height: '5px' }} />}
        <span style={labelStyle(currentTab === 'profile')}>Profile</span>
      </button>
    </div>
  );
}
