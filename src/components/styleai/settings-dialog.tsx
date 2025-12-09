
"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage, type Language } from "@/context/language-context";
import { useApiKey } from '@/context/api-key-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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


  const handleSave = () => {
    setApiKey(currentApiKey);
    onOpenChange(false);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.settings.language}</DialogTitle>
          <DialogDescription>
            Manage your application settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            <Label htmlFor="api-key">{settingsTranslations.apiKey}</Label>
            <Input
              id="api-key"
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
          <Button onClick={handleSave}>{settingsTranslations.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
