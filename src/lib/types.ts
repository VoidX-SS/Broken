import { translations } from '@/lib/translations';
import type { Language } from '@/context/language-context';

export type WardrobeCategory = 'Top' | 'Bottom' | 'Outerwear' | 'Footwear' | 'Accessory' | 'Dress';

export const wardrobeCategories: WardrobeCategory[] = ['Top', 'Bottom', 'Outerwear', 'Footwear', 'Accessory', 'Dress'];

export interface WardrobeItem {
  id: string;
  userProfileId: string;
  photoDataUri: string;
  description: string;
  category: WardrobeCategory;
}

export function getCategoryName(category: WardrobeCategory, lang: Language): string {
    return translations[lang].categories[category];
}
