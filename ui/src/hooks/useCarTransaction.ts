import { useCallback, useState } from 'react';
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_CONFIG, CONTRACT_FUNCTIONS, GAS_BUDGET } from '../config/blockchain';

export interface TransactionResult {
  digest: string;
  status: 'success' | 'failed';
  error?: string;
}

export function useCarTransaction() {
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = useCallback(
    async (txBlock: TransactionBlock): Promise<TransactionResult> => {
      return new Promise((resolve) => {
        setIsLoading(true);
        setError(null);

        signAndExecute(
          { transactionBlock: txBlock },
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
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.MINT_CAR}`,
        arguments: [
          txBlock.pure.string(model),
          txBlock.pure.string(color),
        ],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Arabayı boyama
  const repaintCar = useCallback(
    async (carId: string, newColor: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.REPAINT_CAR}`,
        arguments: [
          txBlock.object(carId),
          txBlock.pure.string(newColor),
        ],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Jant oluşturma
  const createWheels = useCallback(
    async (style: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.CREATE_WHEELS}`,
        arguments: [txBlock.pure.string(style)],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Tampon oluşturma
  const createBumper = useCallback(
    async (shape: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.CREATE_BUMPER}`,
        arguments: [txBlock.pure.string(shape)],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Jant takma
  const installWheels = useCallback(
    async (carId: string, wheelsId: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.INSTALL_WHEELS}`,
        arguments: [
          txBlock.object(carId),
          txBlock.object(wheelsId),
        ],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Tampon takma
  const installBumper = useCallback(
    async (carId: string, bumperId: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.INSTALL_BUMPER}`,
        arguments: [
          txBlock.object(carId),
          txBlock.object(bumperId),
        ],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Jant çıkartma
  const removeWheels = useCallback(
    async (carId: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.REMOVE_WHEELS}`,
        arguments: [txBlock.object(carId)],
      });

      return executeTransaction(txBlock);
    },
    [executeTransaction]
  );

  // Tampon çıkartma
  const removeBumper = useCallback(
    async (carId: string) => {
      const txBlock = new TransactionBlock();

      txBlock.moveCall({
        target: `${SUI_CONFIG.PACKAGE_ID}::${SUI_CONFIG.MODULE_NAME}::${CONTRACT_FUNCTIONS.REMOVE_BUMPER}`,
        arguments: [txBlock.object(carId)],
      });

      return executeTransaction(txBlock);
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
  };
}
