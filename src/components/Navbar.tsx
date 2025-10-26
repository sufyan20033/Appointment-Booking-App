import { Link, useLocation } from 'react-router-dom';
import { Calendar, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  user?: { name: string; email: string; role: string };
  onLogout?: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BookEase
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider' : '/dashboard'}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/dashboard') || isActive('/provider') || isActive('/admin')
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/appointments"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/appointments') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  My Appointments
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
