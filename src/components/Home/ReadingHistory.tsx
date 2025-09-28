import type { ReadingHistory } from '@/types/manga';
import Link from '@/components/ui/Link';
import Image from 'next/image';
import { getReadingHistory } from '@/utils/history';
import { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';

const ReadingHistory = () => {
  const [history, setHistory] = useState<ReadingHistory[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const storedHistory = getReadingHistory();
      if (storedHistory && storedHistory.length > 0) {
        // Ensure history is sorted by lastReadTime
        const sortedHistory = [...storedHistory].sort(
          (a, b) => new Date(b.lastReadTime).getTime() - new Date(a.lastReadTime).getTime()
        );
        setHistory(sortedHistory);
      }
    };

    loadHistory();
    // Add event listener for storage changes
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reading History</h1>
        <Link
          href="/history"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <FaHistory />
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {history.slice(0, 5).map(item => (
          <div key={item.mangaId} className="flex flex-col">
            <div className="group">
              <Link href={`/manga/${item.mangaId}`}>
                <Image
                  src={item.manga_cover}
                  // alt={item.title}
                  alt="Manga Cover"
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
  );
};

export default ReadingHistory;
