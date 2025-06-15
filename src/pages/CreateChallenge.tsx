
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Loader2 } from "lucide-react";
import { Step1BasicInfo } from "@/components/challenge/Step1BasicInfo";
import { Step2DailyTasks } from "@/components/challenge/Step2DailyTasks";
import { Step3Metrics } from "@/components/challenge/Step3Metrics";
import { Step4Review } from "@/components/challenge/Step4Review";
import { format } from "date-fns";

const challengeTaskSchema = z.object({
  day_number: z.coerce.number().int().min(1, "Day number must be at least 1"),
  title: z.string().min(3, { message: "Title needs at least 3 characters" }),
  description: z.string().optional(),
  video_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  resource_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

const challengeMetricSchema = z.object({
  metric_name: z.string().min(2, { message: "Metric name needs at least 2 characters" }),
  metric_type: z.enum(['numeric', 'text', 'boolean'], { required_error: "Please select a metric type" }),
  description: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(5, { message: "Challenge name needs at least 5 characters" }),
  description: z.string().min(20, { message: "Challenge description needs at least 20 characters" }),
  duration_days: z.coerce.number().int().positive({ message: "Duration must be a positive number" }).min(1).default(30),
  image_url: z.string().url({ message: "Please enter a valid image URL" }).optional().or(z.literal('')),
  challenge_type: z.string().optional(),
  start_date: z.date().optional(),
  tasks: z.array(challengeTaskSchema).default([]),
  metrics: z.array(challengeMetricSchema).default([]),
});

const steps = [
  { id: 'Step 1', name: '基本資訊', fields: ['name', 'description', 'duration_days', 'image_url', 'challenge_type', 'start_date'] },
  { id: 'Step 2', name: '每日任務', fields: ['tasks'] },
  { id: 'Step 3', name: '追蹤指標', fields: ['metrics'] },
  { id: 'Step 4', name: '檢查並提交' }
]

const CreateChallenge = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user || profile?.role !== 'host') {
      toast({
        title: "權限不足",
        description: "只有挑戰發起者才能進入此頁面。",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, profile, authLoading, navigate, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_days: 30,
      image_url: "",
      challenge_type: "",
      tasks: [],
      metrics: [],
    },
    mode: "onTouched",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "錯誤", description: "您必須登入才能發起挑戰。", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.rpc('create_full_challenge', {
        p_name: values.name,
        p_description: values.description,
        p_duration_days: values.duration_days,
        p_image_url: values.image_url || null,
        p_challenge_type: values.challenge_type || null,
        p_start_date: values.start_date ? format(values.start_date, 'yyyy-MM-dd') : null,
        p_tasks: values.tasks,
        p_metrics: values.metrics,
      });

    setLoading(false);

    if (error) {
      toast({
        title: "建立挑戰失敗",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "挑戰已建立！",
        description: "您的挑戰已成功提交審核。",
      });
      navigate('/');
    }
  }
  
  const handleNext = async () => {
    const fields = steps[currentStep].fields as (keyof z.infer<typeof formSchema>)[];
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  }

  if (authLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>發起一個新的挑戰</CardTitle>
          <CardDescription>
            第 {currentStep + 1} 步 / {steps.length} 步: {steps[currentStep].name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 0 && <Step1BasicInfo />}
              {currentStep === 1 && <Step2DailyTasks />}
              {currentStep === 2 && <Step3Metrics />}
              {currentStep === 3 && <Step4Review />}

              <div className="flex justify-between pt-8">
                <div>
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={handlePrev}>
                      上一步
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < steps.length - 1 && (
                    <Button type="button" onClick={handleNext}>
                      下一步
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                     <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? '提交中...' : '提交挑戰以供審核'}
                      </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateChallenge;
