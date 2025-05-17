
import React from 'react';
import { FloorPlanArea } from '@/types';

interface FloorPlanProps {
  areas: FloorPlanArea[];
  className?: string;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ areas, className }) => {
  return (
    <div className={`relative border border-border rounded-md bg-background ${className}`}>
      {areas.map((area) => (
        <div
          key={area.id}
          className={`absolute border ${
            area.type === 'exhibit' 
              ? 'border-heatmap-highlight bg-heatmap-highlight/10' 
              : area.type === 'entrance'
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-400 bg-gray-400/10'
          } rounded-md flex items-center justify-center text-xs font-medium`}
          style={{
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.width}%`,
            height: `${area.height}%`,
          }}
          title={area.name}
        >
          <span className="text-center truncate px-1">{area.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FloorPlan;
