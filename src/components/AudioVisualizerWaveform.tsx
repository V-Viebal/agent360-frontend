import React, { useEffect, useRef } from "react";

interface AudioVisualizerWaveformProps {
  isRecording: boolean;
  className?: string;
}

export function AudioVisualizerWaveform({ isRecording, className = "" }: AudioVisualizerWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

        const preferredDeviceId = localStorage.getItem("agent360_preferred_mic_id") || undefined;
        const audioConstraints: MediaTrackConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
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

          for (let i = 0; i < barCount; i++) {
            // Sample frequency bin
            const index = Math.floor((i / barCount) * (bufferLength / 2));
            const val = dataArray[index] || 0;
            const percent = val / 255;
            const height = Math.max(3, percent * (canvas.height - 2));

            const x = startX + i * (barWidth + gap);
            const y = (canvas.height - height) / 2;

            // Gradient bar
            const gradient = ctx.createLinearGradient(0, y, 0, y + height);
            gradient.addColorStop(0, "#ff7a00");
            gradient.addColorStop(1, "#ff3366");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, 1.5);
            ctx.fill();
          }
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
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 animate-in fade-in select-none ${className}`}>
      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
      <span className="text-[10px] font-mono text-red-400 font-semibold uppercase tracking-wider shrink-0">
        Listening
      </span>
      <canvas
        ref={canvasRef}
        width={100}
        height={20}
        className="block shrink-0"
      />
    </div>
  );
}
