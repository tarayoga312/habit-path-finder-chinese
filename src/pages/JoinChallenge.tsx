import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';

type ChallengeWithMetrics = Tables<'challenges'> & {
  challenge_metrics: Tables<'challenge_metrics'>[];
};

const fetchChallengeWithMetrics = async (id: string): Promise<ChallengeWithMetrics | null> => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*, challenge_metrics(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching challenge with metrics", error);
    throw new Error(error.message);
  }
  return data;
};

const JoinChallenge = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: challenge, isLoading, isError, error } = useQuery({
        queryKey: ['join-challenge-data', id],
        queryFn: () => fetchChallengeWithMetrics(id!),
        enabled: !!id && !!user,
    });

    const formSchema = React.useMemo(() => {
        if (!challenge?.challenge_metrics) return z.object({});
        
        const schema = challenge.challenge_metrics.reduce((acc, metric) => {
            let fieldSchema: z.ZodType<any, any>;

            switch (metric.metric_type) {
                case 'number_input':
                    fieldSchema = z.coerce.number({invalid_type_error: "請輸入一個數字"});
                    break;
                case 'slider_1_10':
                    fieldSchema = z.coerce.number().min(1).max(10);
                    break;
                case 'text_area':
                    fieldSchema = z.string().min(1, "此欄位為必填");
                    break;
                default:
                    fieldSchema = z.any();
            }
            acc[metric.id] = fieldSchema;
            return acc;
        }, {} as Record<string, z.ZodType<any, any>>);
        
        return z.object(schema);
    }, [challenge]);

    const defaultValues = React.useMemo(() => {
        if (!challenge?.challenge_metrics) return {};
        return challenge.challenge_metrics.reduce((acc, metric) => {
            switch (metric.metric_type) {
                case 'number_input':
                    acc[metric.id] = 0;
                    break;
                case 'slider_1_10':
                    acc[metric.id] = 5;
                    break;
                case 'text_area':
                    acc[metric.id] = '';
                    break;
            }
            return acc;
        }, {} as Record<string, any>);
    }, [challenge]);

    const form = useForm<Record<string, any>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    
    React.useEffect(() => {
        if (Object.keys(defaultValues).length > 0) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !challenge) return;
        setIsSubmitting(true);

        const initial_metrics = challenge.challenge_metrics.map(metric => {
            const value = values[metric.id];
            return {
                metric_id: metric.id,
                value_text: metric.metric_type === 'text_area' ? String(value) : null,
                value_number: (metric.metric_type === 'number_input' || metric.metric_type === 'slider_1_10') ? Number(value) : null,
            };
        });

        const { error: rpcError } = await supabase.rpc('join_challenge_with_initial_data', {
            p_challenge_id: challenge.id,
            p_user_id: user.id,
            p_initial_metrics: initial_metrics,
        });
        
        setIsSubmitting(false);

        if (rpcError) {
            if (rpcError.code === '23505') {
                toast({ title: "您已加入此挑戰", description: "看來您之前已經加入過。", variant: 'default' });
                navigate('/my-challenges');
            } else {
                toast({ title: "加入挑戰失敗", description: rpcError.message, variant: 'destructive' });
            }
        } else {
            toast({ title: "成功加入挑戰！", description: "您的初始數據已記錄。" });
            navigate('/my-challenges');
        }
    }

    if (!user) {
        if (!isLoading) {
            navigate('/auth');
            toast({ title: "請先登入", variant: "destructive" });
        }
        return null;
    }

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-2xl py-12">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (isError) {
        return <div className="text-center py-20 text-destructive">載入挑戰資料失敗: {error.message}</div>;
    }

    if (!challenge) {
        return <div className="text-center py-20">找不到挑戰資料。</div>
    }
    
    if (challenge.challenge_metrics.length === 0) {
        navigate(`/challenge/${id}`);
        return null;
    }

    return (
        <>
        <main className="container mx-auto max-w-2xl py-12 px-4">
            <Link to={`/challenge/${id}`} className="text-sm text-primary hover:underline mb-4 block">&larr; 返回挑戰詳情</Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">加入挑戰：{challenge.name}</h1>
            <p className="text-muted-foreground mb-8">在開始前，請先記錄您的初始數據。這將幫助您追蹤進度。</p>

            <Card>
                <CardHeader>
                    <CardTitle>初始數據記錄</CardTitle>
                    <CardDescription>誠實地記錄，這是您個人成長的起點。</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {challenge.challenge_metrics.map(metric => (
                                <FormField
                                    key={metric.id}
                                    control={form.control}
                                    name={metric.id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg">{metric.metric_name}</FormLabel>
                                            {metric.description && <FormDescription>{metric.description}</FormDescription>}
                                            <FormControl>
                                                <>
                                                    {metric.metric_type === 'number_input' && <Input type="number" {...field} value={field.value ?? ''} onChange={field.onChange} />}
                                                    {metric.metric_type === 'text_area' && <Textarea {...field} value={field.value ?? ''} />}
                                                    {metric.metric_type === 'slider_1_10' && (
                                                        <div className="pt-2">
                                                            <Slider
                                                                min={1} max={10} step={1}
                                                                value={[field.value]}
                                                                onValueChange={(value) => field.onChange(value[0])}
                                                                className="w-[95%] mx-auto"
                                                            />
                                                            <p className="text-center text-xl font-bold mt-2">{field.value}</p>
                                                        </div>
                                                    )}
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                             <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                完成並加入挑戰
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
        <Footer />
        </>
    );
};

export default JoinChallenge;
