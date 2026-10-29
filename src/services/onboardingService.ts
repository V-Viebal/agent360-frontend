import { driver, Driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

const STORAGE_KEY_SEEN_ONBOARDING = "agent360_has_seen_onboarding_tour_v3";
const STORAGE_KEY_TOUR_COMPLETED = "agent360_onboarding_completed_at_v3";

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
 * Lean 4-step guided tour:
 * 1. Chọn đồng đội (Agent)
 * 2. Giao việc (Composer)
 * 3. Hồ sơ kỹ năng (Specs/Memory)
 * 4. Phím tắt (Ctrl + K)
 */
export function startOnboardingTour(options: OnboardingTourOptions = {}): Driver | null {
  if (typeof window === "undefined") return null;

  if (!options.force && hasSeenOnboardingTour()) {
    return null;
  }

  const isMobile = window.innerWidth < 768;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    overlayColor: "rgba(0, 0, 0, 0.75)",
    nextBtnText: "Tiếp ▸",
    prevBtnText: "◂ Trước",
    doneBtnText: "Bắt đầu ✓",
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
          title: "1. Đồng đội AI",
          description: "Chọn nhân viên AI phụ trách theo từng nghiệp vụ.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-prompt-composer",
        popover: {
          title: "2. Giao việc",
          description: "Nhập nội dung yêu cầu hoặc bấm mic nói chuyện rảnh tay.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#tour-bot-spec-trigger",
        popover: {
          title: "3. Hồ sơ & Kỹ năng",
          description: "Xem bộ nhớ (Memory), tài liệu (Library) và công cụ liên kết.",
          side: isMobile ? "top" : "left",
          align: "start",
        },
      },
      {
        element: "#tour-command-palette-trigger",
        popover: {
          title: "4. Lệnh nhanh (Ctrl+K)",
          description: "Mở bảng tìm kiếm và chuyển đổi tác vụ tức thì.",
          side: "right",
          align: "end",
        },
      },
    ] as DriveStep[]).filter((step) => {
      if (typeof step.element === "string") {
        return Boolean(document.querySelector(step.element));
      }
      return true;
    }),
  });

  driverObj.drive();
  return driverObj;
}

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
