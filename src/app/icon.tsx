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
          borderRadius: 12,
        }}
      >
        {/* Card — fills most of the canvas, thick border, big ball */}
        <div
          style={{
            width: 46,
            height: 58,
            background: 'linear-gradient(135deg, rgb(120, 53, 15), rgb(217, 119, 6))',
            border: '3px solid #ffd700',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'rotate(6deg)',
            boxShadow: '0 0 10px rgba(255,215,0,0.7)',
            position: 'relative',
          }}
        >
          {/* Shimmer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.15) 50%, transparent 70%)',
            display: 'flex',
          }} />

          {/* Header strip */}
          <div style={{
            height: 10,
            borderBottom: '1px solid rgba(255,215,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 6,
            color: 'rgba(255,255,255,0.4)',
          }}>BRA · ARG</div>

          {/* Ball — big, fully opaque */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}>⚽</div>

          {/* LEGENDARY footer */}
          <div style={{
            height: 12,
            background: 'rgba(255,215,0,0.25)',
            borderTop: '1px solid rgba(255,215,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 5,
            fontWeight: 900,
            color: '#ffd700',
            letterSpacing: 0.5,
          }}>★ LEGENDARY</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
