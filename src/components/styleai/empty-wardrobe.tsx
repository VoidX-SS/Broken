"use client";

import { Shirt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

interface EmptyWardrobeProps {
  onAddClick: () => void;
}

export function EmptyWardrobe({ onAddClick }: EmptyWardrobeProps) {
  const { translations } = useLanguage();
  const currentTranslations = translations.emptyWardrobe;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Shirt className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        {currentTranslations.title}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {currentTranslations.description}
      </p>
      <Button onClick={onAddClick} className="mt-6">
        <Plus className="-ml-1 mr-2 h-4 w-4" />
        {currentTranslations.button}
      </Button>
    </div>
  );
}
