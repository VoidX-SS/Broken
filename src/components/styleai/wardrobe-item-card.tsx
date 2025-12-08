"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
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

interface WardrobeItemCardProps {
  item: WardrobeItem;
  onDelete: (id: string) => void;
}

export function WardrobeItemCard({ item, onDelete }: WardrobeItemCardProps) {
  const { language, translations } = useLanguage();
  const currentTranslations = translations.deleteDialog;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 z-10 h-7 w-7 scale-90 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
            aria-label={currentTranslations.ariaLabel}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{currentTranslations.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {currentTranslations.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{currentTranslations.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(item.id)}>
              {currentTranslations.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
