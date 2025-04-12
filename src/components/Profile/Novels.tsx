import React, { memo } from "react";
import { Novel } from "@/types/novel";
import NovelCard from "./NovelCard";

interface NovelsProps {
  comics: Novel[];
}

const Novels: React.FC<NovelsProps> = memo(({ comics }) => (
  <div className="h-full">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {comics.slice(0, 6).map((comic) => (
        <NovelCard key={comic._id} comic={comic} />
      ))}
    </div>
  </div>
));

Novels.displayName = "Novels";

export default Novels; 