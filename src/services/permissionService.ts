// Comprehensive Browser Permission & Hardware Capability Service for Skyer

export type PermissionType = "microphone" | "notifications" | "clipboard" | "speaker";

export interface PermissionStatusDetail {
  type: PermissionType;
  name: string;
  description: string;
  state: "granted" | "denied" | "prompt" | "unsupported";
  canRequest: boolean;
}

/**
 * Query current permission status for a specific browser permission
 */
export async function queryPermissionStatus(type: PermissionType): Promise<PermissionStatusDetail> {
  if (typeof window === "undefined") {
    return {
      type,
      name: getPermissionName(type),
      description: getPermissionDescription(type),
      state: "unsupported",
      canRequest: false,
    };
  }

  // 1. Microphone
  if (type === "microphone") {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        type,
        name: "Microphone Access",
        description: "Allows real-time voice speech-to-text recording for agent interaction.",
        state: "unsupported",
        canRequest: false,
      };
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: "microphone" as any });
        return {
          type,
          name: "Microphone Access",
          description: "Allows real-time voice speech-to-text recording for agent interaction.",
          state: status.state,
          canRequest: status.state !== "denied",
        };
      }
    } catch {
      // Some browsers (Firefox, older WebKit) throw or do not support querying "microphone"
    }

    return {
      type,
      name: "Microphone Access",
      description: "Allows real-time voice speech-to-text recording for agent interaction.",
      state: "prompt",
      canRequest: true,
    };
  }

  // 2. Notifications
  if (type === "notifications") {
    if (!("Notification" in window)) {
      return {
        type,
        name: "Desktop Notifications",
        description: "Sends chime and desktop alerts when an autonomous task completes in background.",
        state: "unsupported",
        canRequest: false,
      };
    }

    const state = Notification.permission as "granted" | "denied" | "default";
    return {
      type,
      name: "Desktop Notifications",
      description: "Sends chime and desktop alerts when an autonomous task completes in background.",
      state: state === "default" ? "prompt" : state,
      canRequest: state !== "denied",
    };
  }

  // 3. Clipboard
  if (type === "clipboard") {
    if (!navigator.clipboard) {
      return {
        type,
        name: "Clipboard Access",
        description: "Allows copying tool outputs, code verification commands, and terminal stdout.",
        state: "unsupported",
        canRequest: false,
      };
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: "clipboard-write" as any });
        return {
          type,
          name: "Clipboard Access",
          description: "Allows copying tool outputs, code verification commands, and terminal stdout.",
          state: status.state,
          canRequest: status.state !== "denied",
        };
      }
    } catch {
      // Fallback
    }

    return {
      type,
      name: "Clipboard Access",
      description: "Allows copying tool outputs, code verification commands, and terminal stdout.",
      state: "granted", // Modern browsers generally allow clipboard-write on user gesture
      canRequest: true,
    };
  }

  // 4. Audio / Speaker (Web Audio & SpeechSynthesis)
  if (type === "speaker") {
    const hasAudio = "AudioContext" in window || "webkitAudioContext" in window;
    const hasTTS = "speechSynthesis" in window;
    return {
      type,
      name: "Audio Playback & Speech",
      description: "Plays harmonic notification chimes and text-to-speech readouts.",
      state: hasAudio || hasTTS ? "granted" : "unsupported",
      canRequest: false,
    };
  }

  return {
    type,
    name: getPermissionName(type),
    description: getPermissionDescription(type),
    state: "unsupported",
    canRequest: false,
  };
}

/**
 * Request permission interactively with user gesture
 */
