import React, { type ReactNode } from "react";
import clsx from "clsx";

interface NavbarProps {
  brand?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  sticky?: boolean;
}

export function Navbar({ brand, children, actions, className, sticky = true }: NavbarProps) {
  return (
    <header
      className={clsx(
        "w-full border-b border-xacos-border bg-xacos-bg/80 backdrop-blur-md",
        sticky && "sticky top-0 z-40",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            {brand !== undefined && <div className="font-semibold text-xacos-text">{brand}</div>}
            {children !== undefined && (
              <nav className="hidden md:flex items-center gap-1">{children}</nav>
            )}
          </div>
          {actions !== undefined && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  active?: boolean;
}

export function NavLink({ href, children, active = false, className, ...rest }: NavLinkProps) {
  return (
    <a
      href={href}
      className={clsx(
        "px-3 py-2 rounded-xacos text-sm transition-colors duration-150",
        active
          ? "text-xacos-text bg-white/10"
          : "text-xacos-muted hover:text-xacos-text hover:bg-white/5",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

