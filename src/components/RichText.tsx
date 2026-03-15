import ReactMarkdown from 'react-markdown';

interface RichTextProps {
  content: string;
  className?: string;
}

export function RichText({ content, className = '' }: RichTextProps) {
  return (
    <div
      className={`prose prose-invert prose-sm sm:prose-base max-w-none
        prose-headings:font-mono prose-headings:text-primary prose-headings:drop-shadow-[0_0_8px_oklch(0.55_0.25_27_/_0.4)]
        prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-6 prose-h1:mt-10
        prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-2
        prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mb-3 prose-h3:mt-6
        prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-mono
        prose-strong:text-foreground prose-strong:font-bold
        prose-em:text-foreground/80
        prose-code:bg-muted prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-none
        prose-blockquote:border-l-primary prose-blockquote:bg-card/50 prose-blockquote:py-1 prose-blockquote:italic
        prose-ul:text-muted-foreground prose-ol:text-muted-foreground
        prose-li:marker:text-primary
        prose-hr:border-border/60
        ${className}`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
