import { WalletButton } from "./components/WalletButton";
import { TipForm } from "./components/TipForm";
import { ProtocolStats } from "./components/ProtocolStats";

export function App() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gigl-gold/80">BNB Smart Chain</p>
          <h1 className="font-display text-4xl text-white md:text-5xl">
            GiggleFund <span className="text-gigl-gold">GIGL</span>
          </h1>
          <p className="mt-2 max-w-xl text-white/65">
            A gratitude token for comedy & kindness — tip creators, say thank you with reactions,
            and optionally fund charity. No transfer tax. Built for real use, not memes alone.
          </p>
        </div>
        <WalletButton />
      </header>

      <section className="mt-10">
        <ProtocolStats />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TipForm />
        </div>
        <aside className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-gigl-card/60 p-5 text-sm text-white/75">
            <h3 className="font-display text-lg text-gigl-gold">Why GiggleFund?</h3>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>On-chain thank-you notes with laugh reactions</li>
              <li>You choose charity % per tip (0–50%)</li>
              <li>Verified comedians earn protocol laugh-matches</li>
              <li>Transparent CharityVault payouts on BscScan</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gigl-card/60 p-5 text-sm text-white/75">
            <h3 className="font-display text-lg text-gigl-gold">Launch path</h3>
            <p className="mt-2">
              Deploy → add liquidity on PancakeSwap → grow community → apply for Binance listing
              when metrics qualify. See <code>docs/LAUNCH_GUIDE.md</code> in the repo.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
