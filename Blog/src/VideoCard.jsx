import { useRef, useState } from "react";
import {
  MdPlayArrow,
  MdPause,
  MdVolumeOff,
  MdVolumeUp
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

function VideoCard({ data, theme }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const navigate =useNavigate();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState(false);
  const [seeking, setSeeking] = useState(false);

  /* Play / Pause */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  /* Mute */
  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !muted;
    setMuted(!muted);
  };

  /* Update progress */
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  /* Seek */
  const seek = (e) => {
    const bar = progressRef.current;
    const video = videoRef.current;

    const rect = bar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);

    video.currentTime = percent * video.duration;
    setProgress(percent * 100);
  };

  return (
    <div
      className={`
        w-full max-w-[900px] m-10 h-fit
        rounded-2xl overflow-hidden
        bg-primaryD light:bg-primary
        shadow-sm hover:shadow-lg transition
        ${!theme ? "light" : ""}
      `}
      
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setSeeking(false);
      }}
    >
      {/* VIDEO */}
      <div className="relative w-full h-[450px] bg-black">
        <video
          ref={videoRef}
          src={data.Video}
          poster={data.postMedia}
          muted={muted}
          loop
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Overlay Play/Pause */}
        {hover && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-14 h-14 bg-logo light:bg-logo2 text-white rounded-full
              flex items-center justify-center shadow-lg
              hover:border-2 hover:border-white active:scale-95"
            >
              {playing ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        {hover && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="bg-black/50 p-1 rounded-full text-white"
            >
              {muted ? <MdVolumeOff size={22} /> : <MdVolumeUp size={22} />}
            </button>

            <div
              ref={progressRef}
              onMouseDown={(e) => {
                setSeeking(true);
                seek(e);
              }}
              onMouseMove={(e) => seeking && seek(e)}
              onMouseUp={() => setSeeking(false)}
              className="flex-1 h-2 bg-white/30 rounded-full cursor-pointer"
            >
              <div
                className="h-full bg-logo light:bg-logo2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3 cursor-pointer">
        <div className=" space-y-3 cursor-pointer" onClick={() => navigate(`/detail/${data._id}`)}>
        {/* Title  */}
        <h3 className="text-[17px] font-bold" >
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-1 mr-3
              text-xs rounded-full font-semibold
              bg-white text-red-600
              hover:bg-red-600
              hover:text-white transition
            `}
          >
            video
          </span>
          {data.title}
        </h3>

        {/* decription */}
        <div className="flex items-center justify-between text-sm opacity-80">
          <span> {data.detail}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm opacity-80">
          <span>👤 {data.author} • {data.likes.length} likes</span>
        </div>
      </div>
        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button className="px-3 py-1 text-sm rounded-lg bg-secondaryD/70 light:bg-secondary hover:bg-secondaryD transition">
            ❤️ {data.likes.length}
          </button>
          <button className="px-3 py-1 text-sm rounded-lg bg-secondaryD/70 light:bg-secondary hover:bg-secondaryD transition">
            💬 {data.comments || 0}
          </button>
          <button className="px-3 py-1 text-sm rounded-lg bg-secondaryD/70 light:bg-secondary hover:bg-secondaryD transition">
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
