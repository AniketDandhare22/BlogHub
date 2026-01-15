import { useEffect, useState,useMemo  } from "react";
import Card from './card'
import Vcard from './VideoCard'
import { FiMenu } from "react-icons/fi";
import SideBar from './Sidebar'
import { useTheme } from "./context/useTheme";
import Navbar from "./Navbar";
import {useNavigate } from "react-router-dom";
import {useAuth} from "./context/AuthProvider"
import api from "./api/api.jsx"
import HomeSkeleton from "./component/HomeSkeleton";

function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const {isAuth,loading } = useAuth();
    const { dark} = useTheme();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);   
    const [myposts, setMyposts] = useState([]);   
    const [query, setQuery] = useState("");
    const [query2, setQuery2] = useState("");
    const [recentPosts, setRecentPosts] = useState([]);
    useEffect(() => {
      if (!isAuth) return;
      api.get("/post/recent")
        .then(res => setRecentPosts(res.data?? []))
        .catch(() => setRecentPosts([]));
    }, [isAuth]);


    // ✅ Hooks must ALWAYS run
    useEffect(() => {
      api.get("/post/")
        .then(res => setPosts(res.data.post ))
        .catch(() => setPosts([]))
      api.get("/post/mine")
        .then(res => setMyposts(res.data ?? []))
        .catch(() => setMyposts([]));
    }, []);

     const filteredPosts =useMemo (() => {
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        // 🔥 TRENDING
        if (query2 === "Trending") {
          return posts.filter((post) => {
            const likesCount = post.likes?.length || 0;
            const createdTime = new Date(post.createdAt).getTime();

            return (
              likesCount > 0 &&
              now - createdTime <= oneWeek &&
              (
                post.title?.toLowerCase().includes(query.toLowerCase()) ||
                post.detail?.toLowerCase().includes(query.toLowerCase())
              )
            );
          });
        }

        if (query2 === "Other") {
          const mainCategories = ["Technology", "Design", "Business", "Lifestyle", "Education", "Video"];
          
          return posts.filter((post) => {
            // 1. Is it a "Main" category?
            const isMainCategory = mainCategories.includes(post.category);
            
            // 2. Does it match the search text?
            const matchesSearch = 
                post.title?.toLowerCase().includes(query.toLowerCase()) ||
                post.detail?.toLowerCase().includes(query.toLowerCase());

            // Return if it is NOT a main category AND matches search
            return !isMainCategory && matchesSearch;
          });
        }

        // 🧑 My Posts
        if (query2 === "My Posts") {
          return myposts.filter((post) =>
            post.title?.toLowerCase().includes(query.toLowerCase()) ||
            post.detail?.toLowerCase().includes(query.toLowerCase())
          );
        }

        // 🌍 All posts (default)
        let base = posts;

        // Category filter
        if (query2 && query2 !== "All Posts") {
          base = base.filter(
            (post) => post.category?.toLowerCase() === query2.toLowerCase()
          );
        }

        // Search filter
        if (query) {
          base = base.filter(
            (post) =>
              post.title?.toLowerCase().includes(query.toLowerCase()) ||
              post.detail?.toLowerCase().includes(query.toLowerCase())
          );
        }

        return base;
      }, [posts, myposts, query, query2]);

  if (loading) {
    return <HomeSkeleton />;
  }
  return (
    <div className={`h-screen w-full flex flex-col bg-primaryD light:bg-primary text-white light:text-txPrimary ${!dark?"light":""}`}>
      {/* Navbar */}
      <Navbar setQuery={setQuery}/>

      {/* Content */}
        <div className=" w-full  flex flex-row overflow-hidden"> 

            {/* Sidebar */}
              <div
                className={`
                  relative h-full overflow z-20
                  transition-all duration-300 ease-in-out
                  ${collapsed ? "w-[2%] min-w-[32px]" : "md:w-[30%] lg:w-[25%]"}
                  border-r border-txSecondaryD/70 light:border-gray-300
                `}
              >
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className={`
                    absolute hidden lg:flex top-1/8 -translate-y-1/4 -right-4 z-50
                    w-8 h-8 rounded-full md:flex items-center justify-center shadow-md
                    border light:border-txSecondaryD/50 border-white/30
                    ${dark
                      ? "bg-btncolorD text-white hover:bg-btncolorD/90"
                      : "bg-white text-gray-800 hover:bg-gray-100"}
                  `}
                ><FiMenu
                  size={20}
                  className={`transition-transform ${collapsed ? "rotate-90" : ""}`}
                />

                </button>

                <div className={`${collapsed ? "opacity-0 pointer-events-none " : "opacity-100"} transition-opacity`}>
                  <SideBar theme={dark} task={setQuery2} />
                </div>
              </div>
  

            {/* blog content */}
            <div className={`w-full flex flex-wrap justify-center h-screen custom-scroll ${dark?"bg-secondaryD":"bg-secondary"} overflow-y-auto overflow-x-hidden`}>
              <div className="w-full max-w-[850px] m-10 flex justify-between">
                <div className="h-20">
                  <h1 className={`text-4xl mb-2 light:text-primaryD text-primary light:hover:text-logo2 hover:text-logo`}>
                    Latest Blog Posts
                  </h1>
                  <p className={`light:text-secondaryD text-secondary`}>
                    Discover stories, thinking, and expertise from writers on any topic.
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg h-10lg:h-10 md: h-15 justify-center items-center flex light:text-txSecondary text-txSecondaryD bg-primaryD light:bg-white font-bold border-2 border-transparent hover:border-logo light:hover:border-logo2`}>
                  {filteredPosts.length} posts
                </div>
              </div>
              <div className="w-full h-full justify-center flex flex-wrap">

              {filteredPosts.length === 0 && (
                <p className="text-center wrap-break-word max-w-200 h-fit text-sm opacity-70  rounded-lg bg-primaryD light:bg-primary p-2 px-4 ">
                  No posts found for "{query}"
                </p>
              )}

              {filteredPosts.map((post) =>
                post.category === "Video" ? (
                  <Vcard key={post._id} data={post} theme={dark} />
                ) : (
                  <Card key={post._id} data={post} theme={dark} />
                )
              )}

              </div>

            </div>


            {/* Recent Posts */}

             {/* Recent Posts */}
                <div className="md:w-[30%] lg:w-[25%] p-5 border-l bg-triaryD border-txSecondary light:border-gray-300 light:bg-primary md:block hidden">

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white light:text-txPrimary mb-4 text-center">
                    Recent
                  </h3>

                  {/* Logged OUT state */}
                  {!isAuth && (
                    <div className="h-[60vh] flex items-center justify-center text-center px-4">
                      <p className="text-sm text-txSecondaryD light:text-txSecondary opacity-80">
                        No recent activity yet.  
                        <br />
                        <span className="text-xs">
                          Login to see your reading history.
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Logged in state */}
                      {isAuth && (
                  <div className="space-y-4">

                    {recentPosts.length === 0 && (
                      <div className="h-[60vh] flex items-center justify-center text-center px-4">
                        <p className="text-sm opacity-70">
                          No recent activity yet.
                        </p>
                      </div>
                    )}

                    {recentPosts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => navigate(`/detail/${post._id}`)}
                        className="flex gap-3 p-3 rounded-xl bg-primaryD/60
                                  light:bg-secondary hover:bg-primaryD/80
                                  transition cursor-pointer"
                      >
                        <img
                          src={post.postMedia || "https://picsum.photos/80/80"}
                          className="w-16 h-16 rounded-lg object-cover"
                        />

                        <div>
                          <h4 className="text-sm font-semibold line-clamp-2 text-wrap">
                            {post.title}
                          </h4>

                          <p className="text-xs opacity-70 line-clamp-2 text-wrap">
                            {post.detail}
                          </p>

                          <span className="text-[11px] opacity-60">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}

                  </div>
                )}

                </div> 
            



            
        </div>  
    </div>
  );
}

export default Home;