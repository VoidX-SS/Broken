
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
  onDeleteItem: (id: string) => void;
  isLoading: boolean;
}

export function WardrobeDisplay({
  wardrobe,
  onAddItem,
  onDeleteItem,
  isLoading,
}: WardrobeDisplayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { translations } = useLanguage();
  const currentTranslations = translations.wardrobeDisplay;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{currentTranslations.title}</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          {currentTranslations.button}
        </Button>
        <AddItemDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddItem={onAddItem}
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : wardrobe.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wardrobe.map((item) => (
            <WardrobeItemCard
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      ) : (
        <EmptyWardrobe onAddClick={() => setIsDialogOpen(true)} />
      )}
    </div>
  );
}
