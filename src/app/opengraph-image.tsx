import { ImageResponse } from 'next/og';

export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

function MiniCard({ gradient, borderColor, label, flag1, flag2, top, left, rotate }: {
  gradient: string; borderColor: string; label: string;
  flag1: string; flag2: string; top: number; left: number; rotate: number;
}) {
  return (
    <div style={{
      position: 'absolute',
      top, left,
      width: 180,
      height: 252,
      background: gradient,
      borderRadius: 14,
      border: `2px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      transform: `rotate(${rotate}deg)`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 10px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span>{flag1} BRA</span>
        <span>ARG {flag2}</span>
      </div>
      {/* Ball */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 52,
        opacity: 0.35,
      }}>⚽</div>
      {/* Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: 11,
        fontWeight: 800,
        color: borderColor,
        letterSpacing: 1,
        background: `${borderColor}18`,
      }}>
        <span>{label}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>#042</span>
      </div>
    </div>
  );
}

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: 1200,
        height: 630,
        display: 'flex',
        background: '#06080f',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,83,0.08), transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -150,
          right: 200,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.06), transparent 70%)',
          display: 'flex',
        }} />

        {/* Left content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 70px',
          flex: 1,
          gap: 24,
        }}>
          {/* World Cup badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0,200,83,0.12)',
            border: '1px solid rgba(0,200,83,0.35)',
            borderRadius: 30,
            padding: '6px 16px',
            alignSelf: 'flex-start',
            fontSize: 13,
            fontWeight: 700,
            color: '#00c853',
            letterSpacing: 2,
          }}>
            ⚽ WORLD CUP 2026
          </div>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, lineHeight: 1 }}>
            <span style={{ fontSize: 80, fontWeight: 900, color: '#00c853', letterSpacing: -3 }}>Snap</span>
            <span style={{ fontSize: 80, fontWeight: 900, color: '#ffffff', letterSpacing: -3 }}>Gol</span>
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: -0.5,
          }}>
            Snap. Collect. Trade.
          </div>

          {/* Description */}
          <div style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.6,
            maxWidth: 480,
          }}>
            The world's first fan-powered World Cup digital sticker collection.
            Upload photos, earn rare cards, complete your album.
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
            {[
              { v: '142K', l: 'Cards' },
              { v: '28K', l: 'Collectors' },
              { v: '32', l: 'Countries' },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#ffffff' }}>{v}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, fontWeight: 600 }}>{l.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Cards */}
        <div style={{
          position: 'relative',
          width: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 30,
        }}>
          <MiniCard
            gradient="linear-gradient(135deg, #3b0764, #7e22ce)"
            borderColor="#a855f7"
            label="★ EPIC"
            flag1="🇧🇷" flag2="🇦🇷"
            top={130} left={20} rotate={-12}
          />
          <MiniCard
            gradient="linear-gradient(135deg, #1e3a8a, #1d4ed8)"
            borderColor="#3b82f6"
            label="RARE"
            flag1="🇫🇷" flag2="🇪🇸"
            top={160} left={120} rotate={-2}
          />
          <MiniCard
            gradient="linear-gradient(135deg, #78350f, #d97706)"
            borderColor="#ffd700"
            label="★ LEGENDARY"
            flag1="🇦🇷" flag2="🇧🇷"
            top={80} left={220} rotate={10}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
