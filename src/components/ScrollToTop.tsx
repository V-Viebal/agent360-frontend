import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop ensures that when navigating across routes:
 * 1. The viewport automatically resets to the top (0, 0) for fresh pages.
 * 2. If a hash anchor is provided (e.g. /#bots, /#pricing, /#faq), it smoothly scrolls to that element with navbar offset compensation (64px).
 * 3. Handles asynchronous/lazy-loaded route elements gracefully with a quick fallback retry.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // 1. Handle anchor hash navigation (e.g. #bots, #pricing, #faq)
    if (hash) {
      const targetId = hash.replace("#", "");
      let retries = 0;
      const maxRetries = 8;

      const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          const navOffset = 72; // h-16 navbar (64px) + breathing space
          const targetY = el.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth",
          });
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const interval = setInterval(() => {
          retries++;
          if (scrollToTarget() || retries >= maxRetries) {
            clearInterval(interval);
          }
        }, 50);
        return () => clearInterval(interval);
      }
      prevPathnameRef.current = pathname;
      return;
    }

    // 2. Normal page navigation: reset window and document scroll to top
    // Always execute on pathname transition
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    prevPathnameRef.current = pathname;
  }, [pathname, hash]);

  return null;
}
