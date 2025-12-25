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
      return {
        model: fields.model,
        color: fields.color,
        wheels: fields.wheels,
        bumper: fields.bumper,
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
