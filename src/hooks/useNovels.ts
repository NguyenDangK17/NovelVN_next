import { useState, useEffect } from 'react';
import axios from 'axios';
import { Novel } from '@/types/novel';
import { API_ENDPOINTS } from '@/config/api';

interface UseNovelsReturn {
  novels: Novel[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNovels = (): UseNovelsReturn => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNovels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_ENDPOINTS.NOVELS);
      setNovels(response.data);
    } catch (error) {
      console.error('Failed to load novels', error);
      setError('Failed to load novels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNovels();
  }, []);

  return {
    novels,
    loading,
    error,
    refetch: fetchNovels
  };
}; 