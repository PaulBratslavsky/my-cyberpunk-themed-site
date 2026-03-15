import { cn } from '../lib/cn';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
}

export function GlitchText({ text, as: Tag = 'h1', className }: GlitchTextProps) {
  return (
    <Tag
      className={cn('glitch-text font-mono', className)}
      data-text={text}
    >
      {text}
    </Tag>
  );
}