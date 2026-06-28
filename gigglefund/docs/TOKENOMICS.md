# GiggleFund (GIGL) Tokenomics

## Mission

GIGL is a **utility gratitude token**: its primary job is to move value between fans, comedians/creators, and charity — with public, verifiable on-chain receipts (tips, reactions, vault balance).

## Supply

| Parameter | Value |
|-----------|-------|
| Max supply | 1,000,000,000 GIGL |
| Decimals | 18 |
| Inflation | None (fixed cap) |
| Transfer tax | **0%** (important for CEX compatibility) |

## Recommended initial allocation

Allocate at deploy time from the owner treasury wallet:

| Bucket | % | Purpose |
|--------|---|---------|
| Liquidity (PancakeSwap) | 35% | Trading pair GIGL/BNB or GIGL/USDT |
| Laugh-match pool | 5% | Seeded into `LaughTip` (deploy script defaults to 5%) |
| Community rewards | 20% | Creator grants, laugh leaderboards, airdrops |
| Charity treasury | 15% | Periodic vault top-ups + matched campaigns |
| Ecosystem / partnerships | 10% | Comedy venues, festivals, integrations |
| Team | 10% | **2-year linear vesting** (use vesting contract) |
| Reserve | 5% | Emergency / future listings |

> Adjust percentages to your launch strategy; keep team + insider allocations transparent.

## How value flows (unique mechanics)

### 1. Laugh Tips (core utility)

User calls `LaughTip.tip(recipient, amount, charityBps, reaction, message)`:

1. GIGL moves from tipper → protocol  
2. `charityBps` (0–5000) → `CharityVault`  
3. If recipient is **verified creator**, laugh pool adds up to `matchBps` (default 10%, max 25%)  
4. Remainder → recipient  

**Example:** 1,000 GIGL tip, 10% charity, verified creator, 10% match  
- Charity: 100 GIGL  
- Match from pool: 90 GIGL  
- Creator receives: 990 GIGL  

### 2. Charity Vault

- Holds donated GIGL  
- Owner (multisig) calls `distribute(charityWallet, amount, cause)`  
- Every payout emits an on-chain event for transparency  

Partner with registered nonprofits (comedy therapy, mental health, arts education) and publish wallet addresses.

### 3. Laugh-match pool

- Funded at deploy + optional top-ups via `GiggleFund.fundLaughPool`  
- Rewards **verified** comedians only (anti-spam)  
- Owner sets `matchBps` ≤ 25%  

### 4. Deflation (optional)

`GiggleFund` is burnable — community can burn GIGL for memorial campaigns or supply reduction events.

## What we deliberately avoided

- **No reflection / passive yield** — regulatory gray area  
- **No hidden transfer tax** — blocks many CEX listings  
- **No “laugh mining” oracle** — off-chain “did they laugh?” is gameable; tips + reactions are honest signals  

## Governance roadmap (post-MVP)

1. Multisig owner → community multisig  
2. On-chain proposals for: match rate, verified creator list, charity disbursements  
3. Snapshot for off-chain signaling before votes  

## Metrics that matter for Binance

Binance does not publish fixed thresholds, but historically considers:

- Daily active on-chain users & transaction count  
- Liquidity depth & spread  
- Market cap & holder distribution (avoid concentrated insider wallets)  
- Legal clarity & audit status  
- Real product (this dApp + integrations)  

GIGL’s story: **gratitude + comedy + charity with measurable on-chain tips** — stronger than a pure meme.
