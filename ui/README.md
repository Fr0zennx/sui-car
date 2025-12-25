# 🏎️ Sui Car Garage - UI Layer

## Step 2: UI Görselleştirme (Garaj Ekranı)

Bu katman, Sui blockchain üzerinde yapılan araç modifikasyonlarını görselleştiren bir React + TypeScript arayüzüdür.

### 🎯 Özellikler

#### 1. **Renk Seçici (Color Picker)**
- 10 farklı hazır renk seçeneği
- Özel HEX renk girişi
- Anlık araba görseli güncellemesi
- `repaint_car` blockchain fonksiyonu entegrasyonu

#### 2. **Parça Market (Parts Market)**
- **Jantlar**: Spor, Klasik, Ofset
- **Tamponlar**: Agresif, Standart
- Satın al & tak işlemi
- Takılı parçaları göster
- Parçaları çıkartma özelliği

#### 3. **Araba Görsel (Car Display)**
- SVG ile çizilmiş animasyonlu araba
- Renk değişiklikleri anlık olarak yansıtılır
- Jant seçimine göre stil değişimi
- Tampon takılıysa ekranda görünür
- Özellikler paneli (Model, Renk, Takılı Parçalar)

### 🛠️ Kurulum

```bash
cd ui
npm install
```

### 🚀 Geliştirme Sunucusu

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresine gidin

### 📦 Üretim İçin Build

```bash
npm run build
```

### 📁 Proje Yapısı

```
ui/
├── src/
│   ├── components/
│   │   ├── CarDisplay.tsx      # Araba görseli & özellikler
│   │   ├── ColorPicker.tsx     # Renk seçim arayüzü
│   │   └── PartsMarket.tsx     # Parça pazarı
│   ├── App.tsx                 # Ana uygulama
│   ├── App.css                 # Stil dosyası
│   └── main.tsx                # Giriş noktası
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 🔗 Blockchain Entegrasyonu (Step 3'te yapılacak)

Şu anda UI mock data ile çalışıyor. Blockchain entegrasyonu için:

```typescript
// Gelecekte @mysten/sui.js kullanılacak
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
```

### 🎨 Tasarım Sistemi

- **Renk Şeması**: Mor-Gradient (#667eea → #764ba2)
- **Tipografi**: System Font Stack
- **Responsive**: Mobile-first tasarım
- **Animasyonlar**: Smooth transitions & drop shadows

### 📱 Responsive Breakpoints

- **Masaüstü**: 1400px max-width, 2-kolon grid
- **Tablet**: 1024px'dan aşağı, 1-kolon
- **Mobil**: 768px'dan aşağı, optimized layout

### 🔧 Teknoloji Stack

- **React 18.2** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS3** - Styling (Grid, Flexbox, Animations)

### 📝 Notlar

1. Şu anki implementasyon frontend-only (mock data)
2. Backend Move modules'ün Sui blockchain'e deploy edilmesi gerekli
3. Step 3'te `@mysten/sui.js` kütüphanesi entegre edilecek
4. Wallet bağlantısı ve transaction imzalama eklenecek

### 🚦 Sonraki Adımlar (Step 3)

1. Sui blockchain'e bağlanma
2. Move contract'larını çağırma
3. Wallet authentication
4. Transaction signing & confirmation
5. Blockchain state'ini UI'da reflect etme
