import React from 'react';
import { useTheme } from "../context/useTheme";

const PostSkeleton = () => {
  const { dark } = useTheme();

  return (
    // Outer Card Container - matches your real card width/height roughly
    <div className={`
      w-full h-[480px] rounded-xl p-3 flex flex-col gap-3 animate-pulse
      border border-white/10 light:border-gray-200
      ${dark ? "bg-white/5" : "bg-white shadow-sm"}
    `}>
      
      {/* 1. Fake Image Placeholder */}
      <div className="w-full h-48 rounded-lg bg-gray-700 light:bg-gray-200"></div>

      {/* 2. Fake Category Tag */}
      <div className="w-20 h-5 rounded-full bg-gray-700 light:bg-gray-200 mt-1"></div>

      {/* 3. Fake Title (Two lines) */}
      <div className="w-full flex flex-col gap-2 mt-1">
        <div className="h-5 w-[90%] rounded bg-gray-700 light:bg-gray-200"></div>
        <div className="h-5 w-[60%] rounded bg-gray-700 light:bg-gray-200"></div>
      </div>

      {/* 4. Fake User/Date Info (Bottom) */}
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/5 light:border-gray-100">
        <div className="w-9 h-9 rounded-full bg-gray-700 light:bg-gray-200"></div> {/* Avatar */}
        <div className="flex flex-col gap-1">
             <div className="h-3 w-24 rounded bg-gray-700 light:bg-gray-200"></div> {/* Name */}
             <div className="h-2 w-16 rounded bg-gray-700 light:bg-gray-200"></div> {/* Date */}
        </div>
      </div>

    </div>
  );
};

export default PostSkeleton;