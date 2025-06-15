
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-foreground">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">30</span>
              </div>
              <h3 className="text-2xl font-bold">三十日挑戰</h3>
            </div>
            <p className="text-foreground/70 mb-4 max-w-md">
              通過30天的持續實踐，培養良好習慣，實現個人成長和轉變。加入我們的社群，開始您的改變之旅。
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">探索</h4>
            <ul className="space-y-2 text-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">熱門挑戰</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">精選挑戰</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">新手指南</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">成功故事</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">支援</h4>
            <ul className="space-y-2 text-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">常見問題</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">聯絡我們</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">隱私政策</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">使用條款</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-foreground/60">
          <p>&copy; 2025 三十日挑戰. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
