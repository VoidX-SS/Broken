'use client';

import React from 'react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, doc } from 'firebase/firestore';

import type { WardrobeItem } from '@/lib/types';
import { AppHeader } from '@/components/styleai/header';
import { StylingAssistant } from '@/components/styleai/styling-assistant';
import { WardrobeDisplay } from '@/components/styleai/wardrobe-display';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

export function MainApp() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { translations } = useLanguage();

  const wardrobeCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `wardrobe`);
  }, [firestore]);

  const {
    data: wardrobe,
    isLoading: isWardrobeLoading,
    error: wardrobeError,
  } = useCollection<WardrobeItem>(wardrobeCollectionQuery);

  if (wardrobeError) {
    // This will be caught by the FirebaseErrorListener and thrown
    // to the nearest error boundary, which is Next.js's default.
    // No need to render a UI here.
  }

  const handleAddItem = async (item: Omit<WardrobeItem, 'id' | 'userProfileId'>) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: translations.toast.genericError.title,
        description: 'Firestore not available.',
      });
      return;
    }
    const clothingCollectionRef = collection(firestore, `wardrobe`);
    
    addDocumentNonBlocking(clothingCollectionRef, item);
  };

  const handleDeleteItem = async (id: string) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: translations.toast.genericError.title,
        description: 'Firestore not available.',
      });
      return;
    }
    const itemDocRef = doc(firestore, `wardrobe`, id);
    deleteDocumentNonBlocking(itemDocRef);
  };
  
  const isLoading = isWardrobeLoading;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto grid flex-1 gap-12 p-4 md:grid-cols-3 md:p-8 lg:grid-cols-[1fr_2fr]">
          <aside className="md:col-span-1 lg:col-span-1">
            <div className="sticky top-24">
              <StylingAssistant wardrobe={wardrobe || []} />
            </div>
          </aside>
          <div className="md:col-span-2 lg:col-span-1">
            <WardrobeDisplay
              wardrobe={wardrobe || []}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
