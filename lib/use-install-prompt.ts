import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "./analytics";

interface InstallEvent {
  prompt: () => Promise<void>;
}

// Installation de l'application : Chrome, Android et ordinateur proposent un événement à déclencher,
// Safari (iOS) demande un geste manuel que l'on explique à la place.
export function useInstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [iosHint, setIosHint] = useState<boolean>(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as unknown as InstallEvent);
    };
    const onInstalled = () => {
      setEvent(null);
      trackEvent("evt/installation");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
    setIosHint(ios && !standalone);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(() => {
    event?.prompt();
    setEvent(null);
  }, [event]);

  return { canInstall: event !== null, install, iosHint };
}
