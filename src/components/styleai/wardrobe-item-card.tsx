"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { Trash2, Pencil } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { WardrobeItem } from "@/lib/types";
import { getCategoryName } from "@/lib/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddItemDialog } from './add-item-dialog';

interface WardrobeItemCardProps {
  item: WardrobeItem;
  onUpdate: (id: string, item: Omit<WardrobeItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function WardrobeItemCard({ item, onUpdate, onDelete }: WardrobeItemCardProps) {
  const { language, translations } = useLanguage();
  const deleteDialogTranslations = translations.deleteDialog;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSave = (updatedItem: Omit<WardrobeItem, 'id'>) => {
    onUpdate(item.id, updatedItem);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
       <AddItemDialog
        mode="edit"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSave}
        initialData={item}
      />
      <div className="absolute right-2 top-2 z-10 flex scale-90 flex-col gap-2 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
        <Button
            variant="default"
            size="icon"
            className="h-7 w-7"
            aria-label={translations.addItemDialog.editTitle}
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="h-7 w-7"
              aria-label={deleteDialogTranslations.ariaLabel}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteDialogTranslations.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteDialogTranslations.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{deleteDialogTranslations.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item.id)}>
                {deleteDialogTranslations.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardContent className="p-0">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={item.photoDataUri}
            alt={item.description}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardContent>
      <div className="p-4">
        <Badge variant="secondary" className="mb-2">{getCategoryName(item.category, language)}</Badge>
        <p className="truncate text-sm font-medium">{item.description}</p>
      </div>
    </Card>
  );
}
