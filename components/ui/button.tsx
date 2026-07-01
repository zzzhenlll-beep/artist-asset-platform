import { cn } from "@/lib/utils";

import type { ButtonHTMLAttributes, ReactNode } from "react";



interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

  variant?: "primary" | "secondary" | "ghost" | "accent";

  size?: "sm" | "md" | "lg";

  children: ReactNode;

}



export function Button({

  variant = "primary",

  size = "md",

  className,

  children,

  ...props

}: ButtonProps) {

  return (

    <button

      className={cn(

        "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition disabled:opacity-40",

        variant === "primary" && "border border-museum bg-museum text-white hover:bg-museum-light",

        variant === "secondary" &&

          "border border-border bg-paper-elevated text-ink hover:border-ink/30",

        variant === "ghost" && "text-muted hover:text-ink",

        variant === "accent" && "border border-museum bg-museum text-white hover:bg-museum-light",

        size === "sm" && "min-h-9 px-3 text-sm",

        size === "md" && "min-h-10 px-4 text-sm",

        size === "lg" && "min-h-11 px-5 text-sm",

        className,

      )}

      {...props}

    >

      {children}

    </button>

  );

}


