"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, User, Bot, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { suggestOutfit } from "@/ai/flows/suggest-outfit-from-wardrobe";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StylingAssistantProps {
  wardrobe: WardrobeItem[];
}

const formSchema = z.object({
  occasion: z.string().min(3, "Please describe the occasion."),
  weather: z.string().min(3, "Please describe the weather."),
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
    defaultValues: { occasion: "", weather: "" },
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

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `${currentTranslations.occasion}: ${values.occasion}, ${currentTranslations.weather}: ${values.weather}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await suggestOutfit({
        wardrobe,
        occasion: values.occasion,
        weather: values.weather,
        language: language === 'vi' ? 'Vietnamese' : 'English',
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: (
          <div className="space-y-2">
            <p className="font-medium">{result.suggestion}</p>
            <p className="text-sm text-muted-foreground">{result.reasoning}</p>
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
      form.reset();
    }
  }

  return (
    <Card className="flex h-[75vh] flex-col">
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
                    "max-w-xs rounded-lg px-4 py-3 text-sm lg:max-w-md",
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 space-y-3 border-t pt-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={currentTranslations.occasionPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weather"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={currentTranslations.weatherPlaceholder} {...field} />
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
      </CardContent>
    </Card>
  );
}
