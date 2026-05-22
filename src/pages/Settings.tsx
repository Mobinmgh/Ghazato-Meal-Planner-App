import { Card } from "@/src/components/ui/Card";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { storage } from "@/src/lib/storage";
import { auth } from "@/src/lib/auth";
import { User, Shield, CreditCard, LogOut, ChevronLeft, Info, Phone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const profile = storage.getProfile();
  const isSubscribed = storage.isSubscribed();

  const handleLogout = () => {
    auth.clearUser();
    navigate("/login");
  };

  return (
    <DashboardLayout title="تنظیمات">
      <div className="space-y-6">
        <h2 className="text-2xl font-black">تنظیمات</h2>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/onboarding")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">مشخصات من</h3>
                <p className="text-xs text-gray-400">سن، وزن و اهداف رژیم</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </Card>

          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">وضعیت اشتراک</h3>
                <p className={isSubscribed ? "text-xs text-green-600 font-bold" : "text-xs text-gray-400"}>
                  {isSubscribed ? "اشتراک ویژه فعال است" : "اشتراک رایگان"}
                </p>
              </div>
            </div>
            {!isSubscribed && (
              <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full font-bold">ارتقا</span>
            )}
          </Card>

          <Card className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/privacy")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">امنیت و حریم خصوصی</h3>
                <p className="text-xs text-gray-400">مدیریت داده‌ها</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </Card>

          <Link to="/about">
            <Card className="flex items-center justify-between p-4 md:hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center 
                  justify-center text-blue-600">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">درباره ما</h3>
                  <p className="text-xs text-gray-400">آشنایی با غذاتو</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </Card>
          </Link>

          <Link to="/contact">
            <Card className="flex items-center justify-between p-4 md:hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center 
                  justify-center text-pink-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">تماس با ما</h3>
                  <p className="text-xs text-gray-400">پشتیبانی و ارتباط</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </Card>
          </Link>
        </section>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 
          py-3.5 rounded-2xl border-2 border-red-100 text-red-500 
          text-sm font-bold hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          خروج از حساب
        </button>

        <p className="text-center text-[10px] text-gray-300">نسخه ۱.۰.۰ — غذاتو 🥗</p>
      </div>
    </DashboardLayout>
  );
}
