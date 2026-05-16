import React, { type AnchorHTMLAttributes, useCallback } from 'react';

interface XLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
}

/**
 * Client-side navigation link.
 * Uses history.pushState to avoid full page reloads.
 *
 * @example
 * <XLink href="/dashboard">Go to Dashboard</XLink>
 */
export function XLink({ href, children, onClick, prefetch = false, ...rest }: XLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let ctrl/cmd+click open in new tab normally
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Let external links go through normally
      if (href.startsWith('http://') || href.startsWith('https://')) return;

      e.preventDefault();
      onClick?.(e);

      // Push new state and dispatch popstate so router can respond
      window.history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    [href, onClick]
  );

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

