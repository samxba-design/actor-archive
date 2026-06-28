import { useReadContract } from "wagmi";
import { CONTRACTS } from "../lib/wagmi";
import { charityVaultAbi, laughTipAbi } from "../abi/contracts";
import { StatCard } from "./StatCard";

export function ProtocolStats() {
  const enabled = Boolean(CONTRACTS.laughTip && CONTRACTS.charityVault);

  const { data: totalTips } = useReadContract({
    address: CONTRACTS.laughTip,
    abi: laughTipAbi,
    functionName: "totalTips",
    query: { enabled },
  });

  const { data: totalCharity } = useReadContract({
    address: CONTRACTS.laughTip,
    abi: laughTipAbi,
    functionName: "totalCharityRouted",
    query: { enabled },
  });

  const { data: totalMatched } = useReadContract({
    address: CONTRACTS.laughTip,
    abi: laughTipAbi,
    functionName: "totalMatched",
    query: { enabled },
  });

  const { data: laughPool } = useReadContract({
    address: CONTRACTS.laughTip,
    abi: laughTipAbi,
    functionName: "laughPoolBalance",
    query: { enabled },
  });

  const { data: vaultBalance } = useReadContract({
    address: CONTRACTS.charityVault,
    abi: charityVaultAbi,
    functionName: "balance",
    query: { enabled },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total tips" value={totalTips?.toString()} format="raw" />
      <StatCard label="Charity routed (GIGL)" value={totalCharity} />
      <StatCard label="Laugh matches paid" value={totalMatched} />
      <StatCard label="Charity vault / pool" value={vaultBalance ?? laughPool} />
    </div>
  );
}
