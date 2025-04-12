export interface MangaDexTag {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
    description: Record<string, any>;
    group: string;
    version: number;
  };
  relationships: any[];
}

export interface MangaDexRelationship {
  id: string;
  type: string;
  related?: string;
}

export interface MangaDexManga {
  id: string;
  type: string;
  attributes: {
    title: {
      en: string;
      vi?: string;
      [key: string]: string | undefined;
    };
    altTitles: Array<{
      [key: string]: string;
    }>;
    description: {
      en?: string;
      vi?: string;
      [key: string]: string | undefined;
    };
    isLocked: boolean;
    links: Record<string, string>;
    originalLanguage: string;
    lastVolume: string;
    lastChapter: string;
    publicationDemographic: string | null;
    status: string;
    year: number;
    contentRating: string;
    tags: MangaDexTag[];
    state: string;
    chapterNumbersResetOnNewVolume: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    availableTranslatedLanguages: string[];
    latestUploadedChapter: string;
  };
  relationships: MangaDexRelationship[];
}

export interface MangaDexResponse {
  result: string;
  response: string;
  data: MangaDexManga[];
  limit: number;
  offset: number;
  total: number;
} 