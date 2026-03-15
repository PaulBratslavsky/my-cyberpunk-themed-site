import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchStrapi, getStrapiMediaUrl } from '../../lib/strapi';
import type { GlobalData, StrapiResponse, Article } from '../../types/strapi';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Banner } from '../../components/Banner';
import { RichText } from '../../components/RichText';

interface ArticleListResponse {
  data: Article[];
  meta?: Record<string, unknown>;
}

export const Route = createFileRoute('/blog/$slug')({ component: BlogPostPage });

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [globalRes, articleRes] = await Promise.all([
          fetchStrapi<StrapiResponse<GlobalData>>('/api/global', {
            'populate[banner][populate]': '*',
            'populate[header][populate][logo][populate]': '*',
            'populate[header][populate][navItems]': 'true',
            'populate[header][populate][cta]': 'true',
            'populate[footer][populate][logo][populate]': '*',
            'populate[footer][populate][navItems]': 'true',
            'populate[footer][populate][socialLinks]': 'true',
            'status': 'published',
          }),
          fetchStrapi<ArticleListResponse>('/api/articles', {
            'filters[slug][$eq]': slug,
            'populate[0]': 'featuredImage',
            'populate[1]': 'author',
            'populate[2]': 'contentTags',
            'status': 'published',
          }),
        ]);

        setGlobalData(globalRes.data);
        setArticle(articleRes.data?.[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="font-mono text-primary text-2xl animate-flicker">LOADING...</div>
          <div className="w-48 h-px bg-muted mx-auto overflow-hidden">
            <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="font-mono text-primary text-3xl">ERROR</div>
          <p className="text-muted-foreground font-mono text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="font-mono text-sm px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        {globalData?.banner && <Banner data={globalData.banner} />}
        {globalData?.header && <Header data={globalData.header} />}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="font-mono text-primary text-5xl">404</div>
            <p className="font-mono text-muted-foreground">TRANSMISSION_NOT_FOUND</p>
            <Link
              to="/blog"
              className="inline-block font-mono text-sm px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              ← BACK TO FEED
            </Link>
          </div>
        </main>
        {globalData?.footer && <Footer data={globalData.footer} />}
      </div>
    );
  }

  const imageUrl = article.featuredImage?.url
    ? getStrapiMediaUrl(article.featuredImage.url)
    : null;

  const publishDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      {globalData?.banner && <Banner data={globalData.banner} />}
      {globalData?.header && <Header data={globalData.header} />}

      <main className="flex-1">
        {/* Hero image */}
        {imageUrl && (
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <img
              src={imageUrl}
              alt={article.featuredImage?.alternativeText || article.title || ''}
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-red-700/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="scanline-overlay opacity-[0.04]" />
            {/* Glitch corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
          </div>
        )}

        {/* Article content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-primary/80 transition-colors mb-8 tracking-wider"
          >
            <span>←</span>
            <span>BACK_TO_FEED</span>
          </Link>

          {/* Tags */}
          {article.contentTags && article.contentTags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {article.contentTags.map((tag) => (
                <span
                  key={tag.id}
                  className="font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1 bg-primary/20 text-primary border border-primary/30"
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 glitch-text leading-tight"
            data-text={article.title}
          >
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-mono text-sm text-muted-foreground">
                {article.author?.fullName || 'UNKNOWN'}
              </span>
            </div>
            {publishDate && (
              <>
                <span className="text-border">|</span>
                <span className="font-mono text-sm text-muted-foreground">{publishDate}</span>
              </>
            )}
          </div>

          {/* Description */}
          {article.description && (
            <div className="mb-10 p-4 border-l-2 border-primary bg-primary/5">
              <p className="text-muted-foreground italic leading-relaxed">{article.description}</p>
            </div>
          )}

          {/* Content */}
          {article.content && (
            <div className="mb-16">
              <RichText content={article.content} />
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-8 border-t border-border/50">
            <Link
              to="/blog"
              className="font-mono text-sm text-primary hover:text-primary/80 transition-colors tracking-wider"
            >
              ← ALL_POSTS
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider"
            >
              SCROLL_TOP ↑
            </button>
          </div>
        </article>
      </main>

      {globalData?.footer && <Footer data={globalData.footer} />}
    </div>
  );
}
