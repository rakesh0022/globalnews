"use client";

import { useRef, useState, useCallback, type ReactNode, type ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Ripple {
  id:   number;
  x:    number;
  y:    number;
  size: number;
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children:    ReactNode;
  rippleColor?: string;
  variant?:    "primary" | "secondary" | "ghost";
}

const VARIANT_CLASSES: Record<string, string> = {
  primary:   "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-blue-900",
  secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700",
  ghost:     "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
};

export default function RippleButton({
  children,
  className = "",
  rippleColor,
  variant = "primary",
  onClick,
  disabled,
  ...rest
}: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const btnRef   = useRef<HTMLButtonElement>(null);
  const reduced  = useReducedMotion();
  const counter  = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || reduced) {
        onClick?.(e);
        return;
      }

      const btn  = btnRef.current;
      if (!btn) { onClick?.(e); return; }

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x    = e.clientX - rect.left - size / 2;
      const y    = e.clientY - rect.top  - size / 2;
      const id   = ++counter.current;

      setRipples((prev) => [...prev, { id, x, y, size }]);
      // Remove after animation completes
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

      onClick?.(e);
    },
    [disabled, reduced, onClick]
  );

  const defaultRipple = variant === "primary" ? "rgba(255,255,255,0.35)" : "rgba(37,99,235,0.15)";
  const rColor = rippleColor ?? defaultRipple;

  return (
    <motion.button
      ref={btnRef}
      className={`relative overflow-hidden select-none rounded-xl px-5 py-2.5 text-sm font-semibold
        transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]} ${className}`}
      whileTap={disabled || reduced ? {} : { scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled}
      {...(rest as object)}
    >
      {/* Ripple layer */}
      {ripples.map(({ id, x, y, size }) => (
        <motion.span
          key={id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: x, top: y,
            width: size, height: size,
            background: rColor,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.0, 0.0, 0.2, 1.0] }}
        />
      ))}

      {/* Content sits above ripple */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
