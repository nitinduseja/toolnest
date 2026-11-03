/**
 * Types for the Favicon & App Icon Generator.
 */

export interface IconSizeConfig {
  name: string;
  filename: string;
  size: number;
  purpose: 'favicon' | 'apple-touch' | 'android-chrome';
}

export interface GeneratedIconItem {
  id: string;
  name: string;
  filename: string;
  size: number;
  dataUrl: string;
  blob: Blob;
}

export interface FaviconManifestConfig {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
}
