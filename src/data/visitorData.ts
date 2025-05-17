
import { VisitorData } from '@/types';

// Generate dummy data based on the provided table structure
export const dummyVisitorData: VisitorData[] = [
  {
    id: 1,
    eventId: 101,
    total: 1,
    genderMale: 1,
    child: 0,
    genderFemale: 0,
    adult: 0,
    isDeleted: true,
    createdDate: "2025-01-06 11:39:48.603",
    updatedDate: "2025-01-06 11:39:48.603",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit1",
    x: 22,
    y: 27
  },
  {
    id: 2,
    eventId: 101,
    total: 1,
    genderMale: 1,
    child: 0,
    genderFemale: 0,
    adult: 0,
    isDeleted: true,
    createdDate: "2025-01-06 11:40:38.617",
    updatedDate: "2025-01-06 11:40:38.617",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit2",
    x: 18,
    y: 55
  },
  {
    id: 3,
    eventId: 101,
    total: 1,
    genderMale: 1,
    child: 0,
    genderFemale: 0,
    adult: 0,
    isDeleted: true,
    createdDate: "2025-01-06 11:40:45.107",
    updatedDate: "2025-01-06 11:40:45.107",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit1",
    x: 25,
    y: 30
  },
  // Adding more dummy records with varied data
  {
    id: 4,
    eventId: 102,
    total: 2,
    genderMale: 1,
    child: 1,
    genderFemale: 1,
    adult: 1,
    isDeleted: false,
    createdDate: "2025-01-06 12:15:22.300",
    updatedDate: "2025-01-06 12:15:22.300",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit3",
    x: 45,
    y: 25
  },
  {
    id: 5,
    eventId: 102,
    total: 3,
    genderMale: 2,
    child: 1,
    genderFemale: 1,
    adult: 2,
    isDeleted: false,
    createdDate: "2025-01-06 12:30:10.450",
    updatedDate: "2025-01-06 12:30:10.450",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit4",
    x: 78,
    y: 27
  },
  {
    id: 6,
    eventId: 103,
    total: 4,
    genderMale: 2,
    child: 2,
    genderFemale: 2,
    adult: 2,
    isDeleted: false,
    createdDate: "2025-01-06 13:05:33.700",
    updatedDate: "2025-01-06 13:05:33.700",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit5",
    x: 50,
    y: 57
  },
  {
    id: 7,
    eventId: 103,
    total: 2,
    genderMale: 1,
    child: 0,
    genderFemale: 1,
    adult: 2,
    isDeleted: false,
    createdDate: "2025-01-06 13:20:15.120",
    updatedDate: "2025-01-06 13:20:15.120",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "exhibit6",
    x: 75,
    y: 60
  },
  {
    id: 8,
    eventId: 104,
    total: 5,
    genderMale: 3,
    child: 2,
    genderFemale: 2,
    adult: 3,
    isDeleted: false,
    createdDate: "2025-01-06 14:10:05.230",
    updatedDate: "2025-01-06 14:10:05.230",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "passage1",
    x: 50,
    y: 14
  },
  {
    id: 9,
    eventId: 104,
    total: 3,
    genderMale: 1,
    child: 1,
    genderFemale: 2,
    adult: 2,
    isDeleted: false,
    createdDate: "2025-01-06 14:25:45.350",
    updatedDate: "2025-01-06 14:25:45.350",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "passage2",
    x: 39,
    y: 45
  },
  {
    id: 10,
    eventId: 105,
    total: 6,
    genderMale: 3,
    child: 2,
    genderFemale: 3,
    adult: 4,
    isDeleted: false,
    createdDate: "2025-01-06 15:05:20.800",
    updatedDate: "2025-01-06 15:05:20.800",
    createdBy: "00000000-0000-0000-0000-000000000000",
    updatedBy: "00000000-0000-0000-0000-000000000000",
    areaId: "cafe",
    x: 50,
    y: 87
  },
];

// Function to convert visitor data to detection format for heatmap
export const convertVisitorDataToDetections = (data: VisitorData[]): Detection[] => {
  return data.map((visitor) => {
    // Convert createdDate string to timestamp
    const timestamp = new Date(visitor.createdDate).getTime();
    
    return {
      id: `detection-${visitor.id}`,
      x: visitor.x || Math.random() * 100, // Use provided x or random if not available
      y: visitor.y || Math.random() * 100, // Use provided y or random if not available
      timestamp,
      count: visitor.total
    };
  });
};
