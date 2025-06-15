
import React from 'react';
import ChallengeCard from './ChallengeCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface ChallengeSectionProps {
  title: string;
  subtitle?: string;
  challenges: any[];
  showViewAll?: boolean;
  isLoading?: boolean;
}

const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  title,
  subtitle,
  challenges,
  showViewAll = true,
  isLoading = false,
}) => {
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-full overflow-hidden">
          <CardHeader className="p-0">
            <Skeleton className="h-48 w-full" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {isLoading ? renderSkeletons() : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {challenges.map((challenge, index) => (
              <div key={challenge.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ChallengeCard {...challenge} />
              </div>
            ))}
          </div>
        )}
        
        {showViewAll && !isLoading && challenges.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg" className="text-base font-semibold">
              查看所有挑戰
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengeSection;
