
import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tables } from '@/integrations/supabase/types';

// Type definitions
type ChallengeMetric = Tables<'challenge_metrics'>;
type UserMetricDataWithMetric = Tables<'user_metric_data'> & {
    challenge_metrics: ChallengeMetric;
};

const fetchReportData = async (userChallengeId: string): Promise<UserMetricDataWithMetric[]> => {
    const { data, error } = await supabase
    .from('user_metric_data')
    .select(`
        data_type,
        value_text,
        value_number,
        challenge_metrics!inner(*)
    `)
    .eq('user_challenge_id', userChallengeId)
    .in('data_type', ['initial', 'final']);

    if (error) throw new Error(error.message);
    return data as UserMetricDataWithMetric[];
};

const buildSchema = (metrics: ChallengeMetric[]) => {
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

const ResultsReport = () => {
    const { userChallengeId } = useParams<{ userChallengeId: string }>();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: reportData, isLoading, isError, error } = useQuery({
        queryKey: ['results_report', userChallengeId],
        queryFn: () => fetchReportData(userChallengeId!),
        enabled: !!userChallengeId && !!user,
    });

    const finalMetrics = useMemo(() => {
        const metrics = reportData
            ?.map(d => d.challenge_metrics)
            .filter(metric => metric?.collection_frequency?.includes('final'))
            .filter((v, i, a) => a.findIndex(t => (t?.id === v?.id)) === i); // Unique
        return metrics || [];
    }, [reportData]);

    const formSchema = useMemo(() => buildSchema(finalMetrics), [finalMetrics]);
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!userChallengeId) return;
        setIsSubmitting(true);
        const payload = finalMetrics.map(metric => ({
            user_challenge_id: userChallengeId,
            metric_id: metric.id,
            data_type: 'final',
            value_text: metric.metric_type === 'text_area' ? values[metric.id] as string | null : null,
            value_number: (metric.metric_type === 'number_input' || metric.metric_type === 'slider_1_10') ? values[metric.id] as number | null : null,
        }));
        
        const { error } = await supabase.from('user_metric_data').upsert(payload, { onConflict: 'user_challenge_id,metric_id,data_type' });
        
        setIsSubmitting(false);
        if (error) {
            toast({ title: "儲存失敗", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "已儲存您的最終成果！" });
            queryClient.invalidateQueries({ queryKey: ['results_report', userChallengeId] });
        }
    }

    const initialData = useMemo(() => reportData?.filter(d => d.data_type === 'initial').reduce((acc, d) => ({ ...acc, [d.challenge_metrics.id]: d }), {} as Record<string, UserMetricDataWithMetric>) || {}, [reportData]);
    const finalData = useMemo(() => reportData?.filter(d => d.data_type === 'final').reduce((acc, d) => ({ ...acc, [d.challenge_metrics.id]: d }), {} as Record<string, UserMetricDataWithMetric>) || {}, [reportData]);

    const someFinalMetricNotEntered = useMemo(() => finalMetrics.some(metric => !finalData[metric.id]), [finalMetrics, finalData]);

    if (isLoading) return <div className="p-4"><Skeleton className="w-full h-screen" /></div>;
    if (isError) return <div className="text-center py-20 text-red-500">無法載入報告資料: {error.message}</div>;

    return (
        <div className="bg-muted/40 min-h-screen">
          <div className="container mx-auto max-w-4xl py-12">
              <Link to={`/my-challenges/${userChallengeId}`} className="text-sm text-primary hover:underline mb-4 block">&larr; 返回挑戰主頁</Link>
              <h1 className="text-4xl font-bold mb-2">我的成果報告</h1>
              <p className="text-lg text-muted-foreground mb-8">看看您在這段旅程中的驚人轉變！</p>
              
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {finalMetrics.map(metric => {
                          if (!metric) return null;
                          const beforeValue = initialData[metric.id]?.value_number ?? initialData[metric.id]?.value_text ?? 'N/A';
                          const afterData = finalData[metric.id];
                          const afterValue = afterData?.value_number ?? afterData?.value_text;
                          const change = (typeof beforeValue === 'number' && typeof afterValue === 'number') ? (afterValue - beforeValue) : null;

                          return (
                              <Card key={metric.id}>
                                  <CardHeader><CardTitle>{metric.metric_name}</CardTitle></CardHeader>
                                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                      <div>
                                          <h3 className="font-semibold mb-2 text-muted-foreground">挑戰前</h3>
                                          <p className="text-4xl font-bold">{beforeValue}</p>
                                      </div>
                                      <div>
                                          <h3 className="font-semibold mb-2 text-muted-foreground">挑戰後</h3>
                                          { afterData ? (
                                              <div>
                                                  <p className="text-4xl font-bold text-primary">{afterValue}</p>
                                                  {change !== null && (
                                                      <p className={`text-lg font-bold mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                          變化: {change >= 0 ? '+' : ''}{change % 1 === 0 ? change : change.toFixed(1)}
                                                      </p>
                                                  )}
                                              </div>
                                          ) : (
                                              <FormField
                                                  control={form.control}
                                                  name={metric.id}
                                                  render={({ field }) => (
                                                      <FormItem>
                                                          <FormLabel className="sr-only">{metric.metric_name}</FormLabel>
                                                          <FormControl>
                                                              <>
                                                                {metric.metric_type === 'number_input' && <Input type="number" placeholder={metric.description || ''} {...field} />}
                                                                {metric.metric_type === 'text_area' && <Textarea placeholder={metric.description || ''} {...field} value={field.value ?? ''} />}
                                                                {metric.metric_type === 'slider_1_10' && (
                                                                  <div className="flex items-center space-x-4">
                                                                    <Slider
                                                                      min={1} max={10} step={1}
                                                                      onValueChange={(value) => field.onChange(value[0])}
                                                                      defaultValue={[5]}
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
                                          )}
                                      </div>
                                  </CardContent>
                              </Card>
                          )
                      })}
                      {someFinalMetricNotEntered && (
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          儲存最終成果
                        </Button>
                      )}
                  </form>
              </Form>
          </div>
        </div>
    );
};

export default ResultsReport;
