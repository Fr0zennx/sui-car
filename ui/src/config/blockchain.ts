// Sui blockchain configuration
export const SUI_CONFIG = {
  // Testnet RPC endpoint
  RPC_URL: 'https://fullnode.testnet.sui.io:443',
  
  // Package ID - bu değer contract deploy ettikten sonra güncellenmeli
  PACKAGE_ID: '0x0', // Placeholder - update after deployment
  
  // Module name
  MODULE_NAME: 'garage',
  
  // Network
  NETWORK: 'testnet' as const,
};

// Contract function names
export const CONTRACT_FUNCTIONS = {
  MINT_CAR: 'mint_car',
  REPAINT_CAR: 'repaint_car',
  CREATE_WHEELS: 'create_wheels',
  CREATE_BUMPER: 'create_bumper',
  INSTALL_WHEELS: 'install_wheels',
  INSTALL_BUMPER: 'install_bumper',
  REMOVE_WHEELS: 'remove_wheels',
  REMOVE_BUMPER: 'remove_bumper',
} as const;

// Gas budget
export const GAS_BUDGET = 100_000_000; // 0.1 SUI
