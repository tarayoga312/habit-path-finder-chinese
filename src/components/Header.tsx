
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">30</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">三十日挑戰</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-md font-medium text-foreground/80 hover:text-primary transition-colors">
              探索挑戰
            </a>
            <a href="#" className="text-md font-medium text-foreground/80 hover:text-primary transition-colors">
              我的挑戰
            </a>
            <a href="#" className="text-md font-medium text-foreground/80 hover:text-primary transition-colors">
              發起挑戰
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-foreground/70" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-foreground/70" />
            </Button>
            <Button>
              登入
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
