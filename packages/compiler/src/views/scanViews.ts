import { ViewScanner, type ViewRoute } from '../scanner/ViewScanner';

/**
 * Functional wrapper for ViewScanner.scan().
 */
export function scanViews(viewsDir: string): ViewRoute[] {
  return new ViewScanner(viewsDir).scan();
}
