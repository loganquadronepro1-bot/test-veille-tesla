import { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { NewsCard, type Article } from "./NewsCard";

interface FeedSource {
  url: string;
  name: string;
}

interface NewsFeedProps {
  sources: FeedSource[];
  refreshTrigger: number;
  maxItems?: number;
}

const RSS2JSON = "https://api.rss2json.com/v1/api.json";

async function fetchFeed(source: FeedSource): Promise<Article[]> {
  const res = await fetch(
    `${RSS2JSON}?rss_url=${encodeURIComponent(source.url)}&count=12`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== "ok") throw new Error(data.message || "Feed error");
  return (data.items || []).map((item: Record<string, string>) => ({
    title: item.title || "",
    link: item.link || "",
    pubDate: item.pubDate || "",
    description: item.description || "",
    author: item.author || "",
    thumbnail: item.thumbnail || "",
    source: source.name,
  }));
}

export function NewsFeed({ sources, refreshTrigger, maxItems = 20 }: NewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(sources.map(fetchFeed));
      const merged: Article[] = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") merged.push(...r.value);
      });
      merged.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setArticles(merged.slice(0, maxItems));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [sources, maxItems]);

  useEffect(() => { load(); }, [load, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
        <Loader2 size={16} className="animate-spin text-primary" />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>CHARGEMENT DES FLUX...</span>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-red-400">
        <AlertCircle size={16} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>ERREUR: {error}</span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
        AUCUN ARTICLE DISPONIBLE
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
      {articles.map((article, i) => (
        <NewsCard key={`${article.link}-${i}`} {...article} />
      ))}
    </div>
  );
}
