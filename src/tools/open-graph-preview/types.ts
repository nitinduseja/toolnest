export type TwitterCardType = 'summary_large_image' | 'summary';
export type OpenGraphType = 'website' | 'article' | 'product' | 'profile';
export type SocialPreviewPlatform =
  'google' | 'twitter' | 'facebook' | 'linkedin' | 'discord' | 'slack';

export interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle: string;
  twitterCard: TwitterCardType;
  contentType: OpenGraphType;
  locale: string;
  robots: string;
  themeColor: string;
  author: string;
}

export interface MetaLengthScore {
  length: number;
  min: number;
  max: number;
  status: 'too-short' | 'optimal' | 'too-long';
  recommendation: string;
}

export interface OgPreset {
  id: string;
  name: string;
  description: string;
  config: MetaTagsConfig;
}
