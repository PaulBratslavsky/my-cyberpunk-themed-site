import { cn } from '../../lib/cn';
import { getStrapiMediaUrl } from '../../lib/strapi';
import { RichText } from '../RichText';
import type { ContentWithImageBlock as ContentWithImageBlockType } from '../../types/strapi';

interface Props {
  data: ContentWithImageBlockType;
}

export function ContentWithImageBlock({ data }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-10 items-center',
        data.reversed && 'md:[&>*:first-child]:order-2'
      )}>
        {/* Text side */}
        <div className="space-y-5">
          {data.heading && (
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
              {data.heading}
            </h2>
          )}
          {data.content && (
            <RichText content={data.content} className="prose-sm" />
          )}
          {data.link && (
            <a
              href={data.link.href}
              target={data.link.isExternal ? '_blank' : undefined}
              className="inline-block font-mono text-sm px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {data.link.label}
            </a>
          )}
        </div>

        {/* Image side with glitch border */}
        <div className="relative">
          {data.image?.url && (
            <div className="glitch-border">
              <div className="glitch-border-inner">
                <img
                  src={getStrapiMediaUrl(data.image.url)}
                  alt={data.image.alternativeText || ''}
                  className="w-full h-auto object-cover grayscale"
                />
                <div className="absolute inset-0 bg-red-700/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 to-transparent" />
                <div className="glitch-border-scanlines" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
