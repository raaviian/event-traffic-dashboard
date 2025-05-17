
import { Detection, TimeRange, HeatmapData } from '@/types';

// Generate mock detection data
export const generateMockData = (count: number = 500): Detection[] => {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  
  return Array.from({ length: count }, (_, i) => ({
    id: `detection-${i}`,
    x: Math.random() * 100, // 0-100% of canvas width
    y: Math.random() * 100, // 0-100% of canvas height
    timestamp: hourAgo + (Math.random() * (now - hourAgo)), // Random time in the last hour
    count: 1 + Math.floor(Math.random() * 5) // 1-5 people detected
  }));
};

// Filter detections by time range
export const filterByTimeRange = (
  detections: Detection[], 
  timeRange: TimeRange
): Detection[] => {
  return detections.filter(
    d => d.timestamp >= timeRange.start && d.timestamp <= timeRange.end
  );
};

// Calculate intensity at given point based on nearby detections
export const calculateIntensity = (
  x: number, 
  y: number, 
  detections: Detection[], 
  radius: number
): number => {
  return detections.reduce((acc, detection) => {
    // Calculate distance between point and detection (as percentages)
    const dx = (detection.x - x) / 100;
    const dy = (detection.y - y) / 100;
    const distance = Math.sqrt(dx * dx + dy * dy) * 100;
    
    // If detection is within radius, add its intensity based on distance and count
    if (distance <= radius) {
      // Linear falloff based on distance
      const factor = 1 - (distance / radius);
      return acc + (factor * detection.count);
    }
    return acc;
  }, 0);
};

// Process data to create heatmap data structure
export const processHeatmapData = (
  detections: Detection[], 
  timeRange: TimeRange
): HeatmapData => {
  const filteredDetections = filterByTimeRange(detections, timeRange);
  
  // Find maximum intensity for normalization
  let maxIntensity = 0;
  filteredDetections.forEach(d => {
    if (d.count > maxIntensity) maxIntensity = d.count;
  });
  
  // Group nearby detections
  const groupedPoints: Detection[] = [];
  const gridSize = 5; // Size of grid cells for grouping
  const grid: Record<string, Detection> = {};
  
  filteredDetections.forEach(detection => {
    // Round to grid
    const gridX = Math.floor(detection.x / gridSize) * gridSize;
    const gridY = Math.floor(detection.y / gridSize) * gridSize;
    const key = `${gridX},${gridY}`;
    
    if (grid[key]) {
      grid[key].count += detection.count;
      if (detection.timestamp > grid[key].timestamp) {
        grid[key].timestamp = detection.timestamp;
      }
    } else {
      grid[key] = {
        ...detection,
        x: gridX + gridSize / 2,
        y: gridY + gridSize / 2
      };
    }
  });
  
  Object.values(grid).forEach(point => {
    groupedPoints.push(point);
    if (point.count > maxIntensity) maxIntensity = point.count;
  });
  
  return {
    points: groupedPoints,
    timeRange,
    maxIntensity
  };
};

// Format timestamp for display
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get color for intensity value (0-1)
export const getIntensityColor = (intensity: number): string => {
  // Blue (low) -> Orange (medium) -> Red (high)
  if (intensity < 0.33) {
    return `rgba(14, 165, 233, ${0.2 + intensity * 0.8})`; // Low - blue
  } else if (intensity < 0.66) {
    return `rgba(249, 115, 22, ${0.2 + intensity * 0.8})`; // Medium - orange
  } else {
    return `rgba(220, 38, 38, ${0.2 + intensity * 0.8})`; // High - red
  }
};

// Generate timestamps for last 24 hours at 15 min intervals
export const generateTimeOptions = (): { label: string; value: number }[] => {
  const now = new Date();
  now.setMinutes(Math.floor(now.getMinutes() / 15) * 15, 0, 0); // Round to nearest 15 min
  
  const options = [];
  for (let i = 0; i < 96; i++) { // 24 hours * 4 (15-min intervals)
    const time = new Date(now.getTime() - (i * 15 * 60 * 1000));
    options.push({
      label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: time.getTime()
    });
  }
  return options;
};
