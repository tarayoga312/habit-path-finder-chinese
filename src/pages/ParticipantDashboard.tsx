import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

type DailyTask = Tables<'daily_tasks'>;
type ChallengeWithDetails = Tables<'challenges'> & {
  daily_tasks: DailyTask[];
  users: { name: string | null } | null;
};
type UserChallengeWithDetails = Tables<'user_challenges'> & {
  challenges: ChallengeWithDetails | null;
};

const fetchParticipantChallenge = async (userChallengeId: string): Promise<UserChallengeWithDetails | null> => {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenges (
        *,
        daily_tasks ( * ),
        users ( name )
      )
    `)
    .eq('id', userChallengeId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const ParticipantDashboard = () => {
  const { userChallengeId } = useParams<{ userChallengeId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCompleting, setIsCompleting] = useState(false);

  const { data: userChallenge, isLoading, isError } = useQuery({
    queryKey: ['participant_challenge', userChallengeId],
    queryFn: () => fetchParticipantChallenge(userChallengeId!),
    enabled: !!userChallengeId && !!user,
  });

  const currentTask = userChallenge?.challenges?.daily_tasks?.find(
    (task) => task.day_number === userChallenge.current_day
  );

  const handleCompleteTask = async () => {
    if (!userChallenge || !currentTask) return;
    setIsCompleting(true);
  
    // 1. Log the task completion
    const { error: progressError } = await supabase
      .from('user_challenge_progress')
      .insert({
        user_challenge_id: userChallenge.id,
        task_id: currentTask.id,
        day_number: userChallenge.current_day,
      });
  
    if (progressError) {
      toast({ title: "錯誤", description: progressError.message, variant: "destructive" });
      setIsCompleting(false);
      return;
    }
  
    // 2. Advance the day
    const nextDay = userChallenge.current_day + 1;
    const { error: updateError } = await supabase
      .from('user_challenges')
      .update({ current_day: nextDay })
      .eq('id', userChallenge.id);
  
    setIsCompleting(false);
  
    if (updateError) {
      toast({ title: "錯誤", description: updateError.message, variant: "destructive" });
    } else {
      toast({ title: `第 ${userChallenge.current_day} 天完成！`, description: "做得好，繼續前進！" });
      queryClient.invalidateQueries({ queryKey: ['participant_challenge', userChallengeId] });
    }
  };


  if (isLoading) return <div className="container mx-auto max-w-4xl py-12"><Skeleton className="h-64 w-full" /></div>;
  if (isError) return <div className="text-center py-20 text-red-500">無法載入挑戰資料。</div>;

  if (!userChallenge) return <div className="text-center py-20">找不到挑戰。</div>;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Link to="/my-challenges" className="text-sm text-primary hover:underline mb-4 block">&larr; 返回我的挑戰</Link>
      <h1 className="text-4xl font-bold text-foreground mb-2">{userChallenge.challenges?.name}</h1>
      <p className="text-lg text-muted-foreground mb-8">由 {userChallenge.challenges?.users?.name} 發起</p>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>第 {userChallenge.current_day} 天</span>
            <span className="text-base font-medium text-muted-foreground">{userChallenge.current_day} / {userChallenge.challenges?.duration_days}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentTask ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{currentTask.title}</h2>
              <div className="prose max-w-none mb-8 text-foreground/80">
                <p>{currentTask.description}</p>
              </div>
              <Button size="lg" className="w-full" onClick={handleCompleteTask} disabled={isCompleting}>
                {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                {isCompleting ? '處理中...' : '完成今日任務'}
              </Button>
            </div>
          ) : (
            <div className='text-center py-10'>
              <h2 className="text-2xl font-bold">恭喜！</h2>
              <p className="text-muted-foreground mt-2">您已完成所有挑戰任務！</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantDashboard;
