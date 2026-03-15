import type { NewsletterBlock as NewsletterBlockType } from '../../types/strapi';
import { useState } from 'react';

interface Props {
  data: NewsletterBlockType;
}

export function NewsletterBlock({ data }: Props) {
  const [email, setEmail] = useState('');

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-card border border-border/60 p-8 sm:p-12">
        {data.heading && (
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {data.heading}
          </h2>
        )}
        {data.text && (
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">{data.text}</p>
        )}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={data.placeholder || 'Enter your email'}
            className="flex-1 bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
          />
          <button
            type="submit"
            className="font-mono text-sm px-6 py-3 bg-primary text-primary-foreground neon-glow hover:scale-105 transition-transform uppercase tracking-widest"
          >
            {data.label || 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
}