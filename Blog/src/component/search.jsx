import { FiSearch } from "react-icons/fi";

function SearchBar(elem) {
  return (
    <div className={`relative lg:w-[60%] md:w-[50%] w-20 min-w-[260px] flex items-center border-none ${elem.theme?'light':""} `}>
      {/* Search Icon */}
      <FiSearch
        size={18}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${elem.theme?"text-white ":"text-gray-500"}`}
      />

      {/* Input */}
      <input
        type="text"
        placeholder="Search"
        className={`
          w-full h-[80%] py-1 pl-11 pr-24
          text-sm ${elem.theme?"text-white border-gray-200 bg-btncolorD focus:outline-logo focus:border-none":"text-txPrimary border-none focus:outline-logo2 bg-secondary"}
          rounded-full
          shadow-sm
          focus:shadow-md
          transition-all duration-200
        `}
        onChange={(e) => elem.toQuery(e.target.value)}
      />

      {/* Subtle Enter Hint */}
      <span
        className={`
          absolute right-4 top-1/2 -translate-y-1/2
           ${elem.theme?"text-white ":"text-gray-500"}
          text-xs 
          select-none`}
        
      >
        ⏎ Search
      </span>
    </div>
  );
}

export default SearchBar;
