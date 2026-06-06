import { trpc } from "@/providers/trpc";
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
        "Salut ! Je suis ton assistant IA pour Rosita Content Studio. Je peux t'aider avec tes prospects, ta stratégie de contenu, ou répondre à tes questions business. Comment puis-je t'aider aujourd'hui ?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMutation = trpc.chat.send.useMutation();

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
      const result = await sendMutation.mutateAsync({ message: userMsg });
      setMessages((prev) => [...prev, { role: "assistant", content: result.response }]);
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
    <div className="fixed right-4 bottom-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-[#E7E0EC] flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#6750A4] text-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
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
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EADDFF] flex items-center justify-center mt-1">
                <Sparkles className="h-3.5 w-3.5 text-[#6750A4]" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#6750A4] text-white rounded-br-sm"
                  : "bg-[#FEF7FF] text-[#1C1B1F] border border-[#E7E0EC] rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6750A4] flex items-center justify-center mt-1">
                <Diamond className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EADDFF] flex items-center justify-center mt-1">
              <Sparkles className="h-3.5 w-3.5 text-[#6750A4] animate-spin" />
            </div>
            <div className="bg-[#FEF7FF] border border-[#E7E0EC] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#6750A4] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#6750A4] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#6750A4] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#E7E0EC] bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pose ta question..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FEF7FF] border border-[#E7E0EC] text-sm text-[#1C1B1F] placeholder:text-[#49454F]/60 focus:outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/20 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              message.trim() && !isLoading
                ? "bg-[#6750A4] text-white hover:bg-[#4F378B] shadow-md"
                : "bg-[#E7E0EC] text-[#49454F] cursor-not-allowed"
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
