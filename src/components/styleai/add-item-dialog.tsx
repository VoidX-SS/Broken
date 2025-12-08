
"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UploadCloud, Sparkles } from "lucide-react";
import Image from "next/image";

import { generateDescriptionForClothingItem } from "@/ai/flows/generate-description-from-photo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WardrobeItem } from "@/lib/types";
import { wardrobeCategories, getCategoryName } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  photoDataUri: z.string().min(1, "Please upload an image."),
  description: z.string().min(3, "Please add a short description."),
  category: z.enum(wardrobeCategories, {
    required_error: "Please select a category.",
  }),
});

interface AddItemDialogProps {
  onAddItem: (item: Omit<WardrobeItem, 'id'>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddItemDialog({ onAddItem, open, onOpenChange }: AddItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language, translations } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: "",
      description: "",
    },
  });

  const photoDataUri = form.watch("photoDataUri");

  const handleAnalyzePhoto = async (photo: string) => {
    if (!photo) return;
    setIsGenerating(true);
    try {
      const result = await generateDescriptionForClothingItem({ 
        photoDataUri: photo,
        language: language === 'vi' ? 'Vietnamese' : 'English',
        categories: [...wardrobeCategories],
      });
      form.setValue("description", result.description, { shouldValidate: true });
      form.setValue("category", result.category, { shouldValidate: true });
    } catch (error) {
      console.error("Failed to generate description/category:", error);
      toast({
        variant: "destructive",
        title: translations.toast.genericError.title,
        description: translations.toast.descriptionGenerationError,
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleRegenerate = () => {
      const currentPhoto = form.getValues("photoDataUri");
      if(currentPhoto) {
          handleAnalyzePhoto(currentPhoto);
      }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: translations.toast.fileTooLarge.title,
          description: translations.toast.fileTooLarge.description,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotoDataUri = reader.result as string;
        form.setValue("photoDataUri", newPhotoDataUri, { shouldValidate: true });
        handleAnalyzePhoto(newPhotoDataUri);
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: translations.toast.fileReadError.title,
          description: translations.toast.fileReadError.description,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    onAddItem(values);
    setIsSubmitting(false);
    form.reset();
    onOpenChange(false);
  };
  
  const currentTranslations = translations.addItemDialog;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) form.reset();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentTranslations.title}</DialogTitle>
          <DialogDescription>
            {currentTranslations.description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photoDataUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{currentTranslations.photoLabel}</FormLabel>
                  <FormControl>
                    <div
                      className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition hover:border-primary/80 hover:bg-muted/40"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      {photoDataUri ? (
                        <Image
                          src={photoDataUri}
                          alt={currentTranslations.photoAlt}
                          width={100}
                          height={100}
                          className="h-24 w-24 rounded-md object-cover"
                        />
                      ) : (
                        <>
                          <UploadCloud className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {currentTranslations.uploadHint}
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            {currentTranslations.uploadLimit}
                          </p>
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
                 <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute -right-2 -top-2 z-10 h-7 w-7 text-primary"
                    onClick={handleRegenerate}
                    disabled={isGenerating || !photoDataUri}
                    aria-label={currentTranslations.generateDescriptionAria}
                  >
                    {isGenerating ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                </Button>

                <div className="space-y-4 rounded-md border bg-muted/20 p-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{currentTranslations.categoryLabel}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isGenerating}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={currentTranslations.categoryPlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wardrobeCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {getCategoryName(cat, language)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{currentTranslations.descriptionLabel}</FormLabel>
                          <FormControl>
                              <Input placeholder={currentTranslations.descriptionPlaceholder} {...field} disabled={isGenerating} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormDescription className="mt-2 text-right">
                    {currentTranslations.descriptionHint}
                  </FormDescription>
            </div>


            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isGenerating}
                className="w-full sm:w-auto"
              >
                {(isSubmitting || isGenerating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {currentTranslations.submitButton}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
