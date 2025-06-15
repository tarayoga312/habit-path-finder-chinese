
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from "@/hooks/use-toast";

type ChallengeDetails = Database['public']['Tables']['challenges']['Row'] & {
  users: { name: string; profile_picture_url: string | null } | null;
  daily_tasks: Array<Database['public']['Tables']['daily_tasks']['Row']>;
};

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          users ( name, profile_picture_url ),
          daily_tasks ( id, day_number, title )
        `)
        .eq('id', id)
        .order('day_number', { referencedTable: 'daily_tasks', ascending: true })
        .single();

      if (error) {
        console.error('Error fetching challenge details:', error);
      } else {
        setChallenge(data as ChallengeDetails);
      }
      setLoading(false);
    };

    fetchChallengeDetails();
  }, [id]);

  const handleJoinChallenge = async () => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您必須登入才能加入挑戰。",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!id) return;

    setIsJoining(true);
    const { error } = await supabase
      .from('user_challenges')
      .insert({
        user_id: user.id,
        challenge_id: id,
      });
    
    setIsJoining(false);

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({
          title: "您已加入此挑戰",
          description: "您可以在「我的挑戰」頁面中找到它。",
          variant: "default",
        });
        navigate('/my-challenges');
      } else {
        toast({
          title: "加入挑戰失敗",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "成功加入挑戰！",
        description: "開始您的轉變之旅吧！",
      });
      navigate('/my-challenges');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="w-full h-96 rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">找不到挑戰</h1>
        <p className="text-muted-foreground mt-2">這個挑戰可能已經不存在或網址錯誤。</p>
        <Button asChild className="mt-6">
          <a href="/">回到首頁</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <main className="container mx-auto max-w-5xl py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <span className="text-sm font-semibold text-primary uppercase">{challenge.challenge_type}</span>
              <h1 className="text-4xl font-bold text-foreground mt-2 mb-4">{challenge.name}</h1>
              <div className="flex items-center text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>由 {challenge.users?.name || '匿名發起人'} 發起</span>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{challenge.duration_days} 天挑戰</span>
                  </div>
              </div>
            </div>

            <img
              src={challenge.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&fit=crop&crop=center'}
              alt={challenge.name}
              className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg"
            />

            <div className="prose prose-lg max-w-none text-foreground">
              <h2 className="font-semibold text-2xl text-foreground">關於這個挑戰</h2>
              <p>{challenge.description}</p>

              <h2 className="font-semibold text-2xl mt-8 text-foreground">每日任務預覽</h2>
              <ul className="list-disc pl-5 space-y-2">
                {challenge.daily_tasks.length > 0 ? challenge.daily_tasks.map(task => (
                  <li key={task.id}>
                    <strong>第 {task.day_number} 天:</strong> {task.title}
                  </li>
                )) : (
                  <p className="text-muted-foreground">此挑戰尚未新增每日任務。</p>
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3">
             <div className="sticky top-24 bg-card p-6 rounded-xl shadow-md border">
                <h3 className="text-xl font-bold mb-4">準備好開始了嗎？</h3>
                <p className="text-muted-foreground mb-6">加入挑戰，開始為期 {challenge.duration_days} 天的轉變之旅。</p>
                <Button size="lg" className="w-full text-lg font-semibold" onClick={handleJoinChallenge} disabled={isJoining}>
                  {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isJoining ? '處理中...' : '加入挑戰'}
                </Button>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChallengeDetail;
