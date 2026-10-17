import { driver, Driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

const STORAGE_KEY_SEEN_ONBOARDING = "agent360_has_seen_onboarding_tour";
const STORAGE_KEY_TOUR_COMPLETED = "agent360_onboarding_completed_at";

export interface OnboardingTourOptions {
  onTourComplete?: () => void;
  force?: boolean;
}

export function hasSeenOnboardingTour(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY_SEEN_ONBOARDING) === "true";
  } catch {
    return false;
  }
}

export function markOnboardingTourSeen(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SEEN_ONBOARDING, "true");
    localStorage.setItem(STORAGE_KEY_TOUR_COMPLETED, new Date().toISOString());
  } catch {}
}

export function resetOnboardingTour(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_SEEN_ONBOARDING);
    localStorage.removeItem(STORAGE_KEY_TOUR_COMPLETED);
  } catch {}
}

/**
 * Start the Driver.js interactive guided tour for new users.
 * Matches the App360 frontend theme with Skyer dark aesthetics & custom accents.
 */
export function startOnboardingTour(options: OnboardingTourOptions = {}): Driver | null {
  if (typeof window === "undefined") return null;

  // Don't auto-start if already seen, unless forced
  if (!options.force && hasSeenOnboardingTour()) {
    return null;
  }

  // Abort if screen is too narrow (mobile users get bottom sheet or manual help)
  const isMobile = window.innerWidth < 768;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: "rgba(0, 0, 0, 0.78)",
    nextBtnText: "Tiếp tục ▸",
    prevBtnText: "◂ Quay lại",
    doneBtnText: "Bắt đầu làm việc ✓",
    popoverClass: "driverjs-skyer-theme",
    onDestroyStarted: () => {
      markOnboardingTourSeen();
      if (options.onTourComplete) {
        options.onTourComplete();
      }
      driverObj.destroy();
    },
    steps: ([
      {
        element: "#tour-agent-selector",
        popover: {
          title: "🤖 Chọn AI Teammate",
          description: "Chọn bot chuyên môn (SWE, SRE, QA, Sentinel, v.v.) từ danh sách các instance đang chạy thực tế trên hạ tầng cluster.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-chat-sessions",
        popover: {
          title: "💬 Quản lý Phiên Hội Thoại",
          description: "Lịch sử chat độc lập theo từng agent. Bạn có thể tạo phiên mới, ghim phiên quan trọng (Pin), đổi tên hoặc xem trạng thái Done.",
          side: isMobile ? "bottom" : "left",
          align: "start",
        },
      },
      {
        element: "#tour-prompt-composer",
        popover: {
          title: "⚡ Gửi Yêu Cầu & Giọng Nói",
          description: "Nhập lệnh prompt hoặc bấm biểu tượng Micro (Alt + M) để nói chuyện rảnh tay qua Voice VAD. Kèm các shortcut tra cứu nhanh bằng Ctrl+/.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#tour-bot-spec-trigger",
        popover: {
          title: "🛠 Chi Tiết Kỹ Thuật & Công Cụ",
          description: "Mở pane thông tin agent để xem Model đang chạy, cây thư mục làm việc (Workspace Tree), Connected Apps và lịch trình tự động (Cron).",
          side: isMobile ? "top" : "left",
          align: "start",
        },
      },
      {
        element: "#tour-command-palette-trigger",
        popover: {
          title: "⌨️ Quick Launcher & Command Palette",
          description: "Bấm nút này hoặc gõ Ctrl + K bất kỳ lúc nào để chuyển nhanh giữa các Agent, Node hạ tầng, hoặc test thiết bị âm thanh.",
          side: "right",
          align: "end",
        },
      },
    ] as DriveStep[]).filter((step) => {
      // Filter out elements that may not currently exist in the DOM (e.g. collapsed tabs)
      if (typeof step.element === "string") {
        return Boolean(document.querySelector(step.element));
      }
      return true;
    }),
  });

  // Start driving
  driverObj.drive();
  return driverObj;
}

/**
 * Highlights a single target element with a descriptive popover.
 * Aligned with App360 OnboardingService.highlightElement() standard.
 */
export function highlightElement(
  selector: string,
  title: string,
  description: string,
  side: "top" | "right" | "bottom" | "left" | "over" = "bottom"
): void {
  if (typeof window === "undefined" || window.innerWidth < 768) return;
  const target = document.querySelector(selector);
  if (!target) return;

  const driverObj = driver({
    showProgress: false,
    animate: true,
    overlayColor: "rgba(0, 0, 0, 0.75)",
    nextBtnText: "Đóng",
    doneBtnText: "Đã hiểu",
    popoverClass: "driverjs-skyer-theme",
    steps: [
      {
        element: selector,
        popover: {
          title,
          description,
          side: side as any,
          align: "start",
        },
      },
    ],
  });
  driverObj.drive();
}

/**
 * "Lights Off" Focus Spotlight
 * Dims the screen and focuses attention on a target element without floating popover.
 * Aligned with App360 OnboardingService.lightsOffFocus() standard.
 */
export function lightsOffFocus(selector: string): void {
  if (typeof window === "undefined" || window.innerWidth < 768) return;
  const target = document.querySelector(selector);
  if (!target) return;

  const driverObj = driver({
    showProgress: false,
    animate: true,
    overlayColor: "rgba(0, 0, 0, 0.8)",
    steps: [{ element: selector }],
  });
  driverObj.drive();
}
