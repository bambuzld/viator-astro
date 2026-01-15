import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "preferred-language";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "Deutsche", flag: "🇩🇪" },
];

export function LanguageSelector() {
  const [open, setOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(
    languages[1]
  );

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const found = languages.find((lang) => lang.code === stored);
      if (found) {
        setSelectedLanguage(found);
      }
    }
  }, []);

  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem(STORAGE_KEY, language.code);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label={`Current language: ${selectedLanguage.name}. Click to change language.`}
        >
          <span className="text-base" aria-hidden="true">
            {selectedLanguage.flag}
          </span>
          <span className="hidden sm:inline">{selectedLanguage.code.toUpperCase()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelectLanguage(language)}
              className={cn(
                "flex items-center gap-4 w-full px-4 py-3 rounded-lg text-left transition-colors",
                "hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedLanguage.code === language.code &&
                  "bg-accent border border-primary"
              )}
              aria-pressed={selectedLanguage.code === language.code}
            >
              <span className="text-2xl" aria-hidden="true">
                {language.flag}
              </span>
              <span className="font-medium">{language.name}</span>
              {selectedLanguage.code === language.code && (
                <svg
                  className="ml-auto h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
