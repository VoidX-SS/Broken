"use client";

import { Shirt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyWardrobeProps {
  onAddClick: () => void;
}

export function EmptyWardrobe({ onAddClick }: EmptyWardrobeProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Shirt className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        Your wardrobe is empty
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Start by adding your clothing items to get personalized style
        suggestions.
      </p>
      <Button onClick={onAddClick} className="mt-6">
        <Plus className="-ml-1 mr-2 h-4 w-4" />
        Add Your First Item
      </Button>
    </div>
  );
}
