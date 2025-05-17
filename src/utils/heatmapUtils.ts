import { Detection, TimeRange, HeatmapData, VisitorData } from '@/types';
import { dummyVisitorData, convertVisitorDataToDetections } from '@/data/visitorData';

// Generate mock detection data
export const generateMockData = (count: number = 500): Detection[] => {
  // Use our dummy visitor data when available, supplement with random data
  const visitorDetections = convertVisitorDataToDetections(dummyVisitorData);
  
  // If we need more data points than what's in our visitor data, generate random ones
  if (count > visitorDetections.length) {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    const additionalCount = count - visitorDetections.length;
    const randomDetections = Array.from({ length: additionalCount }, (_, i) => ({
      id: `detection-random-${i}`,
      x: Math.random() * 100, // 0-100% of canvas width
      y: Math.random() * 100, // 0-100% of canvas height
      timestamp: hourAgo + (Math.random() * (now - hourAgo)), // Random time in the last hour
      count: 1 + Math.floor(Math.random() * 5) // 1-5 people detected
    }));
    
    return [...visitorDetections, ...randomDetections];
  }
  
  return visitorDetections;
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

// New utility function to get visitor statistics
export const getVisitorStatistics = (data: VisitorData[]) => {
  const totalVisitors = data.reduce((sum, item) => sum + item.total, 0);
  const totalMales = data.reduce((sum, item) => sum + item.genderMale, 0);
  const totalFemales = data.reduce((sum, item) => sum + item.genderFemale, 0);
  const totalChildren = data.reduce((sum, item) => sum + item.child, 0);
  const totalAdults = data.reduce((sum, item) => sum + item.adult, 0);
  
  // Calculate area frequencies
  const areaFrequency: Record<string, number> = {};
  data.forEach(item => {
    if (item.areaId) {
      areaFrequency[item.areaId] = (areaFrequency[item.areaId] || 0) + item.total;
    }
  });
  
  // Find busiest area
  let busiestArea = { id: '', count: 0 };
  Object.entries(areaFrequency).forEach(([id, count]) => {
    if (count > busiestArea.count) {
      busiestArea = { id, count };
    }
  });
  
  return {
    totalVisitors,
    totalMales,
    totalFemales,
    totalChildren,
    totalAdults,
    busiestArea,
    percentageMale: totalMales / totalVisitors * 100,
    percentageFemale: totalFemales / totalVisitors * 100,
    percentageChildren: totalChildren / totalVisitors * 100,
    percentageAdults: totalAdults / totalVisitors * 100
  };
};
