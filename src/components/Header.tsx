
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-off-white/80 backdrop-blur-sm border-b border-light-grey/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted-olive rounded-lg flex items-center justify-center">
              <span className="text-off-white font-bold text-lg">30</span>
            </div>
            <h1 className="text-xl font-bold text-dark-slate-gray">三十日挑戰</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-dark-slate-gray hover:text-muted-olive transition-colors font-medium">
              探索挑戰
            </a>
            <a href="#" className="text-dark-slate-gray hover:text-muted-olive transition-colors font-medium">
              我的挑戰
            </a>
            <a href="#" className="text-dark-slate-gray hover:text-muted-olive transition-colors font-medium">
              發起挑戰
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-warm-tan/20">
              <Search className="h-5 w-5 text-dark-slate-gray" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-warm-tan/20">
              <Bell className="h-5 w-5 text-dark-slate-gray" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-warm-tan/20">
              <User className="h-5 w-5 text-dark-slate-gray" />
            </Button>
            <Button className="btn-primary">
              登入
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
