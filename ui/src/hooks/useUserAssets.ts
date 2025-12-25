import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getCars, getWheels, getBumpers, getCarData } from './useSuiClient';

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
  shape: string;
}

export function useUserAssets() {
  const account = useCurrentAccount();
  const [cars, setCars] = useState<CarObject[]>([]);
  const [wheels, setWheels] = useState<WheelsObject[]>([]);
  const [bumpers, setBumpers] = useState<BumperObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setCars([]);
      setWheels([]);
      setBumpers([]);
      return;
    }

    const fetchAssets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch cars
        const carsData = await getCars(account.address);
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

        setCars(parsedCars);

        // Fetch wheels
        const wheelsData = await getWheels(account.address);
        const parsedWheels: WheelsObject[] = wheelsData.map((w) => ({
          id: w.data?.objectId || '',
          style: (w.data?.content as any)?.fields?.style || '',
        }));
        setWheels(parsedWheels);

        // Fetch bumpers
        const bumpersData = await getBumpers(account.address);
        const parsedBumpers: BumperObject[] = bumpersData.map((b) => ({
          id: b.data?.objectId || '',
          shape: (b.data?.content as any)?.fields?.shape || '',
        }));
        setBumpers(parsedBumpers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assets';
        setError(errorMessage);
        console.error('Error fetching assets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [account?.address]);

  const refreshAssets = async () => {
    if (!account?.address) return;

    setIsLoading(true);
    try {
      const carsData = await getCars(account.address);
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

      setCars(parsedCars);
    } catch (err) {
      console.error('Error refreshing assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cars,
    wheels,
    bumpers,
    isLoading,
    error,
    refreshAssets,
  };
}
