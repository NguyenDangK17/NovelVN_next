import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chapter } from '@/types/chapter';
// import { createHttpsRequestPromise } from '@/api/utils';
import axios from 'axios';

// Define the types for the chapter data structure
export interface ChapterData {
  chapter: string;
  id: string;
  others: string[];
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

// Cache for chapter lists
const chapterListCache = new Map<string, { data: ChapterListResponse; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

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
      ...chapterData,
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
};

export const useChapterList = (mangaId: string, language: string = 'vi') => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rawData, setRawData] = useState<ChapterListResponse | null>(null);

  const fetchChapterList = useCallback(async () => {
    if (!mangaId) {
      setLoading(false);
      return;
    }

    const cacheKey = `${mangaId}-${language}`;
    const cachedData = chapterListCache.get(cacheKey);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      setChapter(cachedData.data as unknown as Chapter);
      setRawData(cachedData.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/${mangaId}/chapters?language=${language}`
      );

      setChapter(data as Chapter);
      setRawData(data as unknown as ChapterListResponse);

      // Cache the results
      chapterListCache.set(cacheKey, {
        data: data as unknown as ChapterListResponse,
        timestamp: now,
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching chapter list:', err);
    } finally {
      setLoading(false);
    }
  }, [mangaId, language]);

  useEffect(() => {
    fetchChapterList();
  }, [fetchChapterList]);

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
    rawData,
    refetch: fetchChapterList,
  };
};
