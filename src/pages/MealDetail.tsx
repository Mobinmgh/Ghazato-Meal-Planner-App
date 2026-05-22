import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Card } from "@/src/components/ui/Card";
import {
  ChevronRight,
  Clock,
  Users,
  ChefHat,
  Flame,
  Zap,
  Wheat,
  Droplets,
} from "lucide-react";
import { convertToPersianNumbers, cn } from "@/src/lib/utils";

interface MealData {
  name: string;
  calories: number;
  note: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  ingredients: { name: string; amount: string; unit: string }[];
  steps: string[];
  nutrition: { protein: number; carbs: number; fat: number; fiber: number };
  tips: string;
}

export default function MealDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const meal = location.state?.meal as MealData;
  const mealLabel = location.state?.label as string;

  useEffect(() => {
    if (!meal) {
      navigate("/plan");
    }
  }, [meal, navigate]);

  if (!meal) return null;

  return (
    <DashboardLayout title={meal.name}>
      <div className="space-y-6 pb-12 rtl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-bold text-gray-500 mb-4 md:hidden"
        >
          <ChevronRight className="w-4 h-4" />
          بازگشت
        </button>

        <Card className="bg-primary-600 text-white rounded-2xl p-6 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {mealLabel}
            </span>
            <h1 className="text-2xl font-black mt-3">{meal.name}</h1>
            <p className="text-sm opacity-80 mt-1">{meal.note}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <div className="bg-white/15 rounded-xl px-3 py-2 text-center min-w-[70px]">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold leading-none">{meal.prep_time}</p>
                <p className="text-[10px] opacity-60">آماده‌سازی</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2 text-center min-w-[70px]">
                <Flame className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold leading-none">{meal.cook_time}</p>
                <p className="text-[10px] opacity-60">پخت</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2 text-center min-w-[70px]">
                <Users className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold leading-none">{convertToPersianNumbers(meal.servings)} نفر</p>
                <p className="text-[10px] opacity-60">تعداد</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2 text-center min-w-[70px]">
                <ChefHat className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs font-bold leading-none">{meal.difficulty}</p>
                <p className="text-[10px] opacity-60">دشواری</p>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="font-black text-base text-gray-900 mb-3">ارزش غذایی</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "پروتئین", value: meal.nutrition.protein, color: "text-blue-600", icon: Zap },
              { label: "کربوهیدرات", value: meal.nutrition.carbs, color: "text-orange-500", icon: Wheat },
              { label: "چربی", value: meal.nutrition.fat, color: "text-yellow-500", icon: Droplets },
              { label: "فیبر", value: meal.nutrition.fiber, color: "text-green-600", icon: Zap },
            ].map((nut) => (
              <div key={nut.label} className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                <nut.icon className={cn("w-5 h-5 mx-auto mb-1", nut.color)} />
                <p className={cn("text-lg font-black", nut.color)}>{convertToPersianNumbers(nut.value)}</p>
                <p className="text-[10px] text-gray-400">گرم</p>
                <p className="text-xs text-gray-500 mt-0.5">{nut.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <h3 className="font-black text-base text-gray-900 mb-3">مواد لازم</h3>
            <Card className="divide-y divide-gray-100 p-0 overflow-hidden">
              {meal.ingredients.map((ing, idx) => (
                <div key={idx} className="flex justify-between items-center gap-4 px-5 py-3">
                  <span className="font-bold text-sm text-gray-900">{ing.name}</span>
                  <span className="text-sm text-gray-400 shrink-0">
                    {convertToPersianNumbers(ing.amount)} {ing.unit}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          <div className="xl:col-span-2">
            <h3 className="font-black text-base text-gray-900 mb-3">طرز تهیه</h3>
            <Card className="p-5">
              <div className="space-y-4">
                {meal.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start py-3 border-b border-gray-100 last:border-none first:pt-0 last:pb-0">
                    <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {convertToPersianNumbers(idx + 1)}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {meal.tips && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-800">
              <span>💡</span>
              <h4 className="font-black text-sm">نکته آشپزی</h4>
            </div>
            <p className="text-sm text-amber-700 mt-2 leading-relaxed">
              {meal.tips}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
