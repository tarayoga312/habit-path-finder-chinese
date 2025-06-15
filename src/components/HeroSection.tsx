
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sprout, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-background py-24 sm:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-fade-in"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-fade-in animation-delay-300"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tighter">
            開始您的
            <span className="text-primary"> 30 日</span>
            <br />
            轉變之旅
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            加入數千名用戶，透過精心設計的挑戰培養持久的習慣。追蹤您的進步，見證真實的改變，成就更好的自己。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Button size="lg" className="text-lg px-8 py-6 font-semibold">
              探索挑戰
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-semibold">
              瞭解更多
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">30</span>
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">30 天承諾</h3>
              <p className="text-foreground/60 text-sm">
                專注於一個月的持續實踐，建立持久習慣
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">追蹤進度</h3>
              <p className="text-foreground/60 text-sm">
                詳細記錄您的變化，見證成長軌跡
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">持續成長</h3>
              <p className="text-foreground/60 text-sm">
                每個挑戰都是自我提升的機會
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-foreground/30" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
