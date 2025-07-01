import React, { useState, useCallback, memo } from 'react';
import { useAuth } from '@/context/UserContext';
import axios from 'axios';
import Image from 'next/image';
import { API_ENDPOINTS } from '@/config/api';
import { ASSETS } from '@/config/constants';
import { updateUser } from '@/utils/userUtils';

const ProfileHeader: React.FC = memo(() => {
  const { user, setUser, accessToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!user || !accessToken) return;
      if (!event.target.files?.[0]) return;

      setIsUploading(true);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user._id);

      try {
        const response = await axios.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const updatedUser = { ...user, avatar: response.data.avatar, _id: user._id };
        updateUser(updatedUser, setUser);
      } catch (error) {
        console.error('Error updating avatar:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [user, setUser, accessToken]
  );

  if (!user || !accessToken) return null;

  return (
    <div className="relative h-[300px] md:h-[450px] bg-[#2c2c2c]">
      <div
        className="absolute inset-0 w-full h-[200px] md:h-[350px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${ASSETS.PROFILE_BACKGROUND})`,
          backgroundPosition: 'center 25%',
        }}
      />
      <div className="absolute bottom-0 left-0 w-full">
        <div className="max-w-7xl mx-auto flex items-end p-6">
          <div className="w-32 md:w-40 h-auto aspect-[1/1] rounded-full overflow-hidden relative">
            <Image
              src={user?.avatar || '/default-avatar.png'}
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
            <h1 className="text-3xl md:text-4xl font-bold text-white">{user?.username}</h1>
            <p className="text-lg text-gray-300">Unemployed Hooman</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
