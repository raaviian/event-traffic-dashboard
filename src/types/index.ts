
export interface Detection {
  id: string;
  x: number;
  y: number;
  timestamp: number;
  count: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface FloorPlanArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'exhibit' | 'passage' | 'entrance';
}

export interface HeatmapData {
  points: Detection[];
  timeRange: TimeRange;
  maxIntensity: number;
}

export interface HeatmapConfig {
  radius: number;
  blur: number;
  maxOpacity: number;
  minOpacity: number;
}
