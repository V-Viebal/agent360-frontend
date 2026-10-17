// Text-to-Speech (TTS) Voice Synthesis Service for Skyer

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  gender?: "female" | "male";
}

export interface SpeechSettings {
  rate: number;
  pitch: number;
  voiceURI?: string;
}

export function getStoredSpeechSettings(): SpeechSettings {
  if (typeof window === "undefined") {
    return { rate: 1.05, pitch: 1.0, voiceURI: "" };
  }
  try {
    const rawRate = localStorage.getItem("agent360_speech_rate");
    const rawPitch = localStorage.getItem("agent360_speech_pitch");
    const voiceURI = localStorage.getItem("agent360_speech_voice") || "";
    const rate = rawRate ? Math.min(Math.max(parseFloat(rawRate), 0.7), 1.8) : 1.05;
    const pitch = rawPitch ? Math.min(Math.max(parseFloat(rawPitch), 0.5), 1.5) : 1.0;
    return {
      rate: isNaN(rate) ? 1.05 : rate,
      pitch: isNaN(pitch) ? 1.0 : pitch,
      voiceURI
    };
  } catch {
    return { rate: 1.05, pitch: 1.0, voiceURI: "" };
  }
}

export function saveStoredSpeechSettings(settings: Partial<SpeechSettings>): void {
  if (typeof window === "undefined") return;
  try {
    if (settings.rate !== undefined) {
      localStorage.setItem("agent360_speech_rate", settings.rate.toFixed(2));
    }
    if (settings.pitch !== undefined) {
      localStorage.setItem("agent360_speech_pitch", settings.pitch.toFixed(2));
    }
    if (settings.voiceURI !== undefined) {
      localStorage.setItem("agent360_speech_voice", settings.voiceURI);
    }
  } catch {}
}

let _cachedVoices: SpeechSynthesisVoice[] = [];

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  if (_cachedVoices.length > 0) {
    return _cachedVoices;
  }
  _cachedVoices = window.speechSynthesis.getVoices();
  return _cachedVoices;
}

// Proactively populate voice cache when browser signals voices loaded
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    _cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function pickBestVoice(langPreference: "vi" | "en" = "vi", customVoiceURI?: string): SpeechSynthesisVoice | undefined {
  const voices = getAvailableVoices();
  if (voices.length === 0) return undefined;

  // 1. If explicit custom voice URI specified and matches
  if (customVoiceURI) {
    const match = voices.find((v) => v.voiceURI === customVoiceURI || v.name === customVoiceURI);
    if (match) return match;
  }

  // 2. Stored voice preference
  const stored = getStoredSpeechSettings();
  if (stored.voiceURI) {
    const match = voices.find((v) => v.voiceURI === stored.voiceURI || v.name === stored.voiceURI);
    if (match) return match;
  }

  // 3. Fallback heuristics
  if (langPreference === "vi") {
    // Look for Vietnamese voice first (e.g. Google Tiếng Việt, Microsoft HoaiMy, etc.)
    const viVoice = voices.find((v) => v.lang.startsWith("vi") || v.lang.includes("VN"));
    if (viVoice) return viVoice;
  }

  // Natural English voices fallback (e.g. Google US English, Samantha, Daniel)
  const enVoice = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
  ) || voices.find((v) => v.lang.startsWith("en"));

  return enVoice || voices[0];
}


// Audio Ducking: lowers background audio / chime volume during active TTS readout
let _isDuckingActive = false;

export function isAudioDuckingActive(): boolean {
  return _isDuckingActive;
}

function setDuckingState(active: boolean) {
  _isDuckingActive = active;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("agent360_audio_ducking_changed", { detail: { isDucking: active } }));
  }
}


export interface TextChunkSegment {
  text: string;
  lang: "vi" | "en";
}

/**
 * Split mixed Vietnamese-English technical text into segments for accurate bilingual TTS pronunciation
 */
export function segmentBilingualText(text: string): TextChunkSegment[] {
  if (!text) return [];

  // Match sentences or clauses
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  const segments: TextChunkSegment[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    // Detect if this sentence has Vietnamese tone marks
    const hasVi = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(trimmed);
    segments.push({
      text: trimmed,
      lang: hasVi ? "vi" : "en",
    });
  }

  return segments;
}

export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";

  return rawText
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, " Đã hiển thị mã nguồn. ")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove image and link tags
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    // Remove markdown headers and formatting marks
    .replace(/[#*_~>]/g, "")
    // Remove repetitive bullet markers
    .replace(/^\s*[-+*]\s+/gm, "")
    // Collapse excess spaces and newlines
    .replace(/\s+/g, " ")
    .trim();
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    setDuckingState(false);
  }
}

export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceURI?: string;
    voice?: SpeechSynthesisVoice;
    onEnd?: () => void;
    onError?: (err: any) => void;
    onSegmentChange?: (segmentText: string, index: number, total: number) => void;
  }
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  const clean = cleanTextForSpeech(text);
  if (!clean) return false;

  // Cancel any ongoing speech turn
  window.speechSynthesis.cancel();

  const segments = segmentBilingualText(clean);
  if (segments.length === 0) return false;

  const stored = getStoredSpeechSettings();
  let currentSegmentIndex = 0;

  setDuckingState(true);

  const speakNextSegment = () => {
    if (currentSegmentIndex >= segments.length) {
      setDuckingState(false);
      options?.onEnd?.();
      return;
    }

    const seg = segments[currentSegmentIndex];
    const segmentVoice = options?.voice || pickBestVoice(seg.lang, options?.voiceURI);

    options?.onSegmentChange?.(seg.text, currentSegmentIndex, segments.length);

    const utterance = new SpeechSynthesisUtterance(seg.text);
    if (segmentVoice) {
      utterance.voice = segmentVoice;
      utterance.lang = segmentVoice.lang;
    }
    utterance.rate = options?.rate ?? stored.rate;
    utterance.pitch = options?.pitch ?? stored.pitch;
    utterance.volume = options?.volume ?? 1.0;

    utterance.onend = () => {
      currentSegmentIndex++;
      speakNextSegment();
    };

    utterance.onerror = (e) => {
      console.warn("Speech segment error:", e);
      currentSegmentIndex++;
      if (currentSegmentIndex < segments.length) {
        speakNextSegment();
      } else {
        setDuckingState(false);
        options?.onError?.(e);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNextSegment();
  return true;
}
