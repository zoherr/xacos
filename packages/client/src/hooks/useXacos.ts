import { useState, useEffect } from 'react';

interface XacosRouteInfo {
  params: Record<string, string>;
  searchParams: Record<string, string>;
  pathname: string;
}

/**
 * Hook that returns current route params, search params, and pathname.
 * Updates when the URL changes via XLink or redirect().
 *
 * Note: params are derived by matching the current pathname against
 * the pattern stored in a data attribute on the root element (set by server).
 */
export function useXacos(): XacosRouteInfo {
  const [info, setInfo] = useState<XacosRouteInfo>(() => extractRouteInfo());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handler = () => setInfo(extractRouteInfo());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return info;
}

function extractRouteInfo(): XacosRouteInfo {
  if (typeof window === 'undefined') {
    return { params: {}, searchParams: {}, pathname: '/' };
  }

  const pathname = window.location.pathname;
  const search = window.location.search;

  // Parse search params
  const searchParams: Record<string, string> = {};
  new URLSearchParams(search).forEach((value, key) => {
    searchParams[key] = value;
  });

  // Params extracted from data attribute set by HTML shell:
  // <div id="root" data-params='{"id":"123"}'>
  const root = document.getElementById('root');
  let params: Record<string, string> = {};
  try {
    const raw = root?.dataset['params'];
    if (raw) params = JSON.parse(raw) as Record<string, string>;
  } catch {
    params = {};
  }

  return { params, searchParams, pathname };
}

