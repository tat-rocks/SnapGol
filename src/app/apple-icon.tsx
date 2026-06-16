import { ImageResponse } from 'next/og';

export const size        = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #06080f, #161b22)',
          borderRadius: 38,
          border: '4px solid #ffd700',
          gap: 6,
        }}
      >
        {/* Logo text */}
        <div style={{ display: 'flex', gap: 0, fontSize: 42, fontWeight: 900, letterSpacing: -2 }}>
          <span style={{ color: '#00c853' }}>Snap</span>
          <span style={{ color: '#ffffff' }}>Gol</span>
        </div>
        {/* Ball + rarity glow */}
        <div style={{
          fontSize: 44,
          display: 'flex',
          filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.9))',
        }}>
          ⚽
        </div>
        {/* Legendary badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255,215,0,0.15)',
          border: '1px solid rgba(255,215,0,0.5)',
          borderRadius: 20,
          padding: '3px 10px',
          fontSize: 13,
          fontWeight: 800,
          color: '#ffd700',
          letterSpacing: 1,
        }}>
          ★ LEGENDARY
        </div>
      </div>
    ),
    { ...size }
  );
}
