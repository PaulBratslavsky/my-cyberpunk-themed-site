import type { MarkdownBlock as MarkdownBlockType } from '../../types/strapi';
import { RichText } from '../RichText';

interface Props {
  data: MarkdownBlockType;
}

export function MarkdownBlock({ data }: Props) {
  if (!data.content) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <RichText content={data.content} />
    </div>
  );
}
