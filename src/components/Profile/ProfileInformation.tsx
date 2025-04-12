import React, { memo } from "react";
import { useAuth } from "@/context/UserContext";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import Image from "next/image";

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

export default ProfileInformation; 