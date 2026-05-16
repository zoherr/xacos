/**
 * Simple string interpolation utility for XAOCS templates.
 * Replaces {{ variable }} with values from the data object.
 */
export function interpolate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    return data[key]?.toString() ?? match;
  });
}

