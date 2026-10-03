export type PhotographyStyle = 'rustic' | 'bright' | 'social';
export type ImageResolution = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '4:3' | '16:9' | '3:4' | '9:16';
export type ImageModel = 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview';

export interface PhotoHistoryEntry {
  url: string;
  instruction: string;
  timestamp: number;
  modelUsed: string;
}

export interface GeneratedPhoto {
  url: string;
  modelUsed: string;
  imageSize: ImageResolution;
  aspectRatio: AspectRatio;
  style: PhotographyStyle;
  promptUsed: string;
  editHistory: PhotoHistoryEntry[];
}

export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  price: string;
  suggestedStyle: PhotographyStyle;
  photographyNotes?: string;
  generatedPhoto?: GeneratedPhoto;
  status: 'idle' | 'generating' | 'done' | 'error';
  error?: string;
}

export interface MenuData {
  restaurantName: string;
  cuisineType: string;
  dishes: Dish[];
}
