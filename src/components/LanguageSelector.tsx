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
import {
  type LanguageCode,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getCurrentLanguage,
  setCurrentLanguage,
  getTranslations,
} from "@/lib/i18n";

export function LanguageSelector() {
  const [open, setOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = React.useState(getTranslations(DEFAULT_LANGUAGE));

  React.useEffect(() => {
    const lang = getCurrentLanguage();
    setSelectedLanguage(lang);
    setTranslations(getTranslations(lang));
  }, []);

  const handleSelectLanguage = (langCode: LanguageCode) => {
    setSelectedLanguage(langCode);
    setTranslations(getTranslations(langCode));
    setCurrentLanguage(langCode);
    setOpen(false);
    // Force page reload to update static content
    window.location.reload();
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label={`${translations.language.currentLanguage}: ${currentLangInfo?.nativeName}. ${translations.language.selectLanguage}.`}
        >
          <span className="text-base" aria-hidden="true">
            {currentLangInfo?.flag}
          </span>
          <span className="hidden sm:inline">{selectedLanguage.toUpperCase()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.language.selectLanguage}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelectLanguage(language.code)}
              className={cn(
                "flex items-center gap-4 w-full px-4 py-3 rounded-lg text-left transition-colors",
                "hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedLanguage === language.code &&
                  "bg-accent border border-primary"
              )}
              aria-pressed={selectedLanguage === language.code}
            >
              <span className="text-2xl" aria-hidden="true">
                {language.flag}
              </span>
              <span className="font-medium">{language.nativeName}</span>
              {selectedLanguage === language.code && (
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
