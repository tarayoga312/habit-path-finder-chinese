import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Save, BarChartHorizontal, CalendarDays, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { addDays, parseISO } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

// Type definitions
type DailyTask = Tables<'daily_tasks'>;
type ChallengeMetric = Tables<'challenge_metrics'>;
type ChallengeWithDetails = Tables<'challenges'> & {
  daily_tasks: DailyTask[];
  challenge_metrics: ChallengeMetric[];
  users: { name: string | null } | null;
};
type UserChallengeWithDetails = Tables<'user_challenges'> & {
  challenges: ChallengeWithDetails;
};
type UserChallengeProgress = Tables<'user_challenge_progress'>;

type ParticipantChallengeData = {
  userChallenge: UserChallengeWithDetails | null;
  progress: UserChallengeProgress[];
};

const fetchParticipantChallengeData = async (userChallengeId: string): Promise<ParticipantChallengeData> => {
  const challengePromise = supabase
    .from('user_challenges')
    .select(`
      id,
      current_day,
      challenge_status,
      joined_at,
      challenges!inner (
        *,
        start_date,
        duration_days,
        daily_tasks ( * ),
        challenge_metrics ( * ),
        users ( name )
      )
    `)
    .eq('id', userChallengeId)
    .single();

  const progressPromise = supabase
    .from('user_challenge_progress')
    .select('*')
    .eq('user_challenge_id', userChallengeId);

  const [challengeResult, progressResult] = await Promise.all([challengePromise, progressPromise]);

  if (challengeResult.error) throw new Error(challengeResult.error.message);
  if (progressResult.error) throw new Error(progressResult.error.message);

  return {
    userChallenge: challengeResult.data as UserChallengeWithDetails | null,
    progress: progressResult.data || [],
  };
};

const buildSchema = (metrics?: ChallengeMetric[]) => {
    if (!metrics || metrics.length === 0) return z.object({});
    const schemaFields: Record<string, z.ZodType<any, any>> = {};
    metrics.forEach(metric => {
      switch (metric.metric_type) {
        case 'number_input':
        case 'slider_1_10':
          schemaFields[metric.id] = z.coerce.number({ invalid_type_error: "必須是數字" });
          break;
        case 'text_area':
          schemaFields[metric.id] = z.string().optional();
          break;
      }
    });
    return z.object(schemaFields);
};

