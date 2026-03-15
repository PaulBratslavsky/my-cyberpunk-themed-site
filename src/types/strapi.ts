export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }>;
}

export interface StrapiLink {
  id: number;
  href: string;
  label: string;
  isExternal?: boolean;
  isButtonLink?: boolean;
  type?: 'PRIMARY' | 'SECONDARY';
}

export interface StrapiLogoLink {
  id: number;
  label: string;
  href: string;
  isExternal?: boolean;
  image?: StrapiImage;
}

export interface BannerData {
  isVisible: boolean;
  description?: string;
  link?: StrapiLink;
}

export interface HeaderData {
  logo?: StrapiLogoLink;
  navItems?: StrapiLink[];
  cta?: StrapiLink;
}

export interface FooterData {
  logo?: StrapiLogoLink;
  text?: string;
  navItems?: StrapiLink[];
  socialLinks?: StrapiLogoLink[];
}

export interface GlobalData {
  title?: string;
  description?: string;
  banner?: BannerData;
  header?: HeaderData;
  footer?: FooterData;
}

// Block types
export interface HeroBlock {
  __component: 'blocks.hero';
  id: number;
  heading?: string;
  text?: string;
  links?: StrapiLink[];
  image?: StrapiImage;
}

export interface SectionHeadingBlock {
  __component: 'blocks.section-heading';
  id: number;
  heading?: string;
  subHeading?: string;
  anchorLink?: string;
}

export interface Card {
  id: number;
  heading?: string;
  text?: string;
}

export interface CardGridBlock {
  __component: 'blocks.card-grid';
  id: number;
  cards?: Card[];
}

export interface ContentWithImageBlock {
  __component: 'blocks.content-with-image';
  id: number;
  heading?: string;
  content?: string;
  reversed?: boolean;
  link?: StrapiLink;
  image?: StrapiImage;
}

export interface MarkdownBlock {
  __component: 'blocks.markdown';
  id: number;
  content?: string;
}

export interface PersonCardBlock {
  __component: 'blocks.person-card';
  id: number;
  personName?: string;
  personJob?: string;
  text?: string;
  image?: StrapiImage;
}

export interface FaqItem {
  id: number;
  heading?: string;
  text?: string;
}

export interface FaqsBlock {
  __component: 'blocks.faqs';
  id: number;
  faq?: FaqItem[];
}

export interface Author {
  id: number;
  fullName?: string;
  image?: StrapiImage;
}

export interface Tag {
  id: number;
  title?: string;
}

export interface Article {
  id: number;
  documentId: string;
  title?: string;
  description?: string;
  slug?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  featuredImage?: StrapiImage;
  author?: Author;
  contentTags?: Tag[];
}

export interface FeaturedArticlesBlock {
  __component: 'blocks.featured-articles';
  id: number;
  articles?: Article[];
}

export interface NewsletterBlock {
  __component: 'blocks.newsletter';
  id: number;
  heading?: string;
  text?: string;
  placeholder?: string;
  label?: string;
  formId?: string;
}

export type Block =
  | HeroBlock
  | SectionHeadingBlock
  | CardGridBlock
  | ContentWithImageBlock
  | MarkdownBlock
  | PersonCardBlock
  | FaqsBlock
  | FeaturedArticlesBlock
  | NewsletterBlock;

export interface LandingPage {
  id: number;
  title?: string;
  description?: string;
  blocks?: Block[];
}

export interface StrapiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}
