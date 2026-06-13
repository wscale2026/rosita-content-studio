import { ReactNode } from "react";
import { Link } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function AuthContainer({ children, title, subtitle }: { children: ReactNode, title: string, subtitle: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 p-3 rounded-xl bg-card border border-border shadow-sm hover:bg-muted transition-all z-10"
      >
        {theme === "light" ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
      </button>

      <div className="w-full max-w-md p-6 z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-border animate-slide-up bg-card">
          <div className="flex flex-col items-center mb-8">
            <Link to="/backoffice" className="flex items-center justify-center mb-6 group transition-transform hover:scale-105">
              <img src="/images/logo.jpeg" alt="Rosyta Logo" className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-center mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
