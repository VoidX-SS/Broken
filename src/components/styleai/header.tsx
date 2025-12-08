import { Logo } from "@/components/icons/logo";

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo className="h-7 w-auto" />
          <h1 className="text-xl font-bold tracking-tight text-foreground/90">StyleAI</h1>
        </div>
      </div>
    </header>
  );
}
