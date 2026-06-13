import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Diamond,
  Wand2,
  Flame,
  Zap,
  X,
  Compass,
  Loader2,
} from "lucide-react";

interface AIChatProps {
  open: boolean;
  onClose: () => void;
}

export function AIChat({ open, onClose }: AIChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Salut ! Je suis ton assistant IA pour Rosyta Content Studio. Je peux t'aider avec tes prospects, ta stratégie de contenu, ou répondre à tes questions business. Comment puis-je t'aider aujourd'hui ?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock AI responses for frontend-only mode
  const mockResponses = [
    "C'est une excellente question ! Pour améliorer ton taux de conversion, concentre-toi sur la personnalisation de tes emails.",
    "Je te recommande d'analyser tes prospects les plus engagés en premier. Filtre par statut 'Chaud' pour commencer.",
    "Pour ta stratégie de contenu, vise 3 publications par semaine avec des visuels de qualité et des CTA clairs.",
    "Pense à segmenter ta liste de prospects par secteur d'activité pour des campagnes plus ciblées et efficaces.",
    "Le meilleur moment pour envoyer tes emails est entre 9h et 11h le mardi ou le jeudi selon les études.",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // Frontend-only mode: return a mock AI response
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Désolé, une erreur est survenue. Réessaie dans un instant !",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-4 bottom-4 w-96 h-[500px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Assistant IA</h3>
            <div className="flex items-center gap-1">
              {isLoading ? (
                <Flame className="h-3 w-3 text-amber-300 animate-pulse" />
              ) : (
                <Zap className="h-3 w-3 text-green-300" />
              )}
              <span className="text-[10px] text-white/80">
                {isLoading ? "Réflexion..." : "En ligne"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm shadow-sm"
                  : "bg-muted text-foreground border border-border rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center mt-1 shadow-sm">
                <Diamond className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-spin" />
            </div>
            <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pose ta question..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              message.trim() && !isLoading
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
