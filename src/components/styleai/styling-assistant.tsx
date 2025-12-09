"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, User, Bot, Loader2, Mic, StopCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { suggestOutfit } from "@/ai/flows/suggest-outfit-from-wardrobe";
import { extractOutfitFromText } from "@/ai/flows/extract-outfit-from-text";
import { generateSpeechFromText, type GenerateSpeechOutput } from "@/ai/flows/generate-speech-from-text";
import type { WardrobeItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { useApiKey } from "@/context/api-key-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
  audio?: GenerateSpeechOutput;
};

export function StylingAssistant({ wardrobe }: StylingAssistantProps) {
  const { language, translations } = useLanguage();
  const currentTranslations = translations.stylingAssistant;
  const { apiKey } = useApiKey();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: currentTranslations.initialMessage,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // This is where you would send the audio to a Speech-to-Text API
        // For this example, we'll use a placeholder.
        // In a real app, you would get the transcript and set it.
        // const transcript = await speechToTextAPI(audioBlob);
        // form.setValue("occasion", transcript);

        // For now, let's just log a message. This part requires a proper STT service.
         toast({
          title: "Ghi âm đã dừng",
          description: "Chức năng chuyển giọng nói thành văn bản đang được phát triển.",
        });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Lỗi Micro",
        description: "Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập.",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (wardrobe.length === 0) {
      toast({
        variant: "destructive",
        title: translations.toast.emptyWardrobe.title,
        description: translations.toast.emptyWardrobe.description,
      });
      return;
    }
     if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please set your Google AI API key in the settings.",
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
      const suggestionResult = await suggestOutfit({
        wardrobe,
        occasion: values.occasion,
        weather: values.weather,
        gender: values.gender,
        style: values.style,
        language: language === 'vi' ? 'Vietnamese' : 'English',
        apiKey: apiKey,
      });
      
      const [extractedOutfit, speechResult] = await Promise.all([
        extractOutfitFromText({
          suggestionText: suggestionResult.suggestion,
          wardrobe: wardrobe,
          apiKey: apiKey,
        }),
        generateSpeechFromText({
          text: suggestionResult.suggestion,
          apiKey: apiKey,
        }),
      ]);


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
        audio: speechResult
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
                          {message.audio && message.audio.audio && (
                            <audio controls autoPlay className="mt-4 w-full">
                              <source src={message.audio.audio} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          )}
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
                          <div className="relative">
                            <Textarea placeholder={currentTranslations.occasionPlaceholder} {...field} className="pr-10" />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                            >
                              {isRecording ? <StopCircle className="text-primary" /> : <Mic />}
                            </Button>
                          </div>
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
