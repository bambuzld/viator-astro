import * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const STORAGE_KEY = "notification-dismissed";

export function FloatingNotification() {
  const [isDismissed, setIsDismissed] = React.useState(true);

  React.useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-label="Notification banner"
      className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm font-medium flex-1 text-center">
          Hey, this is floating notification! You can turn it on and off.
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="shrink-0 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
