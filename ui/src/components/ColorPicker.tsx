import React, { useState } from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  isLoading?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorChange,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState(currentColor);

  const colors = [
    { name: 'Kırmızı', value: '#FF0000' },
    { name: 'Mavi', value: '#0000FF' },
    { name: 'Yeşil', value: '#00FF00' },
    { name: 'Sarı', value: '#FFFF00' },
    { name: 'Siyah', value: '#000000' },
    { name: 'Beyaz', value: '#FFFFFF' },
    { name: 'Mor', value: '#800080' },
    { name: 'Turuncu', value: '#FFA500' },
    { name: 'Pembe', value: '#FFC0CB' },
    { name: 'Cyan', value: '#00FFFF' },
  ];

  const handleColorClick = (value: string) => {
    setInputValue(value);
    onColorChange(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    onColorChange(inputValue);
  };

  return (
    <div className="color-picker">
      <h3>🎨 Rengini Seç</h3>
      
      <div className="color-grid">
        {colors.map((color) => (
          <button
            key={color.value}
            className={`color-button ${currentColor === color.value ? 'active' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorClick(color.value)}
            title={color.name}
            disabled={isLoading}
          >
            {currentColor === color.value && '✓'}
          </button>
        ))}
      </div>

      <div className="custom-color">
        <label htmlFor="color-input">Özel Renk:</label>
        <input
          id="color-input"
          type="color"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
