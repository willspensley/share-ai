
import { supabase } from '@/integrations/supabase/client';
import { ConditionRating } from '@/types';

export interface ProcessedImageResult {
  description: string;
  condition: {
    summary: string;
    points: string[];
    rating: ConditionRating;
  };
  cleanliness: string;
  rating?: string; // The original rating from Gemini
  notes?: string;
}

export const cleanlinessOptions = [
  { value: 'professional_clean', label: 'Professional Clean' },
  { value: 'professional_clean_with_omissions', label: 'Professional Clean with Omissions' },
  { value: 'domestic_clean_high_level', label: 'Domestic Clean to a High Level' },
  { value: 'domestic_clean', label: 'Domestic Clean' },
  { value: 'not_clean', label: 'Not Clean' }
];

export const conditionRatingOptions = [
  { value: 'excellent', label: 'Good Order', color: 'bg-green-500' },
  { value: 'good', label: 'Used Order', color: 'bg-blue-500' },
  { value: 'fair', label: 'Fair Order', color: 'bg-yellow-500' },
  { value: 'poor', label: 'Damaged', color: 'bg-red-500' }
];

/**
 * Convert condition rating to human-readable text
 * @param condition Condition rating from the enum
 * @returns Formatted text representation
 */
export const conditionRatingToText = (condition: string): string => {
  const option = conditionRatingOptions.find(opt => opt.value === condition);
  return option ? option.label : condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Processes an image using the Gemini API to analyze a component
 * @param imageUrls URL or array of URLs of the image(s) to analyze
 * @param roomType Type of room the component is in
 * @param componentName Name of the component being analyzed
 * @param multipleImages Flag indicating multiple images are being processed
 * @returns Processed image result with description, condition, cleanliness and other details
 */
export const processComponentImage = async (
  imageUrls: string | string[],
  roomType: string,
  componentName: string,
  multipleImages = false
): Promise<ProcessedImageResult> => {
  try {
    console.log(`Processing ${Array.isArray(imageUrls) ? imageUrls.length : 1} images for component: ${componentName}`);
    
    const response = await supabase.functions.invoke('process-room-image', {
      body: {
        imageUrls,
        componentName,
        roomType,
        inventoryMode: true, // Use the inventory clerk prompt format
        multipleImages
      },
    });

    if (response.error) {
      console.error('Error calling Gemini API:', response.error);
      throw new Error('Failed to analyze image');
    }

    return response.data as ProcessedImageResult;
  } catch (error) {
    console.error('Error in processComponentImage:', error);
    throw error;
  }
};
