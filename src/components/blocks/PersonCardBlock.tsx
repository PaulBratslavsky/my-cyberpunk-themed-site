import { getStrapiMediaUrl } from '../../lib/strapi';
import { RichText } from '../RichText';
import type { PersonCardBlock as PersonCardBlockType } from '../../types/strapi';

interface Props {
  data: PersonCardBlockType;
}

export function PersonCardBlock({ data }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-card border border-border/60 border-l-4 border-l-primary p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
        {data.image?.url && (
          <div className="relative w-16 h-16 shrink-0 rounded-full glitch-border-sm overflow-hidden">
            <div className="w-full h-full overflow-hidden rounded-full">
              <img
                src={getStrapiMediaUrl(data.image.url)}
                alt={data.personName || ''}
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-red-700/40 mix-blend-multiply rounded-full" />
            </div>
          </div>
        )}
        <div className="space-y-3">
          {data.text && (
            <blockquote className="italic leading-relaxed">
              <RichText content={data.text} className="prose-sm prose-p:text-foreground/90" />
            </blockquote>
          )}
          <div>
            {data.personName && (
              <p className="font-mono text-sm font-bold text-primary">{data.personName}</p>
            )}
            {data.personJob && (
              <p className="text-xs text-muted-foreground">{data.personJob}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
