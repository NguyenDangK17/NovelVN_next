"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { useAuth } from "@/context/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Novel } from "@/types/novel";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { updateUser } from "@/utils/userUtils";
import { API_ENDPOINTS } from "@/config/api";
import { ASSETS } from "@/config/constants";
import Image from "next/image";

const ProfileHeader: React.FC = memo(() => {
  const { user, setUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const handleAvatarChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files?.[0]) return;

      setIsUploading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", user._id);

      try {
        const response = await axios.post(
          API_ENDPOINTS.UPLOAD_AVATAR,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const updatedUser = { ...user, avatar: response.data.avatar };
        updateUser(updatedUser, setUser);
      } catch (error) {
        console.error("Error updating avatar:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [user, setUser]
  );

  return (
    <div className="relative h-[300px] md:h-[450px] bg-[#2c2c2c]">
      <div
        className="absolute inset-0 w-full h-[200px] md:h-[350px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${ASSETS.PROFILE_BACKGROUND})`,
          backgroundPosition: "center 25%",
        }}
      />
      <div className="absolute bottom-0 left-0 w-full">
        <div className="max-w-7xl mx-auto flex items-end p-6">
          <div className="w-32 md:w-40 h-auto aspect-[1/1] rounded-full overflow-hidden relative">
            <Image
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              width={160}
              height={160}
              className="w-full h-full object-cover"
              priority
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {user?.username}
            </h1>
            <p className="text-lg text-gray-300">Unemployed Hooman</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = "ProfileHeader";

const ProfileInfo: React.FC = memo(() => (
  <div className="bg-[#2a2a2a] p-6 min-h-[400px] rounded-lg">
    <h2 className="text-xl font-bold text-white mb-3">About</h2>
    <p className="text-white">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit...
    </p>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

const ProfileInformation: React.FC = memo(() => {
  const { user } = useAuth();

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-gray-400 text-lg" />
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white font-medium">
              {user?.email || "Not provided"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaUser className="text-gray-400 text-lg" />
          <div>
            <p className="text-gray-400 text-sm">Username</p>
            <p className="text-white font-medium">
              {user?.username || "Not provided"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaLock className="text-gray-400 text-lg" />
          <div>
            <p className="text-gray-400 text-sm">Avatar</p>
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full object-cover border border-gray-500"
              />
            ) : (
              <p className="text-white font-medium">No avatar available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileInformation.displayName = "ProfileInformation";

const Groups: React.FC = memo(() => (
  <div className="h-full">
    <h2 className="text-xl font-bold text-white mb-3">Groups</h2>
    <p className="text-white">
      Here you can find all the groups you are part of.
    </p>
  </div>
));

Groups.displayName = "Groups";

const NovelCard: React.FC<{ comic: Novel }> = memo(({ comic }) => {
  const router = useRouter();

  return (
    <div className="flex p-2 items-start space-x-2 bg-[#2c2c2c] hover:bg-[#3a3a3a] transition duration-300">
      <div className="w-28 h-auto flex-shrink-0">
        <Image
          src={comic.image}
          alt={comic.title}
          width={112}
          height={150}
          className="w-full h-auto object-cover hover:cursor-pointer"
          onClick={() => router.push(`/manga/${comic._id}`)}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between min-h-[150px] px-2">
        <h2
          className="text-lg font-bold text-white hover:text-primary-500 hover:cursor-pointer line-clamp-2 min-h-[3rem]"
          onClick={() => router.push(`/manga/${comic._id}`)}
        >
          {comic.title}
        </h2>
        <div className="mt-auto space-y-1">
          {[1, 2, 3].map((chapter) => (
            <div
              key={chapter}
              className="flex justify-between items-center text-sm text-gray-400 hover:text-gray-300 hover:cursor-pointer transition"
            >
              <p>Chapter {chapter}</p>
              <p className="text-gray-500">{chapter * 3} hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

NovelCard.displayName = "NovelCard";

const Novels: React.FC<{ comics: Novel[] }> = memo(({ comics }) => (
  <div className="h-full">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {comics.slice(0, 6).map((comic) => (
        <NovelCard key={comic._id} comic={comic} />
      ))}
    </div>
  </div>
));

Novels.displayName = "Novels";

const ProfileTabs: React.FC<{ comics: Novel[] }> = memo(({ comics }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "info";

  const handleTabChange = useCallback(
    (tabName: string) => {
      router.push(`/profile?tab=${tabName}`, { scroll: false });
    },
    [router]
  );

  const tabs = ["info", "groups", "novels"] as const;
  const tabPosition = tabs.indexOf(tab as (typeof tabs)[number]);

  return (
    <>
      <div className="relative flex space-x-0 mb-6 w-1/2">
        <div className="absolute inset-0 flex bg-[#2a2a2a]">
          <div
            className={`transition-all duration-300 ease-in-out bg-[#4f4f4f] rounded ${
              tabPosition === 0
                ? "w-1/3"
                : tabPosition === 1
                ? "w-1/3 translate-x-full"
                : "w-1/3 translate-x-[200%]"
            }`}
          />
        </div>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`relative z-10 flex-1 px-4 py-2 font-bold rounded ${
              tab === t ? "text-white" : "text-[#4e4e4e] hover:text-[#6f6f6f]"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {tab === "info" && <ProfileInformation />}
        {tab === "groups" && <Groups />}
        {tab === "novels" && <Novels comics={comics} />}
      </div>
    </>
  );
});

ProfileTabs.displayName = "ProfileTabs";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [comics, setComics] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.NOVELS);
        setComics(res.data);
      } catch (error) {
        console.error("Failed to load comics", error);
        setError("Failed to load comics. Please try again later.");
      }
    };

    fetchComics();
  }, []);

  if (loading || !user) return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto bg-[#1f1f1f] py-12">
      <ProfileHeader />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <ProfileInfo />
          </div>
          <div className="md:col-span-3">
            <ProfileTabs comics={comics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
