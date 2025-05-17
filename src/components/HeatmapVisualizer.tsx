
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Detection, FloorPlanArea, HeatmapConfig, HeatmapData, TimeRange } from '@/types';
import { calculateIntensity, filterByTimeRange, formatTimestamp, getIntensityColor, processHeatmapData } from '@/utils/heatmapUtils';
import FloorPlan from './FloorPlan';

interface HeatmapVisualizerProps {
  detections: Detection[];
  areas: FloorPlanArea[];
  timeRange: TimeRange;
  className?: string;
}

const HeatmapVisualizer: React.FC<HeatmapVisualizerProps> = ({
  detections,
  areas,
  timeRange,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [heatmapConfig, setHeatmapConfig] = useState<HeatmapConfig>({
    radius: 25,
    blur: 15,
    maxOpacity: 0.8,
    minOpacity: 0.1
  });
  const [showFloorPlan, setShowFloorPlan] = useState(true);
  const [peopleCounted, setPeopleCounted] = useState(0);
  const [hotspot, setHotspot] = useState<{x: number, y: number, count: number} | null>(null);

  // Process data whenever detections or time range changes
  useEffect(() => {
    const data = processHeatmapData(detections, timeRange);
    renderHeatmap(data);
    
    // Calculate total people detected within time range
    const filteredDetections = filterByTimeRange(detections, timeRange);
    const total = filteredDetections.reduce((sum, detection) => sum + detection.count, 0);
    setPeopleCounted(total);
    
    // Find hotspot (area with most people)
    if (filteredDetections.length > 0) {
      const hotspotDetection = filteredDetections.reduce(
        (max, detection) => max.count > detection.count ? max : detection
      );
      setHotspot({
        x: hotspotDetection.x,
        y: hotspotDetection.y,
        count: hotspotDetection.count
      });
    } else {
      setHotspot(null);
    }
  }, [detections, timeRange, heatmapConfig]);

  // Render the heatmap on canvas
  const renderHeatmap = (data: HeatmapData) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas size to match container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If no data or showing only floor plan, return
    if (data.points.length === 0) return;
    
    // Draw points with varying intensity
    const { radius, blur, maxOpacity, minOpacity } = heatmapConfig;
    
    // Draw base heatmap
    for (let x = 0; x < canvas.width; x += 5) {
      for (let y = 0; y < canvas.height; y += 5) {
        // Convert pixel coordinates to percentage
        const xPercent = (x / canvas.width) * 100;
        const yPercent = (y / canvas.height) * 100;
        
        // Calculate intensity at this point
        const intensity = calculateIntensity(xPercent, yPercent, data.points, radius);
        
        // Normalize intensity
        const normalizedIntensity = intensity / (data.maxIntensity * 1.5);
        
        if (normalizedIntensity > 0.05) {
          // Get color based on intensity
          const color = getIntensityColor(normalizedIntensity);
          
          // Draw point with color
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }
    
    // Apply blur
    ctx.filter = `blur(${blur}px)`;
    ctx.globalCompositeOperation = 'source-over';
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const data = processHeatmapData(detections, timeRange);
      renderHeatmap(data);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [detections, timeRange]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Visitor Traffic Heatmap</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-muted">
              {peopleCounted} visitors
            </Badge>
            <Badge variant="outline" className="bg-muted">
              {formatTimestamp(timeRange.start)} - {formatTimestamp(timeRange.end)}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={showFloorPlan ? "default" : "outline"}
            onClick={() => setShowFloorPlan(true)}
          >
            Show Floor Plan
          </Button>
          <Button
            size="sm"
            variant={!showFloorPlan ? "default" : "outline"}
            onClick={() => setShowFloorPlan(false)}
          >
            Hide Floor Plan
          </Button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 bg-gradient-to-r from-heatmap-low via-heatmap-medium to-heatmap-high rounded-sm" />
              <span className="text-xs text-muted-foreground">Low to High Traffic</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div 
          ref={containerRef} 
          className="relative w-full" 
          style={{ height: "500px" }}
        >
          {showFloorPlan && (
            <FloorPlan 
              areas={areas} 
              className="absolute inset-0 z-10 bg-opacity-95"
            />
          )}
          
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20"
          />
          
          {hotspot && (
            <div 
              className="absolute z-30 w-8 h-8 rounded-full bg-red-500 bg-opacity-50 animate-pulse-slow -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`
              }}
              title={`Hotspot: ${hotspot.count} visitors`}
            >
              {hotspot.count}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapVisualizer;
