import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function IdleTimer() {
  const { user, logout } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 30 minutes in milliseconds
  const IDLE_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    // Only activate if the user is logged in and has auto_logout enabled
    if (!user || user.auto_logout === false) {
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        toast.info("Déconnexion automatique", {
          description: "Vous avez été déconnecté suite à une inactivité prolongée.",
          duration: 5000,
        });
        logout();
      }, IDLE_TIMEOUT);
    };

    // Initialize timer
    resetTimer();

    // Events to track activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  return null; // This component doesn't render anything
}
