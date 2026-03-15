import { getStrapiMediaUrl } from '../lib/strapi';
import type { HeaderData } from '../types/strapi';
import { useState } from 'react';

interface HeaderProps {
  data: HeaderData;
}

export function Header({ data }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/30 shadow-[0_1px_20px_oklch(0.55_0.25_27_/_0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={data.logo?.href || '/'} className="flex items-center gap-2 animate-flicker">
            {data.logo?.image?.url && (
              <img
                src={getStrapiMediaUrl(data.logo.image.url)}
                alt={data.logo.label || 'Logo'}
                className="h-8 w-auto brightness-0 invert sepia saturate-[10] hue-rotate-[-15deg]"
              />
            )}
            <span className="font-mono text-lg font-bold text-primary tracking-wider">
              {data.logo?.label || 'SITE'}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {data.navItems?.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="font-mono text-sm text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
            {data.cta && (
              <a
                href={data.cta.href}
                target={data.cta.isExternal ? '_blank' : undefined}
                rel={data.cta.isExternal ? 'noopener noreferrer' : undefined}
                className="font-mono text-sm px-4 py-2 bg-primary text-primary-foreground border border-primary hover:neon-glow transition-shadow"
              >
                {data.cta.label}
              </a>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-border/50 pt-4 flex flex-col gap-3">
            {data.navItems?.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="font-mono text-sm text-foreground/80 hover:text-primary transition-colors px-2 py-1"
              >
                {item.label}
              </a>
            ))}
            {data.cta && (
              <a
                href={data.cta.href}
                target={data.cta.isExternal ? '_blank' : undefined}
                className="font-mono text-sm px-4 py-2 bg-primary text-primary-foreground text-center"
              >
                {data.cta.label}
              </a>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
