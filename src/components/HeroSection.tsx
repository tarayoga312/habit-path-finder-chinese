
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sprout, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-soft-beige via-off-white to-warm-tan/10 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-muted-olive rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-warm-tan rounded-full blur-xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-dark-slate-gray mb-6 leading-tight">
            開始您的
            <span className="text-muted-olive"> 30 日</span>
            <br />
            轉變之旅
          </h1>
          
          <p className="text-lg md:text-xl text-dark-slate-gray/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            加入數千名用戶，透過精心設計的挑戰培養持久的習慣。追蹤您的進步，見證真實的改變，成就更好的自己。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button className="btn-primary text-lg px-8 py-4">
              探索挑戰
            </Button>
            <Button className="btn-secondary text-lg px-8 py-4">
              瞭解更多
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4 transition-transform duration-300 hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-muted-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-muted-olive">30</span>
              </div>
              <h3 className="font-semibold text-dark-slate-gray mb-2">30 天承諾</h3>
              <p className="text-dark-slate-gray/60 text-sm">
                專注於一個月的持續實踐，建立lasting habits
              </p>
            </div>
            
            <div className="text-center p-4 transition-transform duration-300 hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-warm-tan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-warm-tan" />
              </div>
              <h3 className="font-semibold text-dark-slate-gray mb-2">追蹤進度</h3>
              <p className="text-dark-slate-gray/60 text-sm">
                詳細記錄您的變化，見證成長軌跡
              </p>
            </div>
            
            <div className="text-center p-4 transition-transform duration-300 hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-muted-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-muted-terracotta" />
              </div>
              <h3 className="font-semibold text-dark-slate-gray mb-2">持續成長</h3>
              <p className="text-dark-slate-gray/60 text-sm">
                每個挑戰都是自我提升的機會
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-dark-slate-gray/40" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

