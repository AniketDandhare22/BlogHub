import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "./data/categories";

const daysAgo = (createdAt) => {
  if (!createdAt) return "Unknown";
  const date = new Date(createdAt);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};


function BlogCard({ data, theme }) {
  const category = CATEGORIES[data.category] || {};
  const Icon = category.icon;
  const navigate =useNavigate();
  return (
    <div
      className={`
        w-full max-w-[900px] lg:mx-10 md:mx-10 mx-3 my-6 h-fit
        rounded-2xl overflow-hidden
        shadow-sm hover:shadow-lg hover:-translate-y-1
        transition cursor-pointer
        bg-primaryD light:bg-primary
        ${!theme ? "light" : ""}
      `}
      
      onClick={() => navigate(`/detail/${data._id}`)}
    >
      {/* Image */}
      <div className="w-full lg:h-90 md:h-90 h-100 overflow-hidden">
        <img
          src={data.postMedia}
          alt={data.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Category Tag */}
        <span
          className={`
            inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold
            rounded-full transition-all duration-200
            ${category.bg || "bg-gray-100"}
            ${category.color || "text-gray-600"}
            ${category.hover || "hover:bg-gray-600"}
            hover:text-white
          `}

        >
          {Icon && <Icon size={14} />}
          {data.category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-semibold light:text-txPrimary text-white">
          {data.title}
        </h3>

        {/* Description */}
        <p className="text light:text-txSecondary text-txSecondaryD line-clamp-3">
          {data.detail}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <div className="flex items-center gap-2">
            <span>👤 {data.author || "Anonymous"}</span>
            <span>• {data.likes.length}</span>
          </div>
          <span>⏱ {daysAgo(data.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3">
          <button className="px-3 py-1 text-sm rounded-lg
            text-white light:text-black
            bg-secondaryD/70 light:bg-secondary
            hover:bg-secondaryD light:hover:bg-gray-200 transition">
            ❤️ {data.likes.length}
          </button>

          <button className="px-3 py-1 text-sm rounded-lg
            text-white light:text-black
            bg-secondaryD/70 light:bg-secondary
            hover:bg-secondaryD light:hover:bg-gray-200 transition">
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
