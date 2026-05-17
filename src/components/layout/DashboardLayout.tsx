import { Link, useLocation } from "react-router-dom"
import { Utensils, ShoppingCart, Settings, Leaf, 
         User, LogOut, Info, Phone } from "lucide-react"
import { BottomNav } from "./BottomNav"
import { TopBar } from "./TopBar"
import { cn } from "@/src/lib/utils"
import { storage } from "@/src/lib/storage"

const SIDEBAR_ITEMS = [
  { label: "برنامه غذایی", icon: Utensils, path: "/plan" },
  { label: "لیست خرید", icon: ShoppingCart, path: "/shoppingList" },
  { label: "تنظیمات", icon: Settings, path: "/settings" },
  { label: "درباره ما", icon: Info, path: "/about" },
  { label: "تماس با ما", icon: Phone, path: "/contact" },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const location = useLocation()
  const isSubscribed = storage.isSubscribed()

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      
      {/* MOBILE: simple passthrough */}
      <div className="md:hidden">
        <TopBar />
        <div className="pb-24 px-4">
          {children}
        </div>
        <BottomNav />
      </div>

      {/* DESKTOP: dashboard layout */}
      <div className="hidden md:flex min-h-screen">
        
        {/* Right Sidebar */}
        <aside className="w-72 bg-white border-l border-gray-100 fixed right-0 top-0 h-full flex flex-col z-50">
          
          {/* Logo */}
          <div className="px-6 py-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-primary-700">غذاتو</h1>
                <p className="text-xs text-gray-400">دستیار تغذیه هوشمند</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm",
                    isActive
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom: subscription status + logout */}
          <div className="px-4 py-6 border-t border-gray-100 space-y-3">
            <div className={cn(
              "px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2",
              isSubscribed 
                ? "bg-green-50 text-green-700" 
                : "bg-gray-100 text-gray-500"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                isSubscribed ? "bg-green-500" : "bg-gray-400"
              )} />
              {isSubscribed ? "اشتراک ویژه فعال" : "اشتراک رایگان"}
            </div>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/"
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl 
              text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
            >
              <LogOut className="w-5 h-5" />
              خروج از حساب
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 mr-72 min-h-screen">
          {/* Desktop Top Bar */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md 
            border-b border-gray-100 px-10 h-20 flex items-center justify-between">
            <h1 className="text-xl font-black text-gray-900">{title || "غذاتو"}</h1>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center 
                justify-center text-primary-600">
                <User className="w-5 h-5" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="px-10 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
