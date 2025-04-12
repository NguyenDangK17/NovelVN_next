"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaHeart,
  FaStar,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaDownload,
  FaShare,
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

// Define the cover art data type
interface CoverArtData {
  id: string;
  type: string;
  attributes: {
    fileName: string;
  };
}

// Define the chapter data type
interface ChapterData {
  chapterNumber: number;
  chapter: string;
  id: string;
  volume?: string;
  others: any[];
  count: number;
}

const genres = [
  "Action",
  "Comedy",
  "Fantasy",
  "Harem",
  "School Life",
  "Shounen",
];

const MangaDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const mangaId = params.mangaId as string;

  const [manga, setManga] = useState<MangaData | null>(null);
  const [coverArt, setCoverArt] = useState<string | null>(null);
  const [openVolumes, setOpenVolumes] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const { chapterListData } = useChapterList(mangaId);

  useEffect(() => {
    if (!mangaId) return;

    const fetchMangaData = async () => {
      try {
        setLoading(true);
        // Fetch manga data
        const mangaResponse = await axios.get(
          `https://api.mangadex.org/manga/${mangaId}`
        );
        setManga(mangaResponse.data.data);

        // Find cover art relationship
        const coverArtRelationship = mangaResponse.data.data.relationships.find(
          (rel: any) => rel.type === "cover_art"
        );

        if (coverArtRelationship) {
          // Fetch cover art data
          const coverResponse = await axios.get(
            `https://api.mangadex.org/cover/${coverArtRelationship.id}?includes[]=manga`
          );

          // Construct cover URL
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

  const toggleVolume = (volumeKey: string) => {
    setOpenVolumes((prev) => ({
      ...prev,
      [volumeKey]: !prev[volumeKey],
    }));
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

  return (
    <div className="relative p-6 w-full mx-auto text-white mb-7">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 w-full h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(25, 26, 28, 0.6) 10%, rgb(25, 26, 28) 90%), url(${coverArt})`,
          backgroundPosition: "center 25%",
        }}
      />

      <div className="relative w-full max-w-screen-2xl mx-auto px-6 mt-60 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-9/12 flex flex-col gap-10">
          <div className="p-6 rounded-lg bg-[#2c2c2c]">
            <div className="relative flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-3/12 flex justify-center">
                <div className="relative w-[200px] md:w-[250px] lg:w-[283px] max-w-full">
                  <Image
                    src={coverArt || ""}
                    alt={manga.attributes.title.en}
                    width={283}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <div className="w-full md:w-9/12 flex flex-col justify-between space-y-2">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  {manga.attributes.title.en}
                </h1>

                <div className="flex flex-wrap gap-2 text-white font-semibold text-sm">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="inline-block px-3 py-1 bg-[#1f1f1f] rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <p>
                  <span className="font-semibold mr-2">Year:</span>
                  {manga.attributes.year}
                </p>
                <p className="mb-6">
                  <span className="font-semibold mr-2">Status:</span>
                  {manga.attributes.status.charAt(0).toUpperCase() +
                    manga.attributes.status.slice(1)}
                </p>

                <div className="flex flex-row gap-4">
                  <button className="flex w-full md:w-[240px] items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md">
                    <FaHeart /> Add to Favorite
                  </button>
                  <button className="flex w-full md:w-[240px] items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md">
                    <FaBookOpen /> Start Reading
                  </button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-12 w-full p-6">
                  <button className="flex flex-col items-center">
                    <FaHeart size={24} className="text-red-500" />
                    <span className="text-sm mt-1">708</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <FaStar size={24} className="text-yellow-400" />
                    <span className="text-sm mt-1">Rate</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <FaComment size={24} />
                    <span className="text-sm mt-1">Forums</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <FaDownload size={24} className="text-blue-400" />
                    <span className="text-sm mt-1">Download</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <FaShare size={24} className="text-green-400" />
                    <span className="text-sm mt-1">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-5 font-bold">
              <div>
                <p className="text-md text-gray-500">Updated On</p>
                <p className="text-2xl text-white">
                  {formatDate(manga.attributes.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-md text-gray-500">Total Chapters</p>
                <p className="text-2xl text-white">{chapterListData.length}</p>
              </div>
              <div>
                <p className="text-md text-gray-500">Rating</p>
                <p className="text-2xl text-orange-400">10,000</p>
              </div>
              <div>
                <p className="text-md text-gray-500">Available Languages</p>
                <p className="text-2xl text-white">
                  {manga.attributes.availableTranslatedLanguages.length}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-2">Alternative Titles</h2>
              {manga.attributes.altTitles.length > 0 ? (
                <ul className="space-y-1">
                  {manga.attributes.altTitles.map((altTitle, index) => {
                    const language = Object.keys(altTitle)[0];
                    return (
                      <li key={index} className="text-sm">
                        <span className="font-semibold mr-2">
                          {language.toUpperCase()}:
                        </span>
                        {altTitle[language]}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm">No alternative names available.</p>
              )}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-2">Themes</h2>
              <div className="flex flex-wrap gap-2 text-white font-semibold text-sm">
                {themes.map((theme) => (
                  <span
                    key={theme}
                    className="inline-block px-3 py-1 bg-[#1f1f1f] rounded-full"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p>{manga.attributes.description.en}</p>
            </div>
          </div>

          {/* Chapter List */}
          <div className="space-y-4">
            {/* Group chapters by volume for display */}
            {(
              Object.entries(
                chapterListData.reduce((acc, chapter) => {
                  const volume = chapter.volume || "none";
                  if (!acc[volume]) {
                    acc[volume] = [];
                  }
                  acc[volume].push(chapter);
                  return acc;
                }, {} as Record<string, ChapterData[]>)
              ) as [string, ChapterData[]][]
            ).map(([volumeKey, volumeChapters]) => (
              <div key={volumeKey} className="rounded-lg bg-[#2c2c2c]">
                <button
                  className="flex items-center justify-between w-full bg-[#2c2c2c] rounded-md px-6 py-4"
                  onClick={() => toggleVolume(volumeKey)}
                >
                  <span className="font-bold text-white text-2xl">
                    Chapter List
                  </span>
                  {openVolumes[volumeKey] ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {!openVolumes[volumeKey] && (
                  <div className="p-4 bg-[#1e1e1e] flex flex-col md:flex-row">
                    <Image
                      src={coverArt || ""}
                      alt="Cover"
                      width={150}
                      height={200}
                      className="w-[141px] h-[201px] mx-auto md:mx-0 md:mr-6 object-cover"
                    />
                    <div className="flex-1">
                      <ul className="overflow-y-auto max-h-64">
                        {volumeChapters
                          .sort(
                            (a: ChapterData, b: ChapterData) =>
                              a.chapterNumber - b.chapterNumber
                          )
                          .map((chapter: ChapterData) => (
                            <li
                              key={chapter.id}
                              className="py-2 border-b border-gray-700 hover:bg-[#292929] cursor-pointer px-3"
                              onClick={() =>
                                router.push(`/chapter/${chapter.id}`)
                              }
                            >
                              Chapter {chapter.chapter}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related/Sidebar (same as yours) */}
        {/* Right Column */}
        <div className="w-full lg:w-3/12 hidden lg:block">
          <div className="bg-[#2c2c2c] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Related Novels</h2>
            <ul className="space-y-3">
              <li className="text-sm hover:underline cursor-pointer">
                Related Novel 1
              </li>
              <li className="text-sm hover:underline cursor-pointer">
                Related Novel 2
              </li>
              <li className="text-sm hover:underline cursor-pointer">
                Related Novel 3
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">[Ad Placeholder]</p>
          </div>

          <div className="bg-[#2c2c2c] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
            <p className="text-md text-gray-500">Updated On</p>
            <p className="text-xl font-bold text-white">
              {formatDate(manga.attributes.updatedAt)}
            </p>
          </div>
        </div>

        {/* Show Right Column Content Below on Tablets */}
        <div className="block lg:hidden w-full">
          <div className="bg-[#2c2c2c] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Related Novels</h2>
            <ul className="space-y-3">
              <li className="text-sm hover:underline cursor-pointer">
                Related Novel 1
              </li>
              <li className="text-sm hover:underline cursor-pointer">
                Related Novel 2
              </li>
              <li className="text-sm hover:underline cursor-pointer">
                Related Novel 3
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-sm">[Ad Placeholder]</p>
          </div>

          <div className="bg-[#2c2c2c] p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
            <p className="text-md text-gray-500">Updated On</p>
            <p className="text-xl font-bold text-white">
              {formatDate(manga.attributes.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetailPage;
