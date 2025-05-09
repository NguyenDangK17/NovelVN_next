'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Manga } from '@/types/manga';
import CarouselComponent from '@/components/Home/Carousel';
import Link from '@/components/ui/Link';
import Image from 'next/image';
import TrendingToday from '@/components/Home/TrendingToday';
import ReadingHistory from '@/components/Home/ReadingHistory';
import Ranking from '@/components/Home/Ranking';

// Dummy Notice Board Data
const notices = [
  {
    id: 1,
    title: 'Site Maintenance on Feb 20',
    author: 'Admin',
    timestamp: 'Feb 18, 2025',
    content:
      'We will be performing scheduled maintenance on February 20th at 2:00 AM UTC. Expect some downtime during this period.',
  },
  {
    id: 2,
    title: 'New Comics Added!',
    author: 'Moderator',
    timestamp: 'Feb 16, 2025',
    content:
      "We have added 10 new trending comics this week! Check them out in the 'Trending Today' section.",
  },
  {
    id: 3,
    title: 'Bug Fix: Login Issues Resolved',
    author: 'Admin',
    timestamp: 'Feb 15, 2025',
    content:
      'Some users were experiencing login issues. This has now been fixed. Let us know if you encounter any further problems.',
  },
  {
    id: 4,
    title: 'Community Guidelines Updated',
    author: 'Moderator',
    timestamp: 'Feb 10, 2025',
    content:
      'Please review the latest updates to our community guidelines. We aim to make this a friendly and welcoming place for all users.',
  },
];

// Dummy Forum Data
const forums = [
  {
    id: 1,
    title: 'Favorite Manga of 2025?',
    author: 'MangaFan',
    timestamp: 'Feb 17, 2025',
    replies: 24,
  },
  {
    id: 2,
    title: 'Best Plot Twists',
    author: 'PlotTwistLover',
    timestamp: 'Feb 16, 2025',
    replies: 15,
  },
  {
    id: 3,
    title: 'Recommendations for New Readers',
    author: 'NewbieGuide',
    timestamp: 'Feb 15, 2025',
    replies: 30,
  },
  {
    id: 4,
    title: 'Upcoming Releases',
    author: 'ReleaseWatcher',
    timestamp: 'Feb 14, 2025',
    replies: 10,
  },
];

