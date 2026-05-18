import { ToggleLeft, ToggleRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative size-10 rounded-xl border-none cursor-pointer"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      <ToggleLeft className="h-[1.2rem] w-[1.2rem] rotate-0 scale-130 transition-all dark:-rotate-90 dark:scale-0" />

      <ToggleRight className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-130" />
    </Button>
  );
}
