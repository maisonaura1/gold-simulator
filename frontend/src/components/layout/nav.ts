import { BookOpen, CandlestickChart, Home, NotebookPen, UserRound, type LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

export const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Inicio', icon: Home, match: (p) => p === '/dashboard' },
  { href: '/academy', label: 'Academia', icon: BookOpen, match: (p) => p.startsWith('/academy') },
  { href: '/trade', label: 'Simulador', icon: CandlestickChart, match: (p) => p.startsWith('/trade') },
  { href: '/journal', label: 'Diario', icon: NotebookPen, match: (p) => p.startsWith('/journal') },
  { href: '/account', label: 'Cuenta', icon: UserRound, match: (p) => p.startsWith('/account') },
];
