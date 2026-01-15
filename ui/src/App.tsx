import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletHeader } from './components/WalletHeader';
import { useCarTransaction } from './hooks/useCarTransaction';
import { useUserAssets, CarObject } from './hooks/useUserAssets';
import ModelViewer from './components/ModelViewer';
import LightRays from './components/LightRays';
import { Wrench, X, ChevronDown, Palette, Plus, Package } from 'lucide-react';
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
    repaintCar, 
    removeWheels, 
    removeBumper, 
    createWheels,
    createBumper,
    installWheels,
    installBumper,
    mintCar 
  } = useCarTransaction();
  const { cars, wheels, bumpers, refreshAssets } = useUserAssets();
  
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
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await repaintCar(selectedCar.id, newColor);
      if (result.status === 'success') {
        showNotification(`Car color changed!`, 'success');
        setSelectedCar((prev) => prev ? { ...prev, color: newColor } : null);
        setTimeout(() => refreshAssets(), 1500);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error changing color!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Create new wheels (add to inventory)
  const handleCreateWheels = async (part: Part) => {
    if (!account?.address) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      showNotification(`Creating ${part.name}...`, 'info');
      const result = await createWheels(part.style);
      
      if (result.status === 'success') {
        showNotification(`${part.name} added to your inventory!`, 'success');
        setTimeout(() => refreshAssets(), 2000);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error creating wheels!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Install wheels to car
  const handleInstallWheels = async (wheelId: string, style: string) => {
    if (!selectedCar || !account?.address) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      showNotification(`Installing wheels...`, 'info');
      const result = await installWheels(selectedCar.id, wheelId);
      
      if (result.status === 'success') {
        showNotification(`Wheels installed successfully!`, 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasWheels: true, wheelStyle: style } : null
        );
        setTimeout(() => refreshAssets(), 2000);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error installing wheels!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Create new bumper (add to inventory)
  const handleCreateBumper = async (part: Part) => {
    if (!account?.address) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      showNotification(`Creating ${part.name}...`, 'info');
      const result = await createBumper(part.style);
      
      if (result.status === 'success') {
        showNotification(`${part.name} added to your inventory!`, 'success');
        setTimeout(() => refreshAssets(), 2000);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error creating bumper!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Install bumper to car
  const handleInstallBumper = async (bumperId: string, material: string) => {
    if (!selectedCar || !account?.address) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      showNotification(`Installing bumper...`, 'info');
      const result = await installBumper(selectedCar.id, bumperId);
      
      if (result.status === 'success') {
        showNotification(`Bumper installed successfully!`, 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasBumper: true, bumperShape: material } : null
        );
        setTimeout(() => refreshAssets(), 2000);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error installing bumper!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveWheels = async () => {
    if (!selectedCar || !account?.address) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await removeWheels(selectedCar.id);
      if (result.status === 'success') {
        showNotification('Wheels removed successfully!', 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasWheels: false, wheelStyle: undefined } : null
        );
        setTimeout(() => refreshAssets(), 1000);
      } else {
        showNotification('Failed to remove wheels', 'error');
      }
    } catch (error) {
      showNotification('Error removing wheels!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBumper = async () => {
    if (!selectedCar || !account?.address) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await removeBumper(selectedCar.id);
      if (result.status === 'success') {
        showNotification('Bumper removed successfully!', 'success');
        setSelectedCar((prev) => 
          prev ? { ...prev, hasBumper: false, bumperShape: undefined } : null
        );
        setTimeout(() => refreshAssets(), 1000);
      } else {
        showNotification('Failed to remove bumper', 'error');
      }
    } catch (error) {
      showNotification('Error removing bumper!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMintCar = async () => {
    setIsProcessing(true);
    try {
      const result = await mintCar('classic car', '#FF0000');
      if (result.status === 'success') {
        showNotification('Car created successfully!', 'success');
        setTimeout(() => refreshAssets(), 1500);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification('Error creating car!', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const colorOptions = [
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0080FF' },
    { name: 'Green', value: '#00FF00' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Orange', value: '#FF8000' },
    { name: 'Purple', value: '#8000FF' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
  ];

  const wheelOptions: Part[] = [
    { name: 'Sport Wheels', style: 'Sport' },
    { name: 'Classic Wheels', style: 'Classic' },
    { name: 'Offset Wheels', style: 'Offset' },
  ];

  const bumperOptions: Part[] = [
    { name: 'Aggressive Bumper', style: 'Aggressive' },
    { name: 'Standard Bumper', style: 'Standard' },
  ];

  return (
    <div className="app-container">
      {/* Light Rays Effect - Top */}
      <div className="light-rays-wrapper">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00d9ff"
          raysSpeed={0.8}
          lightSpread={1.2}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.05}
          distortion={0.03}
          fadeDistance={1.2}
          saturation={1.2}
        />
      </div>

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
            defaultZoom={0.5}
            minZoomDistance={0.3}
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
            carColor={selectedCar?.color || '#FF0000'}
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
              <p>Connect wallet to customize your car</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="tuning-empty">
              <p>You don't have a car yet</p>
              <button 
                className="mint-btn"
                onClick={handleMintCar}
                disabled={isProcessing}
              >
                ✨ Create Car
              </button>
            </div>
          ) : (
            <>
              {/* Color Picker */}
              <div className="menu-item">
                <button
                  className={`menu-header ${showMenu === 'color' ? 'open' : ''}`}
                  onClick={() => setShowMenu(showMenu === 'color' ? null : 'color')}
                >
                  <Palette size={18} />
                  <span>Color</span>
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
                  <span>Wheels</span>
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
                        <span>Remove Wheels</span>
                      </button>
                    ) : (
                      <>
                        {/* Available wheels */}
                        {wheels.length > 0 && (
                          <div className="inventory-section">
                            <div className="section-title">
                              <Package size={14} />
                              <span>Inventory Wheels</span>
                            </div>
                            <div className="parts-list">
                              {wheels.map((wheel) => (
                                <button
                                  key={wheel.id}
                                  className="part-btn inventory-item"
                                  onClick={() => handleInstallWheels(wheel.id, wheel.style)}
                                  disabled={isProcessing}
                                >
                                  <span>{wheel.style}</span>
                                  <span className="part-icon">→</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Create new wheels */}
                        <div className="create-section">
                          <div className="section-title">
                            <Plus size={14} />
                            <span>Create New Wheels</span>
                          </div>
                          <div className="parts-list">
                            {wheelOptions.map((part) => (
                              <button
                                key={part.style}
                                className="part-btn create-btn"
                                onClick={() => handleCreateWheels(part)}
                                disabled={isProcessing}
                              >
                                <span>{part.name}</span>
                                <span className="part-icon">+</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Loading */}
              {isProcessing && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <span>Processing...</span>
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
