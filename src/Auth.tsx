import React, { useState, useEffect } from 'react';
import './Auth.css';
import floodwatchLogo from './assets/Floodwatchlogo.svg';
import splashIcon from './assets/Frame 2147229111.svg';

interface AuthProps {
  onAuthComplete: (username: string, isNewSignup?: boolean) => void;
}

type AuthStep = 'splash' | 'landing' | 'signin' | 'signup';
type SignUpSubStep = 1 | 2 | 3 | 'otp';

export default function Auth({ onAuthComplete }: AuthProps) {
  const [step, setStep] = useState<AuthStep>('splash');
  const [splashPhase, setSplashPhase] = useState<0 | 1 | 2>(0);
  const [signUpSubStep, setSignUpSubStep] = useState<SignUpSubStep>(1);

  // Sign In Form States
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form States
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // OTP Verification State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendMessage, setResendMessage] = useState('');

  // Sequenced splash animation: icon alone -> divider grows in -> wordmark fades in -> hand off to sign in
  useEffect(() => {
    if (step !== 'splash') return;

    setSplashPhase(0);
    const toDivider = setTimeout(() => setSplashPhase(1), 450);
    const toWordmark = setTimeout(() => setSplashPhase(2), 950);
    const toLanding = setTimeout(() => setStep('signin'), 2600);

    return () => {
      clearTimeout(toDivider);
      clearTimeout(toWordmark);
      clearTimeout(toLanding);
    };
  }, [step]);

  // Email input handler for Sign In
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) setEmailError('');
    setEmail(e.target.value);
  };

  // Email input handler for Sign Up
  const handleSignUpEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (signUpEmailError) setSignUpEmailError('');
    setSignUpEmail(e.target.value);
  };

  // Format validation helper
  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Active status checks
  const isSignInActive = signInPassword.length >= 8;
  const isStep1Valid = signUpUsername.trim().length > 0 && validateEmail(signUpEmail);

  // Password criteria check
  const hasMinLength = signUpPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(signUpPassword);
  const hasNumber = /[0-9]/.test(signUpPassword);
  const isStep2Valid = hasMinLength && hasUppercase && hasNumber;

  // Mask Email for OTP Screen
  const maskedEmail = (() => {
    const [localPart, domain] = signUpEmail.split('@');
    if (!localPart || !domain) return 'jo****@example.com';
    return localPart.slice(0, 2) + '****@' + domain;
  })();

  // Handle Login Submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    const username = email.split('@')[0];
    onAuthComplete(username || 'user');
  };

  // Handle Step 1 Submission
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(signUpEmail)) {
      setSignUpEmailError('Please enter a valid email address.');
      return;
    }
    setSignUpEmailError('');
    setSignUpSubStep(2);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Create the account locally — no external service involved.
  const handleCreateAccount = () => {
    setSignUpSubStep('otp');
  };

  // OTP entry is not verified — any 6 digits proceed straight through.
  const handleVerifyOtp = () => {
    const username = signUpUsername.trim() || 'user';
    onAuthComplete(username, true);
  };

  const handleResendOtp = () => {
    setResendMessage('A new code has been sent.');
  };

  return (
    <div style={{
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#091b29',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes eyeballWobbleLeft {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(-2px, -1.5px); }
          50% { transform: translate(2px, 1.5px); }
          75% { transform: translate(-1.5px, 2px); }
        }

        @keyframes eyeballWobbleRight {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(2px, -1.5px); }
          50% { transform: translate(-2px, 1.5px); }
          75% { transform: translate(1.5px, 2px); }
        }

        .eyeball-dot-left {
          animation: eyeballWobbleLeft 0.8s ease-in-out infinite;
        }

        .eyeball-dot-right {
          animation: eyeballWobbleRight 0.8s ease-in-out infinite;
        }
      `}</style>

      <div style={{ 
        width: '100%', 
        maxWidth: '402px', 
        height: '100%',
        maxHeight: '874px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        position: 'relative'
      }}>

        {/* Header Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '12px 24px 0 24px',
          fontSize: '14px',
          fontWeight: '600',
          color: step === 'splash' ? '#FFFFFF' : '#111827',
          backgroundColor: step === 'splash' ? '#091b29' : '#FFFFFF',
          transition: 'all 0.3s ease'
        }}>
          
        </div>

        {/* ----------------- 1. SPLASH SCREEN ----------------- */}
        {step === 'splash' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: '#091b29'
          }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: splashPhase >= 1 ? '18px' : '0px',
                transition: 'gap 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              <div
                className="splash-icon-enter"
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img src={splashIcon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              <div
                style={{
                  width: '1px',
                  height: splashPhase >= 1 ? '92px' : '0px',
                  backgroundColor: 'rgba(255, 255, 255, 0.45)',
                  opacity: splashPhase >= 1 ? 1 : 0,
                  flexShrink: 0,
                  transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease',
                }}
              />

              <div
                style={{
                  maxWidth: splashPhase >= 2 ? '240px' : '0px',
                  opacity: splashPhase >= 2 ? 1 : 0,
                  transform: splashPhase >= 2 ? 'translateX(0)' : 'translateX(-8px)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  transition: 'max-width 0.55s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
                }}
              >
                <h1 style={{ fontSize: '38px', fontWeight: '700', color: '#FFFFFF', margin: 0, lineHeight: '1.05', letterSpacing: '-0.01em' }}>
                  Flood<br />Watch
                </h1>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Segoe Script", "Bradley Hand", "Brush Script MT", cursive',
                  fontStyle: 'italic',
                }}>
                  Developed by Group 6
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2. LANDING PAGE ----------------- */}
        {step === 'landing' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            backgroundColor: '#FFFFFF',
            padding: '32px 24px',
            flex: 1,
            justifyContent: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#091b29',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#FFFFFF',
                WebkitMaskImage: `url("${floodwatchLogo}")`,
                maskImage: `url("${floodwatchLogo}")`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }} />
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 12px 0' }}>
              Welcome to FloodWatch
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '36px', lineHeight: '1.5' }}>
              Stay ahead of urban flooding. Receive live community alerts and report road conditions instantly.
            </p>

            <button 
              onClick={() => setStep('signin')}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '28px',
                backgroundColor: '#091b29',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              Sign In
            </button>

            <button 
              onClick={() => {
                setStep('signup');
                setSignUpSubStep(1);
              }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '28px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: 'none',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* ----------------- 3. SIGN IN SCREEN ----------------- */}
        {step === 'signin' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '52px 24px 24px 24px',
            backgroundColor: '#FFFFFF',
            fontFamily: '"Euclid", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '44px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: '#111827',
                  WebkitMaskImage: `url("${floodwatchLogo}")`,
                  maskImage: `url("${floodwatchLogo}")`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }} />
              </div>

              <h1 style={{
                fontSize: '34px',
                fontWeight: '700',
                color: '#111827',
                textAlign: 'center',
                marginBottom: '40px',
                letterSpacing: '-0.01em'
              }}>
                Welcome back!
              </h1>

              <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '17px', color: '#111827', marginBottom: '10px', fontWeight: '700' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailInputChange}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '26px',
                      border: emailError ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '16px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                  {emailError && (
                    <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px', display: 'block' }}>
                      {emailError}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '17px', color: '#111827', marginBottom: '10px', fontWeight: '700' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{
                        width: '100%',
                        padding: '16px 48px 16px 20px',
                        borderRadius: '26px',
                        border: '1.5px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                        fontSize: '16px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '18px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9CA3AF',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3l18 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.584 10.587a2 2 0 002.829 2.829" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.523 10.523 0 01-2.02 3.568M6.228 6.228C4.42 7.36 3.036 9.026 2.458 12c.639 2.107 1.936 3.87 3.646 5.043" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                  <a href="#forgot" style={{ fontSize: '15px', color: '#003366', textDecoration: 'none', fontWeight: '600' }}>
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={!isSignInActive}
                  style={{
                    width: '100%',
                    padding: '17px',
                    borderRadius: '999px',
                    backgroundColor: isSignInActive ? '#003366' : '#8DA4B8',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '17px',
                    cursor: isSignInActive ? 'pointer' : 'not-allowed',
                    marginTop: '10px',
                    transition: 'background-color 0.25s ease, cursor 0.25s ease'
                  }}
                >
                  Sign in
                </button>
              </form>
            </div>

            <p style={{ textAlign: 'center', fontSize: '15px', color: '#6B7280', margin: '24px 0 12px 0' }}>
              Don't have an account?{' '}
              <span
                onClick={() => {
                  setStep('signup');
                  setSignUpSubStep(1);
                }}
                style={{ color: '#003366', fontWeight: '700', cursor: 'pointer' }}
              >
                Create Account
              </span>
            </p>
          </div>
        )}

        {/* ----------------- 4. PROGRESSIVE CREATE ACCOUNT FLOW (FIGMA EXACT MATCH) ----------------- */}
        {step === 'signup' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '16px 24px 24px 24px',
            backgroundColor: '#FFFFFF',
            overflowY: 'auto'
          }}>
            <div>
              {/* Top Navigation & Step Indicator Header */}
              {signUpSubStep !== 'otp' && (
                <div style={{ position: 'relative', marginBottom: '36px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (signUpSubStep === 1) setStep('signin');
                        else if (signUpSubStep === 2) setSignUpSubStep(1);
                        else if (signUpSubStep === 3) setSignUpSubStep(2);
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#111827'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0, letterSpacing: '-0.01em' }}>
                      Create your Account
                    </h2>
                  </div>
                </div>
              )}

              {/* ---------------- STEP 1 (1 of 3): Personal Information ---------------- */}
              {signUpSubStep === 1 && (
                <div>
                  {/* Icon Avatar */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      backgroundColor: '#091b29',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                      Personal Information
                    </h3>
                    <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0 }}>
                      Let's start with your basic details
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 28px 0', gap: '14px' }}>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: '#091b29',
                        width: '33.3%',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '15px', color: '#091b29', fontWeight: '700', flexShrink: 0 }}>
                      1 of 3
                    </span>
                  </div>

                  <form onSubmit={handleStep1Next} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '17px', color: '#111827', marginBottom: '10px', fontWeight: '700' }}>
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        required
                        value={signUpUsername}
                        onChange={(e) => setSignUpUsername(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          borderRadius: '26px',
                          border: '1.5px solid #E5E7EB',
                          backgroundColor: '#FFFFFF',
                          fontSize: '16px',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '17px', color: '#111827', marginBottom: '10px', fontWeight: '700' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={signUpEmail}
                        onChange={handleSignUpEmailChange}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          borderRadius: '26px',
                          border: signUpEmailError ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                          backgroundColor: '#FFFFFF',
                          fontSize: '16px',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                      />
                      <span style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px', display: 'block' }}>
                        Used to log in and receive OTP codes
                      </span>
                      {signUpEmailError && (
                        <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                          {signUpEmailError}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isStep1Valid}
                      style={{
                        width: '100%',
                        padding: '17px',
                        borderRadius: '999px',
                        backgroundColor: isStep1Valid ? '#091b29' : '#6C8395',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '17px',
                        cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.25s ease'
                      }}
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* ---------------- STEP 2 (2 of 3): Secure Your Account ---------------- */}
              {signUpSubStep === 2 && (
                <div>
                  {/* Lock Icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      backgroundColor: '#091b29',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                      Secure Your Account
                    </h3>
                    <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0, lineHeight: '1.4' }}>
                      Create a strong password to protect your account
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 28px 0', gap: '14px' }}>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: '#091b29',
                        width: '66.6%',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '15px', color: '#091b29', fontWeight: '700', flexShrink: 0 }}>
                      2 of 3
                    </span>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setSignUpSubStep(3); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '17px', color: '#111827', marginBottom: '10px', fontWeight: '700' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '16px 48px 16px 20px',
                            borderRadius: '26px',
                            border: '1.5px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            fontSize: '16px',
                            color: '#111827',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          style={{
                            position: 'absolute',
                            right: '18px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9CA3AF',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {showSignUpPassword ? (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3l18 18" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.584 10.587a2 2 0 002.829 2.829" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.523 10.523 0 01-2.02 3.568M6.228 6.228C4.42 7.36 3.036 9.026 2.458 12c.639 2.107 1.936 3.87 3.646 5.043" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password Requirements Card */}
                    <div style={{
                      backgroundColor: '#DDE6ED',
                      borderRadius: '18px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="9" stroke="#091b29" strokeWidth="1.6" />
                          <path d="M12 11v5.5" stroke="#091b29" strokeWidth="1.8" strokeLinecap="round" />
                          <circle cx="12" cy="7.8" r="1" fill="#091b29" />
                        </svg>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#091b29' }}>Password Requirements</span>
                      </div>
                      <div style={{ fontSize: '14px', color: hasMinLength ? '#16A34A' : '#4B5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: hasMinLength ? '#16A34A' : '#6B7280' }}>•</span> At least 8 characters
                      </div>
                      <div style={{ fontSize: '14px', color: hasUppercase ? '#16A34A' : '#4B5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: hasUppercase ? '#16A34A' : '#6B7280' }}>•</span> One Uppercase letter
                      </div>
                      <div style={{ fontSize: '14px', color: hasNumber ? '#16A34A' : '#4B5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: hasNumber ? '#16A34A' : '#6B7280' }}>•</span> One number
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!isStep2Valid}
                      style={{
                        width: '100%',
                        padding: '17px',
                        borderRadius: '999px',
                        backgroundColor: isStep2Valid ? '#091b29' : '#6C8395',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '17px',
                        cursor: isStep2Valid ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.25s ease'
                      }}
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* ---------------- STEP 3 (3 of 3): Almost Done! ---------------- */}
              {signUpSubStep === 3 && (
                <div>
                  {/* Check Icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      backgroundColor: '#091b29',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      <svg width="34" height="34" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                      Almost Done!
                    </h3>
                    <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0 }}>
                      Review and Confirm
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 28px 0', gap: '14px' }}>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: '#091b29',
                        width: '100%',
                        borderRadius: '4px',
                      }} />
                    </div>
                    <span style={{ fontSize: '15px', color: '#091b29', fontWeight: '700', flexShrink: 0 }}>
                      3 of 3
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                    {/* Username Review */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1.5px solid #E5E7EB', borderRadius: '18px', backgroundColor: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#091b29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                          <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Username</div>
                          <div style={{ fontSize: '17px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>@{signUpUsername || 'username'}</div>
                        </div>
                      </div>
                      <button onClick={() => setSignUpSubStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#091b29', padding: 0, display: 'flex', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#091b29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Email Review */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1.5px solid #E5E7EB', borderRadius: '18px', backgroundColor: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#091b29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                          <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l9 7 9-7"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Email</div>
                          <div style={{ fontSize: '17px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>{signUpEmail || 'you@example.com'}</div>
                        </div>
                      </div>
                      <button onClick={() => setSignUpSubStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#091b29', padding: 0, display: 'flex', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#091b29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Password Review */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1.5px solid #E5E7EB', borderRadius: '18px', backgroundColor: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#091b29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}>
                          <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Password</div>
                          <div style={{ fontSize: '17px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>{signUpPassword || '••••••••'}</div>
                        </div>
                      </div>
                      <button onClick={() => setSignUpSubStep(2)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#091b29', padding: 0, display: 'flex', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#091b29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                    marginBottom: '24px', padding: '16px 18px', borderRadius: '18px', backgroundColor: '#DDE6ED',
                  }}>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                      border: `2px solid #091b29`, backgroundColor: agreedToTerms ? '#091b29' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s ease',
                    }}>
                      {agreedToTerms && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12.5l4.5 4.5L19 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#091b29', lineHeight: '1.4' }}>
                      By creating an account, you agree to our Term of service and privacy policy
                    </span>
                  </label>

                  <button
                    type="button"
                    disabled={!agreedToTerms}
                    onClick={handleCreateAccount}
                    style={{
                      width: '100%',
                      padding: '17px',
                      borderRadius: '999px',
                      backgroundColor: agreedToTerms ? '#091b29' : '#6C8395',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '17px',
                      cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                      transition: 'background-color 0.25s ease'
                    }}
                  >
                    Create account
                  </button>
                </div>
              )}

              {/* ---------------- STEP 4 (3 of 3): OTP VERIFICATION ---------------- */}
              {signUpSubStep === 'otp' && (
                <div style={{ paddingTop: '36px' }}>
                  <button
                    type="button"
                    onClick={() => setSignUpSubStep(3)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#111827',
                      marginBottom: '40px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M15 5l-7 7 7 7" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h3 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
                      Hello, {signUpUsername || 'User'}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0, lineHeight: '1.4' }}>
                      We sent you a verification code to<br />
                      {maskedEmail}
                    </p>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        placeholder="0"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        style={{
                          width: '48px',
                          height: '58px',
                          borderRadius: '14px',
                          border: '1.5px solid #E5E7EB',
                          backgroundColor: '#FFFFFF',
                          textAlign: 'center',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#111827',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!otp.every(d => d !== '')}
                    onClick={handleVerifyOtp}
                    style={{
                      width: '100%',
                      padding: '17px',
                      borderRadius: '999px',
                      backgroundColor: otp.every(d => d !== '') ? '#091b29' : '#6C8395',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '17px',
                      cursor: otp.every(d => d !== '') ? 'pointer' : 'not-allowed',
                      marginBottom: '28px',
                      transition: 'background-color 0.25s ease'
                    }}
                  >
                    Verify Code
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '15px', color: '#9CA3AF', margin: '0 0 10px 0' }}>
                    Didn't receive OTP?
                  </p>
                  <p style={{ textAlign: 'center', margin: 0 }}>
                    <span
                      onClick={handleResendOtp}
                      style={{
                        color: '#091b29',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Resend code
                    </span>
                  </p>
                  {resendMessage && (
                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#16A34A', margin: '10px 0 0 0' }}>
                      {resendMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Sign-In Switch */}
            {signUpSubStep !== 'otp' && (
              <p style={{ textAlign: 'center', fontSize: '15px', color: '#6B7280', margin: '20px 0 8px 0' }}>
                Already have an account?{' '}
                <span
                  onClick={() => setStep('signin')}
                  style={{ color: '#091b29', fontWeight: '700', cursor: 'pointer' }}
                >
                  Log in
                </span>
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}