import { ExternalLink, Clock } from "lucide-react";

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  author?: string;
  thumbnail?: string;
  source?: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (hours < 1) return "< 1h";
  if (hours < 24) return `${hours}h`;
  return `${days}j`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim().slice(0, 180);
}

export function NewsCard({ title, link, pubDate, description, source }: Article) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 p-4 border border-border bg-card hover:border-primary/50 hover:bg-[#161616] transition-all duration-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h4
          className="text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2"
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          {title}
        </h4>
        <ExternalLink size={12} className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      {description && (
        <p className="text-muted-foreground leading-relaxed line-clamp-2" style={{ fontSize: "11px" }}>
          {stripHtml(description)}
        </p>
      )}

      <div className="flex items-center gap-3 mt-1">
        {source && (
          <span
            className="text-primary uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}
          >
            {source}
          </span>
        )}
        <span
          className="flex items-center gap-1 text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}
        >
          <Clock size={9} />
          {timeAgo(pubDate)}
        </span>
      </div>
    </a>
  );
}
