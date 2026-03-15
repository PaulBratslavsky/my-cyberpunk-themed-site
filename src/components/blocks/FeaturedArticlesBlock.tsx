import { getStrapiMediaUrl } from '../../lib/strapi';
import type { FeaturedArticlesBlock as FeaturedArticlesBlockType } from '../../types/strapi';

interface Props {
  data: FeaturedArticlesBlockType;
}

export function FeaturedArticlesBlock({ data }: Props) {
  if (!data.articles || data.articles.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.articles.map((article) => (
          <a
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group glitch-border bg-card overflow-visible transition-all duration-300"
          >
            {article.featuredImage?.url && (
              <div className="glitch-border-inner aspect-video">
                <img
                  src={getStrapiMediaUrl(article.featuredImage.url)}
                  alt={article.featuredImage.alternativeText || article.title || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale"
                />
                <div className="absolute inset-0 bg-red-700/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 to-transparent" />
                <div className="glitch-border-scanlines" />
              </div>
            )}
            <div className="p-5 space-y-2">
              {article.contentTags && article.contentTags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {article.contentTags.map((tag) => (
                    <span key={tag.id} className="font-mono text-[10px] text-primary uppercase tracking-widest">
                      {tag.title}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="font-mono text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{article.description}</p>
              )}
              {article.author?.fullName && (
                <p className="text-xs text-muted-foreground font-mono pt-1">By {article.author.fullName}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}