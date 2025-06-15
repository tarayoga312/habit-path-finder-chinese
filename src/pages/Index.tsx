
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, parseISO } from 'date-fns';
import HeroSection from '../components/HeroSection';
import ChallengeSection from '../components/ChallengeSection';
import Footer from '../components/Footer';

const fetchChallenges = async () => {
  const { data, error } = await supabase.rpc('get_public_challenges');

  if (error) {
    console.error('Error fetching challenges:', error);
    throw new Error('Could not fetch challenges');
  }

  if (!data) {
    return [];
  }

  // Transform data to match component props
  return data.map(challenge => {
    const participantCount = Number(challenge.participant_count);

    const daysRemaining = challenge.start_date
      ? differenceInDays(parseISO(challenge.start_date), new Date())
      : 0;

    return {
      id: challenge.id,
      name: challenge.name,
      description: challenge.description || 'No description available.',
      image: challenge.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center',
      hostName: challenge.host_name || 'Anonymous Host',
      challengeType: challenge.challenge_type || 'General',
      participantCount: isNaN(participantCount) ? 0 : participantCount,
      daysRemaining: Math.max(0, daysRemaining),
      featured: challenge.featured
    };
  });
};

const Index = () => {
  const { data: challenges, isLoading, isError } = useQuery({
    queryKey: ['public_challenges'],
    queryFn: fetchChallenges,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-red-500 text-lg">無法載入挑戰，請稍後再試。</p>
      </div>
    );
  }

  const featuredChallenges = challenges?.filter(c => c.featured) || [];
  const trendingChallenges = challenges?.filter(c => !c.featured) || [];

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        
        <ChallengeSection
          title="精選挑戰"
          subtitle="由我們的專家團隊精心挑選，最受歡迎且效果顯著的挑戰"
          challenges={featuredChallenges}
          showViewAll={false}
          isLoading={isLoading}
        />
        
        <ChallengeSection
          title="熱門挑戰"
          subtitle="最多用戶參與的挑戰，加入他們一起成長"
          challenges={trendingChallenges}
          isLoading={isLoading}
        />
        
        {/* Stats Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                加入成長社群
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="px-4">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">12,845</div>
                <p className="text-lg text-foreground/80">活躍用戶</p>
              </div>
              <div className="pt-8 md:pt-0 px-4">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">156</div>
                <p className="text-lg text-foreground/80">可選挑戰</p>
              </div>
              <div className="pt-8 md:pt-0 px-4">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">89%</div>
                <p className="text-lg text-foreground/80">完成率</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
