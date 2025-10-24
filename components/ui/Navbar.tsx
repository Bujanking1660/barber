"use client";

import { Home, Scissors, Folders, Scroll } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const router = useRouter()

  const navItems = [
    { name: "Home", icon: Home, path:'/' },
    { name: "Gallery", icon: Folders, path:'/gallery' },
    { name: "Order", icon: Scroll, path:'/orders' },
    { name: "Model", icon: Scissors, path:'/models' },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-between px-6 py-4 gap-4 bg-surface shadow-[0_2px_15px_rgba(0,0,0,0.1)] rounded-3xl border border-border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;

          return (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                router.push(item.path);
              }}
              className="group flex flex-col items-center px-3 gap-0.5 transition-all duration-300 "
            >
              <Icon
                className={`transition-all duration-300 ${
                  isActive ? "text-primary scale-110" : "text-gray-400"
                }`}
                size={22}
              />
              <span
                className={`text-[10px] mt-1 font-medium transition-all duration-300 ${
                  isActive ? "text-primary translate-y-[-2px]" : "text-gray-400"
                }`}
              >
                {item.name}
              </span>
              <span
                className={`border-b rounded-full border-transparent transition-all duration-300 ${
                  isActive
                    ? "bg-primary h-[2.5px] w-[15px]"
                    : "bg-transparent h-[2.5px] w-[15px]"
                }`}
              ></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
