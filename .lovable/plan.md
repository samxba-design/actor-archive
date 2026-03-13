

# Add Real Client Logos to Demo Pages

## What

Update the `mockClients` arrays in all three demo data files to use recognizable, industry-appropriate company names that map to real logos via the existing Clearbit lookup in `companyLogos.ts`.

## Changes

### 1. `src/data/demoScreenwriterData.ts` (Screenwriter — studios & streamers)
Replace `mockClients` with:
```
["Universal", "Disney", "Amazon Studios", "HBO", "Netflix", "A24", "Paramount", "Apple TV+"]
```

### 2. `src/data/demoActorData.ts` (Actor — same entertainment industry)
Replace `mockClients` with:
```
["Warner Bros", "Universal", "Disney", "Amazon Studios", "HBO", "Apple TV+", "Netflix", "Searchlight"]
```

### 3. `src/data/demoCopywriterData.ts` (Copywriter — corporate/tech clients)
Replace `mockClients` with:
```
["Apple", "Microsoft", "Shopify", "HubSpot", "Stripe", "Notion", "Salesforce", "Slack"]
```

All these names already exist in `COMPANY_DOMAINS` so Clearbit logos will resolve automatically. No other file changes needed — the demo pages already render `mockClients` via `ClientLogosWithToggle`.

> **Note**: There is no journalist demo page currently, so no changes needed there. If one is added later, appropriate publications (NYT, The Guardian, WSJ) can be added then.

