import React, { ReactNode } from 'react';
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import './WalletHeader.css';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletHeader: React.FC = () => {
  const account = useCurrentAccount();

  return (
    <div className="wallet-header">
      <div className="wallet-info">
        {account ? (
          <>
            <span className="status connected">✓ Connected</span>
            <span className="address">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
          </>
        ) : (
          <span className="status disconnected">⚠ Disconnected</span>
        )}
      </div>
      <ConnectButton />
    </div>
  );
};
