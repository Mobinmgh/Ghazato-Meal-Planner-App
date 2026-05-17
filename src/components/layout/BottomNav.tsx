import { Utensils, ShoppingCart, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";

export const BottomNav = () => {
  const location = useLocation();

  const NAV_ITEMS = [
    { label: "برنامه غذایی", icon: Utensils, path: "/plan" },
    { label: "لیست خرید", icon: ShoppingCart, path: "/shoppingList" },
    { label: "تنظیمات", icon: Settings, path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around h-20 px-4 pb-4 md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-0.5 transition-all duration-300"
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
              isActive ? "bg-primary-100" : ""
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary-600" : "text-gray-400"
              )} />
            </div>
            <span className={cn(
              "text-[10px] font-bold transition-colors",
              isActive ? "text-primary-600" : "text-gray-400"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
