"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaStar,
  FaBookOpen,
  FaGlobe,
  FaCalendarAlt,
  FaUser,
  FaPen,
  FaInfoCircle,
  FaBookmark,
} from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
import Loading from "@/app/loading";
import { useChapterList } from "@/hooks/useChapterList";

// Define the manga data type based on the new API structure
interface MangaData {
  id: string;
  type: string;
  attributes: {
    title: {
      en: string;
      [key: string]: string;
    };
    altTitles: Array<{
      [key: string]: string;
    }>;
    description: {
      en: string;
      [key: string]: string;
    };
    status: string;
    year: number;
    tags: Array<{
      id: string;
      type: string;
      attributes: {
        name: {
          en: string;
          [key: string]: string;
        };
        group: string;
      };
    }>;
    availableTranslatedLanguages: string[];
    updatedAt: string;
  };
  relationships: Array<{
    id: string;
    type: string;
  }>;
}

const MangaDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const mangaId = params.mangaId as string;

  const [manga, setManga] = useState<MangaData | null>(null);
  const [coverArt, setCoverArt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  const { chapterListData } = useChapterList(mangaId);

  useEffect(() => {
    if (!mangaId) return;

    const fetchMangaData = async () => {
      try {
        setLoading(true);
        const mangaResponse = await axios.get(
          `https://api.mangadex.org/manga/${mangaId}`
        );
        setManga(mangaResponse.data.data);

        const coverArtRelationship = mangaResponse.data.data.relationships.find(
          (rel: any) => rel.type === "cover_art"
        );

        if (coverArtRelationship) {
          const coverResponse = await axios.get(
            `https://api.mangadex.org/cover/${coverArtRelationship.id}?includes[]=manga`
          );

          const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverResponse.data.data.attributes.fileName}`;
          setCoverArt(coverUrl);
        }
      } catch (error) {
        console.error("Error fetching manga data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaData();
  }, [mangaId]);

  if (loading || !manga) return <Loading />;

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  // Get genres from tags
  const genres = manga.attributes.tags
    .filter((tag) => tag.attributes.group === "genre")
    .map((tag) => tag.attributes.name.en);

  // Get themes from tags
  const themes = manga.attributes.tags
    .filter((tag) => tag.attributes.group === "theme")
    .map((tag) => tag.attributes.name.en);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Find author and artist from relationships
  const findRelationship = (type: string) => {
    const relationship = manga.relationships.find((rel) => rel.type === type);
    return relationship ? relationship.id : "Unknown";
  };

  const authorId = findRelationship("author");
  const artistId = findRelationship("artist");

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: any;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      <span className="font-medium w-20">{label}</span>
      <span>{value}</span>
    </div>
  );

  const StatsRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );

  const RatingSection = ({
    userRating,
    handleRating,
  }: {
    userRating: number;
    handleRating: (rating: number) => void;
  }) => (
    <div className="bg-[#2c2c2c] rounded-lg p-4">
      <h3 className="font-bold mb-3 text-base">Rating</h3>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-2xl font-bold">4.5</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${
                star <= 4 ? "text-yellow-400" : "text-gray-600"
              } text-base cursor-pointer`}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>
        <span className="text-sm text-gray-400">(1,234 ratings)</span>
      </div>
      <button className="w-full py-2 bg-[#1a1a1a] hover:bg-[#333333] rounded text-sm">
        Rate this manga
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{
            backgroundImage: `url(${coverArt})`,
            backgroundPosition: "center 30%",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 px-4 py-6 sm:px-6 md:px-8 lg:px-12 flex items-center justify-start mt-12">
          <div className="flex flex-row items-stretch gap-4 w-full flex-wrap">
            <div className="relative w-[30%] max-w-[200px] min-w-[100px] aspect-[1443/2048] flex-shrink-0">
              <Image
                src={coverArt || ""}
                alt={manga.attributes.title.en || "Manga cover"}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col flex-1 min-h-[100%]">
              <div className="flex flex-col h-full justify-between">
                {/* Title at top */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold break-words">
                  {manga.attributes.title.en ||
                    manga.attributes.altTitles[0].en ||
                    "Manga title"}
                </h1>

                {/* Action buttons pinned to bottom */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-12 py-2 text-lg font-medium bg-primary-500 hover:bg-primary-700 rounded">
                    <FaBookOpen />
                    <span>Read Now</span>
                  </button>
                  <button className="flex items-center gap-2 px-12 py-2 text-lg font-medium bg-[#2c2c2c] hover:bg-[#333333] rounded">
                    <FaBookmark />
                    <span>Bookmark</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            {/* Manga Info */}
            <div className="bg-[#2c2c2c] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="font-bold mb-2 text-2xl text-primary-500">
                  Manga Information
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <InfoRow
                      icon={<FaUser />}
                      label="Author:"
                      value={authorId}
                    />
                    <InfoRow
                      icon={<FaPen />}
                      label="Artist:"
                      value={artistId}
                    />
                    <InfoRow
                      icon={<FaCalendarAlt />}
                      label="Release:"
                      value={manga.attributes.year}
                    />
                    <InfoRow
                      icon={<FaInfoCircle />}
                      label="Status:"
                      value={manga.attributes.status}
                    />
                    <InfoRow
                      icon={<FaGlobe />}
                      label="Languages:"
                      value={manga.attributes.availableTranslatedLanguages.join(
                        ", "
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-md mb-1">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 bg-[#1a1a1a] rounded text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-md mb-1">Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {themes.map((theme) => (
                          <span
                            key={theme}
                            className="px-2 py-1 bg-[#1a1a1a] rounded text-xs"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-bold mb-2 text-lg text-primary-500">
                    Description
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {manga.attributes.description.en}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-lg text-primary-500">
                    Alternative Titles
                  </h3>
                  <div className="space-y-1">
                    {manga.attributes.altTitles.map((altTitle, index) => {
                      const language = Object.keys(altTitle)[0];
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-gray-400 w-16">
                            {language}:
                          </span>
                          <span>{altTitle[language]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="bg-[#2c2c2c] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between gap-2">
                <h2 className="font-bold mb-2 text-lg text-primary-500">
                  Chapters
                </h2>
                <div className="flex gap-2">
                  <select className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-sm">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                  <select className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-sm">
                    <option value="all">All Languages</option>
                    <option value="en">English</option>
                    <option value="jp">Japanese</option>
                  </select>
                </div>
              </div>
              <div className="divide-y divide-gray-700">
                {chapterListData
                  .sort((a, b) => a.chapterNumber - b.chapterNumber)
                  .map((chapter) => (
                    <div
                      key={chapter.id}
                      className="p-4 hover:bg-[#333333] cursor-pointer flex justify-between items-center"
                      onClick={() => router.push(`/chapter/${chapter.id}`)}
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <FaBookOpen className="text-gray-400" />
                        <span>Chapter {chapter.chapter}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex gap-2">
                        <span>English</span>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            {/* Stats */}
            <div className="bg-[#2c2c2c] rounded-lg p-4">
              <h3 className="font-bold mb-3 text-base">Stats</h3>
              <StatsRow label="Views" value="1,234,567" />
              <StatsRow label="Bookmarks" value="12,345" />
              <StatsRow label="Chapters" value={chapterListData.length} />
              <StatsRow
                label="Last Updated"
                value={formatDate(manga.attributes.updatedAt)}
              />
            </div>

            {/* Rating */}
            <RatingSection
              userRating={userRating}
              handleRating={handleRating}
            />

            {/* Related Manga */}
            <div className="bg-[#2c2c2c] rounded-lg p-4">
              <h2 className="font-bold mb-2 text-lg text-primary-500">
                Related Manga
              </h2>
              <p className="text-sm text-gray-400">No related manga found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetailPage;
