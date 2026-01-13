import React from "react";
import { useTheme } from "./context/useTheme";
import Navbar from "./Navbar";

const AboutUs = () => {
  const { dark } = useTheme();

  return (
    <div className={`h-screen w-full flex flex-col ${!dark?"light":""} overflow-hidden`}>
    <Navbar/>
    <div className={`w-full flex flex-col items-center py-16 px-6 overflow-auto custom-scroll
      bg-primaryD light:bg-primary text-white light:text-black transition-colors`}>
      
      {/* 1. Header Section */}
      <div className="max-w-4xl w-full text-center space-y-6 mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent pb-2
            bg-gradient-to-r 
            from-orange-400 to-orange-600 
            light:from-blue-400 light:to-purple-600">
          About BlogHub
        </h1>
        <p className="text-lg md:text-xl text-gray-300 light:text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A full-stack publishing platform built for the modern web. 
          Designed to empower voices through seamless technology and intuitive design.
        </p>
      </div>

      {/* 2. The "Resume Flex" (Tech Stack) */}
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 mb-20">
        
        {/* Left: The Mission */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 pl-4
            border-orange-500 light:border-blue-500">
            Why this Project?
          </h2>
          <p className="text-gray-400 light:text-gray-700 leading-relaxed">
            BlogHub was built to solve the complexity of modern content creation. 
            It merges a robust backend with a reactive frontend to deliver 
            speed, security, and scalability. This project represents a deep dive 
            into full-stack architecture, from database design to deployment.
          </p>
        </div>

        {/* Right: The Tech Stack (CRITICAL FOR RESUME) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-l-4 pl-4
            border-orange-500 light:border-purple-500">
            Built With
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <TechItem title="Frontend" desc="React + Tailwind CSS" />
            <TechItem title="Backend" desc="Node.js + Express" />
            <TechItem title="Database" desc="MongoDB Atlas" />
            <TechItem title="Auth" desc="JWT + Google OAuth" />
            <TechItem title="Security" desc="HttpOnly Cookies" />
            <TechItem title="Deploy" desc="Vercel + Render" />
          </div>
        </div>
      </div>

      {/* 3. The Developer Card (Call to Action) */}
      <div className="max-w-4xl w-full bg-secondaryD light:bg-gray-100 rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8">
        
        {/* Your Photo - Using GitHub Avatar based on username if available, or placeholder */}
        <img 
          src="https://avatars.githubusercontent.com/AniketDandhare22" 
          alt="Aniket Dandhare" 
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-lg
            border-orange-500 light:border-blue-500"
        />

        <div className="text-center md:text-left space-y-4">
          <h3 className="text-3xl font-bold">Developed by Aniket Dandhare</h3>
          <p className="text-gray-400 light:text-gray-600">
            Hi, I'm a Full Stack Developer and CS student at IIIT Bhagalpur. 
            Passionate about building scalable MERN stack applications, 
            Data Structures, and solving real-world algorithmic problems.
          </p>
          
          <div className="flex justify-center md:justify-start gap-4 pt-2">
            <a href="https://github.com/AniketDandhare22" target="_blank" rel="noreferrer"
               className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition">
               GitHub
            </a>
            <a href="https://linkedin.com/in/aniket-dandhare" target="_blank" rel="noreferrer"
               className="px-6 py-2 rounded-lg text-white transition
               bg-orange-600 hover:bg-orange-500
               light:bg-blue-600 light:hover:bg-blue-500">
               LinkedIn
            </a>
          </div>
        </div>

      </div>

    </div>

   </div>
  );
};

// Helper Component for the Grid
const TechItem = ({ title, desc }) => (
  <div className="p-4 rounded-lg bg-white/5 light:bg-white light:shadow-sm border border-white/10 light:border-gray-200">
    <h4 className="font-bold 
        text-orange-400 light:text-blue-600">
        {title}
    </h4>
    <p className="text-sm text-gray-400 light:text-gray-600">{desc}</p>
  </div>
);

export default AboutUs;