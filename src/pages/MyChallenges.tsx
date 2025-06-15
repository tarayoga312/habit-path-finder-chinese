
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ChallengeCard from '@/components/ChallengeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type UserChallenge = {
  challenge_id: string;
  challenges: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    challenge_type: string | null;
    users: { name: string | null } | null;
    duration_days: number;
    start_date: string | null;
    _count: { user_challenges: number };
  } | null;
};

const fetchUserChallenges = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      challenge_id,
      challenges (
        id,
        name,
        description,
        image_url,
        challenge_type,
        duration_days,
        start_date,
        users ( name ),
        user_challenges ( count )
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user challenges:', error);
    throw new Error('Could not fetch user challenges');
  }

  // Supabase typing for count is a bit tricky, let's remap it
  return data.map(uc => {
    if (uc.challenges && Array.isArray(uc.challenges.user_challenges)) {
      const participantCount = uc.challenges.user_challenges[0]?.count ?? 0;
      // @ts-ignore
      uc.challenges.participantCount = participantCount;
    }
    return uc;
  })
};

const MyChallenges = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: challenges, isLoading, isError } = useQuery({
    queryKey: ['user_challenges', user?.id],
    queryFn: () => fetchUserChallenges(user!.id),
    enabled: !!user,
  });

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[450px] w-full rounded-lg" />)}
    </div>
  );

  if (authLoading || (isLoading && user)) {
    return (
      <div className="container mx-auto py-10 px-4">
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
  
  const formattedChallenges = challenges?.map(uc => {
    const challenge = uc.challenges;
    const daysRemaining = challenge?.start_date ? Math.ceil((new Date(challenge.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return {
      id: challenge?.id || '',
      name: challenge?.name || '無標題',
      description: challenge?.description || '無描述',
      image: challenge?.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center',
      hostName: challenge?.users?.name || '匿名',
      challengeType: challenge?.challenge_type || '一般',
      // @ts-ignore
      participantCount: challenge?.participantCount || 0,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    };
  }) || [];

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">我的挑戰</h1>
        {formattedChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formattedChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} {...challenge} />
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
      </main>
    </div>
  );
};

export default MyChallenges;
