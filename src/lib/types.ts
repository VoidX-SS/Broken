import { translations } from '@/lib/translations';
import type { Language } from '@/context/language-context';

export type WardrobeCategory = 'Shirt' | 'T-shirt' | 'Top' | 'Sweater' | 'Jacket' | 'Coat' | 'Dress' | 'Skirt' | 'Pants' | 'Jeans' | 'Shorts' | 'Bottom' | 'Outerwear' | 'Sneakers' | 'Boots' | 'Sandals' | 'Heels' | 'Footwear' | 'Hat' | 'Bag' | 'Scarf' | 'Belt' | 'Accessory';

export const wardrobeCategories: WardrobeCategory[] = [
    'Shirt',
    'T-shirt',
    'Top',
    'Sweater',
    'Jacket',
    'Coat',
    'Dress',
    'Skirt',
    'Pants',
    'Jeans',
    'Shorts',
    'Bottom',
    'Outerwear',
    'Sneakers',
    'Boots',
    'Sandals',
    'Heels',
    'Footwear',
    'Hat',
    'Bag',
    'Scarf',
    'Belt',
    'Accessory'
];

export interface WardrobeItem {
  id: string;
  photoDataUri: string;
  description: string;
  category: WardrobeCategory;
}

export function getCategoryName(category: WardrobeCategory, lang: Language): string {
    return translations[lang].categories[category] || category;
}
