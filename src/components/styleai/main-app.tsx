"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import type { WardrobeItem } from "@/lib/types";
import { db } from "@/lib/firebase";
import { AppHeader } from "@/components/styleai/header";
import { StylingAssistant } from "@/components/styleai/styling-assistant";
import { WardrobeDisplay } from "@/components/styleai/wardrobe-display";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export function MainApp() {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const { toast } = useToast();
  const { translations } = useLanguage();

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "wardrobe"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WardrobeItem[];
        setWardrobe(items);
      } catch (error) {
        console.error("Error fetching wardrobe: ", error);
        toast({
          variant: 'destructive',
          title: translations.toast.genericError.title,
          description: "Could not fetch wardrobe from Firebase.",
        });
      }
    };

    fetchWardrobe();
  }, [toast, translations.toast.genericError.title]);

  const handleAddItem = async (item: Omit<WardrobeItem, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "wardrobe"), item);
      setWardrobe((prev) => [...prev, { ...item, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding item: ", error);
       toast({
        variant: 'destructive',
        title: translations.toast.genericError.title,
        description: "Could not save item to Firebase.",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "wardrobe", id));
      setWardrobe((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item: ", error);
      toast({
        variant: 'destructive',
        title: translations.toast.genericError.title,
        description: "Could not delete item from Firebase.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto grid flex-1 gap-12 p-4 md:grid-cols-3 md:p-8 lg:grid-cols-[1fr_2fr]">
          <aside className="md:col-span-1 lg:col-span-1">
            <div className="sticky top-24">
              <StylingAssistant wardrobe={wardrobe} />
            </div>
          </aside>
          <div className="md:col-span-2 lg:col-span-1">
            <WardrobeDisplay
              wardrobe={wardrobe}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
