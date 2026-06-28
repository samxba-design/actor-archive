export const laughTipAbi = [
  {
    type: "function",
    name: "tip",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "charityBps", type: "uint16" },
      { name: "reaction", type: "uint8" },
      { name: "message", type: "string" },
    ],
    outputs: [{ name: "tipId", type: "bytes32" }],
  },
  {
    type: "function",
    name: "totalTips",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalCharityRouted",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalMatched",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "laughPoolBalance",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "TipSent",
    inputs: [
      { name: "tipId", type: "bytes32", indexed: true },
      { name: "tipper", type: "address", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "netToRecipient", type: "uint256", indexed: false },
      { name: "charityAmount", type: "uint256", indexed: false },
      { name: "matchAmount", type: "uint256", indexed: false },
      { name: "reaction", type: "uint8", indexed: false },
      { name: "message", type: "string", indexed: false },
    ],
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

export const charityVaultAbi = [
  {
    type: "function",
    name: "totalReceived",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalDistributed",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "balance",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;
