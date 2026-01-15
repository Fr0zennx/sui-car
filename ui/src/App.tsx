import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletHeader } from './components/WalletHeader';
import { useCarTransaction } from './hooks/useCarTransaction';
import { useUserAssets, CarObject } from './hooks/useUserAssets';
import ModelViewer from './components/ModelViewer';
import { Wrench, X, ChevronDown, Palette } from 'lucide-react';
import './App.css';

interface Part {
  name: string;
  style: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const account = useCurrentAccount();
  const { 
    isLoading: txLoading, 
    repaintCar, 
    removeWheels, 
    removeBumper, 
    createAndInstallWheels,
    createAndInstallBumper,
    mintCar 
  } = useCarTransaction();
  const { 
    cars, 
    isLoading: assetsLoading, 
    refreshAssets 
  } = useUserAssets();
  
  const [selectedCar, setSelectedCar] = useState<CarObject | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMenu, setShowMenu] = useState<'color' | 'wheels' | 'bumper' | null>(null);

  useEffect(() => {
    if (cars.length > 0 && !selectedCar) {
      setSelectedCar(cars[0]);
    }
  }, [cars, selectedCar]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleColorChange = async (newColor: string) => {
    if (!selectedCar || !account?.address) {
      showNotification('Lütfen önce cüzdan bağlayın', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await repaintCar(selectedCar.id, newColor);
      if (result.status === 'success') {
        showNotification(`Araba rengi değiştirildi!`, 'success');
        setSelectedCar((prev) => prev ? { ...prev, color: newColor } : null);
        setTimeout(() => refreshAssets(), 1500);
      } else {
        showNotification(`İşlem başarısız: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Renklendir işleminde hata!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAndInstallWheels = async (part: Part) => {
    if (!selectedCar || !account?.address) {
      showNotification('Lütfen önce cüzdan bağlayın', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      showNotification(`${part.name} takılıyor...`, 'info');
      const result = await createAndInstallWheels(selectedCar.id, part.style);
      
      if (result.status === 'success') {
        showNotification(`${part.name} başarıyla takıldı!`, 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasWheels: true, wheelStyle: part.style } : null
        );
        setTimeout(() => refreshAssets(), 2000);
      } else {
        showNotification(`İşlem başarısız: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Jant takma işleminde hata!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAndInstallBumper = async (part: Part) => {
    if (!selectedCar || !account?.address) {
      showNotification('Lütfen önce cüzdan bağlayın', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      showNotification(`${part.name} takılıyor...`, 'info');
      const result = await createAndInstallBumper(selectedCar.id, part.style);
      
      if (result.status === 'success') {
        showNotification(`${part.name} başarıyla takıldı!`, 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasBumper: true, bumperShape: part.style } : null
        );
        setTimeout(() => refreshAssets(), 2000);
      } else {
        showNotification(`İşlem başarısız: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Tampon takma işleminde hata!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveWheels = async () => {
    if (!selectedCar || !account?.address) {
      showNotification('Lütfen önce cüzdan bağlayın', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await removeWheels(selectedCar.id);
      if (result.status === 'success') {
        showNotification('Jant başarıyla çıkartıldı!', 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasWheels: false, wheelStyle: undefined } : null
        );
        setTimeout(() => refreshAssets(), 1000);
      } else {
        showNotification('Jant çıkartma başarısız oldu', 'error');
      }
    } catch (error) {
      showNotification('Jant çıkartma işleminde hata!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBumper = async () => {
    if (!selectedCar || !account?.address) {
      showNotification('Lütfen önce cüzdan bağlayın', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await removeBumper(selectedCar.id);
      if (result.status === 'success') {
        showNotification('Tampon başarıyla çıkartıldı!', 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasBumper: false, bumperShape: undefined } : null
        );
        setTimeout(() => refreshAssets(), 1000);
      } else {
        showNotification('Tampon çıkartma başarısız oldu', 'error');
      }
    } catch (error) {
      showNotification('Tampon çıkartma işleminde hata!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMintCar = async () => {
    setIsProcessing(true);
    try {
      const result = await mintCar('Tesla', '#FF0000');
      if (result.status === 'success') {
        showNotification('Araba başarıyla oluşturuldu!', 'success');
        setTimeout(() => refreshAssets(), 1500);
      } else {
        showNotification(`İşlem başarısız: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Araba oluşturma işleminde hata!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const colorOptions = [
    { name: 'Kırmızı', value: '#FF0000' },
    { name: 'Mavi', value: '#0080FF' },
    { name: 'Yeşil', value: '#00FF00' },
    { name: 'Sarı', value: '#FFFF00' },
    { name: 'Turuncu', value: '#FF8000' },
    { name: 'Mor', value: '#8000FF' },
    { name: 'Siyah', value: '#000000' },
    { name: 'Beyaz', value: '#FFFFFF' },
  ];

  const wheelOptions: Part[] = [
    { name: 'Spor Jant', style: 'Sport' },
    { name: 'Klasik Jant', style: 'Classic' },
    { name: 'Offset Jant', style: 'Offset' },
  ];

  const bumperOptions: Part[] = [
    { name: 'Agresif Tampon', style: 'Aggressive' },
    { name: 'Standart Tampon', style: 'Standard' },
  ];

  const isLoading = txLoading || assetsLoading || isProcessing;

  return (
    <div className="app-container">
      {/* Wallet Header - Top Right */}
      <WalletHeader />

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span className="notification-text">{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification(null)}>
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* 3D Model Viewer - Center */}
        <div className="model-container">
          <ModelViewer
            url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
            width="100%"
            height="100%"
            autoRotate={true}
            autoRotateSpeed={0.15}
            enableMouseParallax={true}
            enableManualRotation={true}
            enableHoverRotation={false}
            enableManualZoom={true}
            defaultZoom={1.5}
            minZoomDistance={0.8}
            maxZoomDistance={4}
            defaultRotationX={0}
            defaultRotationY={15}
            environmentPreset="night"
            ambientIntensity={0.5}
            keyLightIntensity={1.2}
            fillLightIntensity={0.6}
            rimLightIntensity={0.9}
            showScreenshotButton={false}
            fadeIn={true}
          />
        </div>

        {/* Tuning Menu - Right Side */}
        <div className="tuning-panel">
          <div className="tuning-header">
            <Wrench size={24} />
            <h2>Tuning</h2>
          </div>

          {!account?.address ? (
            <div className="tuning-empty">
              <p>Araç özelleştirmek için cüzdan bağlayın</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="tuning-empty">
              <p>Henüz arabanız yok</p>
              <button 
                className="mint-btn"
                onClick={handleMintCar}
                disabled={isProcessing}
              >
                ✨ Araba Oluştur
              </button>
            </div>
          ) : (
            <>
              {/* Current Car Info */}
              {selectedCar && (
                <div className="car-info-mini">
                  <span className="car-model">{selectedCar.model}</span>
                  <span 
                    className="car-color-dot" 
                    style={{ backgroundColor: selectedCar.color }}
                  />
                </div>
              )}

              {/* Color Picker */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'color' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'color' ? null : 'color')}
                >
                  <Palette size={18} />
                  <span>Renk</span>
                  <ChevronDown size={16} className="menu-chevron" />
                </button>

                {showMenu === 'color' && (
                  <div className="menu-content">
                    <div className="color-grid">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          className={`color-btn ${selectedCar?.color === color.value ? 'selected' : ''}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleColorChange(color.value)}
                          disabled={isProcessing}
                          title={color.name}
                        >
                          {selectedCar?.color === color.value && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wheels */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'wheels' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'wheels' ? null : 'wheels')}
                >
                  <Wrench size={18} />
                  <span>Jant</span>
                  {selectedCar?.hasWheels && (
                    <span className="installed-badge">{selectedCar.wheelStyle}</span>
                  )}
                  <ChevronDown size={16} className="menu-chevron" />
                </button>

                {showMenu === 'wheels' && (
                  <div className="menu-content">
                    {selectedCar?.hasWheels ? (
                      <button
                        className="remove-part-btn"
                        onClick={handleRemoveWheels}
                        disabled={isProcessing}
                      >
                        <X size={16} />
                        <span>Jantı Çıkart</span>
                      </button>
                    ) : (
                      <div className="parts-list">
                        {wheelOptions.map((part) => (
                          <button
                            key={part.style}
                            className="part-btn"
                            onClick={() => handleCreateAndInstallWheels(part)}
                            disabled={isProcessing}
                          >
                            <span>{part.name}</span>
                            <span className="part-icon">+</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bumper */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'bumper' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'bumper' ? null : 'bumper')}
                >
                  <Wrench size={18} />
                  <span>Tampon</span>
                  {selectedCar?.hasBumper && (
                    <span className="installed-badge">{selectedCar.bumperShape}</span>
                  )}
                  <ChevronDown size={16} className="menu-chevron" />
                </button>

                {showMenu === 'bumper' && (
                  <div className="menu-content">
                    {selectedCar?.hasBumper ? (
                      <button
                        className="remove-part-btn"
                        onClick={handleRemoveBumper}
                        disabled={isProcessing}
                      >
                        <X size={16} />
                        <span>Tamponu Çıkart</span>
                      </button>
                    ) : (
                      <div className="parts-list">
                        {bumperOptions.map((part) => (
                          <button
                            key={part.style}
                            className="part-btn"
                            onClick={() => handleCreateAndInstallBumper(part)}
                            disabled={isProcessing}
                          >
                            <span>{part.name}</span>
                            <span className="part-icon">+</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Loading */}
              {isProcessing && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <span>İşlem devam ediyor...</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
