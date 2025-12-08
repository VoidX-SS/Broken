"use client";

import { Settings, LogOut, User } from "lucide-react";
import { useLanguage, type Language } from "@/context/language-context";
import { Logo } from "@/components/icons/logo";
import { RealTimeClock } from "@/components/styleai/real-time-clock";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/firebase/auth/use-user";
import { useAuth, initiateAnonymousSignIn } from "@/firebase";
import { getAuth, signOut } from "firebase/auth";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function AppHeader() {
  const { language, setLanguage, translations } = useLanguage();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();


  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };
  
  const handleLogin = () => {
    initiateAnonymousSignIn(auth);
  };
  
  const handleLogout = () => {
    signOut(auth);
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo className="h-7 w-auto" />
          <h1 className="text-xl font-bold tracking-tight text-foreground/90">StyleAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <RealTimeClock />
           {isUserLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.isAnonymous ? "Anonymous User" : user.email || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.uid}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{translations.settings.language}</DropdownMenuLabel>
                   <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={handleLanguageChange}
                  >
                    <DropdownMenuRadioItem value="vi">Tiếng Việt</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           ) : (
            <Button onClick={handleLogin}>Sign In</Button>
           )}
        </div>
      </div>
    </header>
  );
}
