export type Chapter = {
  /** ```console
   * Maximum length: 255
   * ``` */
  title: string | null;
  volume: string | null;
  /** ```console
   * Maximum length: 8
   * ``` */
  chapter: string | null;
  pages: number;
  /** Pattern: `^[a-z]{2}(-[a-z]{2})?$` */
  translatedLanguage: string;
  /** UUID formatted string */
  uploader: string;
  /** ```console
   * Maximum length: 512
   * Pattern: ^https?://
   * ``` */
  externalUrl: string | null;
  /** ```console
   * Minimum: 1
   * ``` */
  version: number;
  createdAt: string;
  updatedAt: string;
  publishAt: string;
  readableAt: string;
};