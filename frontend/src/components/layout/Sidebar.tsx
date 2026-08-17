import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Package2,
  X,
  Shield,
  Grid3X3,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAppSelector } from '../../store/hooks';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['admin', 'moderator', 'user'],
  },
  {
    title: 'Users',
    icon: Users,
    href: '/users',
    roles: ['admin'],
  },
  {
    title: 'Roles & Permissions',
    icon: Shield,
    href: '/roles',
    roles: ['admin'],
  },
  {
    title: 'Products',
    icon: Package2,
    href: '/products',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Attributes',
    icon: Grid3X3,
    href: '/attributes',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Variants',
    icon: Package2,
    href: '/variants',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Reports',
    icon: FileText,
    href: '/reports',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    roles: ['admin', 'moderator', 'user'],
  },
];

export function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || 'user')
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition-[transform,width] duration-300 lg:translate-x-0',
          isCollapsed && 'lg:w-20',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className={cn('flex h-20 items-center border-b border-white/10 px-5', isCollapsed ? 'lg:justify-center' : 'justify-between')}>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-lg shadow-sky-500/20">
              <span className="text-lg font-bold">A</span>
            </div>
            <div className={cn('min-w-0', isCollapsed && 'lg:hidden')}>
              <p className="truncate text-sm font-semibold tracking-tight">Orbit Admin</p>
              <p className="text-[10px] tracking-[0.18em] text-slate-400 uppercase">
                Workspace
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className={cn('flex-1 space-y-1 overflow-y-auto px-4 py-6', isCollapsed && 'lg:px-3')}>
          <p className={cn('mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase', isCollapsed && 'lg:hidden')}>Workspace</p>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer',
                  isCollapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'bg-white text-slate-950 shadow-lg shadow-black/20'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive ? "text-sky-600" : "group-hover:scale-110"
                    )}
                  />
                  <span className={cn(isCollapsed && 'lg:hidden')}>{item.title}</span>
                  {isActive && (
                    <svg
                      className={cn('ml-auto h-5 w-5', isCollapsed && 'lg:hidden')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={cn('mt-auto border-t border-white/10 p-4', isCollapsed && 'lg:p-3')}>
          <div
            className={cn('flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-200 hover:bg-white/10', isCollapsed && 'lg:justify-center lg:border-0 lg:bg-transparent lg:p-1')}
            onClick={() => { navigate('/profile'); onClose(); }}
          >
            <Avatar
              firstName={user?.firstName || 'U'}
              lastName={user?.lastName || ''}
              size="md"
            />
            <div className={cn('min-w-0 flex-1', isCollapsed && 'lg:hidden')}>
              <p className="truncate text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
