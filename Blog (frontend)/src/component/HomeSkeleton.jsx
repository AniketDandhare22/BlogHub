import React from "react";
import PostSkeleton from "./PostSkeleton"; // Reuse your card skeleton!
import { useTheme } from "../context/useTheme";
import Navbar from "../Navbar"; // Keep the real Navbar if it doesn't need data

const HomeSkeleton = () => {
  const { dark } = useTheme();

  return (
    <div className={`h-screen w-full flex flex-col ${!dark ? "light" : ""} overflow-hidden`}>
      
      {/* Keep Navbar static or make a skeleton for it too */}
      <div className="h-10 w-full bg-txPrimary light:bg-secondary"></div>

      <div className="w-full flex flex-row overflow-hidden h-full">
        
        {/* 1. LEFT SIDEBAR SKELETON */}
        <div className="md:w-[30%] lg:w-[25%] hidden md:block h-full border-r border-white/10 light:border-gray-300 p-4 space-y-6 bg-primaryD light:bg-primary">
            {/* Fake Menu Items */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded bg-gray-700 light:bg-gray-300"></div>
                    <div className="h-6 w-40 rounded bg-gray-700 light:bg-gray-300"></div>
                </div>
            ))}
        </div>

        {/* 2. CENTER FEED SKELETON */}
        <div className="flex-1 h-full overflow-hidden bg-secondaryD light:bg-secondary relative">
             <div className="h-full w-full overflow-y-auto custom-scroll">
                
                {/* Header Area */}
                <div className="w-full max-w-[850px] mx-auto m-10 flex justify-between animate-pulse px-4">
                    <div className="space-y-3">
                        <div className="h-10 w-64 bg-gray-700 light:bg-gray-300 rounded"></div>
                        <div className="h-4 w-96 bg-gray-700 light:bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-10 w-24 bg-gray-700 light:bg-gray-300 rounded-lg"></div>
                </div>

                {/* The Grid of Cards */}
                <div className="w-full justify-center flex flex-wrap gap-4 p-4 pb-20">
                    {/* Reuse your existing PostSkeleton 6 times */}
                    {[...Array(6)].map((_, index) => (
                        <PostSkeleton key={index} />
                    ))}
                </div>
             </div>
        </div>

        {/* 3. RIGHT SIDEBAR (RECENT POSTS) SKELETON */}
        <div className="md:w-[30%] lg:w-[25%] hidden lg:block h-full border-l border-white/10 light:border-gray-300 bg-triaryD light:bg-primary p-5 space-y-6">
            
            <div className="h-6 w-24 mx-auto bg-gray-700 light:bg-gray-300 rounded mb-6 animate-pulse"></div>

            {/* Fake Recent Items List */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 light:bg-gray-100 animate-pulse">
                    <div className="w-16 h-16 rounded-lg bg-gray-700 light:bg-gray-300 shrink-0"></div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="h-3 w-full bg-gray-700 light:bg-gray-300 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-700 light:bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default HomeSkeleton;