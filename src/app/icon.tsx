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
        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.22), transparent 65%)',
          display: 'flex',
        }} />

        {/* Legendary card — exact replica of HeroCards legendary, scaled & rotated 6deg */}
        <div
          style={{
            width: 40,
            height: 56,
            background: 'linear-gradient(135deg, rgb(120, 53, 15), rgb(217, 119, 6))',
            border: '2px solid rgb(255, 215, 0)',
            borderRadius: 7,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: 'rotate(6deg)',
            boxShadow: 'rgba(255,215,0,0.5) 0px 0px 12px, rgba(255,215,0,0.15) 0px 0px 24px',
            position: 'relative',
          }}
        >
          {/* Shimmer overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)',
            display: 'flex',
          }} />

          {/* Header: 🇧🇷 BRA — ARG 🇦🇷 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px 4px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: 5,
            color: 'rgba(255,255,255,0.5)',
          }}>
            <span>🇧🇷 BRA</span>
            <span>ARG 🇦🇷</span>
          </div>

          {/* Ball */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            opacity: 0.3,
          }}>⚽</div>

          {/* Footer: ★ Legendary badge + #042 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 4px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              background: 'rgba(255,215,0,0.13)',
              border: '1px solid rgba(255,215,0,0.4)',
              borderRadius: 20,
              padding: '1px 3px',
              fontSize: 4,
              fontWeight: 900,
              color: '#ffd700',
            }}>
              <span>★</span><span>Legendary</span>
            </div>
            <span style={{ fontSize: 4, color: 'rgba(255,255,255,0.3)' }}>#042</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
