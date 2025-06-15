import React from 'react';
import { Users, Clock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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
  id,
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
    <Link to={`/challenge/${id}`} className="block group">
      <Card className={`w-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-primary ${featured ? 'ring-2 ring-secondary' : 'shadow-lg'}`}>
        <CardHeader className="p-0 relative">
          {featured && (
            <div className="absolute top-0 left-0 w-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold text-center z-10">
              精選挑戰
            </div>
          )}
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-foreground hover:bg-white">
              {challengeType}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
            {name}
          </h3>
          
          <p className="text-foreground/70 text-sm mb-4 line-clamp-3 h-[60px]">
            {description}
          </p>
          
          <div className="flex items-center text-xs text-foreground/60 space-x-1">
            <UserIcon className="h-4 w-4" />
            <span>由 {hostName} 發起</span>
          </div>
        </CardContent>
          
        <CardFooter className="flex-col items-start p-6 pt-0">
          <div className="w-full border-t border-border/70 my-4"></div>
          <div className="flex items-center justify-between w-full text-sm text-foreground/80 mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">{participantCount} 人參與</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{daysRemaining} 天後開始</span>
            </div>
          </div>
          
          <Button size="lg" className="w-full text-base font-semibold">
            查看詳情
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ChallengeCard;
