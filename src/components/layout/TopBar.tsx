import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { storage } from "@/src/lib/storage";

export const TopBar = () => {
  const location = useLocation();
  const profile = storage.getProfile();
  
  const pageTitles: Record<string, string> = {
    "/plan": "برنامه امروز",
    "/shoppingList": "لیست خرید هفته",
    "/settings": "تنظیمات",
  };
  
  const pageTitle = pageTitles[location.pathname] || "غذاتو";
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center p-1">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="text-[10px] text-primary-600 font-black uppercase tracking-widest">غذاتو</h2>
          <p className="text-lg font-black text-gray-900 tracking-tighter">{pageTitle}</p>
        </div>
      </div>
      
      <button className="w-10 h-10 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
};
