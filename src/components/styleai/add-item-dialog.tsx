"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UploadCloud, Image as ImageIcon, Sparkles } from "lucide-react";
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
import type { WardrobeItem, WardrobeCategory } from "@/lib/types";
import { wardrobeCategories } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  photoDataUri: z.string().min(1, "Please upload an image."),
  description: z.string().min(3, "Please add a short description."),
  category: z.enum(wardrobeCategories, {
    required_error: "Please select a category.",
  }),
});

interface AddItemDialogProps {
  children: React.ReactNode;
  onAddItem: (item: WardrobeItem) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddItemDialog({ children, onAddItem, open, onOpenChange }: AddItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: "",
      description: "",
    },
  });

  const photoDataUri = form.watch("photoDataUri");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("photoDataUri", reader.result as string, { shouldValidate: true });
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error reading file",
          description: "Could not read the selected image. Please try another.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!photoDataUri) return;
    setIsGeneratingDescription(true);
    try {
      const result = await generateDescriptionForClothingItem({ photoDataUri });
      form.setValue("description", result.description, { shouldValidate: true });
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: "Could not generate a description for the image. Please write one manually.",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  useEffect(() => {
    if (photoDataUri) {
      handleGenerateDescription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoDataUri]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const newItem: WardrobeItem = {
      id: `item-${Date.now()}`,
      ...values,
    };
    onAddItem(newItem);
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) form.reset();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Wardrobe</DialogTitle>
          <DialogDescription>
            Upload a picture of your clothing item. The AI will generate a description for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photoDataUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
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
                          alt="Preview of uploaded item"
                          width={100}
                          height={100}
                          className="h-24 w-24 rounded-md object-cover"
                        />
                      ) : (
                        <>
                          <UploadCloud className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            PNG, JPG, WEBP up to 4MB
                          </p>
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wardrobeCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="e.g., Blue denim jacket" {...field} />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-primary"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDescription || !photoDataUri}
                        aria-label="Generate description"
                      >
                        {isGeneratingDescription ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    The AI will generate this automatically. You can edit it if needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isGeneratingDescription}
                className="w-full sm:w-auto"
              >
                {(isSubmitting || isGeneratingDescription) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
