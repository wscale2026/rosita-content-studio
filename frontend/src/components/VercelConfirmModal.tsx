import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

interface VercelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText: string;
  expectedWord: string;
  isDeleting?: boolean;
}

export function VercelConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  expectedWord,
  isDeleting = false,
}: VercelConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const isMatched = inputValue === expectedWord;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex gap-3 text-sm leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Action irréversible</p>
              {description}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Pour confirmer, veuillez taper <span className="font-bold select-all bg-muted px-1.5 py-0.5 rounded text-foreground">{expectedWord}</span> ci-dessous :
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition-colors text-sm"
              placeholder={expectedWord}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 bg-muted/30 border-t border-border">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (isMatched && !isDeleting) onConfirm();
            }}
            disabled={!isMatched || isDeleting}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center min-w-[120px] ${
              isMatched && !isDeleting
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
                : "bg-destructive/50 text-destructive-foreground/50 cursor-not-allowed"
            }`}
          >
            {isDeleting ? "Suppression..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
