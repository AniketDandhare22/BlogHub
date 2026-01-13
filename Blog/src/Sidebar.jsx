import { useState } from "react";
import { FiHome, FiTrendingUp, FiCpu, FiEdit, FiBriefcase, FiHeart, FiBook ,FiVideo ,FiUser} from 'react-icons/fi';
import { MdApps } from "react-icons/md";
function Sidebar({ theme ,task  }) {
  const [activeItem, setActiveItem] = useState("All Posts");
  const items = [
    { name: "All Posts", icon: <FiHome />, color: "text-logo light:text-logo2 hover:animate-float", bg: "bg-orange-100 light:bg-purple-300" },
    { name: "Trending", icon: <FiTrendingUp />, color: "text-red-600", bg: "bg-red-100" },
    { name: "Technology", icon: <FiCpu />, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Design", icon: <FiEdit />, color: "text-violet-600", bg: "bg-violet-100" },
    { name: "Business", icon: <FiBriefcase />, color: "text-green-500", bg: "bg-green-100" },
    { name: "Lifestyle", icon: <FiHeart />, color: "text-yellow-500", bg: "bg-yellow-100" },
    { name: "Education", icon: <FiBook />, color: "text-pink-600", bg: "bg-pink-100" },
    { name: "Video", icon: <FiVideo />, color: "text-cyan-500", bg: "bg-cyan-100" },
    { name: "Other", icon: <MdApps />, color: "text-gray-500", bg: "bg-gray-100" },
  ];

  return (
    <div className="flex flex-col h-full"> 
    <aside className={`w-full bg-transparent p-4 hidden md:block ${!theme ? "light" : ""}`}>
      <h2 className="text-2xl font-semibold light:text-primaryD text-primary mt-3 mb-7">
        Categories
      </h2>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.name}
            onClick={() => {
              setActiveItem(item.name);
              task(item.name);
            }} 
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
              transition text-xl hover:bg-primary/5 light:hover:bg-primaryD/7
              ${activeItem === item.name 
                ? `font-semibold ${item.color} ${item.bg}`
                : `text-white/50 light:text-txSecondary hover:${item.bg} hover:${item.color} `
              } 
              
            `}
          >
            <span className={`flex-shrink-0 ${item.color} `}>{item.icon}</span>
            <span className="text-[17px]">{item.name}</span>
          </li>
        ))}
      </ul>

      {/* Divider */}
    <div className="my-6 border-t border-white/10 light:border-black/10" />
    </aside>
    
    
    {/* My Posts Button */}
    <div
      onClick={() => {
        setActiveItem("My Posts");
        task("My Posts");
      }}
      className={`
        lg:flex md:flex items-center gap-3 px-3 py-2 mx-3 absolute bottom-7 w-[87%]  rounded-lg cursor-pointer
        transition text-xl hidden
        bg-white/15 light:bg-black/15
        hover:bg-primary/5 light:hover:bg-primaryD/7
        ${
          activeItem === "My Posts"
            ? "font-semibold text-logo light:text-logo2 bg-orange-100 light:bg-purple-300"
            : "text-white/50 light:text-txSecondary hover:bg-orange-100 hover:text-logo"
        }
      `}
    >
      <span className="flex-shrink-0 text-logo light:text-logo2">
        <FiUser />
      </span>
      <span className="text-[17px]">My Posts</span>
    </div>

    </div>


  );
}

export default Sidebar;
