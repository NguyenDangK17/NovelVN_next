import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { updateUser } from '@/utils/userUtils';
import { User } from '@/types/user';

interface UseAvatarUploadProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

interface UseAvatarUploadReturn {
  isUploading: boolean;
  error: string | null;
  handleAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const useAvatarUpload = ({ user, setUser }: UseAvatarUploadProps): UseAvatarUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAvatarChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!user || !event.target.files?.[0]) return;
      
      setIsUploading(true);
      setError(null);
      
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
        setError("Failed to update avatar. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [user, setUser]
  );

  return {
    isUploading,
    error,
    handleAvatarChange
  };
}; 