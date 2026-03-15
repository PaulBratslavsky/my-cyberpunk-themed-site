import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { fetchStrapi, getStrapiMediaUrl } from '../../lib/strapi';
import type { GlobalData, StrapiResponse, Article } from '../../types/strapi';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Banner } from '../../components/Banner';

interface ArticleListResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const PAGE_SIZE = 4;

export const Route = createFileRoute('/blog/')({ component: BlogPage });

function BlogPage() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageCount: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (page: number, query: string) => {
    const params: Record<string, string> = {
      'populate[0]': 'featuredImage',
      'populate[1]': 'author',
      'populate[2]': 'contentTags',
      'pagination[page]': String(page),
      'pagination[pageSize]': String(PAGE_SIZE),
      'sort': 'createdAt:desc',
      'status': 'published',
    };
    if (query.trim()) {
      params['filters[title][$containsi]'] = query.trim();
    }
    return fetchStrapi<ArticleListResponse>('/api/articles', params);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [globalRes, articlesRes] = await Promise.all([
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
          fetchArticles(1, ''),
        ]);
        setGlobalData(globalRes.data);
        setArticles(articlesRes.data);
        setPagination(articlesRes.meta.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchArticles]);

  const handleSearch = async () => {
    setSearch(searchInput);
    setCurrentPage(1);
    setLoading(true);
    try {
      const res = await fetchArticles(1, searchInput);
      setArticles(res.data);
      setPagination(res.meta.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    try {
      const res = await fetchArticles(page, search);
      setArticles(res.data);
      setPagination(res.meta.pagination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (error && !globalData) {
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

  return (
    <div className="min-h-screen flex flex-col">
      {globalData?.banner && <Banner data={globalData.banner} />}
      {globalData?.header && <Header data={globalData.header} />}

      <main className="flex-1">
        {/* Page Header */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)',
            }}
          />
          {/* Red glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-block font-mono text-xs tracking-[0.3em] uppercase text-primary mb-6 px-4 py-1.5 border border-primary/30">
              // BLOG
            </div>
            <h1
              className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 glitch-text"
              data-text="DATA_FEED"
            >
              DATA_FEED
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono leading-relaxed">
              Latest transmissions from the network
            </p>
            {/* Decorative bottom line */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <div className="w-16 h-px bg-primary/50" />
              <div className="w-2 h-2 bg-primary rotate-45" />
              <div className="w-16 h-px bg-primary/50" />
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative">
            <div className="flex gap-0">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-mono text-sm pointer-events-none">
                  {'>'}_
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search transmissions..."
                  className="w-full bg-card border border-primary/30 text-foreground font-mono text-sm pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_oklch(0.55_0.25_27_/_0.3)] placeholder:text-muted-foreground/50 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground font-mono text-sm px-6 py-3.5 border border-primary hover:bg-primary/80 transition-all hover:shadow-[var(--neon-glow-sm)] tracking-wider"
              >
                SCAN
              </button>
            </div>
            {/* Results count */}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {loading ? 'SCANNING...' : `${pagination.total} RESULT${pagination.total !== 1 ? 'S' : ''} FOUND`}
                {search && (
                  <span className="text-primary ml-2">
                    QUERY: "{search}"
                    <button
                      onClick={() => {
                        setSearchInput('');
                        setSearch('');
                        setCurrentPage(1);
                        fetchArticles(1, '').then((res) => {
                          setArticles(res.data);
                          setPagination(res.meta.pagination);
                        });
                      }}
                      className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      [CLEAR]
                    </button>
                  </span>
                )}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                PAGE {currentPage}/{pagination.pageCount || 1}
              </span>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <div key={i} className="bg-card border border-border animate-pulse h-[380px]" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-mono text-primary text-4xl mb-4">NO_DATA</div>
              <p className="font-mono text-muted-foreground text-sm">No transmissions match your query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {!loading && pagination.pageCount > 1 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            <div className="flex items-center justify-center gap-2 mt-8">
              {/* Prev button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="font-mono text-xs px-4 py-2.5 border border-primary/30 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 hover:border-primary transition-all tracking-wider"
              >
                {'<< PREV'}
              </button>

              {/* Page numbers */}
              {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`font-mono text-xs w-10 h-10 border transition-all ${
                    page === currentPage
                      ? 'bg-primary text-primary-foreground border-primary shadow-[var(--neon-glow-sm)]'
                      : 'border-primary/30 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {String(page).padStart(2, '0')}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pageCount}
                className="font-mono text-xs px-4 py-2.5 border border-primary/30 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 hover:border-primary transition-all tracking-wider"
              >
                {'NEXT >>'}
              </button>
            </div>
          </section>
        )}
      </main>

      {globalData?.footer && <Footer data={globalData.footer} />}
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const imageUrl = article.featuredImage?.url
    ? getStrapiMediaUrl(article.featuredImage.url)
    : null;

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug! }}
      className="group block glitch-border bg-card overflow-hidden hover:border-primary transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden glitch-border-inner">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={article.featuredImage?.alternativeText || article.title || ''}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale"
            />
            <div className="absolute inset-0 bg-red-700/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="glitch-border-scanlines" />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="font-mono text-muted-foreground text-sm">NO_IMAGE</span>
          </div>
        )}

        {/* Tags overlay */}
        {article.contentTags && article.contentTags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {article.contentTags.map((tag) => (
              <span
                key={tag.id}
                className="font-mono text-[10px] tracking-[0.15em] uppercase px-2 py-1 bg-primary/90 text-primary-foreground"
              >
                {tag.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h2 className="font-mono text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {article.title}
        </h2>
        {article.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="font-mono text-xs text-muted-foreground">
              {article.author?.fullName || 'UNKNOWN'}
            </span>
          </div>
          <span className="font-mono text-xs text-primary group-hover:tracking-wider transition-all">
            READ_MORE →
          </span>
        </div>
      </div>
    </Link>
  );
}
