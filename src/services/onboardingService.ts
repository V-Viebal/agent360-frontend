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
    doneBtnText: "Vào việc ngay ✓",
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
          title: "🤝 Gặp gỡ Đồng đội AI của bạn",
          description: "Mỗi bạn bot ở đây là một đồng nghiệp chuyên trách (Lập trình viên, Vận hành hệ thống, Kiểm thử, Quản trị, v.v.). Bấm vào để bắt đầu làm việc cùng bạn ấy nhé!",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-chat-sessions",
        popover: {
          title: "📋 Nhật ký công việc & Cuộc trò chuyện",
          description: "Nơi lưu lại các lần trao đổi riêng với từng bạn đồng đội. Bạn có thể mở chủ đề mới, ghim việc quan trọng lên đầu hoặc tìm lại trao đổi cũ.",
          side: isMobile ? "bottom" : "left",
          align: "start",
        },
      },
      {
        element: "#tour-prompt-composer",
        popover: {
          title: "💬 Nhắn tin hoặc Nói chuyện trực tiếp",
          description: "Gõ câu hỏi vào đây, hoặc bấm micro (Alt + M) để nói chuyện rảnh tay như đang gọi điện cho đồng nghiệp. Bấm Ctrl + / để xem thêm phím tắt nhanh nhé.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#tour-bot-spec-trigger",
        popover: {
          title: "🔍 Xem Hồ sơ & Kỹ năng của đồng đội",
          description: "Bấm vào tên bạn ấy ở trên để xem hồ sơ chuyên môn: Trí nhớ dự án (Memory), tài liệu tham khảo (Library), ứng dụng liên kết và công cụ hỗ trợ.",
          side: isMobile ? "top" : "left",
          align: "start",
        },
      },
      {
        element: "#tour-command-palette-trigger",
        popover: {
          title: "⚡ Bảng lệnh thần tốc (Ctrl + K)",
          description: "Bấm vào đây hoặc nhấn Ctrl + K bất cứ lúc nào để gọi nhanh đồng đội khác, tìm hội thoại cũ, hoặc chỉnh âm lượng thông báo.",
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
