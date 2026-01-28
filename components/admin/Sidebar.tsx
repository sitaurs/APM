'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  Calendar, 
  Medal, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { 
    title: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard 
  },
  { 
    title: 'Lomba', 
    href: '/admin/lomba', 
    icon: Trophy 
  },
  { 
    title: 'Expo', 
    href: '/admin/expo', 
    icon: Calendar 
  },
  { 
    title: 'Prestasi', 
    href: '/admin/prestasi', 
    icon: Medal 
  },
  { 
    title: 'Registrasi Expo', 
    href: '/admin/registrasi', 
    icon: Users 
  },
  { 
    title: 'Pesan', 
    href: '/admin/messages', 
    icon: MessageSquare 
  },
  { 
    title: 'Settings', 
    href: '/admin/settings', 
    icon: Settings 
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside 
      className={`
        bg-slate-900 text-white h-screen fixed left-0 top-0 z-40
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
              APM
            </div>
            <span className="font-semibold">Admin Panel</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            <p>APM Portal Admin</p>
            <p>v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}
