import type { BannerData } from '../types/strapi';

interface BannerProps {
  data: BannerData;
}

export function Banner({ data }: BannerProps) {
  if (!data.isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        {data.description && <span>{data.description}</span>}
        {data.link && (
          <a
            href={data.link.href}
            target={data.link.isExternal ? '_blank' : undefined}
            rel={data.link.isExternal ? 'noopener noreferrer' : undefined}
            className="underline font-bold hover:opacity-80 transition-opacity"
          >
            {data.link.label} →
          </a>
        )}
      </div>
    </div>
  );
}