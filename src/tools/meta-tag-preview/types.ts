export interface MetaTagConfig {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  twitterHandle: string;
  twitterCard: 'summary_large_image' | 'summary';
  robots: string;
  themeColor: string;
}

export type SocialPlatform = 'google' | 'twitter' | 'linkedin' | 'discord';
