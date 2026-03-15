import { RichText } from '../RichText';
import type { CardGridBlock as CardGridBlockType } from '../../types/strapi';

interface Props {
  data: CardGridBlockType;
}

export function CardGridBlock({ data }: Props) {
  if (!data.cards || data.cards.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.cards.map((card) => (
          <div
            key={card.id}
            className="bg-card border border-border/60 p-6 hover:border-primary/60 hover:shadow-[0_0_15px_oklch(0.55_0.25_27_/_0.15)] transition-all duration-300 group"
          >
            {card.heading && (
              <h3 className="font-mono text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {card.heading}
              </h3>
            )}
            {card.text && (
              <RichText content={card.text} className="prose-sm prose-p:text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
