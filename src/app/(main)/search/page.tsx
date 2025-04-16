'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';

// Hardcoded manga data
const mangaList = [
  {
    id: 1,
    title: 'One Piece',
    cover: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
    author: 'Eiichiro Oda',
    genres: ['Action', 'Adventure', 'Comedy'],
    status: 'Ongoing',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Jujutsu Kaisen',
    cover: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
    author: 'Gege Akutami',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    status: 'Ongoing',
    rating: 4.7,
  },
  {
    id: 3,
    title: 'Demon Slayer',
    cover: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
    author: 'Koyoharu Gotouge',
    genres: ['Action', 'Fantasy', 'Historical'],
    status: 'Completed',
    rating: 4.6,
  },
  {
    id: 4,
    title: 'Attack on Titan',
    cover: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
    author: 'Hajime Isayama',
    genres: ['Action', 'Drama', 'Fantasy'],
    status: 'Completed',
    rating: 4.9,
  },
  {
    id: 5,
    title: 'My Hero Academia',
    cover: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
    author: 'Kohei Horikoshi',
    genres: ['Action', 'Comedy', 'Supernatural'],
    status: 'Ongoing',
    rating: 4.5,
  },
  {
    id: 6,
    title: 'Death Note',
    cover: 'https://i.pinimg.com/736x/c4/14/27/c4142714e3d7023b30965b445bb5fb6d.jpg',
    author: 'Tsugumi Ohba',
    genres: ['Mystery', 'Psychological', 'Supernatural'],
    status: 'Completed',
    rating: 4.8,
  },
];

// Filter options
const genreOptions = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
];

const statusOptions = ['All', 'Ongoing', 'Completed', 'Hiatus', 'Cancelled'];

const ratingOptions = ['All', '4.5+', '4.0+', '3.5+', '3.0+'];

// MultiSelect component
const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder,
  label,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    if (option === 'All') {
      onChange(['All']);
    } else {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option));
      } else {
        onChange(selected.filter(item => item !== 'All').concat(option));
      }
    }
  };

  const removeOption = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.includes('All')) return 'All';
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div
        className="relative bg-[#212328] border border-gray-700 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 && !selected.includes('All') ? (
              selected.map(item => (
                <span
                  key={item}
                  className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                >
                  {item}
                  <button
                    className="ml-1 focus:outline-none"
                    onClick={e => {
                      e.stopPropagation();
                      removeOption(item);
                    }}
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">{getDisplayText()}</span>
            )}
          </div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#212328] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option}
              className="flex items-center justify-between p-3 hover:bg-[#3d414a] cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              <span className="text-white">{option}</span>
              {selected.includes(option) && <FaCheck className="text-primary-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['All']);
  const [selectedRating, setSelectedRating] = useState<string[]>(['All']);
  const [filteredManga, setFilteredManga] = useState(mangaList);

  // Handle search
  const handleSearch = () => {
    let results = mangaList;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        manga =>
          manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          manga.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genres
    if (selectedGenres.length > 0) {
      results = results.filter(manga => selectedGenres.some(genre => manga.genres.includes(genre)));
    }

    // Filter by status
    if (selectedStatus.length > 0 && !selectedStatus.includes('All')) {
      results = results.filter(manga => selectedStatus.includes(manga.status));
    }

    // Filter by rating
    if (selectedRating.length > 0 && !selectedRating.includes('All')) {
      const minRating = parseFloat(selectedRating[0].replace('+', ''));
      results = results.filter(manga => manga.rating >= minRating);
    }

    setFilteredManga(results);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedStatus(['All']);
    setSelectedRating(['All']);
    setFilteredManga(mangaList);
  };

  return (
    <div className="min-h-screen bg-[#191a1c] text-white pt-20 pb-10">
      <div className="max-w-full mx-auto px-4 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Manga</h1>
          <p className="text-gray-400">Find your next favorite manga or novel</p>
        </div>

        {/* Search Bar and Filter Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full bg-[#212328] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-[#2c2c2c] hover:bg-[#3d414a] text-white px-6 py-3 rounded-lg transition-colors duration-200"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            <span>Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genre Filter */}
              <MultiSelect
                options={genreOptions}
                selected={selectedGenres}
                onChange={setSelectedGenres}
                placeholder="Select genres"
                label="Genres"
              />

              {/* Status Filter */}
              <MultiSelect
                options={statusOptions}
                selected={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Select status"
                label="Status"
              />

              {/* Rating Filter */}
              <MultiSelect
                options={ratingOptions}
                selected={selectedRating}
                onChange={setSelectedRating}
                placeholder="Select rating"
                label="Rating"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="flex items-center gap-2 bg-[#212328] hover:bg-[#3d414a] text-white px-6 py-2 rounded-lg transition-colors duration-200"
                onClick={resetFilters}
              >
                <FaTimes />
                <span>Reset Filters</span>
              </button>
              <button
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredManga.length}</span> results
          </p>
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredManga.map(manga => (
            <Link href={`/manga/${manga.id}`} key={manga.id}>
              <div className="bg-[#2c2c2c] rounded-lg overflow-hidden hover:border-primary-500 border border-gray-700 transition-all duration-300 h-full flex flex-col">
                <div className="relative h-64 w-full">
                  <Image src={manga.cover} alt={manga.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-white mb-1 line-clamp-1">{manga.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{manga.author}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {manga.genres.slice(0, 2).map(genre => (
                      <span
                        key={genre}
                        className="text-xs bg-[#212328] text-gray-300 px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                    {manga.genres.length > 2 && (
                      <span className="text-xs bg-[#212328] text-gray-300 px-2 py-1 rounded">
                        +{manga.genres.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs text-gray-400">{manga.status}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-sm font-bold mr-1">{manga.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredManga.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No manga found matching your criteria.</p>
            <button className="mt-4 text-primary-500 hover:text-primary-400" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
