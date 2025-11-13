import { HardhatUserConfig } from "hardhat/config";

// Deployment-specific configuration
// This file contains network-specific deployment settings

const deploymentConfig: Partial<HardhatUserConfig> = {
  networks: {
    // Production Sepolia deployment
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", // Replace with actual key
      accounts: {
        mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 1,
      },
      gasPrice: 20000000000, // 20 gwei
      gasLimit: 5000000,
      timeout: 60000, // 60 seconds
      confirmations: 2,
    },

    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
      gasLimit: 10000000,
      timeout: 60000,
    },

    // Hardhat network for testing
    hardhat: {
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
      gasLimit: 10000000,
      allowUnlimitedContractSize: true,
      mining: {
        auto: true,
        interval: 0,
      },
    },
  },

  // Deployment verification settings
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },

  // Gas reporting for deployments
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPrice: 20,
    showTimeSpent: true,
    excludeContracts: ["mocks/", "test/"],
  },
};

export default deploymentConfig;
