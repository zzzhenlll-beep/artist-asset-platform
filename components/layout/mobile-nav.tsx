"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { Compass, Home, PlusCircle, User } from "lucide-react";

import { cn } from "@/lib/utils";



const items = [
  { href: "/", label: "首页", icon: Home },
  { href: "/discover", label: "典藏", icon: Compass },
  { href: "/vision", label: "关于", icon: PlusCircle },
  { href: "/login", label: "登录", icon: User },
];



export function MobileNav() {

  const pathname = usePathname();



  return (

    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-paper-elevated/98 backdrop-blur-sm md:hidden safe-bottom">

      <div className="mx-auto flex h-14 max-w-lg items-center justify-around px-2">

        {items.map(({ href, label, icon: Icon }) => {

          const active =

            href === "/"

              ? pathname === "/"

              : pathname === href || pathname.startsWith(`${href}/`);

          return (

            <Link

              key={href}

              href={href}

              className={cn(

                "flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] tracking-wide transition-colors",

                active ? "text-ink" : "text-muted-light hover:text-muted",

              )}

            >

              <Icon className={cn("h-4 w-4", active && "stroke-[2px]")} />

              <span>{label}</span>

            </Link>

          );

        })}

      </div>

    </nav>

  );

}


