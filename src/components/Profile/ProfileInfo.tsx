import React, { memo } from "react";

const ProfileInfo: React.FC = memo(() => (
  <div className="bg-[#2a2a2a] p-6 min-h-[400px] rounded-lg">
    <h2 className="text-xl font-bold text-white mb-3">About</h2>
    <p className="text-white">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit...
    </p>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

export default ProfileInfo;
