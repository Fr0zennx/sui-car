import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { CarDisplay } from './components/CarDisplay';
import { ColorPicker } from './components/ColorPicker';
import { PartsMarket, Part } from './components/PartsMarket';
import { WalletHeader } from './components/WalletHeader';
import { useCarTransaction } from './hooks/useCarTransaction';
import { useUserAssets, CarObject } from './hooks/useUserAssets';
import './App.css';


function App() {
  const account = useCurrentAccount();
  const { isLoading: txLoading, repaintCar, createWheels, createBumper, installWheels, installBumper, removeWheels, removeBumper } = useCarTransaction();
  const { cars, wheels, bumpers, isLoading: assetsLoading, refreshAssets, error: assetsError } = useUserAssets();
  
  const [selectedCar, setSelectedCar] = useState<CarObject | null>(null);
  const [notification, setNotification] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Araba seçildiğinde
  useEffect(() => {
    if (cars.length > 0 && !selectedCar) {
      setSelectedCar(cars[0]);
    }
  }, [cars, selectedCar]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleColorChange = async (newColor: string) => {
    if (!selectedCar || !account?.address) {
      showNotification('❌ Lütfen önce cüzdan bağlayın');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await repaintCar(selectedCar.id, newColor);
      if (result.status === 'success') {
        showNotification(`✅ Araba rengini ${newColor} olarak değiştirildi!`);
        setSelectedCar((prev) => prev ? { ...prev, color: newColor } : null);
        setTimeout(() => refreshAssets(), 1000);
      } else {
        showNotification(`❌ İşlem başarısız: ${result.error}`);
      }
    } catch (error) {
      showNotification('❌ Renklendir işleminde hata!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAndInstallWheels = async (part: Part) => {
    if (!selectedCar || !account?.address) {
      showNotification('❌ Lütfen önce cüzdan bağlayın');
      return;
    }

    setIsProcessing(true);
    try {
      // Önce jant oluştur
      const createResult = await createWheels(part.style);
      if (createResult.status === 'success') {
        showNotification(`✅ ${part.name} oluşturuldu! Bağlanıyor...`);
        
        // Sonra assetleri yenile
        setTimeout(async () => {
          await refreshAssets();
          
          // Yeni jantı bul
          const newWheels = wheels.find((w) => w.style === part.style);
          if (newWheels && selectedCar) {
            const installResult = await installWheels(selectedCar.id, newWheels.id);
            if (installResult.status === 'success') {
              showNotification(`✅ ${part.name} başarıyla takıldı!`);
              setSelectedCar((prev) => 
                prev ? { ...prev, hasWheels: true, wheelStyle: part.style } : null
              );
              setTimeout(() => refreshAssets(), 1000);
            }
          }
        }, 1500);
      }
    } catch (error) {
      showNotification('❌ Jant takma işleminde hata!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAndInstallBumper = async (part: Part) => {
    if (!selectedCar || !account?.address) {
      showNotification('❌ Lütfen önce cüzdan bağlayın');
      return;
    }

    setIsProcessing(true);
    try {
      // Önce tampon oluştur
      const createResult = await createBumper(part.style);
      if (createResult.status === 'success') {
        showNotification(`✅ ${part.name} oluşturuldu! Bağlanıyor...`);
        
        // Sonra assetleri yenile
        setTimeout(async () => {
          await refreshAssets();
          
          // Yeni tamponu bul
          const newBumper = bumpers.find((b) => b.shape === part.style);
          if (newBumper && selectedCar) {
            const installResult = await installBumper(selectedCar.id, newBumper.id);
            if (installResult.status === 'success') {
              showNotification(`✅ ${part.name} başarıyla takıldı!`);
              setSelectedCar((prev) => 
                prev ? { ...prev, hasBumper: true, bumperShape: part.style } : null
              );
              setTimeout(() => refreshAssets(), 1000);
            }
          }
        }, 1500);
      }
    } catch (error) {
      showNotification('❌ Tampon takma işleminde hata!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePart = async (type: 'wheels' | 'bumper') => {
    if (!selectedCar || !account?.address) {
      showNotification('❌ Lütfen önce cüzdan bağlayın');
      return;
    }

    setIsProcessing(true);
    try {
      const result = type === 'wheels' 
        ? await removeWheels(selectedCar.id)
        : await removeBumper(selectedCar.id);

      if (result.status === 'success') {
        const partName = type === 'wheels' ? 'Jant' : 'Tampon';
        showNotification(`✅ ${partName} çıkartıldı!`);
        
        if (type === 'wheels') {
          setSelectedCar((prev) => 
            prev ? { ...prev, hasWheels: false, wheelStyle: undefined } : null
          );
        } else {
          setSelectedCar((prev) => 
            prev ? { ...prev, hasBumper: false, bumperShape: undefined } : null
          );
        }
        
        setTimeout(() => refreshAssets(), 1000);
      }
    } catch (error) {
      showNotification('❌ Parça çıkartma işleminde hata!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInstallPart = (part: Part) => {
    if (part.type === 'wheels') {
      handleCreateAndInstallWheels(part);
    } else {
      handleCreateAndInstallBumper(part);
    }
  };

  const isLoading = txLoading || assetsLoading || isProcessing;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏎️ Sui Car Garage</h1>
        <p>Arabanı özelleştir ve blockchain'de sakla</p>
      </header>

      <WalletHeader />

      {!account?.address ? (
        <div className="wallet-required">
          <div className="wallet-required-message">
            <h2>🔗 Cüzdan Bağlanması Gereklidir</h2>
            <p>Lütfen yukarıdaki "Connect" butonunu tıklayarak cüzdan bağlayın.</p>
            <p>Test ağında (Testnet) kullanmak için Sui cüzdanınızda testnet ağını seçin.</p>
          </div>
        </div>
      ) : cars.length === 0 ? (
        <div className="no-cars">
          <div className="no-cars-message">
            <h2>🚗 Araba Yok</h2>
            <p>Henüz araban yok. Bir araba oluşturmak için aşağıdaki butonu kullan.</p>
            <button className="create-car-btn" onClick={() => showNotification('Araba oluşturma başlıyor...')}>
              🎨 İlk Arabamı Oluştur
            </button>
          </div>
        </div>
      ) : (
        <main className="app-main">
          <div className="car-selector">
            <h3>📍 Arabaların</h3>
            <div className="cars-list">
              {cars.map((car) => (
                <button
                  key={car.id}
                  className={`car-button ${selectedCar?.id === car.id ? 'active' : ''}`}
                  onClick={() => setSelectedCar(car)}
                >
                  <span className="car-name">{car.model}</span>
                  <span className="car-color" style={{ backgroundColor: car.color }}></span>
                </button>
              ))}
            </div>
          </div>

          <div className="car-section">
            {selectedCar && (
              <CarDisplay
                model={selectedCar.model}
                color={selectedCar.color}
                hasWheels={selectedCar.hasWheels}
                wheelStyle={selectedCar.wheelStyle}
                hasBumper={selectedCar.hasBumper}
                bumperShape={selectedCar.bumperShape}
              />
            )}
          </div>

          <div className="controls-section">
            {selectedCar && (
              <>
                <ColorPicker
                  currentColor={selectedCar.color}
                  onColorChange={handleColorChange}
                  isLoading={isLoading}
                />

                <PartsMarket
                  availableParts={[
                    { id: 'wheels-sport', name: 'Spor Jant', type: 'wheels', style: 'Spor' },
                    { id: 'wheels-classic', name: 'Klasik Jant', type: 'wheels', style: 'Klasik' },
                    { id: 'wheels-offset', name: 'Offset Jant', type: 'wheels', style: 'Ofset' },
                    { id: 'bumper-aggressive', name: 'Agresif Tampon', type: 'bumper', style: 'Agresif' },
                    { id: 'bumper-standard', name: 'Standart Tampon', type: 'bumper', style: 'Standart' },
                  ]}
                  installedWheels={
                    selectedCar.hasWheels
                      ? {
                          id: 'installed-wheels',
                          name: selectedCar.wheelStyle || 'Bilinmiyor',
                          type: 'wheels',
                          style: selectedCar.wheelStyle || '',
                        }
                      : undefined
                  }
                  installedBumper={
                    selectedCar.hasBumper
                      ? {
                          id: 'installed-bumper',
                          name: selectedCar.bumperShape || 'Bilinmiyor',
                          type: 'bumper',
                          style: selectedCar.bumperShape || '',
                        }
                      : undefined
                  }
                  onInstallPart={handleInstallPart}
                  onRemovePart={handleRemovePart}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        </main>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default App;
