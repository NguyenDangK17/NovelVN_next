import { useState, useEffect, useMemo } from 'react';
import { Chapter } from '@/types/chapter';
import { createHttpsRequestPromise } from '@/api/utils';

// Define the types for the chapter data structure
export interface ChapterData {
  chapter: string;
  id: string;
  others: any[];
  count: number;
  volume?: string;
}

export interface VolumeData {
  volume: string;
  count: number;
  chapters: Record<string, ChapterData>;
}

export interface ChapterListResponse {
  result: string;
  volumes: Record<string, VolumeData>;
}

export interface ProcessedChapterData extends ChapterData {
  chapterNumber: number;
}

// Function to process chapter data and create a list without duplicates
export const processChapterList = (data: ChapterListResponse): ProcessedChapterData[] => {
  if (!data || !data.volumes) {
    return [];
  }

  const chapterMap = new Map<string, ChapterData>();

  // Iterate through all volumes
  Object.values(data.volumes).forEach(volume => {
    // Iterate through all chapters in the volume
    Object.entries(volume.chapters).forEach(([chapterNumber, chapterData]) => {
      // Only add if we haven't seen this chapter number before
      if (!chapterMap.has(chapterNumber)) {
        chapterMap.set(chapterNumber, chapterData);
      }
    });
  });

  // Convert map to array and sort by chapter number
  return Array.from(chapterMap.entries())
    .map(([chapterNumber, chapterData]) => ({
      chapterNumber: parseInt(chapterNumber, 10),
      ...chapterData
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
};

export const useChapterList = (mangaId: string) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rawData, setRawData] = useState<ChapterListResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChapterList = async () => {
      if (!mangaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await createHttpsRequestPromise('GET', `/manga/${mangaId}/aggregate?translatedLanguage[]=vi`);

        if (isMounted) {
          setChapter(data as Chapter);
          setRawData(data as unknown as ChapterListResponse);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error('Error fetching chapter list:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchChapterList();

    return () => {
      isMounted = false;
    };
  }, [mangaId]);

  // Memoize the processed chapter list to avoid unnecessary recalculations
  const chapterListData = useMemo(() => {
    if (!rawData) return [];
    return processChapterList(rawData);
  }, [rawData]);

  return {
    chapter,
    loading,
    error,
    chapterListData,
    rawData
  };
};