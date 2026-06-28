import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-full border border-gigl-gold/40 bg-gigl-card px-4 py-2 text-sm hover:border-gigl-gold"
      >
        {address.slice(0, 6)}…{address.slice(-4)}
      </button>
    );
  }

  const connector = connectors[0];
  return (
    <button
      type="button"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
      className="rounded-full bg-gigl-gold px-5 py-2 text-sm font-semibold text-gigl-dark hover:brightness-110 disabled:opacity-50"
    >
      {isPending ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
