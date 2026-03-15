import { GlitchText } from '../GlitchText';
import { getStrapiMediaUrl } from '../../lib/strapi';
import type { HeroBlock as HeroBlockType } from '../../types/strapi';

interface HeroBlockProps {
  data: HeroBlockType;
}

export function HeroBlock({ data }: HeroBlockProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image with red overlay + glitch border */}
      {data.image?.url && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-8 sm:inset-12 md:inset-16 glitch-border">
            <div className="glitch-border-inner w-full h-full">
              <img
                src={getStrapiMediaUrl(data.image.url)}
                alt={data.image.alternativeText || ''}
                className="w-full h-full object-cover opacity-40 grayscale"
              />
              <div className="absolute inset-0 bg-red-800/50 mix-blend-multiply" />
              <div className="glitch-border-scanlines" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </div>
      )}

      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {data.heading && (
          <GlitchText
            text={data.heading}
            as="h1"
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6"
          />
        )}
        {data.text && (
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {data.text}
          </p>
        )}
        {data.links && data.links.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {data.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.isExternal ? '_blank' : undefined}
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                className={link.type === 'PRIMARY'
                  ? 'font-mono px-8 py-3 bg-primary text-primary-foreground border border-primary neon-glow hover:scale-105 transition-transform text-sm uppercase tracking-widest'
                  : 'font-mono px-8 py-3 border border-border text-foreground hover:border-primary hover:text-primary transition-colors text-sm uppercase tracking-widest'
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}