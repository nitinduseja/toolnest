import { SnippetFormat } from './base64ImageLogic';

export interface Base64EncodedItem {
  id: string;
  fileName: string;
  fileSize: number;
  dataUrl: string;
  format: SnippetFormat;
  altText: string;
}
