"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onStoreEvent } from "@/lib/store-events";

interface HighlightState {
  elementId: string;
  label: string;
  rect: DOMRect | null;
}

interface OnboardingStep {
  elementId: string;
  label: string;
  duration?: number;
}

interface HighlightPayload {
  elementId?: string;
  label?: string;
  duration?: number;
  steps?: OnboardingStep[];
}

export function HighlightOverlay() {
  const [highlight, setHighlight] = useState<HighlightState | null>(null);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onboardingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runOnboardingStepRef = useRef<
    ((steps: OnboardingStep[], stepIndex: number) => void) | null
  >(null);

  const clearHighlight = useCallback(() => {
    // Remove highlight-active class from all elements
    document.querySelectorAll(".highlight-active").forEach((el) => {
      el.classList.remove("highlight-active");
    });
    setHighlight(null);
  }, []);

  const highlightElement = useCallback(
    (elementId: string, label: string, duration = 3000) => {
      // Clear any previous highlight
      clearHighlight();
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);

      // Small delay to let DOM settle after navigation
      requestAnimationFrame(() => {
        const el = document.querySelector(
          `[data-highlight="${elementId}"]`
        ) as HTMLElement | null;

        if (!el) {
          console.warn(`[Highlight] Element not found: ${elementId}`);
          setHighlight(null);
          return;
        }

        // Scroll into view smoothly
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

        // Wait a bit for scroll to complete, then apply highlight
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          el.classList.add("highlight-active");
          setHighlight({ elementId, label, rect });

          // Auto-remove after duration
          cleanupTimerRef.current = setTimeout(() => {
            el.classList.remove("highlight-active");
            setHighlight(null);
          }, duration);
        }, 400);
      });
    },
    [clearHighlight]
  );

  // Run a single onboarding step
  const runOnboardingStep = useCallback(
    (steps: OnboardingStep[], stepIndex: number) => {
      if (stepIndex >= steps.length) {
        // Onboarding complete
        setIsOnboarding(false);
        setOnboardingSteps([]);
        setCurrentStep(0);
        clearHighlight();
        return;
      }

      const step = steps[stepIndex];
      setCurrentStep(stepIndex);
      highlightElement(step.elementId, step.label, step.duration ?? 3500);

      // Advance to next step after duration
      onboardingTimerRef.current = setTimeout(() => {
        runOnboardingStepRef.current?.(steps, stepIndex + 1);
      }, (step.duration ?? 3500) + 500); // +500ms gap between steps
    },
    [highlightElement, clearHighlight]
  );

  useEffect(() => {
    runOnboardingStepRef.current = runOnboardingStep;
  }, [runOnboardingStep]);

  // Update label position on scroll/resize
  useEffect(() => {
    if (!highlight) return;

    const updatePosition = () => {
      const el = document.querySelector(
        `[data-highlight="${highlight.elementId}"]`
      ) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setHighlight((prev) => (prev ? { ...prev, rect } : null));
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [highlight?.elementId]);

  // Listen for highlight events from the store event bus
  useEffect(() => {
    return onStoreEvent((event) => {
      if (event.type !== "highlight") return;

      const payload = event.payload as unknown as HighlightPayload;
      if (!payload) return;

      // Cancel any running onboarding
      if (onboardingTimerRef.current) {
        clearTimeout(onboardingTimerRef.current);
      }
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }

      if (payload.steps && payload.steps.length > 0) {
        // Onboarding mode — sequential highlights
        setIsOnboarding(true);
        setOnboardingSteps(payload.steps);
        runOnboardingStep(payload.steps, 0);
      } else if (payload.elementId) {
        // Single element highlight
        setIsOnboarding(false);
        setOnboardingSteps([]);
        highlightElement(
          payload.elementId,
          payload.label ?? "",
          payload.duration ?? 3000
        );
      }
    });
  }, [highlightElement, runOnboardingStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
      if (onboardingTimerRef.current) clearTimeout(onboardingTimerRef.current);
      clearHighlight();
    };
  }, [clearHighlight]);

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!highlight?.rect) return { display: "none" };

    const { rect } = highlight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine if tooltip should go above or below
    const spaceBelow = viewportHeight - rect.bottom;
    const showAbove = spaceBelow < 120 && rect.top > 120;

    let top: number;
    if (showAbove) {
      top = rect.top - 60;
    } else {
      top = rect.bottom + 16;
    }

    // Center horizontally on the element, but keep within viewport
    let left = rect.left + rect.width / 2;
    left = Math.max(120, Math.min(left, viewportWidth - 120));

    return {
      position: "fixed" as const,
      top: `${top}px`,
      left: `${left}px`,
      transform: "translateX(-50%)",
      zIndex: 9999,
    };
  };

  return (
    <AnimatePresence>
      {highlight && highlight.label && highlight.rect && (
        <motion.div
          key={highlight.elementId}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={getTooltipStyle()}
          className="pointer-events-none"
        >
          <div className="relative bg-gradient-to-r from-cyan-600 to-sky-600 text-white px-4 py-2.5 rounded-xl shadow-xl shadow-cyan-500/25 text-sm font-medium whitespace-nowrap max-w-xs">
            <div className="flex items-center gap-2">
              {isOnboarding && onboardingSteps.length > 0 && (
                <span className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/20 text-[10px] font-bold">
                  {currentStep + 1}/{onboardingSteps.length}
                </span>
              )}
              <span className="truncate">{highlight.label}</span>
            </div>
            {/* Arrow pointing up or down */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-cyan-600 rotate-45" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
