import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
}

export function NeonCard({ children, className, variant = "primary" }: NeonCardProps) {
  const borderColor = {
    primary: "border-primary/50 group-hover:border-primary",
    secondary: "border-secondary/50 group-hover:border-secondary",
    accent: "border-accent/50 group-hover:border-accent",
  };
  
  const shadowColor = {
    primary: "hover:shadow-[0_0_30px_rgba(235,0,255,0.3)]",
    secondary: "hover:shadow-[0_0_30px_rgba(0,255,128,0.3)]",
    accent: "hover:shadow-[0_0_30px_rgba(255,0,128,0.3)]",
  };

  return (
    <div 
      className={cn(
        "group relative bg-black/40 backdrop-blur-sm border-2 p-6 transition-all duration-300",
        borderColor[variant],
        shadowColor[variant],
        className
      )}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {children}
    </div>
  );
}
