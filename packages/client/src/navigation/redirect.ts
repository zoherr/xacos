/**
 * Programmatic client-side redirect.
 * Call inside event handlers or useEffect.
 */
export function redirect(url: string): void {
  if (typeof window !== 'undefined') {
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

