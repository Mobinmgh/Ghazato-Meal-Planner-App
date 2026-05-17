import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateMealPlan } from "@/src/lib/gemini";
import { storage } from "@/src/lib/storage";
import { auth } from "@/src/lib/auth";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Modal } from "@/src/components/ui/Modal";
import { DAYS_OF_WEEK } from "@/src/lib/constants";
import { cn, convertToPersianNumbers } from "@/src/lib/utils";
import { RefreshCw, Zap, Coffee, Sun, Moon, Apple, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

export default function Plan() {
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [error, setError] = useState("");

  const loadPlan = async () => {
    try {
      const profile = storage.getProfile();
      if (!profile) return;

      const cached = storage.getPlan();
      if (cached) {
        setMealPlan(cached);
        setLoading(false);
        return;
      }

      const plan = await generateMealPlan(profile);
      storage.setPlan(plan);
      storage.incrementPlanCount();
      setMealPlan(plan);

      // Save to cloud
      const user = auth.getUser();
      if (user) {
        fetch("/api/plans/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            planData: plan,
            profileData: profile,
          }),
        }).catch(err => console.error("Cloud save error:", err));
      }
    } catch (err) {
      setError("خطا در ساخت برنامه. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleRegenerate = () => {
    if (storage.isSubscribed() || storage.getPlanCount() < 1) {
      setLoading(true);
      storage.clearPlan();
      loadPlan();
    } else {
      setIsPaywallOpen(true);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 129000,
          description: "اشتراک سه ماهه غذاتو",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "خطا در برقراری ارتباط با درگاه");
      }
    } catch (err: any) {
      setError(err.message || "خطا در فرآیند پرداخت");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center rtl">
        <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-black mb-2">در حال ساخت رژیم هوشمند شما...</h2>
        <p className="text-gray-500">این ممکنه حدود ۱۵ تا ۳۰ ثانیه طول بکشه. داریم بهترین غذاها رو برات انتخاب می‌کنیم! ⏳</p>
      </div>
    );
  }

  const currentDayData = mealPlan?.days[selectedDay];

  return (
    <DashboardLayout title="برنامه غذایی">
      <div className="space-y-6">
        {/* Calorie Summary Card */}
        <Card className="bg-primary-600 text-white overflow-hidden relative border-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 fill-white" />
              <span className="text-xs uppercase font-bold tracking-wider opacity-80">هدف کالری روزانه</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">{convertToPersianNumbers(mealPlan?.daily_calorie_target)}</span>
              <span className="text-sm font-medium opacity-80">کالری بر روز</span>
            </div>
            <p className="text-sm font-medium opacity-70">
              {mealPlan?.summary}
            </p>
          </div>
        </Card>

        {/* Day Selector */}
        <div className="flex overflow-x-auto gap-3 no-scrollbar py-2">
          {DAYS_OF_WEEK.map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={cn(
                "px-5 py-3 rounded-2xl whitespace-nowrap font-bold transition-all duration-200 shadow-sm",
                selectedDay === idx 
                  ? "bg-primary-600 text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-100"
              )}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center justify-between">
            وعده‌های {currentDayData?.day}
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              مجموع: {convertToPersianNumbers(currentDayData?.total_calories)} کالری
            </span>
          </h3>

          {[
            { key: "breakfast", label: "صبحانه", icon: Coffee, color: "text-amber-500 bg-amber-50" },
            { key: "lunch", label: "ناهار", icon: Sun, color: "text-orange-500 bg-orange-50" },
            { key: "dinner", label: "شام", icon: Moon, color: "text-indigo-500 bg-indigo-50" },
            { key: "snack", label: "میان‌وعده", icon: Apple, color: "text-rose-500 bg-rose-50" },
          ].map((mealType) => {
            const meal = currentDayData?.meals[mealType.key];
            return (
              <Card 
                key={mealType.key} 
                className="flex items-center gap-4 transition-transform active:scale-[0.98] cursor-pointer hover:bg-gray-50"
                onClick={() => navigate("/meal", { 
                  state: { 
                    meal: meal, 
                    label: mealType.label 
                  } 
                })}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", mealType.color)}>
                  <mealType.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-gray-400 text-xs">{mealType.label}</h4>
                    <span className="font-bold text-xs text-primary-600">{convertToPersianNumbers(meal?.calories)} ک</span>
                  </div>
                  <p className="font-bold text-base truncate text-gray-900">{meal?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{meal?.note}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-gray-300 shrink-0" />
              </Card>
            );
          })}
        </div>

        <button
          onClick={handleRegenerate}
          className="w-full flex items-center justify-center gap-2 
          py-3.5 rounded-2xl border-2 border-dashed border-gray-200 
          text-gray-400 text-sm font-bold hover:border-primary-300 
          hover:text-primary-600 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          تولید برنامه جدید
        </button>
      </div>

      {/* Paywall Modal */}
      <Modal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} title="یک هفته دیگر بساز">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-600">
            <Zap className="w-10 h-10 fill-primary-600" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-500">برای دریافت برنامه‌های نامحدود و لیست خرید هوشمند اشتراک بخرید.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center border-2 border-gray-100 hover:border-primary-500 cursor-pointer p-5 pb-5">
              <p className="text-xs font-bold text-gray-400 mb-1">یک ماهه</p>
              <p className="text-xl font-black">۸۹,۰۰۰</p>
              <p className="text-xs text-gray-400">تومان</p>
            </Card>
            <Card className="text-center border-2 border-primary-600 bg-primary-50 relative p-5 pb-5">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">پرطرفدار ⭐</span>
              <p className="text-xs font-bold text-primary-600 mb-1">سه ماهه</p>
              <p className="text-xl font-black text-primary-900">۱۲۹,۰۰۰</p>
              <p className="text-xs text-gray-400">تومان</p>
            </Card>
          </div>

          <Button className="w-full" size="lg" onClick={handleSubscribe}>شروع اشتراک ویژه</Button>
          <p className="text-[10px] text-center text-gray-400">پرداخت امن از طریق درگاه زرین‌پال</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
