import { useState, useEffect } from 'react';
import { getManga } from '@/api/manga';
import axios from 'axios';
import { MangaDexManga, MangaDexRelationship } from '@/types/mangaDex';

export interface SearchMangaResult {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
}

export function useSearchManga(query: string) {
  const [results, setResults] = useState<SearchMangaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchManga = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getManga({
          title: query,
          limit: 5,
        });

        const formattedResults = await Promise.all(
          response.data.map(async (manga: MangaDexManga) => {
            const coverArt = manga.relationships.find(
              (rel: MangaDexRelationship) => rel.type === 'cover_art'
            );

            let coverUrl = '';
            if (coverArt) {
              const coverResponse = await axios.get(
                `https://api.mangadex.org/cover/${coverArt.id}?includes[]=manga`
              );
              const coverData = coverResponse.data.data;
              coverUrl = `https://mangadex.org/covers/${manga.id}/${coverData.attributes?.fileName}`;
            }

            return {
              id: manga.id,
              title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
              coverUrl,
              description:
                manga.attributes.description.en ||
                Object.values(manga.attributes.description)[0] ||
                '',
            };
          })
        );

        setResults(formattedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchManga, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
}
