import { formatEther } from "viem";

type StatProps = {
  label: string;
  value?: bigint | number | string;
  format?: "ether" | "raw";
  suffix?: string;
};

export function StatCard({ label, value, format = "ether", suffix }: StatProps) {
  const display = (() => {
    if (value === undefined) return "—";
    if (format === "raw") return `${value}${suffix ?? ""}`;
    return `${Number(formatEther(value as bigint)).toLocaleString()}${suffix ?? ""}`;
  })();

  return (
    <div className="rounded-2xl border border-white/10 bg-gigl-card/80 p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
      <p className="mt-2 font-display text-2xl text-gigl-gold">{display}</p>
    </div>
  );
}
