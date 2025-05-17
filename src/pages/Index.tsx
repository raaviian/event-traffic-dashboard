
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateMockData } from "@/utils/heatmapUtils";
import { Detection, FloorPlanArea, TimeRange } from "@/types";
import HeatmapVisualizer from "@/components/HeatmapVisualizer";
import TimeSelector from "@/components/TimeSelector";
import VisitorStatistics from "@/components/VisitorStatistics";
import { dummyVisitorData } from "@/data/visitorData";

const Index = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: Date.now() - (60 * 60 * 1000), // 1 hour ago
    end: Date.now() // now
  });
  
  // Exhibition floor plan areas
  const exhibitionAreas: FloorPlanArea[] = [
    { id: "entrance", name: "Main Entrance", x: 45, y: 5, width: 10, height: 5, type: "entrance" },
    { id: "exhibit1", name: "Modern Art", x: 10, y: 15, width: 25, height: 25, type: "exhibit" },
    { id: "exhibit2", name: "Sculptures", x: 10, y: 45, width: 25, height: 30, type: "exhibit" },
    { id: "exhibit3", name: "Photography", x: 40, y: 15, width: 20, height: 20, type: "exhibit" },
    { id: "exhibit4", name: "Interactive", x: 65, y: 15, width: 25, height: 25, type: "exhibit" },
    { id: "exhibit5", name: "Digital Media", x: 40, y: 40, width: 20, height: 35, type: "exhibit" },
    { id: "exhibit6", name: "Contemporary", x: 65, y: 45, width: 25, height: 30, type: "exhibit" },
    { id: "passage1", name: "Main Hall", x: 40, y: 13, width: 20, height: 2, type: "passage" },
    { id: "passage2", name: "North Gallery", x: 38, y: 15, width: 2, height: 60, type: "passage" },
    { id: "passage3", name: "South Gallery", x: 60, y: 15, width: 2, height: 60, type: "passage" },
    { id: "cafe", name: "Café", x: 40, y: 80, width: 20, height: 15, type: "exhibit" }
  ];
  
  // Create a map of area IDs to area names
  const areaNameMap = exhibitionAreas.reduce<Record<string, string>>((acc, area) => {
    acc[area.id] = area.name;
    return acc;
  }, {});
  
  // Generate mock detection data on component mount
  useEffect(() => {
    const data = generateMockData(1000);
    setDetections(data);
  }, []);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Exhibition Traffic Heatmap</h1>
        <p className="text-muted-foreground">
          Visualize visitor movement patterns throughout your exhibition space.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Time Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSelector 
              timeRange={timeRange} 
              onTimeRangeChange={setTimeRange} 
            />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3 space-y-6">
          <HeatmapVisualizer 
            detections={detections} 
            areas={exhibitionAreas}
            timeRange={timeRange}
          />
            
          <Tabs defaultValue="analytics">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="visitorData">Visitor Data</TabsTrigger>
              <TabsTrigger value="setup">Setup Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-4">
              <VisitorStatistics data={dummyVisitorData} areaNameMap={areaNameMap} />
            </TabsContent>
            
            <TabsContent value="visitorData">
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">ID</th>
                          <th className="text-left font-medium p-2">Event</th>
                          <th className="text-left font-medium p-2">Total</th>
                          <th className="text-left font-medium p-2">Male</th>
                          <th className="text-left font-medium p-2">Female</th>
                          <th className="text-left font-medium p-2">Child</th>
                          <th className="text-left font-medium p-2">Adult</th>
                          <th className="text-left font-medium p-2">Created Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummyVisitorData.map((visitor) => (
                          <tr key={visitor.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">{visitor.id}</td>
                            <td className="p-2">{visitor.eventId}</td>
                            <td className="p-2">{visitor.total}</td>
                            <td className="p-2">{visitor.genderMale}</td>
                            <td className="p-2">{visitor.genderFemale}</td>
                            <td className="p-2">{visitor.child}</td>
                            <td className="p-2">{visitor.adult}</td>
                            <td className="p-2">{visitor.createdDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="setup">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold">How to Use This Tool</h3>
                  <p>This exhibition traffic heatmap tool visualizes visitor movement patterns using detection data.</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">To implement with real data:</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Install person detection cameras throughout your exhibition space</li>
                      <li>Configure each camera to log detection data with x/y coordinates</li>
                      <li>Replace the mock data generation with API calls to your detection system</li>
                      <li>Update the floor plan to match your exhibition layout</li>
                    </ol>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Currently using simulated data for demonstration purposes.
                    Integrate with your detection system for real-time analytics.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
