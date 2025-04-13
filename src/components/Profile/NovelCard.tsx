import React, { memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Novel } from "@/types/novel";

interface NovelCardProps {
  comic: Novel;
}

const NovelCard: React.FC<NovelCardProps> = memo(({ comic }) => {
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

export default NovelCard;
