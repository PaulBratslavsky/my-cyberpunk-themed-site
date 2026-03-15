import { useState } from 'react';
import { cn } from '../../lib/cn';
import { RichText } from '../RichText';
import type { FaqsBlock as FaqsBlockType } from '../../types/strapi';

interface Props {
  data: FaqsBlockType;
}

export function FaqsBlock({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!data.faq || data.faq.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="space-y-3">
        {data.faq.map((item, index) => (
          <div key={item.id} className="bg-card border border-border/60">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left group"
            >
              <span className="font-mono text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {item.heading}
              </span>
              <span className={cn(
                'text-primary text-lg transition-transform duration-200 font-mono',
                openIndex === index && 'rotate-45'
              )}>
                +
              </span>
            </button>
            {openIndex === index && item.text && (
              <div className="px-6 pb-4 border-t border-border/40 pt-4">
                <RichText content={item.text} className="prose-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
