
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(5, { message: "挑戰名稱至少需要 5 個字" }),
  description: z.string().min(20, { message: "挑戰描述至少需要 20 個字" }),
  duration_days: z.coerce.number().int().positive({ message: "持續天數必須是正整數" }).default(30),
});

const CreateChallenge = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait until authentication check is complete

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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "錯誤", description: "您必須登入才能發起挑戰。", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase
      .from("challenges")
      .insert([
        {
          host_id: user.id,
          name: values.name,
          description: values.description,
          duration_days: values.duration_days,
          status: 'pending_review',
        },
      ]);

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

  if (authLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>發起一個新的三十日挑戰</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>挑戰名稱</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：三十天學習 React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>挑戰描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="詳細描述您的挑戰內容、目標與規則..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>持續天數</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? '提交中...' : '提交挑戰以供審核'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateChallenge;
