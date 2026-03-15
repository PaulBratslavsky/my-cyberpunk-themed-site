import type { Block } from '../../types/strapi';
import { HeroBlock } from './HeroBlock';
import { SectionHeadingBlock } from './SectionHeadingBlock';
import { CardGridBlock } from './CardGridBlock';
import { ContentWithImageBlock } from './ContentWithImageBlock';
import { MarkdownBlock } from './MarkdownBlock';
import { PersonCardBlock } from './PersonCardBlock';
import { FaqsBlock } from './FaqsBlock';
import { FeaturedArticlesBlock } from './FeaturedArticlesBlock';
import { NewsletterBlock } from './NewsletterBlock';

interface BlockRendererProps {
  blocks: Block[];
}

const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  'blocks.hero': HeroBlock,
  'blocks.section-heading': SectionHeadingBlock,
  'blocks.card-grid': CardGridBlock,
  'blocks.content-with-image': ContentWithImageBlock,
  'blocks.markdown': MarkdownBlock,
  'blocks.person-card': PersonCardBlock,
  'blocks.faqs': FaqsBlock,
  'blocks.featured-articles': FeaturedArticlesBlock,
  'blocks.newsletter': NewsletterBlock,
};

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockComponents[block.__component];
        if (!Component) {
          console.warn(`Unknown block type: ${block.__component}`);
          return null;
        }
        return <Component key={`${block.__component}-${block.id || index}`} data={block} />;
      })}
    </>
  );
}