import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletHeader } from './components/WalletHeader';
import { useCarTransaction } from './hooks/useCarTransaction';
import { useUserAssets, CarObject } from './hooks/useUserAssets';
import { Wrench, Zap, X, ChevronDown } from 'lucide-react';
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
    createWheels, 
    createBumper, 
    installWheels, 
    installBumper, 
    removeWheels, 
    removeBumper, 
    createAndInstallWheels,
    createAndInstallBumper,
    mintCar 
  } = useCarTransaction();
  const { 
    cars, 
    wheels, 
    bumpers, 
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
        showNotification(`Araba rengini değiştirildi!`, 'success');
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
      // PTB kullanarak oluşturma ve takma işlemini bir imzada birleştir
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
      // PTB kullanarak oluşturma ve takma işlemini bir imzada birleştir
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
      <WalletHeader />

      {!account?.address ? (
        <div className="no-wallet">
          <div className="no-wallet-content">
            <h2>🔗 Cüzdan Bağlanması Gereklidir</h2>
            <p>Lütfen yukarıdaki "Connect" butonunu kullanarak cüzdan bağlayın.</p>
            <small>Sui Testnet ağında çalışmalıdır.</small>
          </div>
        </div>
      ) : cars.length === 0 ? (
        <div className="no-cars">
          <div className="no-cars-content">
            <h2>🚗 Arabanız Yok</h2>
            <p>Henüz bir araba oluşturmadınız.</p>
            <button 
              className="create-car-btn"
              onClick={() => {
                setIsProcessing(true);
                mintCar('Tesla', '#FF0000').then((result) => {
                  if (result.status === 'success') {
                    showNotification('Araba başarıyla oluşturuldu!', 'success');
                    setTimeout(() => refreshAssets(), 1500);
                  }
                  setIsProcessing(false);
                });
              }}
              disabled={isProcessing}
            >
              ✨ İlk Arabamı Oluştur
            </button>
          </div>
        </div>
      ) : (
        <main className="garage-main">
          {/* Bildirim */}
          {notification && (
            <div className={`notification notification-${notification.type}`}>
              <span className="notification-text">{notification.message}</span>
              <button className="notification-close" onClick={() => setNotification(null)}>
                ×
              </button>
            </div>
          )}

          {/* Araba Seçici */}
          <div className="cars-header">
            <h2>🚗 Arabaların ({cars.length})</h2>
            <div className="cars-selector">
              {cars.map((car) => (
                <button
                  key={car.id}
                  className={`car-select-btn ${selectedCar?.id === car.id ? 'active' : ''}`}
                  onClick={() => setSelectedCar(car)}
                >
                  <span className="model-text">{car.model}</span>
                  <span className="color-indicator" style={{ backgroundColor: car.color }}></span>
                </button>
              ))}
            </div>
          </div>

          <div className="garage-container">
            {/* Sol: Araba Görünümü */}
            <section className="car-display-section">
              {selectedCar && (
                <div className="car-display-card" style={{ backgroundColor: selectedCar.color }}>
                  <div className="car-header-info">
                    <h3>{selectedCar.model}</h3>
                    <span className="car-color-badge">{selectedCar.color}</span>
                  </div>

                  {/* Araba Görseli */}
                  <div className="car-visual">
                    <div className="car-body">
                      <div className="car-top"></div>
                      <div className="car-bottom"></div>
                    </div>
                  </div>

                  {/* Slotlar */}
                  <div className="slots-grid">
                    {/* Jant Slotu */}
                    <div className="slot">
                      <div className="slot-label">⚙️ Jant</div>
                      <div className="slot-content">
                        {selectedCar.hasWheels ? (
                          <div className="slot-installed">
                            <span className="part-name">{selectedCar.wheelStyle}</span>
                            <button 
                              className="remove-btn"
                              onClick={handleRemoveWheels}
                              disabled={isProcessing}
                              title="Jantı Çıkart"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="slot-empty">Boş Slot</span>
                        )}
                      </div>
                    </div>

                    {/* Tampon Slotu */}
                    <div className="slot">
                      <div className="slot-label">🛡️ Tampon</div>
                      <div className="slot-content">
                        {selectedCar.hasBumper ? (
                          <div className="slot-installed">
                            <span className="part-name">{selectedCar.bumperShape}</span>
                            <button 
                              className="remove-btn"
                              onClick={handleRemoveBumper}
                              disabled={isProcessing}
                              title="Tamponu Çıkart"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="slot-empty">Boş Slot</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Sağ: Özelleştirme Menüsü */}
            <section className="tuning-section">
              <h2>🎨 Tuning Menüsü</h2>

              {/* Renk Seçici */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'color' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'color' ? null : 'color')}
                >
                  <Zap size={20} />
                  <span>Renk Değiştir</span>
                  <ChevronDown size={18} className="menu-chevron" />
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

              {/* Jant Dükkanı */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'wheels' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'wheels' ? null : 'wheels')}
                >
                  <Wrench size={20} />
                  <span>Jant Dükkânı</span>
                  <ChevronDown size={18} className="menu-chevron" />
                </button>

                {showMenu === 'wheels' && (
                  <div className="menu-content">
                    <div className="parts-list">
                      {wheelOptions.map((part) => (
                        <button
                          key={part.style}
                          className="part-btn"
                          onClick={() => handleCreateAndInstallWheels(part)}
                          disabled={isProcessing || selectedCar?.hasWheels}
                        >
                          <span className="part-btn-name">{part.name}</span>
                          <span className="part-btn-icon">➕</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tampon Dükkanı */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'bumper' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'bumper' ? null : 'bumper')}
                >
                  <Wrench size={20} />
                  <span>Tampon Dükkânı</span>
                  <ChevronDown size={18} className="menu-chevron" />
                </button>

                {showMenu === 'bumper' && (
                  <div className="menu-content">
                    <div className="parts-list">
                      {bumperOptions.map((part) => (
                        <button
                          key={part.style}
                          className="part-btn"
                          onClick={() => handleCreateAndInstallBumper(part)}
                          disabled={isProcessing || selectedCar?.hasBumper}
                        >
                          <span className="part-btn-name">{part.name}</span>
                          <span className="part-btn-icon">➕</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Yükleniyor Göstergesi */}
              {isProcessing && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>İşlem devam ediyor...</p>
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
