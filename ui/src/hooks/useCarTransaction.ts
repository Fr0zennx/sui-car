import { useCallback, useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SUI_CONFIG, CONTRACT_FUNCTIONS, GAS_BUDGET } from '../config/blockchain';

export interface TransactionResult {
  digest: string;
  status: 'success' | 'failed';
  error?: string;
}

export function useCarTransaction() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = useCallback(
    async (tx: Transaction): Promise<TransactionResult> => {
      return new Promise((resolve) => {
        setIsLoading(true);
        setError(null);

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              setIsLoading(false);
              resolve({
                digest: result.digest,
                status: 'success',
              });
            },
            onError: (err) => {
              const errorMessage = err instanceof Error ? err.message : String(err);
              setError(errorMessage);
              setIsLoading(false);
              resolve({
                digest: '',
                status: 'failed',
                error: errorMessage,
              });
            },
          }
        );
      });
    },
    [signAndExecute]
  );

  // Araba mint etme
  const mintCar = useCallback(
    async (model: string, color: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.MINT_CAR}`,
        arguments: [
          tx.pure.string(model),
          tx.pure.string(color),
        ],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Arabayı boyama
  const repaintCar = useCallback(
    async (carId: string, newColor: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.REPAINT_CAR}`,
        arguments: [
          tx.object(carId),
          tx.pure.string(newColor),
        ],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Jant oluşturma
  const createWheels = useCallback(
    async (style: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.CREATE_WHEELS}`,
        arguments: [tx.pure.string(style)],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Tampon oluşturma
  const createBumper = useCallback(
    async (shape: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.CREATE_BUMPER}`,
        arguments: [tx.pure.string(shape)],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Jant takma
  const installWheels = useCallback(
    async (carId: string, wheelsId: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.INSTALL_WHEELS}`,
        arguments: [
          tx.object(carId),
          tx.object(wheelsId),
        ],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Tampon takma
  const installBumper = useCallback(
    async (carId: string, bumperId: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.INSTALL_BUMPER}`,
        arguments: [
          tx.object(carId),
          tx.object(bumperId),
        ],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Jant çıkartma
  const removeWheels = useCallback(
    async (carId: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.REMOVE_WHEELS}`,
        arguments: [tx.object(carId)],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // Tampon çıkartma
  const removeBumper = useCallback(
    async (carId: string) => {
      const tx = new Transaction();

      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.REMOVE_BUMPER}`,
        arguments: [tx.object(carId)],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // PTB: Jant oluştur ve tak (tek işlemde)
  const createAndInstallWheels = useCallback(
    async (carId: string, style: string) => {
      const tx = new Transaction();

      // 1. Jantı oluştur
      const [newWheels] = tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.CREATE_WHEELS}`,
        arguments: [tx.pure.string(style)],
      });

      // 2. Jantı arabaya tak (ilk adımın çıktısını girdi olarak kullan)
      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.INSTALL_WHEELS}`,
        arguments: [tx.object(carId), newWheels],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  // PTB: Tampon oluştur ve tak (tek işlemde)
  const createAndInstallBumper = useCallback(
    async (carId: string, shape: string) => {
      const tx = new Transaction();

      // 1. Tamponu oluştur
      const [newBumper] = tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.CREATE_BUMPER}`,
        arguments: [tx.pure.string(shape)],
      });

      // 2. Tamponu arabaya tak (ilk adımın çıktısını girdi olarak kullan)
      tx.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.INSTALL_BUMPER}`,
        arguments: [tx.object(carId), newBumper],
      });

      return executeTransaction(tx);
    },
    [executeTransaction]
  );

  return {
    isLoading,
    error,
    mintCar,
    repaintCar,
    createWheels,
    createBumper,
    installWheels,
    installBumper,
    removeWheels,
    removeBumper,
    createAndInstallWheels,
    createAndInstallBumper,
  };
}
