export interface SidebarItem {
  title: string;
  href?: string;
  items?: SidebarItem[];
}

export const sidebar: SidebarItem[] = [
  { title: 'Getting Started', href: '/docs' },
  {
    title: 'Core',
    items: [
      { title: 'IoC Container', href: '/docs/core/container' },
      { title: 'Boot Lifecycle', href: '/docs/core/lifecycle' },
    ],
  },
  {
    title: 'API Routes',
    items: [
      { title: 'File Convention', href: '/docs/api/routing' },
      { title: 'XRouter', href: '/docs/api/router' },
      { title: 'Controllers', href: '/docs/api/controllers' },
    ],
  },
  { title: 'ORM', href: '/docs/orm/models' },
  { title: 'Auth', href: '/docs/auth' },
  { title: 'Frontend', href: '/docs/frontend/views' },
  { title: 'CLI', href: '/docs/cli/commands' },
  { title: 'Packages', href: '/docs/packages' },
];
