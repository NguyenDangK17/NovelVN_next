// src/hooks/useManga.ts
import { useState, useEffect } from 'react';
import { Manga } from '@/types/manga';
import { createHttpsRequestPromise } from '@/api/utils';

export const useManga = (mangaId: string) => {
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const { data } = await createHttpsRequestPromise('GET', `/manga/${mangaId}`);
        setManga(data as Manga);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [mangaId]);

  return { manga, loading, error };
};