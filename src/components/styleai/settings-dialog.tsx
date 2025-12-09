
"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage, type Language } from "@/context/language-context";
import { useApiKey } from "@/context/api-key-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { language, setLanguage, translations } = useLanguage();
  const { apiKey, setApiKey } = useApiKey();
  const [currentApiKey, setCurrentApiKey] = useState(apiKey || "");
  
  const settingsTranslations = translations.settings;

  useEffect(() => {
    if (open) {
      setCurrentApiKey(apiKey || "");
    }
  }, [open, apiKey]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };

  const handleSaveApiKey = () => {
    setApiKey(currentApiKey);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{settingsTranslations.title}</DialogTitle>
          <DialogDescription>
            {settingsTranslations.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>{settingsTranslations.language}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key-input">{settingsTranslations.apiKeyLabel}</Label>
            <Input 
              id="api-key-input"
              type="password"
              value={currentApiKey}
              onChange={(e) => setCurrentApiKey(e.target.value)}
              placeholder={settingsTranslations.apiKeyPlaceholder}
            />
            <p className="text-sm text-muted-foreground">
              {settingsTranslations.apiKeyDescription}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveApiKey}>{settingsTranslations.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
