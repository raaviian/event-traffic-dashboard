
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

// New interface for the visitor data from the table
export interface VisitorData {
  id: number;
  eventId: number;
  total: number;
  genderMale: number;
  child: number;
  genderFemale: number;
  adult: number;
  isDeleted: boolean;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
  // Additional field to link to spatial data
  areaId?: string;
  x?: number;
  y?: number;
}
