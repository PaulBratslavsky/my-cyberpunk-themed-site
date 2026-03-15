import { GlitchText } from '../GlitchText';
import type { SectionHeadingBlock as SectionHeadingBlockType } from '../../types/strapi';

interface Props {
  data: SectionHeadingBlockType;
}

export function SectionHeadingBlock({ data }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center" id={data.anchorLink || undefined}>
      {data.subHeading && (
        <span className="font-mono text-sm text-primary uppercase tracking-[0.3em] mb-3 block">
          {data.subHeading}
        </span>
      )}
      {data.heading && (
        <GlitchText
          text={data.heading}
          as="h2"
          className="text-3xl sm:text-4xl font-bold text-foreground"
        />
      )}
    </div>
  );
}