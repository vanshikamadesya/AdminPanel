import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell, User, LogOut, KeyRound, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/Button';
import { getInitials } from '../../lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
  onSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
}

export function Navbar({ onMenuClick, onSidebarToggle, isSidebarCollapsed }: NavbarProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean).at(-1) || 'dashboard';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="hidden lg:inline-flex"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </Button>

          <div className="border-l border-border pl-4">
            <p className="text-xs font-medium text-muted-foreground">Workspace</p>
            <h2 className="mt-0.5 capitalize text-lg font-semibold tracking-tight">{pageName.replace('-', ' ')}</h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-semibold text-white shadow-sm">
                {user ? getInitials(user.firstName, user.lastName) : 'U'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div className="bg-popover absolute top-full right-0 z-50 mt-2 w-60 rounded-xl border p-1.5 shadow-xl">
                  <Link
                    to="/profile"
                    className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/change-password"
                    className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <KeyRound className="h-4 w-4" />
                    Change password
                  </Link>
                  <hr className="border-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="text-destructive hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
