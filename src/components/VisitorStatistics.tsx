
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisitorData } from '@/types';
import { getVisitorStatistics } from '@/utils/heatmapUtils';

interface VisitorStatisticsProps {
  data: VisitorData[];
  areaNameMap: Record<string, string>;
}

const VisitorStatistics: React.FC<VisitorStatisticsProps> = ({ data, areaNameMap }) => {
  const stats = getVisitorStatistics(data);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalVisitors}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.percentageMale.toFixed(1)}% male, {stats.percentageFemale.toFixed(1)}% female
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Busiest Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {areaNameMap[stats.busiestArea.id] || stats.busiestArea.id}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((stats.busiestArea.count / stats.totalVisitors) * 100).toFixed(1)}% of total traffic
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Visitor Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.percentageAdults.toFixed(1)}% Adults
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.percentageChildren.toFixed(1)}% Children ({stats.totalChildren} total)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorStatistics;
