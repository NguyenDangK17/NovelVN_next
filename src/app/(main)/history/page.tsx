'use client';

import { useEffect, useState } from 'react';
import { ReadingHistory } from '@/types/manga';
import { getReadingHistory, clearReadingHistory } from '@/utils/history';
import Link from '@/components/ui/Link';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';

const HistoryPage = () => {
  const [history, setHistory] = useState<ReadingHistory[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const storedHistory = getReadingHistory();
      if (storedHistory && storedHistory.length > 0) {
        const sortedHistory = [...storedHistory].sort(
          (a, b) => new Date(b.lastReadTime).getTime() - new Date(a.lastReadTime).getTime()
        );
        setHistory(sortedHistory);
      }
    };

    loadHistory();
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your reading history?')) {
      clearReadingHistory();
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Reading History</h1>
        <p className="text-gray-400">No reading history found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-20 pb-10">
      <div className="max-w-full mx-auto px-4 lg:px-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reading History</h1>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaTrash />
            Clear History
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {history.map(item => (
            <div key={item.mangaId} className="flex flex-col">
              <div className="group">
                <Link href={`/manga/${item.mangaId}`}>
                  <Image
                    src={item.manga_cover}
                    alt={item.title}
                    width={1443}
                    height={2048}
                    className="w-full h-auto aspect-[1443/2048] object-cover hover:cursor-pointer rounded-lg"
                  />
                  <h2 className="text-lg font-bold my-2 min-h-[3rem] line-clamp-2 overflow-hidden hover:cursor-pointer group-hover:text-primary-500">
                    {item.title}
                  </h2>
                </Link>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-400 font-medium">Chapter {item.lastReadChapter}</p>
                <p className="text-gray-600 font-medium">
                  {new Date(item.lastReadTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
