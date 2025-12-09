
"use client";

import { Settings } from "lucide-react";
import { RealTimeClock } from "@/components/styleai/real-time-clock";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "./settings-dialog";
import { useState } from "react";

export function AppHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold tracking-tight text-primary">
            Gương Thông Minh
          </div>
        </div>
        <div className="flex items-center gap-4">
          <RealTimeClock />
          <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </div>
      </div>
    </header>
  );
}