const Home = () => {
  const [comics, setComics] = useState<Manga[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mangas`).then(res => setComics(res.data));
  }, []);

  const truncateTitle = useCallback((title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    const truncated = title.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
  }, []);

  const MangaCard = ({ manga }: { manga: Manga }) => (
    <div className="flex flex-col">
      <div className="group">
        <Link href={`/manga/${manga._id}`}>
          <Image
            src={manga.manga_cover}
            alt={manga.title}
            width={1443}
            height={2048}
            className="w-full h-auto aspect-[1443/2048] object-cover hover:cursor-pointer"
          />
          <h2
            className="text-lg font-bold my-2 min-h-[3rem] line-clamp-2 overflow-hidden
            hover:cursor-pointer group-hover:text-primary-500"
          >
            {truncateTitle(manga.title, 40)}
          </h2>
        </Link>
      </div>
      {[1, 2, 3].map(chapter => (
        <div key={chapter} className="flex justify-between items-center text-sm mb-1">
          <p className="text-gray-400 font-medium flex items-center hover:text-gray-700 hover:cursor-pointer">
            Chapter {chapter}
          </p>
          <p className="text-gray-600 font-medium flex items-center">{chapter * 3} hours ago</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full pb-16 overflow-x-hidden">
      <CarouselComponent />

      {/* Main Content Layout */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-7 grid grid-cols-12 gap-6">
        {/* Popular Section - 9/12 width */}
        <div className="col-span-12 lg:col-span-9">
          <TrendingToday />
          <h1 className="text-3xl font-bold p-4 text-left">Notice Board</h1>
          <div className="px-4">
            <ul className="space-y-2">
              {notices.map(notice => (
                <li
                  key={notice.id}
                  className="p-4 rounded-lg hover:bg-[#3a3a3a] transition cursor-pointer"
                  onClick={() => alert(`Opening notice: ${notice.title}`)}
                >
                  <h2 className="text-lg text-primary-500 font-bold">{notice.title}</h2>
                  <p className="text-sm text-gray-400">
                    By {notice.author} • {notice.timestamp}
                  </p>
                  <p className="text-sm mt-1 text-white">{truncateTitle(notice.content, 100)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular (Custom Tabs) Section - 3/12 width */}
        <div className="col-span-12 lg:col-span-3">
          <Ranking />
        </div>

        {/* Novels & Manga Section - 9/12 width */}
        <div className="col-span-12 lg:col-span-9 px-4">
          <div className="flex justify-between items-center mb-6 py-4">
            <h1 className="text-3xl font-bold text-left">Self-Published</h1>
            <Link
              href="/self-published"
              className="text-lg text-primary-500 hover:text-primary-700 cursor-pointer"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {comics.slice(0, 5).map(comic => (
              <MangaCard key={comic._id} manga={comic} />
            ))}
          </div>

          <div className="flex justify-between items-center mt-12 mb-6 py-4">
            <h1 className="text-3xl font-bold text-left">Latest Updates</h1>
            <Link
              href="/manga"
              className="text-lg text-primary-500 hover:text-primary-700 cursor-pointer"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {comics.slice(0, 10).map(comic => (
              <MangaCard key={comic._id} manga={comic} />
            ))}
          </div>

          <ReadingHistory />
        </div>

        {/* Comments Section - 3/12 width */}
        <div className="col-span-12 lg:col-span-3 px-4">
          <h1 className="text-3xl font-bold py-4 text-left">Forums</h1>
          <div className="rounded-lg shadow-md">
            <ul className="space-y-2">
              {forums.map(forum => (
                <li
                  key={forum.id}
                  className="py-2 rounded-lg transition cursor-pointer"
                  onClick={() => alert(`Opening forum: ${forum.title}`)}
                >
                  <h2 className="text-lg text-primary-500 font-bold hover:text-[#8f2403]">
                    {forum.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    By {forum.author} • {forum.timestamp} • {forum.replies} replies
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <h1 className="text-3xl font-bold py-4 mt-6 text-left">Latest Comments</h1>
          <div className="rounded-lg shadow-md">
            <ul className="space-y-4">
              {[
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'User123',
                  comment: 'This manga is 🔥!',
                  comicTitle: 'Comic Title 1',
                  timestamp: '2 hours ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'MangaLover',
                  comment: 'Whens the next update?',
                  comicTitle: 'Comic Title 2',
                  timestamp: '5 hours ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'Reader99',
                  comment:
                    'Plot twist was insane! What an insane chapter! Good work trans, keep it up!',
                  comicTitle: 'Comic Title 3 Comic Title 3 Comic Title 3 Comic Title 3',
                  timestamp: '1 day ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'Reader99',
                  comment:
                    'Plot twist was insane! What an insane chapter! Good work trans, keep it up!',
                  comicTitle: 'Comic Title 3 Comic Title 3 Comic Title 3 Comic Title 3',
                  timestamp: '1 day ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'Reader99',
                  comment:
                    'Plot twist was insane! What an insane chapter! Good work trans, keep it up!',
                  comicTitle: 'Comic Title 3 Comic Title 3 Comic Title 3 Comic Title 3',
                  timestamp: '1 day ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'Reader99',
                  comment:
                    'Plot twist was insane! What an insane chapter! Good work trans, keep it up!',
                  comicTitle: 'Comic Title 3 Comic Title 3 Comic Title 3 Comic Title 3',
                  timestamp: '1 day ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'Reader99',
                  comment:
                    'Plot twist was insane! What an insane chapter! Good work trans, keep it up!',
                  comicTitle: 'Comic Title 3 Comic Title 3 Comic Title 3 Comic Title 3',
                  timestamp: '1 day ago',
                },
                {
                  avatar: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
                  username: 'Reader99',
                  comment:
                    'Plot twist was insane! What an insane chapter! Good work trans, keep it up!',
                  comicTitle: 'Comic Title 3 Comic Title 3 Comic Title 3 Comic Title 3',
                  timestamp: '1 day ago',
                },
              ].map((comment, index) => (
                <li key={index} className="flex flex-col">
                  <h2 className="text-md font-bold text-primary-500 hover:text-[#8f2403] hover:cursor-pointer">
                    {truncateTitle(comment.comicTitle, 40)}
                  </h2>
                  <div className="flex items-start space-x-4 py-2 border-b-2 border-gray-600">
                    <Image
                      src={comment.avatar}
                      alt={comment.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 mb-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white">{comment.username}</span>
                        <span className="text-sm text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {truncateTitle(comment.comment, 60)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
