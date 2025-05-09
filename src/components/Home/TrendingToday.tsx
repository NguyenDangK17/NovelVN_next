'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
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

  const fetchCoverImage = useCallback(async (manga: MangaDexManga) => {
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
  }, []);

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
  }, [fetchCoverImage]);

  const getCoverImage = useCallback(
    (manga: MangaDexManga) => {
      if (coverImages[manga.id]) {
        return coverImages[manga.id];
      }
      return 'https://mangadex.org/covers/3b62f955-732c-43b2-84e7-cc1ff57896a7/7bd9d778-ad3a-4e6c-ac9a-c8f025fb07b4.png.512.jpg';
    },
    [coverImages]
  );

  const getTitle = useCallback((manga: MangaDexManga) => {
    return (
      manga.attributes.title.vi ||
      manga.attributes.title.en ||
      Object.values(manga.attributes.title)[0] ||
      'Untitled'
    );
  }, []);

  const truncateTitle = useCallback((title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    const truncated = title.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
  }, []);

  const TrendingSkeleton = memo(() => {
    return (
      <>
        <h1 className="text-3xl font-bold mb-6 p-4 text-left">Trending Today</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center justify-center p-4">
              <div className="relative w-full aspect-[1443/2048]">
                <div className="w-full h-full bg-[#2c2c2c] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  });

  TrendingSkeleton.displayName = 'TrendingSkeleton';

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
                <div className="relative w-full aspect-[1443/2048]">
                  <Image
                    src={getCoverImage(manga)}
                    alt={getTitle(manga)}
                    width={1443}
                    height={2048}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    quality={85}
                    className="w-full h-full object-cover hover:cursor-pointer"
                    loading="lazy"
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

export default memo(TrendingToday);
