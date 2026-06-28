# GiggleFund Launch Guide (Testnet → Mainnet → Binance)

This is the operational playbook for launching GIGL. The codebase handles smart contracts and the tipping app; **you** handle wallets, legal, liquidity, and exchange applications.

---

## Phase 0 — Prerequisites

1. **Wallet:** MetaMask or Rabby with a dedicated deployer account  
2. **Test BNB:** [BSC testnet faucet](https://testnet.bnbchain.org/faucet-smart)  
3. **Main BNB:** For mainnet deploy + liquidity (~0.5–2 BNB depending on LP size)  
4. **BscScan API key:** [bscscan.com/apis](https://bscscan.com/apis)  
5. **WalletConnect ID:** [cloud.walletconnect.com](https://cloud.walletconnect.com) (for mobile wallets in the dApp)  
6. **Legal:** Consult a lawyer in your country about token issuance (often a foundation or LLC)

---

## Phase 1 — Testnet (do this first)

```bash
cd gigglefund
cp .env.example .env
# DEPLOYER_PRIVATE_KEY=0x...   (testnet-only key!)
npm install
npm test
npm run deploy:testnet
```

1. Verify contracts on [testnet.bscscan.com](https://testnet.bscscan.com)  
2. Copy addresses to `web/.env`  
3. Send test GIGL to friends; run through approve → tip flow  
4. Register a test creator: `LaughTip.setVerifiedCreator(address, true)`  
5. Test charity path: tip with 10% charity, confirm vault balance  

---

## Phase 2 — Mainnet deploy

**Checklist before mainnet:**

- [ ] Audit completed (or accept risk for soft launch)  
- [ ] Owner transferred to **Gnosis Safe** multisig (3-of-5 recommended)  
- [ ] Team tokens in **vesting contract** (Sablier, OpenZeppelin VestingWallet)  
- [ ] Charity partner wallets documented publicly  
- [ ] `.env` uses a **new** mainnet key (never reuse leaked test keys)  

```bash
npm run deploy:mainnet
```

### Post-deploy steps

1. **Verify** all contracts on BscScan  
2. **Renounce** or transfer ownership to multisig immediately  
3. **Publish** `deployments/deployment-56.json` on your website / GitHub  
4. **Seed laugh pool** (deploy script seeds 5%; adjust if needed)  
5. **Verify creators** sparingly — comedians, podcasters, open-mic hosts  

---

## Phase 3 — Liquidity (PancakeSwap)

Binance listings usually require healthy **DEX liquidity first** on BNB Chain.

1. Go to [pancakeswap.finance](https://pancakeswap.finance) → Liquidity  
2. Create pair **GIGL / BNB** (or GIGL / USDT)  
3. Recommended starting LP: 35% of supply + matching BNB (e.g. 350M GIGL + 10–50 BNB — you choose ratio)  
4. **Lock LP tokens** with [PinkSale](https://www.pinksale.finance) or Team Finance for 12+ months (builds trust)  
5. List contract address on [CoinGecko request form](https://www.coingecko.com/en/coins/new) and [CoinMarketCap](https://coinmarketcap.com/request/) after LP is live  

### Price discovery tip

Use a fair launch approach: fixed LP at TGE, no stealth mint, publish allocation chart.

---

## Phase 4 — Growth (real use case)

GIGL wins if people **use** it, not just hold it.

| Tactic | Implementation |
|--------|----------------|
| Open-mic nights | QR code → tipping page with venue wallet |
| Podcasts | Host reads BNB address; fans tip with reaction |
| Charity drives | “10% of every tip this week → [charity]” campaign |
| Creator verification | Application form → `setVerifiedCreator` after review |
| Leaderboard | Index `TipSent` events from BscScan API / subgraph |

Optional next builds (not in MVP):

- The Graph subgraph for tip feeds  
- Mobile app  
- Fiat on-ramp via third-party widget  

---

## Phase 5 — Binance listing path

Binance listing is **competitive and not guaranteed**. There is no public “submit token” form for spot listings — projects typically:

1. **Build traction:** $50M+ daily volume is a rough ballpark for serious consideration (varies)  
2. **Get tracked:** CoinGecko + CMC listings  
3. **Legal & compliance:** Entity, disclosures, no securities promises  
4. **Apply via channels:**  
   - [Binance Labs](https://labs.binance.com/) if you want investment + ecosystem support  
   - Binance listing application / BD outreach (requires incorporated project, audit, community metrics)  
   - [Binance Square](https://www.binance.com/en/square) for community presence first  

### What Binance tends to reject

- Hidden mint functions  
- Transfer taxes / honeypot patterns  
- Anonymous team + concentrated supply  
- No product, pure meme  

### GIGL positioning

Lead with: **gratitude payments + charity transparency + comedy creator economy on BNB Chain.**

---

## Phase 6 — Ongoing operations

| Task | Frequency |
|------|-----------|
| Charity distribution + public report | Monthly |
| Creator verification review | Weekly |
| Laugh pool refill | Quarterly (from treasury) |
| Security monitor (certik/skynet) | Continuous |
| Community AMA | Bi-weekly |

---

## Commands reference

```bash
npm test                  # Run contract tests
npm run compile           # Compile Solidity
npm run deploy:testnet    # Deploy to BSC testnet (chain 97)
npm run deploy:mainnet    # Deploy to BSC mainnet (chain 56)
npm run dev:web           # Tipping dApp on :3090
npm run build:web         # Production build
```

---

## What the agent can still do for you

In follow-up sessions, ask me to:

- Add a vesting contract + deploy script  
- Build a subgraph for the tip feed  
- Add creator application API  
- Integrate with your existing apps (e.g. actor/comedy platforms in this org)  
- Prepare CoinGecko/CMC listing copy  
- Harden contracts for audit  

You remain responsible for: **private keys, real money, legal compliance, and exchange relationships.**
