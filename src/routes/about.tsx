import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchStrapi } from '../lib/strapi';
import type { GlobalData, StrapiResponse, Block } from '../types/strapi';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Banner } from '../components/Banner';
import { BlockRenderer } from '../components/blocks/BlockRenderer';

interface PageData {
  id: number;
  documentId: string;
  title?: string;
  description?: string;
  slug?: string;
  blocks?: Block[];
}

interface PageListResponse {
  data: PageData[];
  meta?: Record<string, unknown>;
}

export const Route = createFileRoute('/about')({ component: AboutPage });

function AboutPage() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [globalRes, pageRes] = await Promise.all([
          fetchStrapi<StrapiResponse<GlobalData>>(
            '/api/global',
            {
              'populate[banner][populate]': '*',
              'populate[header][populate][logo][populate]': '*',
              'populate[header][populate][navItems]': 'true',
              'populate[header][populate][cta]': 'true',
              'populate[footer][populate][logo][populate]': '*',
              'populate[footer][populate][navItems]': 'true',
              'populate[footer][populate][socialLinks]': 'true',
              'status': 'published',
            }
          ),
          fetchStrapi<PageListResponse>(
            '/api/pages',
            {
              'filters[slug][$eq]': 'about',
              'populate[blocks][populate]': '*',
              'status': 'published',
            }
          ),
        ]);

        setGlobalData(globalRes.data);
        setPageData(pageRes.data?.[0] ?? null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col">
      {globalData?.banner && <Banner data={globalData.banner} />}
      {globalData?.header && <Header data={globalData.header} />}

      <main className="flex-1">
        {/* Page Header */}
        {pageData && (
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
                // ABOUT
              </div>
              <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 glitch-text" data-text={pageData.title}>
                {pageData.title}
              </h1>
              {pageData.description && (
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono leading-relaxed">
                  {pageData.description}
                </p>
              )}
              {/* Decorative bottom line */}
              <div className="mt-10 flex items-center justify-center gap-2">
                <div className="w-16 h-px bg-primary/50" />
                <div className="w-2 h-2 bg-primary rotate-45" />
                <div className="w-16 h-px bg-primary/50" />
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Blocks */}
        {pageData?.blocks && pageData.blocks.length > 0 ? (
          <BlockRenderer blocks={pageData.blocks} />
        ) : (
          <div className="min-h-[40vh] flex items-center justify-center">
            <p className="font-mono text-muted-foreground">No content blocks found.</p>
          </div>
        )}
      </main>

      {globalData?.footer && <Footer data={globalData.footer} />}
    </div>
  );
}
