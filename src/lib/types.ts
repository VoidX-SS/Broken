export type WardrobeCategory = 'Top' | 'Bottom' | 'Outerwear' | 'Footwear' | 'Accessory' | 'Dress';

export const wardrobeCategories: WardrobeCategory[] = ['Top', 'Bottom', 'Outerwear', 'Footwear', 'Accessory', 'Dress'];

export interface WardrobeItem {
  id: string;
  photoDataUri: string;
  description: string;
  category: WardrobeCategory;
}
