import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';
import { MangaDexManga, MangaDexResponse } from '@/types/mangaDex';
import axios from 'axios';

// Memoized Carousel Item component
const CarouselItem = memo(
  ({ manga, coverImages }: { manga: MangaDexManga; coverImages: Record<string, string> }) => {
    // Memoized helper functions
    const getCoverImage = useCallback(
      (manga: MangaDexManga) => {
        if (coverImages[manga.id]) {
          return coverImages[manga.id];
        }
        return 'https://mangadex.org/covers/3b62f955-732c-43b2-84e7-cc1ff57896a7/7bd9d778-ad3a-4e6c-ac9a-c8f025fb07b4.png.512.jpg';
      },
      [coverImages]
    );

    const getTags = useCallback((manga: MangaDexManga) => {
      return manga.attributes.tags
        .filter(tag => tag.attributes.group === 'genre' || tag.attributes.group === 'theme')
        .slice(0, 5)
        .map(tag => tag.attributes.name.en);
    }, []);

    const getDescription = useCallback((manga: MangaDexManga) => {
      const description =
        manga.attributes.description.en ||
        Object.values(manga.attributes.description)[0] ||
        'No description available.';
      return description.length > 300 ? description.substring(0, 300) + '...' : description;
    }, []);

    const getTitle = useCallback((manga: MangaDexManga) => {
      return (
        manga.attributes.title.vi ||
        manga.attributes.title.en ||
        Object.values(manga.attributes.title)[0] ||
        'Untitled'
      );
    }, []);

    const coverImage = useMemo(() => getCoverImage(manga), [manga, getCoverImage]);
    const title = useMemo(() => getTitle(manga), [manga, getTitle]);
    const description = useMemo(() => getDescription(manga), [manga, getDescription]);
    const tags = useMemo(() => getTags(manga), [manga, getTags]);

    return (
      <Link href={`/manga/${manga.id}`} className="block">
        <div className="relative w-full h-auto min-h-[70vh] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={coverImage}
              alt={`${title} background`}
              fill
              priority
              className="object-cover object-center"
              style={{ objectPosition: 'center 25%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(25,26,28,0.6)] to-[rgb(25,26,28)]" />
          </div>

          <div className="relative flex flex-col md:flex-row w-full h-full gap-4 mt-10 z-10">
            <div className="w-full md:w-[25%] flex justify-center items-start">
              <div className="w-full max-w-[250px] sm:max-w-[300px]">
                <Image
                  src={coverImage}
                  alt={title}
                  width={1443}
                  height={2048}
                  className="w-full h-auto aspect-[1443/2048] object-cover rounded-md shadow-md"
                  priority
                />
              </div>
            </div>
            <div className="w-full md:w-[65%] flex flex-col justify-start text-white">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-3">{title}</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-gray-700 text-xs sm:text-sm px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm sm:text-base lg:text-lg">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

CarouselItem.displayName = 'CarouselItem';

// Memoized Skeleton component
const CarouselSkeleton = memo(() => {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="relative w-full h-auto min-h-[70vh] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12">
        <div className="absolute inset-0 bg-[#191a1c] z-0" />
        <div className="relative flex flex-col md:flex-row w-full h-full gap-4 mt-10 z-10">
          <div className="w-full md:w-[25%] flex justify-center items-start">
            <div className="w-full max-w-[250px] sm:max-w-[300px]">
              <div className="w-full h-auto aspect-[1443/2048] bg-[#3f3f3f] rounded-md animate-pulse" />
            </div>
          </div>
          <div className="w-full md:w-[65%] flex flex-col justify-start">
            <div className="h-8 bg-[#3f3f3f] rounded w-3/4 mb-4 animate-pulse" />
            <div className="flex flex-wrap gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-6 bg-[#3f3f3f] rounded w-16 animate-pulse" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-[#3f3f3f] rounded w-full animate-pulse" />
              <div className="h-4 bg-[#3f3f3f] rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-[#3f3f3f] rounded w-4/6 animate-pulse" />
              <div className="h-4 bg-[#3f3f3f] rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-[#3f3f3f] rounded w-5/6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CarouselSkeleton.displayName = 'CarouselSkeleton';

const CarouselComponent: React.FC = () => {
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
        if (coverResponse.data?.data) {
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
    const fetchMangas = async (daysAgo = 30) => {
      try {
        const response = await axios.get<MangaDexResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/trending?daysAgo=${daysAgo}`
        );
        setMangas(response.data.data);
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

  if (loading) {
    return <CarouselSkeleton />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="w-full"
      >
        {mangas.map(manga => (
          <SwiperSlide key={manga.id}>
            <CarouselItem manga={manga} coverImages={coverImages} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselComponent;
