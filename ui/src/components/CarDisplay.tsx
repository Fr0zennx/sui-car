import React from 'react';

interface CarDisplayProps {
  model: string;
  color: string;
  hasWheels: boolean;
  wheelStyle?: string;
  hasBumper: boolean;
  bumperShape?: string;
}

export const CarDisplay: React.FC<CarDisplayProps> = ({
  model,
  color,
  hasWheels,
  wheelStyle,
  hasBumper,
  bumperShape,
}) => {
  // Hex rengi RGB'ye çevir (basit parser)
  const parseColor = (colorStr: string) => {
    if (colorStr.startsWith('#')) {
      return colorStr;
    }
    const colorMap: Record<string, string> = {
      red: '#FF0000',
      blue: '#0000FF',
      green: '#00FF00',
      yellow: '#FFFF00',
      black: '#000000',
      white: '#FFFFFF',
      purple: '#800080',
      orange: '#FFA500',
      pink: '#FFC0CB',
      cyan: '#00FFFF',
    };
    return colorMap[colorStr.toLowerCase()] || '#FF0000';
  };

  const carColor = parseColor(color);

  return (
    <div className="car-display">
      <h2>{model}</h2>
      <div className="car-visual">
        {/* Araba gövdesi */}
        <svg width="300" height="200" viewBox="0 0 300 200">
          {/* Tampom varsa göster */}
          {hasBumper && (
            <rect
              x="10"
              y="80"
              width="20"
              height="40"
              fill={bumperShape === 'Agresif' ? '#333' : '#555'}
              className="bumper"
            />
          )}

          {/* Ana gövde */}
          <rect
            x="40"
            y="50"
            width="220"
            height="80"
            fill={carColor}
            stroke="#000"
            strokeWidth="2"
            rx="10"
            className="car-body"
          />

          {/* Pencereler */}
          <rect x="60" y="65" width="50" height="30" fill="#87CEEB" stroke="#000" strokeWidth="1" />
          <rect x="190" y="65" width="50" height="30" fill="#87CEEB" stroke="#000" strokeWidth="1" />

          {/* Ön Tekerlek */}
          {hasWheels ? (
            <>
              <circle
                cx="80"
                cy="140"
                r="25"
                fill={wheelStyle === 'Spor' ? '#111' : '#333'}
                stroke="#000"
                strokeWidth="2"
                className="wheel"
              />
              <circle cx="80" cy="140" r="15" fill="#666" />
              <circle cx="80" cy="140" r="8" fill="#999" />

              {/* Arka Tekerlek */}
              <circle
                cx="220"
                cy="140"
                r="25"
                fill={wheelStyle === 'Spor' ? '#111' : '#333'}
                stroke="#000"
                strokeWidth="2"
                className="wheel"
              />
              <circle cx="220" cy="140" r="15" fill="#666" />
              <circle cx="220" cy="140" r="8" fill="#999" />
            </>
          ) : (
            <>
              <circle cx="80" cy="140" r="25" fill="#ddd" stroke="#000" strokeWidth="2" opacity="0.5" />
              <circle cx="220" cy="140" r="25" fill="#ddd" stroke="#000" strokeWidth="2" opacity="0.5" />
            </>
          )}
        </svg>
      </div>

      <div className="car-specs">
        <div className="spec">
          <span className="label">Model:</span>
          <span className="value">{model}</span>
        </div>
        <div className="spec">
          <span className="label">Renk:</span>
          <div className="color-box" style={{ backgroundColor: carColor }}></div>
          <span className="value">{color}</span>
        </div>
        {hasWheels && (
          <div className="spec">
            <span className="label">Jant:</span>
            <span className="value">{wheelStyle}</span>
          </div>
        )}
        {hasBumper && (
          <div className="spec">
            <span className="label">Tampon:</span>
            <span className="value">{bumperShape}</span>
          </div>
        )}
      </div>
    </div>
  );
};