const ParticipantDashboard = () => {
  const { userChallengeId } = useParams<{ userChallengeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['participant_challenge_data', userChallengeId],
    queryFn: () => fetchParticipantChallengeData(userChallengeId!),
    enabled: !!userChallengeId && !!user,
  });

  const { userChallenge, progress } = data || {};

  const dailyMetrics = useMemo(() => 
    userChallenge?.challenges?.challenge_metrics?.filter(m => m.collection_frequency?.includes('daily')) || [],
    [userChallenge]
  );
  
  const formSchema = useMemo(() => buildSchema(dailyMetrics), [dailyMetrics]);
  
  const form = useForm<Record<string, any>>({
    resolver: zodResolver(formSchema), defaultValues: {},
  });

  const currentTask = userChallenge?.challenges?.daily_tasks?.find(
    (task) => task.day_number === userChallenge.current_day
  );
  
  const challengeStartDate = userChallenge?.challenges?.start_date ? parseISO(userChallenge.challenges.start_date) : new Date();
  
  const completedDays = useMemo(() => 
    progress?.map(p => addDays(challengeStartDate, p.day_number - 1)) || [], 
    [progress, challengeStartDate]
  );

  async function onSaveMetrics(values: Record<string, any>) {
    if (!userChallenge) return;
    setIsSavingMetrics(true);

    const dataToInsert = dailyMetrics.map(metric => ({
      user_challenge_id: userChallenge.id,
      metric_id: metric.id,
      data_type: 'daily' as const,
      value_text: metric.metric_type === 'text_area' ? (values[metric.id] as string | null) : null,
      value_number: (metric.metric_type === 'number_input' || metric.metric_type === 'slider_1_10') ? (values[metric.id] as number | null) : null,
    }));

    const { error } = await supabase.from('user_metric_data').insert(dataToInsert);

    setIsSavingMetrics(false);

    if (error) {
      toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "成功儲存今日記錄！" });
      form.reset();
    }
  }

  const handleCompleteTask = async () => {
    if (!userChallenge) return;
    setIsCompleting(true);
  
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
  
    const isFinalDay = userChallenge.current_day === userChallenge.challenges?.duration_days;
    const nextDay = userChallenge.current_day + 1;
    const newStatus = isFinalDay ? 'completed' : 'active';
  
    const { error: updateError } = await supabase
      .from('user_challenges')
      .update({ current_day: nextDay, challenge_status: newStatus })
      .eq('id', userChallenge.id);
  
    setIsCompleting(false);
  
    if (updateError) {
      toast({ title: "錯誤", description: updateError.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ['participant_challenge_data', userChallengeId] });
      if (isFinalDay) {
        toast({ title: "挑戰完成！", description: "恭喜您！現在來看看您的成果吧。" });
        navigate(`/my-challenges/${userChallengeId}/report`);
      } else {
        toast({ title: `第 ${userChallenge.current_day} 天完成！`, description: "做得好，繼續前進！" });
      }
    }
  };

  if (isLoading) return <div><Skeleton className="h-screen w-full" /></div>;
  if (isError) return <div className="text-center py-20 text-red-500">無法載入挑戰資料。</div>;
  if (!userChallenge) return <div className="text-center py-20">找不到挑戰。</div>;

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto max-w-4xl py-12">
        <div className='flex justify-between items-center mb-4'>
            <Link to="/my-challenges" className="text-sm text-primary hover:underline">&larr; 返回我的挑戰</Link>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                  <Link to={`/my-challenges/${userChallengeId}/progress`}>
                      <BarChartHorizontal className="mr-2 h-4 w-4" />
                      進度趨勢
                  </Link>
              </Button>
              {userChallenge.challenge_status === 'completed' && (
                <Button asChild>
                  <Link to={`/my-challenges/${userChallengeId}/report`}>
                    <Trophy className="mr-2 h-4 w-4" />
                    查看成果報告
                  </Link>
                </Button>
              )}
            </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">{userChallenge.challenges?.name}</h1>
        <p className="text-lg text-muted-foreground mb-8">由 {userChallenge.challenges?.users?.name} 發起</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
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
                    {userChallenge.challenge_status === 'completed' && (
                      <Button asChild className="mt-4">
                        <Link to={`/my-challenges/${userChallengeId}/report`}>
                          <Trophy className="mr-2 h-4 w-4" />
                          查看您的最終成果報告
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {dailyMetrics.length > 0 && currentTask && (
              <Card>
                <CardHeader>
                  <CardTitle>今日記錄</CardTitle>
                  <CardDescription>記錄今天的感受與數據，追蹤您的變化。</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSaveMetrics)} className="space-y-8">
                      {dailyMetrics.map(metric => (
                        <FormField
                          key={metric.id}
                          control={form.control}
                          name={metric.id}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{metric.metric_name}</FormLabel>
                              <FormControl>
                                <>
                                  {metric.metric_type === 'number_input' && <Input type="number" placeholder={metric.description || ''} {...field} />}
                                  {metric.metric_type === 'text_area' && <Textarea placeholder={metric.description || ''} {...field} value={field.value ?? ''} />}
                                  {metric.metric_type === 'slider_1_10' && (
                                    <div className="flex items-center space-x-4">
                                      <Slider
                                        min={1} max={10} step={1}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        value={[field.value as number ?? 5]}
                                      />
                                      <span className="font-bold text-lg text-primary w-12 text-center">{field.value || '-'}</span>
                                    </div>
                                  )}
                                </>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button type="submit" disabled={isSavingMetrics}>
                        {isSavingMetrics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        儲存今日記錄
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  進度月曆
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  month={challengeStartDate}
                  modifiers={{ 
                    completed: completedDays,
                    today: new Date(),
                  }}
                  modifiersClassNames={{
                    completed: 'day-completed',
                    today: 'day-today-highlight'
                  }}
                  className="p-0"
                  disabled={(date) => date > new Date()}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
