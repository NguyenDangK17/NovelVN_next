import { useState, useEffect, useCallback } from 'react';
import { getManga } from '@/api/manga';
import axios from 'axios';
import { MangaDexManga, MangaDexRelationship } from '@/types/mangaDex';

export interface SearchMangaResult {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
}

// Cache for search results
const searchCache = new Map<string, SearchMangaResult[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSearchManga(query: string) {
  const [results, setResults] = useState<SearchMangaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchManga = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Check cache first
    const cachedResults = searchCache.get(searchQuery);
    if (cachedResults) {
      setResults(cachedResults);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getManga({
        title: searchQuery,
        limit: 5,
      });

      // Batch cover art requests
      const coverArtPromises = response.data.map(async (manga: MangaDexManga) => {
        const coverArt = manga.relationships.find(
          (rel: MangaDexRelationship) => rel.type === 'cover_art'
        );

        if (coverArt) {
          try {
            const coverResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/${coverArt.id}/cover`
            );
            const coverData = coverResponse.data.data;
            return {
              id: manga.id,
              coverUrl: `https://mangadex.org/covers/${manga.id}/${coverData.attributes?.fileName}`,
            };
          } catch (err) {
            console.error('Error fetching cover art:', err);
            return {
              id: manga.id,
              coverUrl: '',
            };
          }
        }
        return {
          id: manga.id,
          coverUrl: '',
        };
      });

      const coverResults = await Promise.all(coverArtPromises);
      const coverMap = new Map(coverResults.map(result => [result.id, result.coverUrl]));

      const formattedResults = response.data.map((manga: MangaDexManga) => ({
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        coverUrl: coverMap.get(manga.id) || '',
        description:
          manga.attributes.description.en || Object.values(manga.attributes.description)[0] || '',
      }));

      // Cache the results
      searchCache.set(searchQuery, formattedResults);
      setTimeout(() => searchCache.delete(searchQuery), CACHE_DURATION);

      setResults(formattedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => searchManga(query), 300);
    return () => clearTimeout(debounceTimer);
  }, [query, searchManga]);

  return { results, loading, error };
}
