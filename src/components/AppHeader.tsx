
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export const AppHeader = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ChallengeApp</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {loading ? null : user ? (
              <>
                <span className="text-sm font-medium hidden sm:inline-block">{user.email}</span>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
