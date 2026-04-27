'use client'

export default function HexagonBackground() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* SVG Pattern tĩnh - opacity rất thấp */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern id="hex" width="60" height="104" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
            <path
              d="M30 0L60 17.5V52.5L30 70L0 52.5V17.5Z"
              fill="none"
              stroke="#F5A623"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  )
}
