import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';
import { MangaDexManga, MangaDexResponse } from '@/types/mangaDex';
import axios from 'axios';

const CarouselComponent: React.FC = () => {
  const [mangas, setMangas] = useState<MangaDexManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverImages, setCoverImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
        const formattedDate = sevenDaysAgo.toISOString().split('T')[0] + 'T00:00:00';

        const response = await axios.get<MangaDexResponse>(
          `https://api.mangadex.org/manga?limit=10&includedTagsMode=AND&excludedTagsMode=OR&availableTranslatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&createdAtSince=${formattedDate}&order%5BfollowedCount%5D=desc&hasAvailableChapters=true`
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
          `https://api.mangadex.org/cover/${coverArtRelationship.id}?includes[]=manga`
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

  // Function to get tags for a manga
  const getTags = (manga: MangaDexManga) => {
    return manga.attributes.tags
      .filter(tag => tag.attributes.group === 'genre' || tag.attributes.group === 'theme')
      .slice(0, 5) // Limit to 5 tags
      .map(tag => tag.attributes.name.en);
  };

  // Function to get description for a manga
  const getDescription = (manga: MangaDexManga) => {
    // Try to get English description first, then any available
    const description =
      manga.attributes.description.en ||
      Object.values(manga.attributes.description)[0] ||
      'No description available.';

    // Truncate description if it's too long
    return description.length > 300 ? description.substring(0, 300) + '...' : description;
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

  // Skeleton loader component
  const CarouselSkeleton = () => {
    return (
      <div className="max-w-screen-2xl mx-auto">
        <div className="relative w-full h-auto min-h-[70vh] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12">
          {/* Background Skeleton */}
          <div className="absolute inset-0 bg-[#191a1c] z-0" />

          {/* Content Wrapper */}
          <div className="relative flex flex-col md:flex-row w-full h-full gap-4 mt-10 z-10">
            {/* Image Skeleton */}
            <div className="w-full md:w-[25%] flex justify-center items-start">
              <div className="w-full max-w-[250px] sm:max-w-[300px]">
                <div className="w-full h-auto aspect-[1443/2048] bg-[#3f3f3f] rounded-md animate-pulse" />
              </div>
            </div>

            {/* Text content Skeleton */}
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
  };

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
            <Link href={`/manga/${manga.id}`} className="block">
              <div className="relative w-full h-auto min-h-[70vh] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-12">
                {/* Background Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(25, 26, 28, 0.6) 10%, rgb(25, 26, 28) 90%), url(${getCoverImage(
                      manga
                    )})`,
                    backgroundPosition: 'center 25%',
                  }}
                />

                {/* Content Wrapper */}
                <div className="relative flex flex-col md:flex-row w-full h-full gap-4 mt-10 z-10">
                  {/* Image */}
                  <div className="w-full md:w-[25%] flex justify-center items-start">
                    <div className="w-full max-w-[250px] sm:max-w-[300px]">
                      <Image
                        src={getCoverImage(manga)}
                        alt={getTitle(manga)}
                        width={1443}
                        height={2048}
                        className="w-full h-auto aspect-[1443/2048] object-cover rounded-md shadow-md"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="w-full md:w-[65%] flex flex-col justify-start text-white">
                    <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-3">
                      {getTitle(manga)}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {getTags(manga).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-700 text-xs sm:text-sm px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm sm:text-base lg:text-lg">{getDescription(manga)}</p>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselComponent;
