import { describe, it, expect } from 'bun:test';
import { buildHtmlShell } from './buildHtmlShell';

describe('buildHtmlShell', () => {
  it('injects chunk URL and meta tags', () => {
    const html = buildHtmlShell({
      chunkUrl: '/__xacos/home.js',
      meta: { title: 'Home', description: 'Testing' }
    });
    
    expect(html).toContain('<title>Home</title>');
    expect(html).toContain('description" content="Testing"');
    expect(html).toContain('src="/__xacos/home.js"');
    expect(html).toContain('<div id="root"></div>');
  });

  it('injects SSR HTML into root div', () => {
    const html = buildHtmlShell({
      chunkUrl: '/__xacos/home.js',
      ssrHtml: '<h1>SSR Content</h1>'
    });
    
    expect(html).toContain('<div id="root"><h1>SSR Content</h1></div>');
  });
});

