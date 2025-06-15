
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-slate-gray text-off-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-muted-olive rounded-lg flex items-center justify-center">
                <span className="text-off-white font-bold text-lg">30</span>
              </div>
              <h3 className="text-xl font-bold">三十日挑戰</h3>
            </div>
            <p className="text-off-white/70 mb-4 max-w-md">
              通過30天的持續實踐，培養良好習慣，實現個人成長和轉變。加入我們的社群，開始您的改變之旅。
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">探索</h4>
            <ul className="space-y-2 text-off-white/70">
              <li><a href="#" className="hover:text-warm-tan transition-colors">熱門挑戰</a></li>
              <li><a href="#" className="hover:text-warm-tan transition-colors">精選挑戰</a></li>
              <li><a href="#" className="hover:text-warm-tan transition-colors">新手指南</a></li>
              <li><a href="#" className="hover:text-warm-tan transition-colors">成功故事</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">支援</h4>
            <ul className="space-y-2 text-off-white/70">
              <li><a href="#" className="hover:text-warm-tan transition-colors">常見問題</a></li>
              <li><a href="#" className="hover:text-warm-tan transition-colors">聯絡我們</a></li>
              <li><a href="#" className="hover:text-warm-tan transition-colors">隱私政策</a></li>
              <li><a href="#" className="hover:text-warm-tan transition-colors">使用條款</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-off-white/20 mt-8 pt-8 text-center text-off-white/60">
          <p>&copy; 2024 三十日挑戰. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
