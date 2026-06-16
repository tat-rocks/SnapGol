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
          background: 'linear-gradient(145deg, #78350f, #d97706, #ffd700)',
          borderRadius: 14,
          border: '3px solid #ffd700',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 3,
          borderRadius: 10,
          border: '1px solid rgba(255,215,0,0.4)',
          display: 'flex',
        }} />
        <div style={{ fontSize: 32, display: 'flex' }}>⚽</div>
      </div>
    ),
    { ...size }
  );
}
