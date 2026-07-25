import type { ReactNode } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';

interface ProfileScreenProps {
  currentUser: string;
  getUserInitials: (name: string) => string;
  onOpenPersonalInfo: () => void;
  onOpenPrivacySecurity: () => void;
  onOpenLocationPreferences: () => void;
  onOpenHelpSupport: () => void;
  onLogout: () => void;
}

function WatermarkLayer({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
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

function SettingsIcon({ path }: { path: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d={path} stroke="#1F5C4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SettingsRowProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  danger?: boolean;
  onClick?: () => void;
}

function SettingsRow({ icon, title, subtitle, danger, onClick }: SettingsRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ flexShrink: 0, width: '22px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '700', color: danger ? '#EF4444' : '#111827' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{subtitle}</div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M9 6l6 6-6 6" stroke="#C4C9D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function ProfileScreen({ currentUser, getUserInitials, onOpenPersonalInfo, onOpenPrivacySecurity, onOpenLocationPreferences, onOpenHelpSupport, onLogout }: ProfileScreenProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: '#F6F7F8',
      overflowY: 'auto',
      zIndex: 2,
      fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Banner */}
      <div style={{ position: 'relative', height: '230px', backgroundColor: '#4E7488', overflow: 'hidden' }}>
        <WatermarkLayer opacity={0.14} />
      </div>

      {/* Avatar overlapping banner */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-70px', position: 'relative' }}>
        <div style={{
          width: '132px',
          height: '132px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          padding: '6px',
          boxSizing: 'border-box',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#2E4E63',
            color: '#FFFFFF',
            fontSize: '36px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {getUserInitials(currentUser)}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '21px', fontWeight: '700', color: '#111827' }}>@{currentUser}</span>
          <button style={{
            width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#CBD8E0',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#2E4E63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '6px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z" stroke="#9CA3AF" strokeWidth="1.6" />
            <path d="M12 2C16.8706 2 21 6.03298 21 10.9258C21 15.8965 16.8033 19.3847 12.927 21.7567C12.6445 21.9162 12.325 22 12 22C11.675 22 11.3555 21.9162 11.073 21.7567C7.2039 19.3616 3 15.9137 3 10.9258C3 6.03298 7.12944 2 12 2Z" stroke="#9CA3AF" strokeWidth="1.6" />
          </svg>
          <span style={{ fontSize: '14px', color: '#9CA3AF' }}>Ajah, Lagos State</span>
        </div>
      </div>

      {/* Stats card */}
      <div style={{ padding: '24px 20px 0 20px' }}>
        <div style={{
          display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px 0',
          boxShadow: '0px 4px 16px rgba(0,0,0,0.05)',
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Reports</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4V8z" stroke="#EF4444" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M13 7l-6 10" stroke="#EF4444" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>14</span>
            </div>
          </div>
          <div style={{ width: '1px', backgroundColor: '#EEF0F2' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Confirmations</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>31</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
          <div style={{
            flex: 1, backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px 0', textAlign: 'center',
            boxShadow: '0px 4px 16px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2FBF8F', margin: '0 auto 8px auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Verified</div>
            <div style={{ fontSize: '19px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>9</div>
          </div>

          <div style={{
            flex: 1, backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '18px 0', textAlign: 'center',
            boxShadow: '0px 4px 16px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1F3A4D', margin: '0 auto 8px auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#FFFFFF" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="8.5" stroke="#FFFFFF" strokeWidth="1.6" />
              </svg>
            </div>
            <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Areas</div>
            <div style={{ fontSize: '19px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>5</div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #EEF0F2', margin: '24px 0 8px 0' }} />

      <div>
        <SettingsRow
          icon={<SettingsIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
          title="Personal Information"
          subtitle="Username & phone number"
          onClick={onOpenPersonalInfo}
        />
        <SettingsRow
          icon={<SettingsIcon path="M12 2l8 3.5v5.5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5.5L12 2z" />}
          title="Privacy and Security"
          subtitle="Manage your privacy & security settings"
          onClick={onOpenPrivacySecurity}
        />
        <SettingsRow
          icon={<SettingsIcon path="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11ZM12 2C16.8706 2 21 6.03298 21 10.9258C21 15.8965 16.8033 19.3847 12.927 21.7567C12.6445 21.9162 12.325 22 12 22C11.675 22 11.3555 21.9162 11.073 21.7567C7.2039 19.3616 3 15.9137 3 10.9258C3 6.03298 7.12944 2 12 2Z" />}
          title="Location Preferences"
          subtitle="Manage location access & preference"
          onClick={onOpenLocationPreferences}
        />
        <SettingsRow
          icon={<SettingsIcon path="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5L2 22l5-1.338A9.959 9.959 0 0012 22zM9.5 9.5a2.5 2.5 0 015 0c0 1.5-2 1.75-2 3.5M12 16.5h.01" />}
          title="Help & Support"
          subtitle="FAQs, feedback and support"
          onClick={onOpenHelpSupport}
        />
      </div>

      <div style={{ borderTop: '1px solid #EEF0F2', margin: '8px 0 8px 0' }} />

      <div style={{ paddingBottom: '140px' }}>
        <SettingsRow
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5M21 12H9" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Log Out"
          subtitle="Sign out of your account"
          danger
          onClick={onLogout}
        />
      </div>
    </div>
  );
}
