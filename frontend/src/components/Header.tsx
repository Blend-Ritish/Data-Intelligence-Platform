import { History, User, LogOut, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import logoDark from '@/assets/logo.png';
import logoLight from '@/assets/logo-light.png';

interface HeaderProps {
  onHistoryClick: () => void;
  onAnalysisClick: () => void;
  onLoadAnalysisClick: () => void;
}

export function Header({ onHistoryClick, onAnalysisClick, onLoadAnalysisClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 md:h-18 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={theme === 'dark' ? logoDark : logoLight} 
            alt="Blend Logo" 
            className="h-8 md:h-10 w-auto"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          
          {/* <Button 
            variant="hero" 
            onClick={onAnalysisClick}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Get Analysis</span>
          </Button> */}
          <Button 
            variant="hero" 
            onClick={onLoadAnalysisClick}
            className="gap-2 bg-[#073155] dark:bg-primary hover:bg-[#073155]/90 dark:hover:bg-primary/90 text-white dark:text-primary-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Load Analysis</span>
          </Button>
          <Button 
            variant="glass" 
            size="icon" 
            onClick={onHistoryClick}
            className="relative"
          >
            <History className="h-5 w-5" />
            <span className="sr-only">History</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-[#073155] dark:bg-primary text-white dark:text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-[#073155] dark:bg-primary text-white dark:text-primary-foreground font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2 cursor-pointer">
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
