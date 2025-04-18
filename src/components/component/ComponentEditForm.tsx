
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConditionRating } from "@/types";
import { conditionOptions } from "@/utils/roomComponentUtils";

interface ComponentEditFormProps {
  componentId: string;
  description: string;
  conditionSummary?: string;
  conditionPoints?: string[];
  condition: ConditionRating;
  cleanliness?: string;
  cleanlinessOptions?: { value: string, label: string }[];
  conditionRatingOptions?: { value: string, label: string }[];
  notes: string;
  onUpdateComponent: (componentId: string, field: string, value: string) => void;
  onToggleEditMode: (componentId: string) => void;
}

const ComponentEditForm = ({
  componentId,
  description,
  conditionSummary,
  conditionPoints = [],
  condition,
  cleanliness,
  cleanlinessOptions = [],
  conditionRatingOptions = [],
  notes,
  onUpdateComponent,
  onToggleEditMode
}: ComponentEditFormProps) => {
  return (
    <div className="space-y-4 pt-2">
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => onUpdateComponent(componentId, "description", e.target.value)}
          placeholder="Describe the current condition, appearance, etc."
          className="w-full"
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Condition Summary
        </label>
        <Textarea
          value={conditionSummary || ""}
          onChange={(e) => onUpdateComponent(componentId, "conditionSummary", e.target.value)}
          placeholder="Detailed assessment of the condition"
          className="w-full"
          rows={3}
        />
      </div>
      
      {conditionPoints && conditionPoints.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Condition Details
          </label>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {conditionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Condition Rating
        </label>
        {conditionRatingOptions && conditionRatingOptions.length > 0 ? (
          <Select
            value={condition}
            onValueChange={(value) => onUpdateComponent(componentId, "condition", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionRatingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={condition}
            onValueChange={(value) => onUpdateComponent(componentId, "condition", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className={`h-2 w-2 rounded-full ${option.color} mr-2`}></span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {cleanlinessOptions && cleanlinessOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Cleanliness
          </label>
          <Select
            value={cleanliness || "domestic_clean"}
            onValueChange={(value) => onUpdateComponent(componentId, "cleanliness", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cleanliness" />
            </SelectTrigger>
            <SelectContent>
              {cleanlinessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Additional Notes
        </label>
        <Textarea
          value={notes}
          onChange={(e) => onUpdateComponent(componentId, "notes", e.target.value)}
          placeholder="Add any additional notes or observations"
          className="w-full"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => onToggleEditMode(componentId)}
          className="bg-shareai-teal hover:bg-shareai-teal/90"
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default ComponentEditForm;
