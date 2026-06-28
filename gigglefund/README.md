# GiggleFund (GIGL)

**Say thank you with laughter.** GiggleFund is a BNB Smart Chain (BEP-20) token built for tipping comedians, creators, and friends — with optional charity splits and protocol-funded “laugh matches” for verified performers.

> Built as a standalone project inside this repo at `gigglefund/`. Contracts target BNB Chain (Binance ecosystem).

## Why this name & structure?

| Idea | How GIGL implements it |
|------|------------------------|
| Say thank you | On-chain tips with a 280-char message + reaction (😂🔥👏❤️🙏) |
| Comedy / joy | Laugh-match pool boosts verified creators when fans tip |
| Charity | Tipper chooses 0–50% to `CharityVault` per tip — voluntary, transparent |
| Exchange-friendly | **No transfer tax** (Binance and other CEXs often reject taxed tokens) |

## Project layout

```
gigglefund/
├── contracts/          # Solidity (GIGL token, LaughTip, CharityVault)
├── scripts/deploy.ts   # One-command deploy + address export
├── test/               # Hardhat tests
├── web/                # Vite + React tipping dApp
└── docs/               # Tokenomics & launch playbook
```

## Quick start

### 1. Install

```bash
cd gigglefund
npm install
cd web && npm install && cd ..
```

### 2. Configure

```bash
cp .env.example .env
# Add DEPLOYER_PRIVATE_KEY (testnet wallet with tBNB)
# Add BSCSCAN_API_KEY for verification (optional)
```

### 3. Test contracts

```bash
npm test
```

### 4. Deploy to BNB testnet

```bash
npm run deploy:testnet
```

Copy addresses from `deployments/deployment-97.json` into `web/.env`:

```
VITE_GIGL_TOKEN_ADDRESS=0x...
VITE_LAUGH_TIP_ADDRESS=0x...
VITE_CHARITY_VAULT_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=...   # from cloud.walletconnect.com
```

### 5. Run the dApp

```bash
npm run dev:web
```

Open http://localhost:3090, connect MetaMask on **BSC Testnet**, approve GIGL, send a tip.

## What I (the agent) built vs what you must do

| Done in repo | Requires you (human/legal) |
|--------------|----------------------------|
| Token + tipping + charity contracts | Fund deployer wallet with BNB |
| Tests & deploy scripts | Deploy to mainnet when ready |
| Web tipping UI | WalletConnect project ID |
| Tokenomics & Binance launch guide | Legal entity, KYC, audits |
| | PancakeSwap liquidity |
| | Binance listing application |

See **`docs/LAUNCH_GUIDE.md`** for the full mainnet → Binance path.

## Token summary

- **Name:** GiggleFund  
- **Symbol:** GIGL  
- **Chain:** BNB Smart Chain (BEP-20)  
- **Supply:** 1,000,000,000 (fixed, burnable)  
- **Details:** `docs/TOKENOMICS.md`

## Security

This is an MVP codebase, **not audited**. Before mainnet:

1. Professional smart contract audit  
2. Multisig (Gnosis Safe) as contract owner  
3. Timelock on parameter changes  
4. Legal review in your jurisdiction  

## License

MIT
