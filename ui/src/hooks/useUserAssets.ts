import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getCars, getCarData, getWheels, getBumpers } from './useSuiClient';

export interface CarObject {
  id: string;
  model: string;
  color: string;
  hasWheels: boolean;
  wheelStyle?: string;
  hasBumper: boolean;
  bumperShape?: string;
}

export interface WheelsObject {
  id: string;
  style: string;
}

export interface BumperObject {
  id: string;
  material: string;
}

export function useUserAssets() {
  const account = useCurrentAccount();
  const [cars, setCars] = useState<CarObject[]>([]);
  const [wheels, setWheels] = useState<WheelsObject[]>([]);
  const [bumpers, setBumpers] = useState<BumperObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCars = async (address: string) => {
    const carsData = await getCars(address);
    const parsedCars: CarObject[] = [];

    for (const car of carsData) {
      if (car.data?.objectId) {
        try {
          const carData = await getCarData(car.data.objectId);
          if (carData) {
            parsedCars.push({
              id: car.data.objectId,
              model: carData.model || 'Unknown',
              color: carData.color || '#FF0000',
              hasWheels: carData.wheels?.vec?.length > 0 || false,
              wheelStyle: carData.wheels?.vec?.[0]?.fields?.style,
              hasBumper: carData.bumper?.vec?.length > 0 || false,
              bumperShape: carData.bumper?.vec?.[0]?.fields?.shape,
            });
          }
        } catch (err) {
          console.error('Error fetching car data:', err);
        }
      }
    }
    return parsedCars;
  };

  const fetchWheels = async (address: string) => {
    const wheelsData = await getWheels(address);
    const parsedWheels: WheelsObject[] = [];

    for (const wheel of wheelsData) {
      if (wheel.data?.objectId && wheel.data?.content?.dataType === 'moveObject') {
        const fields = (wheel.data.content as any).fields;
        parsedWheels.push({
          id: wheel.data.objectId,
          style: fields.style || 'Unknown',
        });
      }
    }
    return parsedWheels;
  };

  const fetchBumpers = async (address: string) => {
    const bumpersData = await getBumpers(address);
    const parsedBumpers: BumperObject[] = [];

    for (const bumper of bumpersData) {
      if (bumper.data?.objectId && bumper.data?.content?.dataType === 'moveObject') {
        const fields = (bumper.data.content as any).fields;
        parsedBumpers.push({
          id: bumper.data.objectId,
          material: fields.material || 'Unknown',
        });
      }
    }
    return parsedBumpers;
  };

  useEffect(() => {
    if (!account?.address) {
      setCars([]);
      setWheels([]);
      setBumpers([]);
      return;
    }

    const loadAssets = async () => {
      setIsLoading(true);
      try {
        const [parsedCars, parsedWheels, parsedBumpers] = await Promise.all([
          fetchCars(account.address),
          fetchWheels(account.address),
          fetchBumpers(account.address),
        ]);
        setCars(parsedCars);
        setWheels(parsedWheels);
        setBumpers(parsedBumpers);
      } catch (err) {
        console.error('Error fetching assets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [account?.address]);

  const refreshAssets = async () => {
    if (!account?.address) return;

    setIsLoading(true);
    try {
      const [parsedCars, parsedWheels, parsedBumpers] = await Promise.all([
        fetchCars(account.address),
        fetchWheels(account.address),
        fetchBumpers(account.address),
      ]);
      setCars(parsedCars);
      setWheels(parsedWheels);
      setBumpers(parsedBumpers);
    } catch (err) {
      console.error('Error refreshing assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { cars, wheels, bumpers, isLoading, refreshAssets };
}
