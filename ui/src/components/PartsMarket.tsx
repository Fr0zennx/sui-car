import React from 'react';

export interface Part {
  id: string;
  name: string;
  type: 'wheels' | 'bumper';
  style: string;
  price?: number;
}

interface PartsMarketProps {
  availableParts: Part[];
  installedWheels?: Part;
  installedBumper?: Part;
  onInstallPart: (part: Part) => void;
  onRemovePart: (type: 'wheels' | 'bumper') => void;
  isLoading?: boolean;
}

export const PartsMarket: React.FC<PartsMarketProps> = ({
  availableParts,
  installedWheels,
  installedBumper,
  onInstallPart,
  onRemovePart,
  isLoading = false,
}) => {
  return (
    <div className="parts-market">
      <h3>🏪 Parça Pazarı</h3>

      {/* Mevcut Parçalar */}
      <div className="market-section">
        <h4>Satın Alınabilir Parçalar</h4>
        <div className="parts-list">
          {availableParts.map((part) => (
            <div key={part.id} className="part-card">
              <div className="part-header">
                <span className="part-type">
                  {part.type === 'wheels' ? '🛞' : '🪛'}
                </span>
                <span className="part-name">{part.name}</span>
              </div>
              <div className="part-style">{part.style}</div>
              <button
                className="install-btn"
                onClick={() => onInstallPart(part)}
                disabled={isLoading}
              >
                Satın Al & Tak
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Takılı Parçalar */}
      <div className="market-section">
        <h4>Takılı Parçalar</h4>
        <div className="installed-parts">
          {installedWheels ? (
            <div className="installed-part">
              <span>🛞 {installedWheels.name}</span>
              <button
                className="remove-btn"
                onClick={() => onRemovePart('wheels')}
                disabled={isLoading}
              >
                Çıkart
              </button>
            </div>
          ) : (
            <div className="no-part">Jant takılı değil</div>
          )}

          {installedBumper ? (
            <div className="installed-part">
              <span>🪛 {installedBumper.name}</span>
              <button
                className="remove-btn"
                onClick={() => onRemovePart('bumper')}
                disabled={isLoading}
              >
                Çıkart
              </button>
            </div>
          ) : (
            <div className="no-part">Tampon takılı değil</div>
          )}
        </div>
      </div>
    </div>
  );
};
