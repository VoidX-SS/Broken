"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, User, Bot, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { suggestOutfit } from "@/ai/flows/suggest-outfit-from-wardrobe";
import { extractOutfitFromText } from "@/ai/flows/extract-outfit-from-text";
import type { WardrobeItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StylingAssistantProps {
  wardrobe: WardrobeItem[];
}

const formSchema = z.object({
  occasion: z.string().min(3, "Please describe the occasion."),
  weather: z.string().min(3, "Please describe the weather."),
  gender: z.enum(["male", "female"], { required_error: "Please select a gender."}),
  style: z.string().min(3, "Please describe the desired style."),
});

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string | React.ReactNode;
};

export function StylingAssistant({ wardrobe }: StylingAssistantProps) {
  const { language, translations } = useLanguage();
  const currentTranslations = translations.stylingAssistant;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: currentTranslations.initialMessage,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "initial",
        sender: "ai",
        text: currentTranslations.initialMessage,
      },
    ]);
  }, [currentTranslations.initialMessage]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { occasion: "", weather: "", style: "", gender: undefined },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (wardrobe.length === 0) {
      toast({
        variant: "destructive",
        title: translations.toast.emptyWardrobe.title,
        description: translations.toast.emptyWardrobe.description,
      });
      return;
    }

    const userMessageText = `
      ${currentTranslations.gender}: ${values.gender === 'male' ? currentTranslations.male : currentTranslations.female}, 
      ${currentTranslations.style}: ${values.style}, 
      ${currentTranslations.occasion}: ${values.occasion}, 
      ${currentTranslations.weather}: ${values.weather}
    `;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMessageText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
        const wardrobeForAI = wardrobe.map(item => ({
        id: item.id,
        description: item.description,
        category: item.category
      }));
      
      const suggestionResult = await suggestOutfit({
        wardrobe: wardrobeForAI,
        occasion: values.occasion,
        weather: values.weather,
        gender: values.gender,
        style: values.style,
        language: language === 'vi' ? 'Vietnamese' : 'English',
      });
      
      const extractedOutfit = await extractOutfitFromText({
        suggestionText: suggestionResult.suggestion,
        wardrobe: wardrobe,
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">{suggestionResult.suggestion}</p>
              <p className="text-sm text-muted-foreground">{suggestionResult.reasoning}</p>
            </div>
            {extractedOutfit.items.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold">{currentTranslations.suggestedItems}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {extractedOutfit.items.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-md border">
                       <Image
                          src={item.photoDataUri}
                          alt={item.description}
                          width={100}
                          height={100}
                          className="h-full w-full object-cover"
                        />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: translations.toast.genericError.title,
        description: translations.toast.suggestionError,
      });
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: translations.toast.suggestionError,
      }
      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
      form.reset({ occasion: "", weather: "", style: "", gender: values.gender });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex h-[75vh] flex-col">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle>{currentTranslations.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
                <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                        "flex items-start gap-3",
                        message.sender === "user" ? "justify-end" : ""
                        )}
                    >
                        {message.sender === "ai" && (
                        <Avatar className="h-8 w-8 border border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary">
                            <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        )}
                        <div
                          className={cn(
                              "max-w-md rounded-lg px-4 py-3 text-sm lg:max-w-lg",
                              message.sender === "ai"
                              ? "bg-muted"
                              : "bg-primary text-primary-foreground"
                          )}
                        >
                          {message.text}
                        </div>

                        {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                            <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            <Bot className="h-5 w-5" />
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center space-x-2 rounded-lg bg-muted px-4 py-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">
                            {currentTranslations.loading}...
                        </span>
                        </div>
                    </div>
                    )}
                </div>
                </ScrollArea>
            </CardContent>
        </Card>

        <div className="lg:col-span-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-full flex-col gap-4"
              >
                <div className="grid gap-4 flex-1">

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{currentTranslations.gender}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={currentTranslations.genderPlaceholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">{currentTranslations.male}</SelectItem>
                            <SelectItem value="female">{currentTranslations.female}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{currentTranslations.style}</FormLabel>
                        <FormControl>
                          <Input placeholder={currentTranslations.stylePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occasion"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{currentTranslations.occasion}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={currentTranslations.occasionPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weather"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{currentTranslations.weather}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={currentTranslations.weatherPlaceholder} {...field} className="flex-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {currentTranslations.button}
                </Button>
              </form>
            </Form>
        </div>
    </div>
  );
}
