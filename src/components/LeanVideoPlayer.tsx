import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Download, ExternalLink, Film } from "lucide-react";

interface LeanVideoPlayerProps {
  src: string;
  fileName: string;
  fallbackUrl?: string;
  themeColor?: string;
  onDownload?: () => void;
  onExpand?: () => void;
  className?: string;
}

export function LeanVideoPlayer({
  src,
  fileName,
  fallbackUrl,
  themeColor,
  onDownload,
  onExpand,
  className = "",
}: LeanVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = () => {
      if (fallbackUrl && video.src !== fallbackUrl) {
        video.src = fallbackUrl;
        video.load();
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [src, fallbackUrl]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    const bar = progressBarRef.current;
    if (!video || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
  };

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpand) {
      onExpand();
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const activeColor = themeColor || "#f8a87c";

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#282838] bg-black max-w-[340px] sm:max-w-[400px] shadow-sm select-none relative group/leanvideo ${className}`}
    >
      {/* Video Viewport */}
      <div className="relative bg-black flex items-center justify-center cursor-pointer" onClick={() => togglePlay()}>
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          playsInline
          className="max-h-60 sm:max-h-72 w-full object-contain block"
        />

        {/* Center Big Play Button Overlay when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-none transition-opacity">
            <div
              style={{ backgroundColor: activeColor }}
              className="h-11 w-11 rounded-full text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
            >
              <Play size={18} className="fill-black translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Floating Scrub Bar on Video Bottom */}
      <div
        ref={progressBarRef}
        onClick={handleSeek}
        className="w-full h-1.5 bg-white/20 hover:h-2 transition-all cursor-pointer overflow-hidden relative"
      >
        <div
          style={{ width: `${progressPercent}%`, backgroundColor: activeColor }}
          className="h-full rounded-r-full transition-[width] duration-75"
        />
      </div>

      {/* Footer Meta & Controls Bar */}
      <div className="px-3 py-2 bg-slate-900/95 text-white flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={(e) => togglePlay(e)}
            className="p-1 hover:text-[var(--agent-light)] dark:hover:text-[var(--agent-dark)] transition-colors cursor-pointer shrink-0"
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? <Pause size={13} className="fill-white" /> : <Play size={13} className="fill-white translate-x-0.5" />}
          </button>
          <span className="text-[10px] text-neutral-400 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <span className="truncate text-[11px] text-neutral-200 font-medium ml-1">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
          >
            {isMuted ? <VolumeX size={12} className="text-red-400" /> : <Volume2 size={12} />}
          </button>
          {fallbackUrl && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-neutral-400 hover:text-emerald-400 transition-colors"
              title="Mở trên Storage"
            >
              <ExternalLink size={12} />
            </a>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={`Tải video ${fileName}`}
            >
              <Download size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Xem toàn màn hình"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
