
import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChallengeCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  hostName: string;
  challengeType: string;
  participantCount: number;
  daysRemaining: number;
  featured?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  name,
  description,
  image,
  hostName,
  challengeType,
  participantCount,
  daysRemaining,
  featured = false
}) => {
  return (
    <div className={`challenge-card ${featured ? 'ring-2 ring-warm-tan' : ''}`}>
      {featured && (
        <div className="bg-warm-tan text-muted-olive px-3 py-1 text-xs font-medium text-center">
          精選挑戰
        </div>
      )}
      
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="tag">{challengeType}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-dark-slate-gray mb-2 line-clamp-2">
          {name}
        </h3>
        
        <p className="text-dark-slate-gray/70 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center text-xs text-dark-slate-gray/60 mb-4 space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>由 {hostName} 發起</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-dark-slate-gray/60 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{participantCount} 人參與</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{daysRemaining} 天後開始</span>
          </div>
        </div>
        
        <Button className="w-full btn-primary">
          加入挑戰
        </Button>
      </div>
    </div>
  );
};

// Fix the import issue by using a different icon name
const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default ChallengeCard;
