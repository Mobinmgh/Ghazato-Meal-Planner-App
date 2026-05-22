import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Card } from "@/src/components/ui/Card";
import { Instagram, Phone, ChevronLeft } from "lucide-react";

export default function Contact() {
  return (
    <DashboardLayout title="تماس با ما">
      <div className="space-y-6 pb-20">
        <header className="py-2">
          <h1 className="text-2xl font-black text-gray-900">تماس با ما</h1>
          <p className="text-sm text-gray-500 mt-1">هر سوال یا پیشنهادی داری، خوشحال می‌شیم بشنویم</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <a 
            href="https://instagram.com/ghazetoo_app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <Instagram className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-base">اینستاگرام</h3>
                <p className="text-sm text-gray-500">@ghazetoo_app</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300 shrink-0" />
            </Card>
          </a>

          <a href="tel:09120000000" className="block">
            <Card className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-base">تلفن پشتیبانی</h3>
                <p className="text-sm text-gray-500">۰۹۱۲-۰۰۰-۰۰۰۰</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300 shrink-0" />
            </Card>
          </a>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">⏰</span>
              <h4 className="font-black text-sm text-amber-800">ساعات پاسخگویی</h4>
            </div>
            <p className="text-xs text-amber-600 mt-1">شنبه تا چهارشنبه، ساعت ۹ صبح تا ۶ عصر</p>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
