// Web Notification & Audio Alert Service for Skyer

export type SoundPreset = "modern" | "retro" | "pop" | "bell";

export interface SoundPresetOption {
  id: SoundPreset;
  name: string;
  description: string;
}

export const SOUND_PRESETS: SoundPresetOption[] = [
  { id: "modern", name: "Modern Chime", description: "Harmonic dual-tone sine chime (E5 & B5)" },
  { id: "retro", name: "Retro Beep", description: "Crisp 8-bit terminal arcade beep" },
  { id: "pop", name: "Subtle Pop", description: "Warm, non-intrusive soft bubble click" },
  { id: "bell", name: "Crystal Bell", description: "Vibrant high-register chime with resonance" },
];

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}


export function getNotificationVolume(): number {
  if (typeof window === "undefined") return 0.8;
  try {
    const v = localStorage.getItem("agent360_chime_volume");
    return v !== null ? Math.max(0, Math.min(1, parseFloat(v))) : 0.8;
  } catch {
    return 0.8;
  }
}

export function setNotificationVolume(vol: number): void {
  if (typeof window === "undefined") return;
  try {
    const clamped = Math.max(0, Math.min(1, vol));
    localStorage.setItem("agent360_chime_volume", clamped.toFixed(2));
  } catch {}
}

export function isNotificationGranted(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
}

// Synthesize audio preset on demand using Web Audio API
export function playNotificationChime(preset: SoundPreset = "modern", customVolume?: number): void {
  const masterVolume = customVolume !== undefined ? Math.max(0, Math.min(1, customVolume)) : getNotificationVolume();
  if (masterVolume <= 0) return;
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    switch (preset) {
      case "retro": {
        // 8-bit crisp arcade square beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04 * masterVolume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }

      case "pop": {
        // Warm subtle pop / bubble click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.09 * masterVolume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case "bell": {
        // High register resonant bell
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(1046.5, now); // C6
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(2093.0, now); // C7 harmonic

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06 * masterVolume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
        break;
      }

      case "modern":
      default: {
        // Harmonic double-chime (sine wave E5 -> B5)
        const playTone = (freq: number, startTime: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.08 * masterVolume, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        playTone(659.25, now, 0.28);
        playTone(987.77, now + 0.09, 0.35);
        break;
      }
    }
  } catch (err) {
    console.warn("Unable to play notification chime:", err);
  }
}

export function notifyTaskComplete(params: {
  agentName: string;
  taskSnippet: string;
  sessionId?: string;
  soundEnabled?: boolean;
  soundPreset?: SoundPreset;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  // Play audio chime if sound is enabled
  if (params.soundEnabled !== false) {
    playNotificationChime(params.soundPreset || "modern");
  }

  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const title = `${params.agentName} — Task Completed`;
  const body = params.taskSnippet
    ? (params.taskSnippet.length > 90 ? params.taskSnippet.slice(0, 90) + "..." : params.taskSnippet)
    : "Your autonomous agent has finished processing.";

  // 1. Try sending message to active Service Worker registration
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "NOTIFY_TASK_COMPLETE",
      title,
      body,
      icon: "/favicon.svg",
      tag: `skyer-turn-${params.sessionId || Date.now()}`,
      url: `/app`
    });
    return;
  }

  // 2. Fallback to direct window Notification if document is backgrounded/hidden
  if (document.hidden) {
    try {
      new Notification(title, {
        body,
        icon: "/favicon.svg",
        tag: `skyer-turn-${params.sessionId || Date.now()}`
      });
    } catch (e) {
      console.warn("Direct Notification fallback error:", e);
    }
  }
}
