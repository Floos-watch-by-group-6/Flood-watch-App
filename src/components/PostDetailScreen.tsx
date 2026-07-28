import { useState, useRef, useEffect } from 'react';
import floodwatchLogo from '../assets/Floodwatchlogo.svg';
import type { FeedPost } from './FeedScreen';

const COMMENTS_API_URL = 'https://floodwatch-backend-82y3.onrender.com/api/comments';

interface Comment {
  id: number;
  username: string;
  timeAgo: string;
  text: string;
}

interface BackendComment {
  _id: string;
  text: string;
  // Backend may use any of these field names for the commenter
  creator?: string | { _id: string; name?: string };
  user?:    string | { _id: string; name?: string };
  author?:  string | { _id: string; name?: string };
  createdAt: string;
}

interface PostDetailScreenProps {
  post: FeedPost;
  currentUser: string;
  onBack: () => void;
}

function hashCommentId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function timeAgoFrom(createdAt: string): string {
  const diffMins = Math.floor((Date.now() - Date.parse(createdAt)) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const hrs = Math.floor(diffMins / 60);
  if (hrs < 24) return `${hrs}hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Pill palette matches the pillu.svg asset (same as the Feed).
function severityColors(level: 'Low' | 'Medium' | 'High'): { bg: string; text: string } {
  switch (level) {
    case 'High': return { bg: 'rgba(248, 17, 0, 0.08)', text: '#F81100' };
    case 'Medium': return { bg: 'rgba(232, 115, 14, 0.10)', text: '#E8730E' };
    case 'Low': return { bg: 'rgba(31, 157, 87, 0.10)', text: '#1F9D57' };
  }
}

function severityLabel(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'High': return 'High Severity';
    case 'Medium': return 'Medium Severity';
    case 'Low': return 'Low Severity';
  }
}

const CARD_OUTLINE = '1px solid #EFEFEF';
const DIVIDER = '#EDEEF0';

export default function PostDetailScreen({ post, currentUser, onBack }: PostDetailScreenProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const sevColors = severityColors(post.severity);

  const watcherCount = comments.filter((c) => c.username !== currentUser).length;

  // Fetch comments and keep them live while the post detail is open.
  useEffect(() => {
    if (!post.backendId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    let cancelled = false;

    const parseComments = (data: unknown): Comment[] => {
      const list: BackendComment[] = Array.isArray(data)
        ? data
        : (data as { comments?: BackendComment[] }).comments ?? [];
      return list.map(c => {
        const creatorField = c.creator ?? c.user ?? c.author;
        const name = typeof creatorField === 'object'
          ? creatorField?.name || 'Unknown'
          : creatorField || 'Unknown';
        return { id: hashCommentId(c._id), username: name, timeAgo: timeAgoFrom(c.createdAt), text: c.text };
      });
    };

    const fetchComments = async (showLoading = false) => {
      if (showLoading) setLoadingComments(true);
      try {
        const res = await fetch(`${COMMENTS_API_URL}/${post.backendId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (!cancelled) setComments(parseComments(data));
      } catch {}
      finally { if (showLoading) setLoadingComments(false); }
    };

    fetchComments(true);
    const intervalId = setInterval(() => fetchComments(false), 5000);
    return () => { cancelled = true; clearInterval(intervalId); };
  }, [post.backendId]);

  const handleSend = () => {
    const text = replyText.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Date.now(),
      username: currentUser || 'You',
      timeAgo: 'Just now',
      text,
    };
    setComments((prev) => [...prev, newComment]);
    setReplyText('');
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);

    // Persist to backend so other users see this comment.
    if (post.backendId) {
      const token = localStorage.getItem('token');
      fetch(`${COMMENTS_API_URL}/${post.backendId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      })
        .catch(() => {});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const canSend = replyText.trim().length > 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        zIndex: 15,
        animation: 'postDetailIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
      }}
    >
      <style>{`
        @keyframes postDetailIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        padding: '52px 20px 14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: '20px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.10)',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2430" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#262537', letterSpacing: '-0.01em' }}>Posts</h2>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 14px 100px 14px',
        }}
      >
        {/* ── ORIGINAL POST CARD ── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '18px 20px',
          marginBottom: '16px',
          border: CARD_OUTLINE,
        }}>
          {/* Username row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#6E6E76' }}>@{post.username}</span>
            <span style={{ fontSize: '13px', color: '#B0B0B8' }}>•</span>
            <span style={{ fontSize: '14px', color: '#9CA0A8' }}>{post.timeAgo}</span>
          </div>

          <div style={{ borderTop: `1px solid ${DIVIDER}`, margin: '14px 0' }} />

          {/* Reported at */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#1F2430' }}>Reported at:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#1F2430" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" stroke="#1F2430" strokeWidth="1.8" />
              </svg>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1F2430' }}>{post.locationName}</span>
            </span>
          </div>

          {/* Severity + Status pills (joined segmented) */}
          <div style={{ display: 'flex', gap: '1px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 11px',
              borderRadius: '12px 8px 8px 12px',
              backgroundColor: sevColors.bg,
              color: sevColors.text,
            }}>
              {severityLabel(post.severity)}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 11px',
              borderRadius: '8px 12px 12px 8px',
              backgroundColor: post.status === 'Verified' ? 'rgba(31, 157, 87, 0.12)' : 'rgba(110, 110, 122, 0.18)',
              color: post.status === 'Verified' ? '#1F9D57' : '#6E6E7A',
            }}>
              {post.status}
            </span>
          </div>

          {/* Description */}
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#8E8E96', lineHeight: '1.45' }}>
            {post.description}
          </p>

          {/* Images */}
          {post.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: post.images.length === 1 ? '1fr' : '1fr 1fr',
              gap: '10px',
            }}>
              {post.images.slice(0, 2).map((img, i) => (
                <div key={i} style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  aspectRatio: post.images.length === 1 ? '16 / 10' : '3 / 4',
                  backgroundColor: '#EDEEF0',
                }}>
                  <img
                    src={img}
                    alt={`flood ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          {/* New watcher comment indicator */}
          {watcherCount > 0 && (
            <>
              <div style={{ borderTop: `1px solid ${DIVIDER}`, margin: '16px 0 14px 0' }} />
              <button
                type="button"
                onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  fontFamily: 'inherit',
                }}
              >
                <img src={floodwatchLogo} alt="" width={24} height={24} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0E4567' }}>
                  + {watcherCount} new watcher comment{watcherCount !== 1 ? 's' : ''}
                </span>
              </button>
            </>
          )}
        </div>

        {/* ── COMMENTS ── */}
        <div ref={commentsRef}>
          {loadingComments && (
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#B0B0B8', margin: '8px 0 16px' }}>
              Loading comments…
            </p>
          )}
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '16px 20px',
                marginBottom: '12px',
                border: CARD_OUTLINE,
                animation: 'fadeSlideUp 0.25s ease both',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#6E6E76' }}>@{comment.username}</span>
                <span style={{ fontSize: '13px', color: '#B0B0B8' }}>•</span>
                <span style={{ fontSize: '14px', color: '#9CA0A8' }}>{comment.timeAgo}</span>
              </div>

              <div style={{ borderTop: `1px solid ${DIVIDER}`, margin: '12px 0' }} />

              <p style={{ margin: 0, fontSize: '14px', color: '#4B4B57', lineHeight: '1.5' }}>
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── REPLY BAR ── */}
      <div style={{
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        padding: '10px 16px max(20px, env(safe-area-inset-bottom)) 16px',
        borderTop: '1px solid #EFEFEF',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#F1F2F3',
          borderRadius: '999px',
          padding: '8px 10px 8px 14px',
        }}>
          {/* Person icon */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: '1.6px solid #C4C7CC',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={`Reply to ${post.username}`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              color: '#1F2430',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
              minWidth: 0,
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              flexShrink: 0,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canSend ? 'pointer' : 'default',
              opacity: canSend ? 1 : 0.55,
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#141B34" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 13.5L20.5 3.5" />
              <path d="M20.5 3.5l-6.4 17a0.6 0.6 0 0 1-1.13.05l-3.4-7.65a0.6 0.6 0 0 0-.3-.3L1.95 9.6a0.6 0.6 0 0 1 .05-1.13z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
