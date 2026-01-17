import { useState } from "react";
import { FiHome, FiTrendingUp, FiCpu, FiEdit, FiBriefcase, FiHeart, FiBook ,FiVideo ,FiUser} from 'react-icons/fi';
import { MdApps } from "react-icons/md";
function Sidebar({ theme ,task  }) {
  const [activeItem, setActiveItem] = useState("All Posts");
  const items = [
    { name: "All Posts", icon: <FiHome />, color: "text-logo light:text-logo2 hover:animate-float", bg: "bg-orange-100 light:bg-purple-100" },
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
      <h2 className="text-2xl flex hover:text-logo light:hover:text-logo2 active:scale-97 justify-center font-semibold light:text-primaryD text-primary mb-4">
        Categories
      </h2>
    {/* Divider */}
    <div className="my-2 border-t border-white/10 light:border-black/10" /> 
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
              transition text-lg hover:bg-primary/5 light:hover:bg-primaryD/7
              ${activeItem === item.name 
                ? `font-semibold ${item.color} ${item.bg} `
                : `text-white light:text-txSecondary hover:${item.bg} hover:${item.color} `
              } 
              
            `}
          >
            <span className={`flex  hover:${item.color}`}>{item.icon}</span>
            <span className={`text-[16px] hover:${item.color}`}>{item.name}</span>
          </li>
        ))}
      </ul>

      {/* Divider */}
    <div className="my-2 border-t border-white/10 light:border-black/10" />
    
    
    
    {/* My Posts Button */}
    <div
      onClick={() => {
        setActiveItem("My Posts");
        task("My Posts");
      }}
      className={`
        lg:flex md:flex pl-12 items-center gap-3 py-2  absolute bottom-7 w-[87%]  rounded-lg cursor-pointer
        transition text-xl hidden active:scale-97
        ${
          activeItem === "My Posts"
            ? "font-semibold text-logo light:text-logo2 bg-orange-100 light:bg-purple-300"
            : "text-white light:text-txSecondary bg-secondaryD hover:bg-orange-100 light:hover:bg-logo2/20 hover:text-logo light:hover:text-logo2 light:bg-secondary"
        }
      `}
    >
      <span className=" text-logo light:text-logo2">
        <FiUser />
      </span>
      <span className="text-[16px]">My Posts</span>
    </div>
    </aside>

    </div>


  );
}

export default Sidebar;
