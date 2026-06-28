import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "";

export const chains = [bscTestnet, bsc] as const;

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId, showQrModal: true })] : []),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
});

export const CONTRACTS = {
  token: import.meta.env.VITE_GIGL_TOKEN_ADDRESS as `0x${string}` | undefined,
  laughTip: import.meta.env.VITE_LAUGH_TIP_ADDRESS as `0x${string}` | undefined,
  charityVault: import.meta.env.VITE_CHARITY_VAULT_ADDRESS as `0x${string}` | undefined,
};

export const REACTIONS = [
  { id: 0, label: "Thanks", emoji: "🙏" },
  { id: 1, label: "Laugh", emoji: "😂" },
  { id: 2, label: "Fire", emoji: "🔥" },
  { id: 3, label: "Clap", emoji: "👏" },
  { id: 4, label: "Heart", emoji: "❤️" },
] as const;
