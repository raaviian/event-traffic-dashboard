
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FloorPlanArea } from '@/types';
import FloorPlan from './FloorPlan';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { generateUniqueId } from '@/utils/heatmapUtils';
import { Trash as TrashIcon, Edit as EditIcon, Plus as PlusIcon } from 'lucide-react';

interface FloorPlanManagerProps {
  areas: FloorPlanArea[];
  onAreasChange: (areas: FloorPlanArea[]) => void;
}

const FloorPlanManager: React.FC<FloorPlanManagerProps> = ({ areas, onAreasChange }) => {
  const [editArea, setEditArea] = useState<FloorPlanArea | null>(null);
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddArea = () => {
    const newArea: FloorPlanArea = {
      id: generateUniqueId(),
      name: `Area ${areas.length + 1}`,
      x: 40,
      y: 40,
      width: 20,
      height: 20,
      type: 'exhibit'
    };
    
    setEditArea(newArea);
    setCurrentEditIndex(-1); // -1 indicates a new area
    setIsEditing(true);
  };

  const handleEditArea = (area: FloorPlanArea, index: number) => {
    setEditArea({ ...area });
    setCurrentEditIndex(index);
    setIsEditing(true);
  };

  const handleDeleteArea = (index: number) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    onAreasChange(newAreas);
  };

  const handleSaveArea = () => {
    if (!editArea) return;
    
    const newAreas = [...areas];
    
    if (currentEditIndex === -1) {
      // Adding a new area
      newAreas.push(editArea);
    } else {
      // Updating existing area
      newAreas[currentEditIndex] = editArea;
    }
    
    onAreasChange(newAreas);
    setIsEditing(false);
    setEditArea(null);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditArea(null);
  };
  
  const handleFieldChange = (field: keyof FloorPlanArea, value: any) => {
    if (!editArea) return;
    
    setEditArea({
      ...editArea,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Floor Plan Management</h3>
        <Button 
          onClick={handleAddArea} 
          size="sm" 
          disabled={isEditing}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Area
        </Button>
      </div>
      
      {isEditing && editArea ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentEditIndex === -1 ? "Add New Area" : "Edit Area"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={editArea.name} 
                  onChange={(e) => handleFieldChange('name', e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={editArea.type} 
                  onValueChange={(value) => handleFieldChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exhibit">Exhibit</SelectItem>
                    <SelectItem value="passage">Passage</SelectItem>
                    <SelectItem value="entrance">Entrance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="x-position">X Position ({editArea.x}%)</Label>
              <Slider 
                id="x-position"
                min={0}
                max={100}
                step={1}
                value={[editArea.x]}
                onValueChange={(value) => handleFieldChange('x', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="y-position">Y Position ({editArea.y}%)</Label>
              <Slider 
                id="y-position"
                min={0}
                max={100}
                step={1}
                value={[editArea.y]}
                onValueChange={(value) => handleFieldChange('y', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width">Width ({editArea.width}%)</Label>
              <Slider 
                id="width"
                min={5}
                max={50}
                step={1}
                value={[editArea.width]}
                onValueChange={(value) => handleFieldChange('width', value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height ({editArea.height}%)</Label>
              <Slider 
                id="height"
                min={5}
                max={50}
                step={1}
                value={[editArea.height]}
                onValueChange={(value) => handleFieldChange('height', value[0])}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              <Button onClick={handleSaveArea}>Save</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <FloorPlan areas={areas} className="h-64" />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Areas</h4>
            <div className="border rounded-md divide-y">
              {areas.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No areas defined yet. Add an area to get started.</p>
              ) : (
                areas.map((area, index) => (
                  <div key={area.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{area.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {area.type} • Position: {area.x}%, {area.y}% • Size: {area.width}% × {area.height}%
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditArea(area, index)}
                        disabled={isEditing}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteArea(index)}
                        disabled={isEditing}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanManager;
