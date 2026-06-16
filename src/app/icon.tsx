import { ImageResponse } from 'next/og';

export const size        = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #78350f, #d97706)',
          borderRadius: 10,
          border: '2.5px solid #ffd700',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 12px rgba(255,215,0,0.6)',
        }}
      >
        {/* Shimmer overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.12) 50%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Header — flags */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '3px 5px',
          borderBottom: '1px solid rgba(255,215,0,0.3)',
          fontSize: 8,
          lineHeight: 1,
        }}>
          <span>🇧🇷</span>
          <span>🇦🇷</span>
        </div>

        {/* Ball */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}>⚽</div>

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px 0',
          borderTop: '1px solid rgba(255,215,0,0.4)',
          background: 'rgba(255,215,0,0.2)',
          fontSize: 6,
          fontWeight: 900,
          color: '#ffd700',
          letterSpacing: 0.5,
        }}>
          ★ LEGENDARY
        </div>
      </div>
    ),
    { ...size }
  );
}
