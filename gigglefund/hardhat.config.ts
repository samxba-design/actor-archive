import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC ?? "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: deployerKey ? [deployerKey] : [],
    },
    bsc: {
      url: process.env.BSC_MAINNET_RPC ?? "https://bsc-dataseed.binance.org",
      chainId: 56,
      accounts: deployerKey ? [deployerKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSCSCAN_API_KEY ?? "",
      bscTestnet: process.env.BSCSCAN_API_KEY ?? "",
    },
  },
};

export default config;
