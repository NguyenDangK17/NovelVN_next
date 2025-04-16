import { ReadingHistory } from '@/types/manga';

const HISTORY_KEY = 'manga_reading_history';
const MAX_HISTORY_ITEMS = 10;

export const getReadingHistory = (): ReadingHistory[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToReadingHistory = (
  manga: {
    _id: string;
    title: string;
    manga_cover: string;
  },
  chapter: number
) => {
  if (typeof window === 'undefined') return;

  const history = getReadingHistory();
  const existingIndex = history.findIndex(item => item.mangaId === manga._id);

  const newHistoryItem: ReadingHistory = {
    mangaId: manga._id,
    title: manga.title,
    manga_cover: manga.manga_cover,
    lastReadChapter: chapter,
    lastReadTime: new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    history[existingIndex] = newHistoryItem;
  } else {
    history.unshift(newHistoryItem);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
  }

  // Sort history by lastReadTime in descending order (most recent first)
  history.sort((a, b) => new Date(b.lastReadTime).getTime() - new Date(a.lastReadTime).getTime());

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearReadingHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
};
