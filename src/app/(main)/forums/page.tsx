import React from 'react';
import Link from 'next/link';
import { FaComments, FaEye, FaUser, FaClock } from 'react-icons/fa';

// Hardcoded forum data
const forumCategories = [
  {
    id: 1,
    title: 'General Discussion',
    description: 'Discuss anything related to manga and novels',
    topics: 156,
    posts: 892,
    lastPost: {
      title: "What's your favorite manga genre?",
      author: 'MangaFan123',
      time: '2 hours ago',
    },
  },
  {
    id: 2,
    title: 'Manga Reviews',
    description: 'Share your thoughts and reviews about manga series',
    topics: 89,
    posts: 445,
    lastPost: {
      title: 'Review: One Piece Chapter 1089',
      author: 'ReviewMaster',
      time: '5 hours ago',
    },
  },
  {
    id: 3,
    title: 'Novel Recommendations',
    description: 'Get and share novel recommendations',
    topics: 234,
    posts: 1203,
    lastPost: {
      title: 'Looking for romance novel recommendations',
      author: 'BookWorm',
      time: '1 day ago',
    },
  },
];

const recentTopics = [
  {
    id: 1,
    title: 'Best manga of 2024 so far?',
    author: 'MangaLover',
    category: 'General Discussion',
    replies: 45,
    views: 892,
    lastActivity: '30 minutes ago',
  },
  {
    id: 2,
    title: 'New chapter discussion: Jujutsu Kaisen',
    author: 'JJKFan',
    category: 'Manga Reviews',
    replies: 23,
    views: 456,
    lastActivity: '1 hour ago',
  },
  {
    id: 3,
    title: 'Recommend me some isekai novels',
    author: 'NovelReader',
    category: 'Novel Recommendations',
    replies: 67,
    views: 789,
    lastActivity: '2 hours ago',
  },
];

const ForumPage = () => {
  return (
    <div className="min-h-screen text-white pt-20 pb-10">
      <div className="max-w-full mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forums</h1>
          <p className="text-gray-400">
            Join the discussion with other manga and novel enthusiasts
          </p>
        </div>

        {/* Forum Categories */}
        <div className="space-y-6 mb-12">
          {forumCategories.map(category => (
            <div
              key={category.id}
              className="bg-[#2c2c2c] rounded-lg overflow-hidden hover:border-primary-500 border border-gray-700 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-white mb-2">{category.title}</h2>
                    <p className="text-gray-400">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div>
                      <span className="font-semibold text-white">{category.topics}</span> topics
                    </div>
                    <div>
                      <span className="font-semibold text-white">{category.posts}</span> posts
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#212328] px-6 py-3">
                <div className="flex items-center text-sm text-gray-400">
                  <FaComments className="mr-2" />
                  <span>Last post: </span>
                  <Link href="#" className="ml-2 text-primary-500 hover:text-primary-400">
                    {category.lastPost.title}
                  </Link>
                  <span className="mx-2">by</span>
                  <span className="text-white">{category.lastPost.author}</span>
                  <FaClock className="ml-2 mr-1" />
                  <span>{category.lastPost.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Topics */}
        <div className="bg-[#2c2c2c] rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Recent Topics</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {recentTopics.map(topic => (
              <div key={topic.id} className="p-6 hover:bg-[#212328] transition-colors duration-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <Link
                      href="#"
                      className="text-lg font-semibold text-white hover:text-primary-500"
                    >
                      {topic.title}
                    </Link>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <FaUser className="mr-2" />
                      <span>{topic.author}</span>
                      <span className="mx-2">•</span>
                      <span>{topic.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <FaComments className="mr-2" />
                      <span>{topic.replies}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEye className="mr-2" />
                      <span>{topic.views}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      <span>{topic.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
