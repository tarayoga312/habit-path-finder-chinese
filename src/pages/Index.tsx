import React from 'react';
import HeroSection from '../components/HeroSection';
import ChallengeSection from '../components/ChallengeSection';
import Footer from '../components/Footer';

const Index = () => {
  // Sample challenge data
  const featuredChallenges = [
    {
      id: '1',
      name: '每日瑜伽練習',
      description: '透過30天的瑜伽練習，提升身體柔韌性，減輕壓力，培養內心平靜。適合所有程度的練習者。',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center',
      hostName: '林瑜伽老師',
      challengeType: '瑜伽',
      participantCount: 1247,
      daysRemaining: 3,
      featured: true
    },
    {
      id: '2',
      name: '正念冥想之旅',
      description: '學習正念冥想技巧，每天10分鐘的練習，改善專注力，減少焦慮，提升生活品質。',
      image: 'https://images.unsplash.com/photo-1506126613408-4e0e0978712e?w=400&h=300&fit=crop&crop=center',
      hostName: '陳正念導師',
      challengeType: '冥想',
      participantCount: 892,
      daysRemaining: 5,
      featured: true
    },
    {
      id: '3',
      name: '健康飲食改造',
      description: '重新審視您的飲食習慣，學習營養搭配，建立健康的用餐模式，改善整體健康狀況。',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop&crop=center',
      hostName: '王營養師',
      challengeType: '健康',
      participantCount: 634,
      daysRemaining: 1
    }
  ];

  const trendingChallenges = [
    {
      id: '4',
      name: '早起習慣養成',
      description: '改變作息，培養早起習慣。透過科學的方法逐步調整生理時鐘，享受清晨的寧靜時光。',
      image: 'https://images.unsplash.com/photo-1475598322381-f1b499717c77?w=400&h=300&fit=crop&crop=center',
      hostName: '張生活教練',
      challengeType: '生活',
      participantCount: 456,
      daysRemaining: 2
    },
    {
      id: '5',
      name: '創意寫作練習',
      description: '每天寫作練習，激發創造力，提升文字表達能力。從簡單的日記開始，逐步培養寫作習慣。',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&crop=center',
      hostName: '李作家',
      challengeType: '學習',
      participantCount: 321,
      daysRemaining: 7
    },
    {
      id: '6',
      name: '居家健身計劃',
      description: '無需器材的居家健身方案，每天30分鐘，提升體能，塑造身材，增強免疫力。',
      image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop&crop=center',
      hostName: '劉健身教練',
      challengeType: '健身',
      participantCount: 789,
      daysRemaining: 4
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        
        <ChallengeSection
          title="精選挑戰"
          subtitle="由我們的專家團隊精心挑選，最受歡迎且效果顯著的挑戰"
          challenges={featuredChallenges}
          showViewAll={false}
        />
        
        <ChallengeSection
          title="熱門挑戰"
          subtitle="最多用戶參與的挑戰，加入他們一起成長"
          challenges={trendingChallenges}
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
