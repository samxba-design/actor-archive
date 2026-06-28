import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, isAddress, formatEther } from "viem";
import { CONTRACTS, REACTIONS } from "../lib/wagmi";
import { erc20Abi, laughTipAbi } from "../abi/contracts";

export function TipForm() {
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("100");
  const [charityPercent, setCharityPercent] = useState(10);
  const [reaction, setReaction] = useState(1);
  const [message, setMessage] = useState("Thanks for the laughs!");
  const [step, setStep] = useState<"idle" | "approve" | "tip">("idle");

  const contractsReady = CONTRACTS.token && CONTRACTS.laughTip;

  const { data: balance } = useReadContract({
    address: CONTRACTS.token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && CONTRACTS.token) },
  });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const parsedAmount = (() => {
    try {
      return parseEther(amount || "0");
    } catch {
      return 0n;
    }
  })();

  const charityBps = Math.min(50, Math.max(0, charityPercent)) * 100;

  async function handleApprove() {
    if (!CONTRACTS.token || !CONTRACTS.laughTip || parsedAmount === 0n) return;
    setStep("approve");
    writeContract({
      address: CONTRACTS.token,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACTS.laughTip, parsedAmount],
    });
  }

  async function handleTip() {
    if (!CONTRACTS.laughTip || !isAddress(recipient) || parsedAmount === 0n) return;
    setStep("tip");
    writeContract({
      address: CONTRACTS.laughTip,
      abi: laughTipAbi,
      functionName: "tip",
      args: [recipient as `0x${string}`, parsedAmount, charityBps, reaction, message],
    });
  }

  if (!contractsReady) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold text-amber-200">Contracts not configured</p>
        <p className="mt-2 text-white/70">
          Deploy with <code className="text-gigl-gold">npm run deploy:testnet</code> and copy
          addresses into <code className="text-gigl-gold">web/.env</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gigl-card/90 p-6 shadow-xl">
      <h2 className="font-display text-2xl text-gigl-gold">Send a Laugh Tip</h2>
      <p className="mt-1 text-sm text-white/60">
        Thank a comedian or friend. Optional charity slice. Verified creators get a protocol match.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="text-white/70">Recipient wallet</span>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x…"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-gigl-gold"
          />
        </label>

        <label className="block text-sm">
          <span className="text-white/70">Amount (GIGL)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-gigl-gold"
          />
          {balance !== undefined && (
            <span className="mt-1 block text-xs text-white/40">
              Balance: {Number(formatEther(balance)).toLocaleString()} GIGL
            </span>
          )}
        </label>

        <label className="block text-sm">
          <span className="text-white/70">Charity share: {charityPercent}%</span>
          <input
            type="range"
            min={0}
            max={50}
            value={charityPercent}
            onChange={(e) => setCharityPercent(Number(e.target.value))}
            className="mt-2 w-full accent-gigl-gold"
          />
        </label>

        <div>
          <span className="text-sm text-white/70">Reaction</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {REACTIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReaction(r.id)}
                className={`rounded-full px-4 py-2 text-sm ${
                  reaction === r.id
                    ? "bg-gigl-gold text-gigl-dark"
                    : "border border-white/10 bg-black/20"
                }`}
              >
                {r.emoji} {r.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-sm">
          <span className="text-white/70">Thank-you note</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={280}
            rows={3}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-gigl-gold"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!isConnected || isPending || confirming}
          onClick={handleApprove}
          className="rounded-full border border-gigl-gold/50 px-5 py-2 text-sm hover:bg-gigl-gold/10 disabled:opacity-50"
        >
          1. Approve GIGL
        </button>
        <button
          type="button"
          disabled={
            !isConnected || !isAddress(recipient) || isPending || confirming || parsedAmount === 0n
          }
          onClick={handleTip}
          className="rounded-full bg-gigl-gold px-5 py-2 text-sm font-semibold text-gigl-dark hover:brightness-110 disabled:opacity-50"
        >
          2. Send Tip
        </button>
      </div>

      {(isPending || confirming) && (
        <p className="mt-4 text-sm text-white/60">
          {step === "approve" ? "Approving…" : "Sending tip…"}
        </p>
      )}
      {isSuccess && (
        <p className="mt-4 text-sm text-emerald-400">Success! Joy transmitted on-chain.</p>
      )}
      {error && <p className="mt-4 text-sm text-red-400">{error.message}</p>}
    </div>
  );
}