export async function requestPermission(type: PermissionType): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (type === "microphone") {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      // Stop all tracks immediately once permission is verified/granted
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: any) {
      console.warn("Microphone permission request rejected or failed:", err);
      return false;
    }
  }

  if (type === "notifications") {
    try {
      if (!("Notification" in window)) return false;
      const result = await Notification.requestPermission();
      return result === "granted";
    } catch (err) {
      console.warn("Notification permission request failed:", err);
      return false;
    }
  }

  if (type === "clipboard") {
    try {
      if (!navigator.clipboard) return false;
      await navigator.clipboard.writeText("");
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Query all known permissions supported by the app
 */
export async function queryAllPermissions(): Promise<PermissionStatusDetail[]> {
  const permissions: PermissionType[] = ["microphone", "notifications", "clipboard", "speaker"];
  return Promise.all(permissions.map((p) => queryPermissionStatus(p)));
}

function getPermissionName(type: PermissionType): string {
  switch (type) {
    case "microphone":
      return "Microphone Access";
    case "notifications":
      return "Desktop Notifications";
    case "clipboard":
      return "Clipboard Access";
    case "speaker":
      return "Audio & Speech Playback";
    default:
      return "Browser Permission";
  }
}

function getPermissionDescription(type: PermissionType): string {
  switch (type) {
    case "microphone":
      return "Voice recording for Speech-to-text prompt input.";
    case "notifications":
      return "Desktop alerts when long-running agent tasks complete.";
    case "clipboard":
      return "Copying code snippets, verification logs, and tokens.";
    case "speaker":
      return "Audio chimes and Vietnamese/English Speech synthesis.";
    default:
      return "";
  }
}


export interface AudioInputDeviceOption {
  deviceId: string;
  label: string;
  groupId: string;
}

/**
 * Enumerate connected audio input devices (microphones)
 */
export async function getAvailableAudioInputDevices(): Promise<AudioInputDeviceOption[]> {
  if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((d) => d.kind === "audioinput");
    return audioInputs.map((d, index) => ({
      deviceId: d.deviceId,
      label: d.label || `Microphone ${index + 1}`,
      groupId: d.groupId,
    }));
  } catch (e) {
    console.warn("Failed to enumerate audio devices:", e);
    return [];
  }
}

export function getSelectedAudioDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("agent360_preferred_mic_id") || "";
  } catch {
    return "";
  }
}

export function setSelectedAudioDeviceId(deviceId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("agent360_preferred_mic_id", deviceId);
    window.dispatchEvent(new CustomEvent("agent360_mic_device_changed", { detail: { deviceId } }));
    broadcastAudioSettingChange("MIC_CHANGED", { deviceId });
  } catch {}
}


/**
 * Enumerate connected audio output devices (speakers / headphones)
 */
export async function getAvailableAudioOutputDevices(): Promise<AudioInputDeviceOption[]> {
  if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutputs = devices.filter((d) => d.kind === "audiooutput");
    return audioOutputs.map((d, index) => ({
      deviceId: d.deviceId,
      label: d.label || `Speaker / Headphone ${index + 1}`,
      groupId: d.groupId,
    }));
  } catch (e) {
    console.warn("Failed to enumerate audio output devices:", e);
    return [];
  }
}

export function getSelectedAudioOutputDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("agent360_preferred_speaker_id") || "";
  } catch {
    return "";
  }
}

export function setSelectedAudioOutputDeviceId(deviceId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("agent360_preferred_speaker_id", deviceId);
    window.dispatchEvent(new CustomEvent("agent360_speaker_device_changed", { detail: { deviceId } }));
    broadcastAudioSettingChange("SPEAKER_CHANGED", { deviceId });
  } catch {}
}


// Cross-tab BroadcastChannel for audio hardware settings sync
const AUDIO_SYNC_CHANNEL_NAME = "agent360_audio_sync_channel";
let audioBroadcastChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    audioBroadcastChannel = new BroadcastChannel(AUDIO_SYNC_CHANNEL_NAME);
    audioBroadcastChannel.onmessage = (event) => {
      const data = event.data;
      if (!data || !data.type) return;

      if (data.type === "MIC_CHANGED") {
        window.dispatchEvent(new CustomEvent("agent360_mic_device_changed", { detail: { deviceId: data.deviceId } }));
      } else if (data.type === "SPEAKER_CHANGED") {
        window.dispatchEvent(new CustomEvent("agent360_speaker_device_changed", { detail: { deviceId: data.deviceId } }));
      } else if (data.type === "VAD_CHANGED") {
        window.dispatchEvent(new CustomEvent("agent360_vad_settings_changed", { detail: data.detail }));
      }
    };
  } catch (e) {
    console.warn("BroadcastChannel initialization skipped:", e);
  }
}

export function broadcastAudioSettingChange(type: "MIC_CHANGED" | "SPEAKER_CHANGED" | "VAD_CHANGED", payload: any): void {
  if (audioBroadcastChannel) {
    try {
      audioBroadcastChannel.postMessage({ type, ...payload });
    } catch {}
  }
}
