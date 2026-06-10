import { useState, useCallback } from "react";
import { RefreshCw, Zap, TrendingDown, Globe, AlertTriangle, Monitor, Megaphone, BarChart2, Users } from "lucide-react";
import { MetricCard } from "./components/MetricCard";
import { NewsFeed } from "./components/NewsFeed";
import { CompetitorCard } from "./components/CompetitorCard";

const TABS = [
  { id: "tech", label: "TECHNOLOGIE", icon: Zap },
  { id: "ux", label: "UI / UX", icon: Monitor },
  { id: "marketing", label: "MARKETING", icon: Megaphone },
  { id: "concurrents", label: "CONCURRENTS", icon: BarChart2 },
  { id: "business", label: "BUSINESS", icon: Globe },
] as const;

type TabId = (typeof TABS)[number]["id"];

const GOOGLE_ALERTS_FEEDS = [
  {
    url: "https://www.google.fr/alerts/feeds/02890367829515322703/9679654097049950038",
    name: "G.ALERT #1",
  },
  // Ajoutez vos autres flux Google Alerts ici
];

const FEED_SOURCES: Record<TabId, Array<{ url: string; name: string }>> = {
  tech: [
    ...GOOGLE_ALERTS_FEEDS,
    { url: "https://electrek.co/tag/tesla/feed/", name: "ELECTREK" },
    { url: "https://www.teslarati.com/feed/", name: "TESLARATI" },
    { url: "https://cleantechnica.com/tag/tesla/feed/", name: "CLEANTECHNICA" },
  ],
  ux: [
    { url: "https://uxdesign.cc/feed", name: "UX COLLECTIVE" },
    { url: "https://www.theverge.com/rss/index.xml", name: "THE VERGE" },
  ],
  marketing: [
    { url: "https://www.marketingweek.com/feed/", name: "MARKETING WEEK" },
    { url: "https://www.theverge.com/rss/index.xml", name: "THE VERGE" },
  ],
  concurrents: [
    { url: "https://insideevs.com/feed/", name: "INSIDEEVS" },
    { url: "https://electrek.co/tag/byd/feed/", name: "ELECTREK/BYD" },
    { url: "https://electrek.co/tag/rivian/feed/", name: "ELECTREK/RIVIAN" },
  ],
  business: [
    { url: "https://cleantechnica.com/tag/tesla/feed/", name: "CLEANTECHNICA" },
    { url: "https://insideevs.com/feed/", name: "INSIDEEVS" },
  ],
};

const COMPETITORS = [
  {
    name: "BYD",
    type: "direct" as const,
    region: "Global / Europe",
    threat: "high" as const,
    note: "Leader mondial des VE depuis 2023, montée en puissance en Europe avec des prix agressifs. Croissance continue malgré les droits de douane UE (+38%).",
    keyword: '"BYD Europe" OR "BYD Tesla" OR "BYD sales"',
  },
  {
    name: "Lucid Motors",
    type: "direct" as const,
    region: "USA / Moyen-Orient",
    threat: "medium" as const,
    note: "Positionnement ultra-premium (Air à 70k€+). Concurrent de niche sur le haut de gamme, difficultés de production persistantes.",
    keyword: '"Lucid Motors" OR "Lucid Air" delivery',
  },
  {
    name: "Rivian",
    type: "direct" as const,
    region: "USA",
    threat: "medium" as const,
    note: "Spécialiste pick-up & SUV électriques. Croissance des livraisons mais pertes importantes. Partenariat Amazon solide.",
    keyword: '"Rivian" delivery OR production 2026',
  },
  {
    name: "Volkswagen ID",
    type: "direct" as const,
    region: "Europe",
    threat: "medium" as const,
    note: "Gamme ID. bien implantée en Europe (ID.3, ID.4, ID.7). Restructuration massive en cours pour réduire les coûts.",
    keyword: '"Volkswagen ID" OR "VW EV" Europe 2026',
  },
  {
    name: "Mercedes EQ",
    type: "indirect" as const,
    region: "Europe / Global",
    threat: "low" as const,
    note: "Gamme EQ en difficulté de ventes, repositionnement vers le premium. Moins agressif sur les prix que Tesla.",
    keyword: '"Mercedes EQ" OR "EQS" sales Europe',
  },
  {
    name: "Apple (CarPlay / Vision)",
    type: "indirect" as const,
    region: "Global",
    threat: "medium" as const,
    note: "Écosystème automobile en expansion. Menace indirecte sur l'interface et la fidélité à l'OS embarqué Tesla.",
    keyword: '"Apple CarPlay" automotive UX OR "Apple car"',
  },
];

