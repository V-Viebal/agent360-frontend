import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, ExternalLink, Music } from "lucide-react";

interface LeanAudioPlayerProps {
  src: string;
  fileName: string;
  fallbackUrl?: string;
  themeColor?: string;
  onDownload?: () => void;
  className?: string;
}

export function LeanAudioPlayer({
  src,
  fileName,
  fallbackUrl,
  themeColor,
  onDownload,
  className = "",
}: LeanAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoaded(true);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = () => {
      if (fallbackUrl && audio.src !== fallbackUrl) {
        audio.src = fallbackUrl;
        audio.load();
      }
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [src, fallbackUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
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
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-xl px-3 py-2 bg-slate-50 dark:bg-[#14141f] border border-slate-200/90 dark:border-[#282838] shadow-2xs text-left select-none transition-all group/leanaudio max-w-[340px] sm:max-w-[380px] w-full ${className}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Header: Track Name & Quick Actions */}
      <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            style={{ backgroundColor: `${activeColor}20`, color: activeColor, borderColor: `${activeColor}40` }}
            className="h-6 w-6 rounded-lg border flex items-center justify-center shrink-0"
          >
            <Music size={11} className={isPlaying ? "animate-pulse" : ""} />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200 truncate font-mono">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {fallbackUrl && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
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
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title={`Tải xuống ${fileName}`}
            >
              <Download size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Player Controls Bar */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={togglePlay}
          style={{ backgroundColor: activeColor }}
          className="h-7 w-7 rounded-full text-black flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label={isPlaying ? "Tạm dừng" : "Phát âm thanh"}
        >
          {isPlaying ? <Pause size={12} className="fill-black" /> : <Play size={12} className="fill-black translate-x-0.5" />}
        </button>

        <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 min-w-[28px] text-right shrink-0">
          {formatTime(currentTime)}
        </span>

        {/* Progress Bar Track */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="relative flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full cursor-pointer overflow-hidden group/bar"
        >
          <div
            style={{ width: `${progressPercent}%`, backgroundColor: activeColor }}
            className="h-full rounded-full transition-[width] duration-75 relative"
          />
        </div>

        <span className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 min-w-[28px] shrink-0">
          {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors shrink-0"
          title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
        >
          {isMuted ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} />}
        </button>
      </div>
    </div>
  );
}
