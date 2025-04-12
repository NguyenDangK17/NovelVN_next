import React, { memo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Novel } from "@/types/novel";
import ProfileInformation from "./ProfileInformation";
import Groups from "./Groups";
import Novels from "./Novels";

interface ProfileTabsProps {
  comics: Novel[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = memo(({ comics }) => {
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

export default ProfileTabs; 