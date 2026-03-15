import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchStrapi } from '../lib/strapi';
import type { GlobalData, LandingPage, StrapiResponse } from '../types/strapi';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Banner } from '../components/Banner';
import { BlockRenderer } from '../components/blocks/BlockRenderer';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [globalRes, landingRes] = await Promise.all([
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
          fetchStrapi<StrapiResponse<LandingPage>>(
            '/api/landing-page',
            {
              'populate[blocks][populate][links][populate]': '*',
              'populate[blocks][populate][image][populate]': '*',
              'populate[blocks][populate][cards][populate]': '*',
              'populate[blocks][populate][link][populate]': '*',
              'populate[blocks][populate][faq][populate]': '*',
              'populate[blocks][populate][articles][populate][0]': 'featuredImage',
              'populate[blocks][populate][articles][populate][1]': 'author',
              'populate[blocks][populate][articles][populate][2]': 'contentTags',
              'status': 'published',
            }
          ),
        ]);

        setGlobalData(globalRes.data);
        setLandingPage(landingRes.data);
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
        {landingPage?.blocks && landingPage.blocks.length > 0 ? (
          <BlockRenderer blocks={landingPage.blocks} />
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="font-mono text-muted-foreground">No content blocks found.</p>
          </div>
        )}
      </main>

      {globalData?.footer && <Footer data={globalData.footer} />}
    </div>
  );
}