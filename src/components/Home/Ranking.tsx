'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MangaDexManga, MangaDexResponse } from '@/types/mangaDex';
import axios from 'axios';

const FALLBACK_COVER =
  'https://mangadex.org/covers/3b62f955-732c-43b2-84e7-cc1ff57896a7/7bd9d778-ad3a-4e6c-ac9a-c8f025fb07b4.png.512.jpg';

const coverCache = new Map<string, string>();

const Ranking: React.FC = () => {
  const [mangas, setMangas] = useState<MangaDexManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'all time'>('weekly');
  const [coverImages, setCoverImages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null); // ✅ track errors
  const [staleData, setStaleData] = useState<MangaDexManga[]>([]); // ✅ keep old results

  const fetchCoverImage = useCallback(async (manga: MangaDexManga) => {
    if (coverCache.has(manga.id)) {
      setCoverImages(prev => ({ ...prev, [manga.id]: coverCache.get(manga.id)! }));
      return;
    }

    try {
      const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
      if (!coverRel) return;

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/${coverRel.id}/cover`
      );
      const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${data.data.attributes.fileName}`;

      coverCache.set(manga.id, coverUrl);
      setCoverImages(prev => ({ ...prev, [manga.id]: coverUrl }));
    } catch (err) {
      console.error(`Cover fetch failed for ${manga.id}`, err);
    }
  }, []);

  useEffect(() => {
    const fetchMangas = async () => {
      setLoading(true);
      try {
        let daysAgo = 7;
        if (activeTab === 'monthly') daysAgo = 60;
        if (activeTab === 'all time') daysAgo = 365;

        const { data } = await axios.get<MangaDexResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/trending?daysAgo=${daysAgo}`
        );

        setMangas(data.data);
        setStaleData(data.data); // ✅ store as backup
        data.data.forEach(manga => fetchCoverImage(manga));
        setError(null); // reset error if successful
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            setError('Server error (500): please try again later.');
          } else {
            setError('Failed to load mangas.');
          }
        } else {
          setError('Unexpected error occurred.');
        }

        // ✅ fallback to stale data if available
        if (staleData.length > 0) {
          setMangas(staleData);
        } else {
          setMangas([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, [activeTab, fetchCoverImage, staleData]);

  const getTitle = (manga: MangaDexManga) =>
    manga.attributes.title.vi ||
    manga.attributes.title.en ||
    Object.values(manga.attributes.title)[0] ||
    'Untitled';

  const truncateTitle = (title: string, max: number) =>
    title.length <= max ? title : title.slice(0, max).split(' ').slice(0, -1).join(' ') + '...';

  const getCover = (manga: MangaDexManga) => coverImages[manga.id] || FALLBACK_COVER;

  // Skeleton only for list items
  const ListSkeleton = () => (
    <ul className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <li key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="w-8 h-8 bg-[#2c2c2c] rounded" />
          <div className="w-20 h-28 bg-[#2c2c2c] rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#2c2c2c] rounded w-3/4" />
            <div className="h-3 bg-[#2c2c2c] rounded w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold py-4 text-left">Ranking</h1>

      {/* Tabs always visible */}
      <div className="flex mb-4">
        {['weekly', 'monthly', 'all time'].map(tab => (
          <button
            key={tab}
            className={`flex-1 py-2 text-md font-semibold transition-colors text-center ${
              activeTab === tab ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* List, skeleton, or error */}
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <div className="text-red-500 font-semibold py-4">{error}</div>
      ) : (
        <ul className="space-y-4">
          {mangas.slice(0, 6).map((manga, index) => (
            <li
              key={manga.id}
              className="flex items-center hover:text-primary-500 rounded-lg cursor-pointer group h-[114px]"
            >
              <Link href={`/manga/${manga.id}`} className="flex items-center w-full">
                <span
                  className={`text-3xl text-center font-bold mr-2 min-w-[2rem] ${
                    index === 0
                      ? 'text-yellow-500'
                      : index === 1
                        ? 'text-[#b5b7bb]'
                        : index === 2
                          ? 'text-[#cd7f32]'
                          : 'text-white'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="relative w-20 h-[114px] flex-shrink-0">
                  <Image
                    src={getCover(manga)}
                    alt={getTitle(manga)}
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                </div>
                <div className="ml-4 h-[114px] flex flex-col justify-start">
                  <h2
                    className={`text-md xl:text-lg font-bold group-hover:text-primary-500 ${
                      index === 0
                        ? 'text-yellow-500'
                        : index === 1
                          ? 'text-[#b5b7bb]'
                          : index === 2
                            ? 'text-[#cd7f32]'
                            : 'text-white'
                    }`}
                  >
                    {truncateTitle(getTitle(manga), 25)}
                  </h2>
                  {manga.attributes.description.en && (
                    <p className="text-sm text-gray-600 lg:hidden xl:block">
                      {truncateTitle(manga.attributes.description.en, 45)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(Ranking);
