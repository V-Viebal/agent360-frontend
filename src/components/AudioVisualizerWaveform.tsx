import React, { useEffect, useRef } from "react";
import { getVoiceAudioProfile } from "../services/permissionService";

interface AudioVisualizerWaveformProps {
  isRecording: boolean;
  className?: string;
  onAudioLevel?: (level: number) => void;
  agentId?: string;
}

export function AudioVisualizerWaveform({
  isRecording,
  className = "",
  onAudioLevel,
  agentId,
}: AudioVisualizerWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [currentLevel, setCurrentLevel] = React.useState<number>(0);

  useEffect(() => {
    if (!isRecording) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let isMounted = true;

    async function setupAudio() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

        const preferredDeviceId = (agentId ? localStorage.getItem(`agent360_preferred_mic_${agentId}`) : null) || localStorage.getItem("agent360_preferred_mic_id") || undefined;
        const profile = getVoiceAudioProfile();
        // `latency` is a valid constraint in Chromium but missing from lib.dom MediaTrackConstraints.
        const audioConstraints: MediaTrackConstraints & { latency?: number } = {
          echoCancellation: profile.echoCancellation,
          noiseSuppression: profile.noiseSuppression,
          autoGainControl: profile.autoGainControl,
          latency: profile.lowLatencyMode ? 0.02 : undefined,
        };
        if (preferredDeviceId) {
          audioConstraints.deviceId = { exact: preferredDeviceId };
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
        }).catch(async (e) => {
          // If exact device fails (disconnected), fallback to default
          console.warn("Exact audio device failed, falling back to default:", e);
          return await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          });
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Low FFT size for responsive bars
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          if (!isMounted || !canvasRef.current) return;
          animationFrameRef.current = requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barCount = 18;
          const barWidth = 3;
          const gap = 2;
          const totalWidth = barCount * (barWidth + gap);
          const startX = (canvas.width - totalWidth) / 2;

          let sumVolume = 0;
          for (let i = 0; i < barCount; i++) {
            // Sample frequency bin
            const index = Math.floor((i / barCount) * (bufferLength / 2));
            const val = dataArray[index] || 0;
            sumVolume += val;
            const percent = val / 255;
            // Reactive dynamic height scaling based on live audio intensity
            const height = Math.max(2, Math.pow(percent, 0.85) * (canvas.height - 2));

            const x = startX + i * (barWidth + gap);
            const y = (canvas.height - height) / 2;

            // Gradient bar from neon orange to bright pink-red
            const gradient = ctx.createLinearGradient(0, y, 0, y + height);
            gradient.addColorStop(0, percent > 0.6 ? "#ff3366" : "#ff7a00");
            gradient.addColorStop(1, percent > 0.6 ? "#ff9900" : "#ff3366");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, 1.5);
            ctx.fill();
          }

          const avgVol = Math.round((sumVolume / (barCount * 255)) * 100);
          if (onAudioLevel) onAudioLevel(avgVol);
          setCurrentLevel(avgVol);
        };

        draw();
      } catch (err) {
        console.warn("AudioVisualizerWaveform initialization warning:", err);
      }
    }

    setupAudio();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <div
      className={`flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-full transition-all duration-150 border animate-in fade-in select-none ${
        currentLevel > 40
          ? "bg-red-500/20 border-red-500/50 shadow-xs shadow-red-500/20"
          : "bg-red-500/10 border-red-500/25"
      } ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
      <span className="text-[10px] font-mono text-red-400 font-semibold uppercase tracking-wider shrink-0 hidden xs:inline">
        Listening
      </span>
      <canvas
        ref={canvasRef}
        width={80}
        height={currentLevel > 50 ? 24 : 18}
        className="block shrink-0 transition-all duration-100"
      />
      {currentLevel > 0 && (
        <span className="text-[9px] font-mono text-neutral-400 shrink-0 hidden sm:inline">
          {currentLevel}%
        </span>
      )}
    </div>
  );
}
