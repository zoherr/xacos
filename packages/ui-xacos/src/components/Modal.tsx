import React, { useEffect, type ReactNode } from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        role="presentation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full bg-xacos-surface border border-xacos-border",
          "rounded-xacos shadow-2xl z-10",
          sizes[size],
        )}
      >
        {title !== undefined && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-xacos-border">
            <h2 className="text-base font-semibold text-xacos-text">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-xacos-muted hover:text-xacos-text transition-colors"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer !== undefined && (
          <div className="px-6 py-4 border-t border-xacos-border flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

