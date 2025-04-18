'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Link from 'next/link';
import Image from 'next/image';
import { MangaDexManga, MangaDexResponse } from '@/types/mangaDex';
import axios from 'axios';

const TrendingToday: React.FC = () => {
  const [mangas, setMangas] = useState<MangaDexManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverImages, setCoverImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMangas = async (daysAgo = 3) => {
      try {
        const response = await axios.get<MangaDexResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/trending?daysAgo=${daysAgo}`
        );
        setMangas(response.data.data);

        // Fetch cover images for each manga
        const coverPromises = response.data.data.map(manga => fetchCoverImage(manga));
        await Promise.all(coverPromises);
      } catch (error) {
        console.error('Error fetching manga data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  // Function to fetch cover image details for a manga
  const fetchCoverImage = async (manga: MangaDexManga) => {
    try {
      const coverArtRelationship = manga.relationships.find(rel => rel.type === 'cover_art');

      if (coverArtRelationship) {
        const coverResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/${coverArtRelationship.id}/cover`
        );

        if (coverResponse.data && coverResponse.data.data) {
          const coverData = coverResponse.data.data;
          const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverData.attributes.fileName}`;

          setCoverImages(prev => ({
            ...prev,
            [manga.id]: coverUrl,
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching cover for manga ${manga.id}:`, error);
    }
  };

  // Function to get cover image URL for a manga
  const getCoverImage = (manga: MangaDexManga) => {
    // Return the cached cover image URL if available
    if (coverImages[manga.id]) {
      return coverImages[manga.id];
    }

    // Fallback image if no cover art is found
    return 'https://mangadex.org/covers/3b62f955-732c-43b2-84e7-cc1ff57896a7/7bd9d778-ad3a-4e6c-ac9a-c8f025fb07b4.png.512.jpg';
  };

  // Function to get title for a manga
  const getTitle = (manga: MangaDexManga) => {
    // Try to get Vietnamese title first, then English, then any available
    return (
      manga.attributes.title.vi ||
      manga.attributes.title.en ||
      Object.values(manga.attributes.title)[0] ||
      'Untitled'
    );
  };

  const truncateTitle = useCallback((title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    const truncated = title.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
  }, []);

  // Skeleton loader component
  const TrendingSkeleton = () => {
    return (
      <>
        <div className="h-10 bg-[#2c2c2c] rounded w-48 mb-6 ml-4 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex flex-col items-center justify-center p-4">
              <div className="relative w-full">
                <div className="w-full h-auto aspect-[1443/2048] bg-[#2c2c2c] rounded animate-pulse" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-800 rounded-b">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="h-6 bg-gray-600 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  if (loading) {
    return <TrendingSkeleton />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 p-4 text-left">Trending Today</h1>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={4}
        slidesPerGroup={4}
        breakpoints={{
          1024: {
            slidesPerView: 4,
            slidesPerGroup: 2,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 2,
          },
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
        }}
        className="px-4 pb-12"
      >
        {mangas.map(manga => (
          <SwiperSlide key={manga.id}>
            <div className="flex flex-col items-center justify-center hover:cursor-pointer group p-4">
              <Link href={`/manga/${manga.id}`} className="relative w-full">
                <div className="relative w-full">
                  <Image
                    src={getCoverImage(manga)}
                    alt={getTitle(manga)}
                    width={1443}
                    height={2048}
                    className="w-full h-auto aspect-[1443/2048] object-cover hover:cursor-pointer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h2 className="text-lg font-bold text-white group-hover:text-primary-500">
                        {truncateTitle(getTitle(manga), 35)}
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default TrendingToday;
