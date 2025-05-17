
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeRange } from '@/types';
import { formatTimestamp, generateTimeOptions } from '@/utils/heatmapUtils';

interface TimeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  className?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  timeRange, 
  onTimeRangeChange,
  className 
}) => {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  const dayAgo = now - (24 * 60 * 60 * 1000);
  
  const timeOptions = generateTimeOptions();
  
  const handleStartTimeChange = (value: string) => {
    onTimeRangeChange({
      start: parseInt(value),
      end: timeRange.end
    });
  };
  
  const handleEndTimeChange = (value: string) => {
    onTimeRangeChange({
      start: timeRange.start,
      end: parseInt(value)
    });
  };
  
  const handleQuickSelect = (start: number, end: number) => {
    onTimeRangeChange({ start, end });
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="time-range">Time Period</Label>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSelect(hourAgo, now)}
            className={timeRange.start === hourAgo ? "border-heatmap-highlight" : ""}
          >
            Last Hour
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSelect(now - (3 * 60 * 60 * 1000), now)}
            className={timeRange.start === now - (3 * 60 * 60 * 1000) ? "border-heatmap-highlight" : ""}
          >
            Last 3 Hours
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSelect(dayAgo, now)}
            className={timeRange.start === dayAgo ? "border-heatmap-highlight" : ""}
          >
            Last 24 Hours
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Select
            value={timeRange.start.toString()}
            onValueChange={handleStartTimeChange}
          >
            <SelectTrigger id="start-time" className="w-full">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {timeOptions.map(option => (
                  <SelectItem 
                    key={`start-${option.value}`} 
                    value={option.value.toString()}
                    disabled={option.value > timeRange.end}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Select
            value={timeRange.end.toString()}
            onValueChange={handleEndTimeChange}
          >
            <SelectTrigger id="end-time" className="w-full">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {timeOptions.map(option => (
                  <SelectItem 
                    key={`end-${option.value}`} 
                    value={option.value.toString()}
                    disabled={option.value < timeRange.start}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between mb-1 text-xs text-muted-foreground">
          <span>{formatTimestamp(timeRange.start)}</span>
          <span>{formatTimestamp(timeRange.end)}</span>
        </div>
        <Slider
          id="time-range"
          min={dayAgo}
          max={now}
          step={(now - dayAgo) / 100}
          value={[timeRange.start, timeRange.end]}
          onValueChange={(value) => onTimeRangeChange({
            start: value[0],
            end: value[1]
          })}
          className="my-4"
        />
      </div>
    </div>
  );
};

export default TimeSelector;
