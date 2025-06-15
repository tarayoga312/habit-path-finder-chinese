
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, parseISO } from 'date-fns';
import HeroSection from '../components/HeroSection';
import ChallengeSection from '../components/ChallengeSection';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

// MODIFIED: The fetch function now accepts search and filter parameters
const fetchChallenges = async (searchTerm: string, challengeType: string) => {
  // MODIFIED: Pass parameters to the RPC function in alphabetical order
  // and cast to 'any' to resolve TypeScript error from stale type definitions.
  const { data, error } = await supabase.rpc('get_public_challenges', {
    p_challenge_type: challengeType,
    p_search_term: searchTerm,
  } as any);

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
  // ADDED: State for search and filter values
  const [searchTerm, setSearchTerm] = useState('');
  const [challengeType, setChallengeType] = useState('all');

  // MODIFIED: The query key now includes search and filter state to trigger refetching
  const { data: challenges, isLoading, isError } = useQuery({
    queryKey: ['public_challenges', searchTerm, challengeType],
    queryFn: () => fetchChallenges(searchTerm, challengeType),
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

  // ADDED: A list of unique challenge types for the filter dropdown
  const challengeTypes = ['all', ...Array.from(new Set(challenges?.map(c => c.challengeType).filter(Boolean) || []))];

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />

        {/* ADDED: Search and Filter UI */}
        <section className="py-12 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜尋挑戰名稱或發起人..."
                  className="pl-10 h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select value={challengeType} onValueChange={setChallengeType}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="篩選挑戰類型" />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? '所有類型' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        
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
