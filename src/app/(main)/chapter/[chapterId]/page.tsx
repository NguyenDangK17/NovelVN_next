'use client';

import React, { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FaBackward, FaExclamationCircle, FaForward, FaHome, FaInfo } from 'react-icons/fa';
import { useChapterList } from '@/hooks/useChapterList';
import { useNavigation } from '@/context/NavigationContext';
import { addToReadingHistory } from '@/utils/history';
// import CommentSection from "../../components/Comment/CommentSection";

interface ChapterData {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
  };
}

interface MangaInfo {
  id: string;
  title: string;
  coverUrl?: string;
}

interface Chapter {
  id: string;
  chapter: string;
  title?: string;
  volume?: string;
  language?: string;
}

const MangaChapterPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { navigate } = useNavigation();
  const chapterId = params.chapterId as string;
  const language = searchParams.get('lang') || 'en';
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mangaInfo, setMangaInfo] = useState<MangaInfo | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [loadedImages, setLoadedImages] = useState(5);
  const [mangaId, setMangaId] = useState<string | null>(null);

  const { chapterListData } = useChapterList(mangaId || '', language);

  // Fetch manga info from chapter ID
  useEffect(() => {
    const fetchMangaInfo = async () => {
      if (!chapterId) return;

      try {
        setLoading(true);
        // First, get the chapter details to find the manga ID
        const chapterResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/chapter/${chapterId}`
        );

        const mangaId = chapterResponse.data.data.relationships.find(
          (rel: { type: string }) => rel.type === 'manga'
        )?.id;

        if (!mangaId) {
          console.error('Could not find manga ID for chapter');
          return;
        }

        setMangaId(mangaId);

        // Then get the manga details
        const mangaResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/${mangaId}`
        );

        // Find cover art relationship
        const coverArtRelationship = mangaResponse.data.data.relationships.find(
          (rel: { type: string }) => rel.type === 'cover_art'
        );

        let coverUrl = '';
        if (coverArtRelationship) {
          // Fetch cover art data
          const coverResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/${coverArtRelationship.id}/cover`
          );

          // Construct cover URL
          coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverResponse.data.data.attributes.fileName}`;
        }

        setMangaInfo({
          id: mangaId,
          title: mangaResponse.data.data.attributes.title.en,
          coverUrl,
        });
      } catch (error) {
        console.error('Error fetching manga info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaInfo();
  }, [chapterId]);

  // Fetch manga chapter data
  useEffect(() => {
    if (!chapterId) return;

    const fetchChapter = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mangadex/at-home/server/${chapterId}`
        );
        setChapterData(response.data);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    fetchChapter();
  }, [chapterId]);

  // Update current chapter index when chapter list data changes
  useEffect(() => {
    if (chapterListData.length > 0 && chapterId) {
      // Sort chapters by decimal numbers before finding the index
      const sortedChapters = [...chapterListData].sort((a, b) => {
        const numA = parseFloat(a.chapter);
        const numB = parseFloat(b.chapter);
        return numA - numB;
      });
      const index = sortedChapters.findIndex(chapter => chapter.id === chapterId);
      setCurrentChapterIndex(index);
    }
  }, [chapterListData, chapterId]);

  // Scroll-based lazy loading
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const foundChapter = chapterListData.find(chapter => chapter.id === chapterId);
          if (foundChapter) {
            setCurrentChapter(foundChapter);
          }
          setLoadedImages(prev => {
            if (!chapterData) return prev;
            return Math.min(prev + 5, chapterData.chapter.data.length);
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapterData, chapterListData, chapterId]);

  useEffect(() => {
    if (mangaInfo && currentChapter) {
      addToReadingHistory(
        {
          _id: mangaInfo.id,
          title: mangaInfo.title,
          manga_cover: mangaInfo.coverUrl || '',
        },
        parseFloat(currentChapter.chapter)
      );
    }
  }, [mangaInfo, currentChapter]);

  if (loading || !chapterData || !mangaInfo) return <Loading />;

  const { baseUrl, chapter } = chapterData;
  const imageFiles = chapter.data;

  // Find current chapter info
  const currentChapterInfo = chapterListData.find(chapter => chapter.id === chapterId);

  const goToNextChapter = () => {
    if (currentChapterIndex !== null && currentChapterIndex < chapterListData.length - 1) {
      // Sort chapters before getting the next one
      const sortedChapters = [...chapterListData].sort((a, b) => {
        const numA = parseFloat(a.chapter);
        const numB = parseFloat(b.chapter);
        return numA - numB;
      });
      navigate(`/chapter/${sortedChapters[currentChapterIndex + 1].id}?lang=${language}`);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex !== null && currentChapterIndex > 0) {
      // Sort chapters before getting the previous one
      const sortedChapters = [...chapterListData].sort((a, b) => {
        const numA = parseFloat(a.chapter);
        const numB = parseFloat(b.chapter);
        return numA - numB;
      });
      navigate(`/chapter/${sortedChapters[currentChapterIndex - 1].id}?lang=${language}`);
    }
  };

  const goToMangaPage = () => {
    navigate(`/manga/${mangaInfo.id}`);
  };

  const handleUserClick = () => {
    setShowNav(prev => !prev);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 relative text-center" onClick={handleUserClick}>
      <h1 className="text-3xl font-bold mb-2">{mangaInfo.title}</h1>
      <h3 className="text-xl text-gray-600 mb-8">
        {currentChapterInfo ? `Chapter ${currentChapterInfo.chapter}` : 'Loading...'}
      </h3>

      <div className="hidden lg:flex fixed right-5 bottom-12 flex-col z-50 p-2">
        <button
          onClick={goToPreviousChapter}
          disabled={currentChapterIndex === 0}
          className={`p-4 shadow-lg bg-gray-700 text-white transition border border-white ${
            currentChapterIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
          }`}
        >
          <FaBackward size={20} />
        </button>

        <button
          onClick={goToMangaPage}
          className="p-4 shadow-lg bg-gray-700 text-white transition border border-white hover:bg-gray-600"
        >
          <FaHome size={20} />
        </button>

        <button
          onClick={() => console.log('Report Chapter')}
          className="p-4 shadow-lg bg-gray-700 text-white transition border border-white hover:bg-gray-600"
        >
          <FaExclamationCircle size={20} />
        </button>

        <button
          onClick={() => console.log('Sidebar List Chapter')}
          className="p-4 shadow-lg bg-gray-700 text-white transition border border-white hover:bg-gray-600"
        >
          <FaInfo size={20} />
        </button>

        <button
          onClick={goToNextChapter}
          disabled={currentChapterIndex === chapterListData.length - 1}
          className={`p-4 shadow-lg bg-gray-700 text-white transition border border-white ${
            currentChapterIndex === chapterListData.length - 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-600'
          }`}
        >
          <FaForward size={20} />
        </button>
      </div>

      {/* Bottom Navigation Bar (Visible on sm and smaller) */}
      <div
        className={`fixed bottom-0 left-0 w-full flex justify-between items-center p-4 bg-black text-white transition-transform duration-300 lg:hidden ${
          showNav ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Previous Chapter Button */}
        <button
          onClick={goToPreviousChapter}
          disabled={currentChapterIndex === 0}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow-lg transition ${
            currentChapterIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
        >
          <FaBackward size={20} />
          <span>Previous</span>
        </button>

        {/* Next Chapter Button */}
        <button
          onClick={goToNextChapter}
          disabled={currentChapterIndex === chapterListData.length - 1}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow-lg transition ${
            currentChapterIndex === chapterListData.length - 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-800'
          }`}
        >
          <span>Next</span>
          <FaForward size={20} />
        </button>
      </div>

      {/* Manga Pages */}
      {imageFiles.slice(0, loadedImages).map((filename, index) => (
        <img
          key={index}
          src={`${baseUrl}/data/${chapter.hash}/${filename}`}
          alt={`Page ${index + 1}`}
          className="w-full my-2"
          loading="lazy"
        />
      ))}

      {/* <CommentSection /> */}
    </div>
  );
};

export default MangaChapterPage;
