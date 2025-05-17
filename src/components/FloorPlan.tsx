
import React from 'react';
import { FloorPlanArea } from '@/types';

interface FloorPlanProps {
  areas: FloorPlanArea[];
  highlightAreaId?: string | null;
  className?: string;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ areas, highlightAreaId, className }) => {
  return (
    <div className={`relative border border-border rounded-md bg-background ${className}`}>
      {areas.map((area) => {
        // Determine if this area should be highlighted
        const isHighlighted = highlightAreaId === area.id;
        
        // Simplified styling based on area type and highlight state
        let areaStyle = '';
        if (isHighlighted) {
          // Highlighted state
          areaStyle = 'border-2 border-primary bg-primary/10';
        } else {
          // Normal state - simplified color scheme
          switch (area.type) {
            case 'exhibit':
              areaStyle = 'border border-blue-300 bg-blue-50';
              break;
            case 'entrance':
              areaStyle = 'border border-green-300 bg-green-50';
              break;
            case 'passage':
              areaStyle = 'border border-gray-200 bg-gray-50';
              break;
          }
        }

        return (
          <div
            key={area.id}
            className={`absolute rounded-md flex items-center justify-center ${areaStyle}`}
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
              width: `${area.width}%`,
              height: `${area.height}%`,
            }}
            title={area.name}
          >
            <span className={`text-center truncate px-1 text-xs font-medium ${isHighlighted ? 'text-primary' : 'text-gray-700'}`}>
              {area.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FloorPlan;
