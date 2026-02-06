// Framer Motion animation variants for Tambo components
import type { Variants, Transition } from "framer-motion";

export const fabVariants: Variants = {
  idle: {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    } as Transition,
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)",
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

export const fabIconVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 45 },
};

export const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export const pulseKeyframes = {
  scale: [1, 1.05, 1],
  boxShadow: [
    "0 0 0 0 rgba(6, 182, 212, 0.4)",
    "0 0 0 10px rgba(6, 182, 212, 0)",
    "0 0 0 0 rgba(6, 182, 212, 0)",
  ],
};

export const pulseTransition: Transition = {
  duration: 2,
  repeat: Infinity,
  ease: "easeOut" as const,
};
