
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReportsAPI } from "@/lib/api";
import { Report, Room, RoomType, RoomComponent } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export type RoomFormValues = {
  name: string;
  type: string;
};

/**
 * Hook for managing room operations within a report
 */
export const useRoomManagement = (
  report: Report | null,
  setReport: React.Dispatch<React.SetStateAction<Report | null>>
) => {
  const { toast } = useToast();
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  const createDefaultComponent = (name: string, type: string, isOptional: boolean): RoomComponent => {
    return {
      id: uuidv4(),
      name,
      type,
      description: "",
      condition: "fair",
      notes: "",
      images: [],
      isOptional,
    };
  };
  
  const handleAddRoom = async (values: RoomFormValues) => {
    if (!report) return;
    
    setIsSubmittingRoom(true);
    
    try {
      const newRoom = await ReportsAPI.addRoom(
        report.id,
        values.name,
        values.type as RoomType
      );
      
      if (newRoom) {
        let initialComponents: RoomComponent[] = [];
        
        if (values.type === "bathroom") {
          initialComponents = [
            createDefaultComponent("Walls", "walls", false),
            createDefaultComponent("Ceiling", "ceiling", false),
            createDefaultComponent("Flooring", "flooring", false),
            createDefaultComponent("Doors & Frames", "doors", false),
            createDefaultComponent("Bath/Shower", "bath", false),
            createDefaultComponent("Toilet", "toilet", false),
          ];
        } else if (values.type === "kitchen") {
          initialComponents = [
            createDefaultComponent("Walls", "walls", false),
            createDefaultComponent("Ceiling", "ceiling", false),
            createDefaultComponent("Flooring", "flooring", false),
            createDefaultComponent("Cabinetry & Countertops", "cabinetry", false),
            createDefaultComponent("Sink & Taps", "sink", false),
          ];
        } else {
          initialComponents = [
            createDefaultComponent("Walls", "walls", false),
            createDefaultComponent("Ceiling", "ceiling", false),
            createDefaultComponent("Flooring", "flooring", false),
            createDefaultComponent("Doors & Frames", "doors", false),
          ];
        }
        
        const updatedRoom = {
          ...newRoom,
          components: initialComponents,
        };
        
        await ReportsAPI.updateRoom(report.id, newRoom.id, updatedRoom);
        
        setReport(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            rooms: [...prev.rooms.filter(r => r.id !== newRoom.id), updatedRoom],
          };
        });
        
        toast({
          title: "Room Added",
          description: `${newRoom.name} has been added to the report with default components.`,
        });
      }
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRoom(false);
    }
  };
  
  const handleUpdateGeneralCondition = async (roomId: string, generalCondition: string) => {
    if (!report) return;
    
    const currentRoom = report.rooms.find(room => room.id === roomId);
    if (!currentRoom) return;
    
    try {
      const updatedRoom = {
        ...currentRoom,
        generalCondition,
      };
      
      const savedRoom = await ReportsAPI.updateRoom(report.id, roomId, updatedRoom);
      
      if (savedRoom) {
        setReport(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            rooms: prev.rooms.map(room => 
              room.id === savedRoom.id ? savedRoom : room
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error saving general condition:", error);
      toast({
        title: "Error",
        description: "Failed to save general condition. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateComponents = async (roomId: string, updatedComponents: RoomComponent[]) => {
    if (!report) return;
    
    const currentRoom = report.rooms.find(room => room.id === roomId);
    if (!currentRoom) return;
    
    try {
      const updatedRoom = {
        ...currentRoom,
        components: updatedComponents,
      };
      
      const savedRoom = await ReportsAPI.updateRoom(report.id, roomId, updatedRoom);
      
      if (savedRoom) {
        setReport(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            rooms: prev.rooms.map(room => 
              room.id === savedRoom.id ? savedRoom : room
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error updating components:", error);
      toast({
        title: "Error",
        description: "Failed to update components. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteRoom = async (roomId: string) => {
    if (!report) return;
    
    try {
      await ReportsAPI.deleteRoom(report.id, roomId);
      
      setReport(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rooms: prev.rooms.filter(room => room.id !== roomId),
        };
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  };
  
  const handleNavigateRoom = (index: number) => {
    if (!report) return;
    if (index >= 0 && index < (report?.rooms.length || 0)) {
      setActiveRoomIndex(index);
    }
  };

  return {
    isSubmittingRoom,
    activeRoomIndex,
    handleAddRoom,
    handleUpdateGeneralCondition,
    handleUpdateComponents,
    handleDeleteRoom,
    handleNavigateRoom,
  };
};
