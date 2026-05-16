import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({
  children,
  title,
  description,
  footer,
  className,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-xacos-surface border border-xacos-border rounded-xacos",
        className,
      )}
    >
      {(title !== undefined || description !== undefined) && (
        <div className="px-6 py-4 border-b border-xacos-border">
          {title !== undefined && (
            <h3 className="text-base font-semibold text-xacos-text">{title}</h3>
          )}
          {description !== undefined && (
            <p className="text-sm text-xacos-muted mt-1">{description}</p>
          )}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer !== undefined && (
        <div className="px-6 py-4 border-t border-xacos-border bg-white/[0.02]">
          {footer}
        </div>
      )}
    </div>
  );
}

