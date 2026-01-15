import React from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import './WalletHeader.css';

export const WalletHeader: React.FC = () => {
  const account = useCurrentAccount();

  return (
    <div className="wallet-header">
      {account && (
        <div className="wallet-address">
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </div>
      )}
      <ConnectButton />
    </div>
  );
};
