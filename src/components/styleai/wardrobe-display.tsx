
"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { WardrobeItem } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { WardrobeItemCard } from "@/components/styleai/wardrobe-item-card";
import { AddItemDialog } from "@/components/styleai/add-item-dialog";
import { EmptyWardrobe } from "./empty-wardrobe";
import { Skeleton } from "@/components/ui/skeleton";

interface WardrobeDisplayProps {
  wardrobe: WardrobeItem[];
  onAddItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onUpdateItem: (id: string, item: Omit<WardrobeItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  isLoading: boolean;
  highlightedItemIds?: string[];
}

export function WardrobeDisplay({
  wardrobe,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isLoading,
  highlightedItemIds = [],
}: WardrobeDisplayProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { translations } = useLanguage();
  const currentTranslations = translations.wardrobeDisplay;

  const sortedWardrobe = React.useMemo(() => {
    if (!highlightedItemIds || highlightedItemIds.length === 0) {
      return wardrobe;
    }
    return [...wardrobe].sort((a, b) => {
      const aIsHighlighted = highlightedItemIds.includes(a.id);
      const bIsHighlighted = highlightedItemIds.includes(b.id);
      if (aIsHighlighted && !bIsHighlighted) return -1;
      if (!aIsHighlighted && bIsHighlighted) return 1;
      return 0;
    });
  }, [wardrobe, highlightedItemIds]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{currentTranslations.title}</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          {currentTranslations.button}
        </Button>
        <AddItemDialog
          mode="add"
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={onAddItem}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : sortedWardrobe.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {sortedWardrobe.map((item) => (
            <WardrobeItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              isHighlighted={highlightedItemIds.includes(item.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyWardrobe onAddClick={() => setIsAddDialogOpen(true)} />
      )}
    </div>
  );
}
