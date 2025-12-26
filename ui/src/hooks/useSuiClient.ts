import { SuiClient } from '@mysten/sui.js/client';
import { SUI_CONFIG } from '../config/blockchain';

let suiClient: SuiClient | null = null;

export function getSuiClient(): SuiClient {
  if (!suiClient) {
    suiClient = new SuiClient({ url: SUI_CONFIG.RPC_URL });
  }
  return suiClient;
}

export async function getObjectData(objectId: string) {
  const client = getSuiClient();
  try {
    const response = await client.getObject({
      id: objectId,
      options: {
        showContent: true,
        showType: true,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to get object data:', error);
    throw error;
  }
}

export async function getCarData(carId: string) {
  const client = getSuiClient();
  try {
    const response = await client.getObject({
      id: carId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    if (response.data?.content?.dataType === 'moveObject') {
      const fields = (response.data.content as any).fields;
      
      // Option veri okuma mantığı:
      // Kontraktın car.wheels ve car.bumper Option<Wheels> ve Option<Bumper> olduğundan
      // Bu veriler Vec yapısında geliyor (boş Vec = None, 1 elemanlı Vec = Some)
      
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
  } catch (error) {
    console.error('Failed to get car data:', error);
    throw error;
  }
}

export async function getOwnedObjects(address: string, type?: string) {
  const client = getSuiClient();
  try {
    const response = await client.getOwnedObjects({
      owner: address,
      filter: type ? { StructType: type } : undefined,
      options: {
        showContent: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get owned objects:', error);
    throw error;
  }
}

export async function getCars(address: string) {
  return getOwnedObjects(address, `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::Car`);
}

export async function getWheels(address: string) {
  return getOwnedObjects(address, `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::Wheels`);
}

export async function getBumpers(address: string) {
  return getOwnedObjects(address, `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::Bumper`);
}
