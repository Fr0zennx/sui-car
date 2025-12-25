import React from 'react'
import ReactDOM from 'react-dom/client'
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui.js/client'
import '@mysten/dapp-kit/dist/index.css'
import App from './App.tsx'

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider>
        <App />
      </WalletProvider>
    </SuiClientProvider>
  </React.StrictMode>,
)
