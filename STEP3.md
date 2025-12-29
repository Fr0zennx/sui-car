# Adım 3: Kritik Kod Blokları (Reference & Yayınlama)

## 1. Veri Okuma Mantığı (Option Deserialization)

Move kontratında `Option<Wheels>` ve `Option<Bumper>` tipinde saklanan veriler, Sui blockchain'de Vec yapısına çevrilir:
- **Boş Option (None):** `{ fields: { vec: [] } }`
- **Dolu Option (Some):** `{ fields: { vec: [{ fields: { ... } }] } }`

### Frontend Implementasyonu

Dosya: [useSuiClient.ts](src/hooks/useSuiClient.ts#L28-L55)

```typescript
export async function getCarData(carId: string) {
  const client = getSuiClient();
  const response = await client.getObject({
    id: carId,
    options: { showContent: true },
  });

  if (response.data?.content?.dataType === 'moveObject') {
    const fields = (response.data.content as any).fields;
    
    // Option veri okuma mantığı:
    // Kontraktın car.wheels ve car.bumper Option yapısından
    // Vec olarak geldiğini göz önüne alarak erişiyoruz
    
    const wheelsData = fields.wheels?.fields?.vec?.[0];
    const bumperData = fields.bumper?.fields?.vec?.[0];
    
    return {
      id: carId,
      model: fields.model,
      color: fields.color,
      hasWheels: wheelsData !== undefined,
      wheels: wheelsData,
      hasBumper: bumperData !== undefined,
      bumper: bumperData,
    };
  }
  return null;
}
```

## 2. Programmable Transaction Block (PTB) - Oluşturma + Takma

PTB, iki veya daha fazla işlemi tek bir imza ile birleştirmeyi sağlar. Bu, gas maliyetini düşürür ve işlem başarısını garanti eder.

### PTB Implementasyonu

Dosya: [useCarTransaction.ts](src/hooks/useCarTransaction.ts#L121-L170)

```typescript
// PTB: Jant oluştur ve tak (tek işlemde)
const createAndInstallWheels = useCallback(
  async (carId: string, style: string) => {
    const txBlock = new TransactionBlock();

    // 1. Jantı oluştur
    const [newWheels] = txBlock.moveCall({
      target: `${PACKAGE_ID}::garage::create_wheels`,
      arguments: [txBlock.pure.string(style)],
    });

    // 2. Jantı arabaya tak (ilk adımın çıktısını girdi olarak kullan)
    txBlock.moveCall({
      target: `${PACKAGE_ID}::garage::install_wheels`,
      arguments: [txBlock.object(carId), newWheels],
    });

    return executeTransaction(txBlock);
  },
  [executeTransaction]
);
```

### PTB Kullanımı (App.tsx)

Dosya: [App.tsx](src/App.tsx#L73-L96)

```typescript
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
    }
  } finally {
    setIsProcessing(false);
  }
};
```

## 3. Kontrat Yayınlama (Publish)

### Komutu Çalıştırma

```bash
cd sui-car
sui client publish --gas-budget 100000000
```

### Çıktı Örneği

```
Published Objects:
  PackageID: 0x601309dfba134af0a8885ee9296adc512762bac597fad2da5d08978bfda0cc99
  Version: 1
  Digest: bLu3Di9wAqkwN7mavtLLXDbcRkybEBeAwjhCFkx9QKh
```

### Config Güncelleme

Dosya: [blockchain.ts](src/config/blockchain.ts)

```typescript
export const SUI_CONFIG = {
  RPC_URL: 'https://fullnode.testnet.sui.io:443',
  PACKAGE_ID: '0x601309dfba134af0a8885ee9296adc512762bac597fad2da5d08978bfda0cc99',
  MODULE_NAME: 'garage',
  NETWORK: 'testnet' as const,
};
```

### Move.toml Güncelleme

```toml
[addresses]
car_game = "0x601309dfba134af0a8885ee9296adc512762bac597fad2da5d08978bfda0cc99"
```

## 4. Önemli Not: Move 2024 Edition Uyumluluk

Kontrat Move 2024 edition kullanıyor. Option veri mutlak kılınırken dikkat edilmesi gereken:

### Move Kontratında (car_game.move)

```move
let mut old_wheels = std::option::swap_or_fill(&mut car.wheels, new_wheels);

if (std::option::is_some(&old_wheels)) {
    let wheels = std::option::extract(&mut old_wheels);
    transfer::public_transfer(wheels, tx_context::sender(ctx));
};
```

**Önemli:** `old_wheels` değişkeni **mut** ile tanımlanmalıdır çünkü `extract` immutable referans alamaz.

## 5. UI Özelleştiği

- **Koyu Tema & Neon Mavi Detaylar:** Modern, oyun benzeri arayüz
- **Dynamic Slots:** Arabada takılı parçaları gösterir
- **Collapse Menüler:** Renk Değiştir, Jant Dükkânı, Tampon Dükkânı
- **Real-time Notification:** İşlem durumunu gösterir

## Sonraki Adımlar

1. **Event Dinleme:** `CarModifiedEvent` events'ini dinleyelim
2. **Admin Capabilities:** Parça oluşturmayı kısıtlamak için `AdminCap` ekleyelim
3. **NFT Entegrasyonu:** Arabalar birer NFT olsun
4. **Skor Sistemi:** Arabanın modifikasyon seviyesine göre skor ver

## Faydalı Linkler

- **Sui RPC:** https://fullnode.testnet.sui.io:443
- **Sui Docs:** https://docs.sui.io
- **PTB Guide:** https://docs.sui.io/guides/developer/transactions/ptb
