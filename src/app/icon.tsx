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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#06080f',
          borderRadius: 13,
          position: 'relative',
        }}
      >
        {/* Gold glow behind card */}
        <div style={{
          position: 'absolute',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.25), transparent 70%)',
          display: 'flex',
        }} />

        {/* Legendary card — tilted like in the hero */}
        <div
          style={{
            width: 38,
            height: 52,
            background: 'linear-gradient(135deg, #78350f, #d97706)',
            border: '1.5px solid #ffd700',
            borderRadius: 6,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'rotate(8deg)',
            boxShadow: '0 2px 14px rgba(255,215,0,0.55)',
            position: 'relative',
          }}
        >
          {/* Shimmer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, transparent 25%, rgba(255,215,0,0.18) 50%, transparent 75%)',
            display: 'flex',
          }} />

          {/* Header — flags */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px 4px',
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
            fontSize: 18,
          }}>⚽</div>

          {/* LEGENDARY badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px 0',
            background: 'rgba(255,215,0,0.22)',
            borderTop: '1px solid rgba(255,215,0,0.4)',
            fontSize: 5,
            fontWeight: 900,
            color: '#ffd700',
            letterSpacing: 0.3,
          }}>
            LEGENDARY
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
