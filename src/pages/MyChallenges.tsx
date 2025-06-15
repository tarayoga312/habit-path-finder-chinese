
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

type UserChallengeForCard = {
  id: string;
  current_day: number;
  challenges: {
    name: string;
    image_url: string | null;
    challenge_type: string | null;
    duration_days: number;
  } | null;
};

// A more specific card for the dashboard context
const MyChallengeCard = ({ userChallenge }: { userChallenge: UserChallengeForCard }) => {
  const challenge = userChallenge.challenges;

  if (!challenge) {
    return (
      <Card className="w-full overflow-hidden transition-all duration-300 shadow-lg">
        <CardHeader className="p-0 relative">
          <Skeleton className="h-48 w-full" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Link to={`/my-challenges/${userChallenge.id}`} className="block group">
      <Card className="w-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-primary shadow-lg">
        <CardHeader className="p-0 relative">
          <img 
            src={challenge.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center'} 
            alt={challenge.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-foreground hover:bg-white">
              {challenge.challenge_type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
            {challenge.name}
          </h3>
          <p className="text-foreground/70 text-sm mb-4 line-clamp-2 h-[40px]">
            第 {userChallenge.current_day} / {challenge.duration_days} 天
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(userChallenge.current_day / challenge.duration_days) * 100}%` }}></div>
          </div>
        </CardContent>
          
        <CardFooter className="flex-col items-start p-6 pt-0">
          <Button size="lg" className="w-full text-base font-semibold">
            繼續挑戰
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};


const fetchUserChallenges = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      id,
      current_day,
      challenges (
        id,
        name,
        description,
        image_url,
        challenge_type,
        duration_days,
        users ( name )
      )
    `)
    .eq('user_id', userId)
    .eq('challenge_status', 'active');

  if (error) {
    console.error('Error fetching user challenges:', error);
    throw new Error('Could not fetch user challenges');
  }
  return data;
};

const MyChallenges = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: userChallenges, isLoading, isError } = useQuery<UserChallengeForCard[]>({
    queryKey: ['user_challenges', user?.id],
    queryFn: () => fetchUserChallenges(user!.id),
    enabled: !!user,
  });

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-lg" />)}
    </div>
  );

  if (authLoading || (isLoading && user)) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">我的挑戰</h1>
        {renderSkeletons()}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">請先登入</h2>
        <p className="text-muted-foreground mb-6">登入後即可查看您已加入的挑戰。</p>
        <Button asChild>
          <Link to="/auth">前往登入</Link>
        </Button>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">無法載入您的挑戰，請稍後再試。</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">我的挑戰</h1>
      {userChallenges && userChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userChallenges.map(uc => (
            <MyChallengeCard key={uc.id} userChallenge={uc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border">
            <h2 className="text-2xl font-bold text-foreground mb-4">尚未加入任何挑戰</h2>
            <p className="text-muted-foreground mb-6">立即探索，開啟您的第一個轉變之旅！</p>
            <Button asChild>
                <Link to="/">探索挑戰</Link>
            </Button>
        </div>
      )}
    </div>
  );
};

export default MyChallenges;
