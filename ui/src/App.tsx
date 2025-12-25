import React, { useState, useEffect } from 'react';
import { CarDisplay } from './components/CarDisplay';
import { ColorPicker } from './components/ColorPicker';
import { PartsMarket, Part } from './components/PartsMarket';
import './App.css';

interface CarState {
  model: string;
  color: string;
  hasWheels: boolean;
  wheelStyle?: string;
  hasBumper: boolean;
  bumperShape?: string;
}

const INITIAL_CAR: CarState = {
  model: 'Sui Racer 2025',
  color: '#FF0000',
  hasWheels: false,
  hasBumper: false,
};

const AVAILABLE_PARTS: Part[] = [
  {
    id: 'wheels-sport',
    name: 'Spor Jant',
    type: 'wheels',
    style: 'Spor',
  },
  {
    id: 'wheels-classic',
    name: 'Klasik Jant',
    type: 'wheels',
    style: 'Klasik',
  },
  {
    id: 'wheels-offset',
    name: 'Offset Jant',
    type: 'wheels',
    style: 'Ofset',
  },
  {
    id: 'bumper-aggressive',
    name: 'Agresif Tampon',
    type: 'bumper',
    style: 'Agresif',
  },
  {
    id: 'bumper-standard',
    name: 'Standart Tampon',
    type: 'bumper',
    style: 'Standart',
  },
];

function App() {
  const [car, setCar] = useState<CarState>(INITIAL_CAR);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string>('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleColorChange = (newColor: string) => {
    setIsLoading(true);
    // Blockchain işlemi simülasyonu
    setTimeout(() => {
      setCar((prev) => ({ ...prev, color: newColor }));
      showNotification(`✅ Araba rengini ${newColor} olarak değiştirildi!`);
      setIsLoading(false);
    }, 500);
  };

  const handleInstallPart = (part: Part) => {
    setIsLoading(true);
    // Blockchain işlemi simülasyonu
    setTimeout(() => {
      if (part.type === 'wheels') {
        setCar((prev) => ({
          ...prev,
          hasWheels: true,
          wheelStyle: part.style,
        }));
        showNotification(`✅ ${part.name} başarıyla takıldı!`);
      } else if (part.type === 'bumper') {
        setCar((prev) => ({
          ...prev,
          hasBumper: true,
          bumperShape: part.style,
        }));
        showNotification(`✅ ${part.name} başarıyla takıldı!`);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleRemovePart = (type: 'wheels' | 'bumper') => {
    setIsLoading(true);
    setTimeout(() => {
      if (type === 'wheels') {
        setCar((prev) => ({
          ...prev,
          hasWheels: false,
          wheelStyle: undefined,
        }));
        showNotification('✅ Jant çıkartıldı!');
      } else if (type === 'bumper') {
        setCar((prev) => ({
          ...prev,
          hasBumper: false,
          bumperShape: undefined,
        }));
        showNotification('✅ Tampon çıkartıldı!');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏎️ Sui Car Garage</h1>
        <p>Arabanı özelleştir ve blockchain'de sakla</p>
      </header>

      <main className="app-main">
        <div className="car-section">
          <CarDisplay
            model={car.model}
            color={car.color}
            hasWheels={car.hasWheels}
            wheelStyle={car.wheelStyle}
            hasBumper={car.hasBumper}
            bumperShape={car.bumperShape}
          />
        </div>

        <div className="controls-section">
          <ColorPicker
            currentColor={car.color}
            onColorChange={handleColorChange}
            isLoading={isLoading}
          />

          <PartsMarket
            availableParts={AVAILABLE_PARTS}
            installedWheels={
              car.hasWheels
                ? AVAILABLE_PARTS.find(
                    (p) => p.type === 'wheels' && p.style === car.wheelStyle
                  )
                : undefined
            }
            installedBumper={
              car.hasBumper
                ? AVAILABLE_PARTS.find(
                    (p) => p.type === 'bumper' && p.style === car.bumperShape
                  )
                : undefined
            }
            onInstallPart={handleInstallPart}
            onRemovePart={handleRemovePart}
            isLoading={isLoading}
          />
        </div>
      </main>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default App;