const KEYWORDS = [
  { label: "Autonomie FSD", query: '"Tesla FSD" OR "Full Self-Driving"', priority: "★★★★★" },
  { label: "Robotaxi Cybercab", query: '"Cybercab" OR "Tesla robotaxi"', priority: "★★★★★" },
  { label: "Tesla AI5 / Dojo", query: '"Tesla AI5" OR "Tesla Dojo" OR "Tesla Optimus"', priority: "★★★★★" },
  { label: "Interface / UX", query: '"Tesla UI" OR "Tesla interface" OR "Model 3 touchscreen"', priority: "★★★★★" },
  { label: "Image marque EU", query: '"Tesla brand" OR "Tesla boycott" Europe', priority: "★★★★☆" },
  { label: "Prix / Ventes", query: '"Tesla sales" 2026 OR "Tesla Model 3" prix', priority: "★★★★☆" },
  { label: "Chute Europe", query: '"Tesla Europe" -27% OR -44% OR "chute ventes"', priority: "★★★★☆" },
  { label: "Megapack / Énergie", query: '"Tesla Megapack" OR "Tesla energy" storage', priority: "★★★☆☆" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("tech");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshTrigger((n) => n + 1);
    setLastRefresh(new Date());
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Top bar */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span
              className="text-primary uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600 }}
            >
              LIVE
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="text-foreground" style={{ fontWeight: 600, letterSpacing: "0.08em", fontSize: "13px" }}>
            TESLA / VEILLE STRATÉGIQUE
          </span>
          <span className="text-muted-foreground hidden sm:block" style={{ fontSize: "11px" }}>
            — Technologie · UI/UX · Marketing · Concurrents · Business
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-muted-foreground hidden sm:block"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
          >
            MÀJ {formatTime(lastRefresh)}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-50"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", borderRadius: 0, letterSpacing: "0.1em" }}
          >
            <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
            ACTUALISER
          </button>
        </div>
      </header>

      {/* KPI Bar */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        <MetricCard label="Ventes EU 2025" value="-27.8%" trend="down" trendLabel="vs 2024" accent />
        <MetricCard label="Jan 2026 EU" value="-44%" trend="down" trendLabel="YoY" />
        <MetricCard label="CAPEX IA 2026" value=">20 Md$" sub="AI5 + Dojo + Optimus" />
        <MetricCard label="Megapack YoY" value="+50%" trend="up" trendLabel="stockage énergie" />
        <MetricCard label="Model 3 Std." value="36 990€" sub="Positionnement B2B" />
        <MetricCard label="Boycott Scan." value="40 000" sub="membres organisés" />
        <MetricCard label="Image DE" value="-48%" trend="down" trendLabel="YouGov brand" />
        <MetricCard label="Robotaxi villes" value="3" sub="Austin · Dallas · Houston" />
      </div>

      {/* Tabs */}
      <nav className="flex border-b border-border overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 border-r border-border whitespace-nowrap transition-colors duration-150 ${
              activeTab === id
                ? "bg-primary/10 text-primary border-b-2 border-b-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.15em", borderRadius: 0 }}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {activeTab !== "concurrents" ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-foreground" style={{ fontWeight: 600, fontSize: "13px", letterSpacing: "0.05em" }}>
                  {TABS.find((t) => t.id === activeTab)?.label}
                </h2>
                <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  — {FEED_SOURCES[activeTab].map((s) => s.name).join(" · ")}
                </span>
              </div>
            </div>
            <NewsFeed
              sources={FEED_SOURCES[activeTab]}
              refreshTrigger={refreshTrigger}
            />
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-8">
            {/* Competitor grid */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-foreground" style={{ fontWeight: 600, fontSize: "13px", letterSpacing: "0.05em" }}>
                  CARTOGRAPHIE CONCURRENTIELLE
                </h2>
                <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  — Directs & Indirects
                </span>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
                {COMPETITORS.map((c) => (
                  <CompetitorCard key={c.name} {...c} />
                ))}
              </div>
            </div>

            {/* Live competitor news */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-foreground" style={{ fontWeight: 600, fontSize: "13px", letterSpacing: "0.05em" }}>
                  FLUX CONCURRENTS
                </h2>
                <span className="text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  — BYD · Rivian · InsideEVs
                </span>
              </div>
              <NewsFeed
                sources={FEED_SOURCES.concurrents}
                refreshTrigger={refreshTrigger}
                maxItems={12}
              />
            </div>
          </div>
        )}
      </div>

      {/* Keywords sidebar strip */}
      <aside className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <AlertTriangle size={12} className="text-primary" />
          <span
            className="text-primary uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
          >
            ALERTES MOTS-CLÉS ACTIVES
          </span>
          <Users size={12} className="text-muted-foreground ml-4" />
          <span
            className="text-muted-foreground uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
          >
            Personas : L'early adopter tech (30-45 · &gt;80k€) · L'éco-rationnel professionnel (40-55 · B2B)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {KEYWORDS.map((kw) => (
            <div
              key={kw.label}
              className="flex items-center gap-2 px-2.5 py-1.5 border border-border bg-secondary hover:border-primary/40 transition-colors group"
              style={{ borderRadius: 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground" style={{ fontSize: "11px" }}>{kw.label}</span>
              <span className="text-primary" style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}>{kw.priority}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
