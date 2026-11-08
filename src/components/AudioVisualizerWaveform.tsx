import React, { useEffect, useRef } from "react";
import { getVoiceAudioProfile } from "../services/permissionService";

interface AudioVisualizerWaveformProps {
  isRecording: boolean;
  className?: string;
  onAudioLevel?: (level: number) => void;
  agentId?: string;
  themeColor?: string;
  externalLevel?: number;
}

export function AudioVisualizerWaveform({
  isRecording,
  className = "",
  onAudioLevel,
  agentId,
  themeColor,
  externalLevel,
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

    // Fast-path: When externalLevel is provided by parent Web Audio pipeline, render directly at 60fps without opening a second hardware mic stream
    if (typeof externalLevel === "number") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let phase = 0;
      const drawExternal = () => {
        if (!isMounted || !canvasRef.current) return;
        animationFrameRef.current = requestAnimationFrame(drawExternal);
        phase += 0.22;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barCount = 28;
        const barWidth = 2.2;
        const gap = 2.2;
        const totalWidth = barCount * (barWidth + gap);
        const startX = (canvas.width - totalWidth) / 2;
        const baseColor = themeColor || "#ffffff";
        const norm = Math.min(1, Math.max(0.12, externalLevel / 100));

        for (let i = 0; i < barCount; i++) {
          const wave = 0.45 + 0.55 * Math.sin(phase + i * 0.42);
          const h = Math.max(3.5, Math.min(canvas.height - 2, norm * wave * (canvas.height - 2)));
          const x = startX + i * (barWidth + gap);
          const y = (canvas.height - h) / 2;
          ctx.fillStyle = baseColor;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, h, 1.5);
          ctx.fill();
        }
      };
      drawExternal();
      return () => {
        isMounted = false;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }

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

            // Gradient bar using agent themeColor or fallback
            const baseColor = themeColor || "#f8a87c";
            const gradient = ctx.createLinearGradient(0, y, 0, y + height);
            gradient.addColorStop(0, percent > 0.6 ? "#ff3366" : baseColor);
            gradient.addColorStop(1, percent > 0.6 ? baseColor : "#ff3366");

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
  }, [isRecording, typeof externalLevel === "number" ? Math.round(externalLevel / 4) : undefined]);

  if (!isRecording) return null;

  const activeLvl = typeof externalLevel === "number" ? externalLevel : currentLevel;

  return (
    <canvas
      ref={canvasRef}
      width={140}
      height={24}
      className={`block shrink-0 transition-all duration-100 max-w-full ${className}`}
    />
  );
}
