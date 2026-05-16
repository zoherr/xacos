import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  fullWidth = true,
  className,
  id,
  ...props
}: InputProps) {
  const autoId = React.useId();
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : autoId);

  return (
    <div className={clsx("flex flex-col gap-1", fullWidth && "w-full")}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-xacos-text">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={clsx(
          "px-3 py-2 rounded-xacos text-sm",
          "bg-xacos-surface border text-xacos-text",
          "placeholder:text-xacos-muted",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "transition-colors duration-150",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-xacos-border focus:border-primary-500",
          className,
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-xacos-muted">{hint}</p>}
    </div>
  );
}

