
import React from 'react';
import ChallengeCard from './ChallengeCard';
import { Button } from '@/components/ui/button';

interface ChallengeSectionProps {
  title: string;
  subtitle?: string;
  challenges: any[];
  showViewAll?: boolean;
}

const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  title,
  subtitle,
  challenges,
  showViewAll = true
}) => {
  return (
    <section className="py-16 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-dark-slate-gray/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {challenges.map((challenge, index) => (
            <div key={challenge.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <ChallengeCard {...challenge} />
            </div>
          ))}
        </div>
        
        {showViewAll && (
          <div className="text-center">
            <Button className="btn-secondary">
              查看所有挑戰
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengeSection;
