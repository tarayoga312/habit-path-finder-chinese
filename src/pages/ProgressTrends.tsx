
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

type ProgressDataItem = Pick<Tables<'user_metric_data'>, 'recorded_at' | 'value_text' | 'value_number'> & {
  challenge_metrics: Pick<Tables<'challenge_metrics'>, 'id' | 'metric_name' | 'metric_type'> | null;
};

type MetricGroup = {
  name: string;
  type: Tables<'challenge_metrics'>['metric_type'];
  data: ProgressDataItem[];
};

const fetchProgressData = async (userChallengeId: string): Promise<ProgressDataItem[] | null> => {
  const { data, error } = await supabase
    .from('user_metric_data')
    .select(`
      recorded_at,
      value_text,
      value_number,
      challenge_metrics (
        id,
        metric_name,
        metric_type
      )
    `)
    .eq('user_challenge_id', userChallengeId)
    .order('recorded_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data as ProgressDataItem[] | null;
};

const ProgressTrends = () => {
  const { userChallengeId } = useParams<{ userChallengeId: string }>();
  const { user } = useAuth();

  const { data: progressData, isLoading, isError } = useQuery({
    queryKey: ['progress_trends', userChallengeId],
    queryFn: () => fetchProgressData(userChallengeId!),
    enabled: !!userChallengeId && !!user,
  });

  const groupedMetrics = progressData?.reduce((acc, item) => {
    const metric = item.challenge_metrics;
    if (!metric) return acc;

    if (!acc[metric.id]) {
      acc[metric.id] = {
        name: metric.metric_name,
        type: metric.metric_type,
        data: [],
      };
    }
    acc[metric.id].data.push(item);
    return acc;
  }, {} as Record<string, MetricGroup>);

  if (isLoading) return <div><Skeleton className="h-screen w-full" /></div>;
  if (isError) return <div className="text-center py-20 text-red-500">無法載入進度資料。</div>;

  return (
    <div className="container mx-auto max-w-6xl py-12">
      <Link to={`/my-challenges/${userChallengeId}`} className="text-sm text-primary hover:underline mb-4 block">&larr; 返回挑戰主頁</Link>
      <h1 className="text-4xl font-bold text-foreground mb-8">進度趨勢報告</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {groupedMetrics && Object.keys(groupedMetrics).length > 0 ? (
            Object.values(groupedMetrics).map((metric) => (
            <Card key={metric.name}>
                <CardHeader>
                <CardTitle>{metric.name}</CardTitle>
                </CardHeader>
                <CardContent>
                { (metric.type === 'number_input' || metric.type === 'slider_1_10') && (
                    <ChartContainer config={{}} className="h-[250px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={metric.data.map(d => ({...d, recorded_at: format(new Date(d.recorded_at), 'M/d')}))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="recorded_at" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="value_number" name={metric.name} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                )}
                { metric.type === 'text_area' && (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4">
                    {metric.data.map((d, index) => (
                        d.value_text && <div key={index} className="border-b pb-2">
                        <p className="text-sm text-muted-foreground">{format(new Date(d.recorded_at), 'yyyy-MM-dd')}</p>
                        <p className="text-foreground">{d.value_text}</p>
                        </div>
                    ))}
                    </div>
                )}
                </CardContent>
            </Card>
            ))
        ) : (
            <p className="text-muted-foreground col-span-full text-center py-10">還沒有任何進度資料可供顯示。</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTrends;
