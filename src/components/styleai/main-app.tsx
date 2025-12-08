"use client";

import React, { useState } from "react";
import type { WardrobeItem } from "@/lib/types";
import { AppHeader } from "@/components/styleai/header";
import { StylingAssistant } from "@/components/styleai/styling-assistant";
import { WardrobeDisplay } from "@/components/styleai/wardrobe-display";

export function MainApp() {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  const handleAddItem = (item: WardrobeItem) => {
    setWardrobe((prev) => [...prev, item]);
  };

  const handleDeleteItem = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
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
