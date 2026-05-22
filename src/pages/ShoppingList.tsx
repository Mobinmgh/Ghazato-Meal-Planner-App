import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateShoppingList } from "@/src/lib/gemini";
import { storage } from "@/src/lib/storage";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Check, ShoppingBasket, AlertTriangle, ClipboardList, RefreshCw } from "lucide-react";
import { convertToPersianNumbers, cn } from "@/src/lib/utils";

export default function ShoppingList() {
  const navigate = useNavigate();
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasPlan, setHasPlan] = useState(true);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const loadList = async () => {
    setLoading(true);
    setError("");

    try {
      const plan = storage.getPlan();
      if (!plan) {
        setHasPlan(false);
        setList(null);
        return;
      }

      setHasPlan(true);

      const cached = localStorage.getItem("shopping_list");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.categories?.length) {
          setList(parsed);
          return;
        }
      }

      const data = await generateShoppingList(plan);
      if (!data?.categories?.length) {
        throw new Error("Shopping list response is empty");
      }

      localStorage.setItem("shopping_list", JSON.stringify(data));
      setList(data);
    } catch (err) {
      console.warn("Shopping list load failed:", err);
      setList(null);
      setError("لیست خرید آماده نشد. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleRetry = () => {
    localStorage.removeItem("shopping_list");
    loadList();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center rtl">
        <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-black mb-2">در حال آماده‌سازی لیست خرید...</h2>
        <p className="text-gray-500">چند لحظه صبر کنید.</p>
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <DashboardLayout title="لیست خرید هفته">
        <div className="min-h-[60vh] flex items-center justify-center rtl">
          <Card className="max-w-md w-full text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900">هنوز برنامه غذایی نداری</h2>
              <p className="text-sm leading-6 text-gray-500">
                برای ساخت لیست خرید، اول باید برنامه غذایی هفته را بسازی.
              </p>
            </div>
            <Button onClick={() => navigate("/plan")} className="w-full">
              رفتن به برنامه غذایی
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !list) {
    return (
      <DashboardLayout title="لیست خرید هفته">
        <div className="min-h-[60vh] flex items-center justify-center rtl">
          <Card className="max-w-md w-full text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900">لیست خرید آماده نشد</h2>
              <p className="text-sm leading-6 text-gray-500">
                {error || "در ساخت لیست خرید مشکلی پیش آمد. دوباره تلاش کنید."}
              </p>
            </div>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4" />
              تلاش دوباره
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="لیست خرید هفته">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white">
            <ShoppingBasket className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black">لیست خرید هفته</h2>
            <p className="text-sm text-gray-500">همه چیزهایی که برای برنامه این هفته لازم داری</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.categories.map((cat: any) => (
            <div key={cat.name} className="space-y-4">
              <h3 className="text-lg font-bold text-primary-900 border-r-4 border-primary-600 pr-3">{cat.name}</h3>
              <Card className="space-y-0 p-0 overflow-hidden divide-y divide-gray-100">
                {cat.items.map((item: any, idx: number) => {
                  const itemKey = `${cat.name}-${idx}`;
                  const isChecked = checked.has(itemKey);
                  return (
                    <div
                      key={itemKey}
                      onClick={() => toggleItem(itemKey)}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isChecked ? "bg-primary-600 border-primary-600" : "border-gray-200"
                          )}
                        >
                          <Check className={cn("w-3.5 h-3.5 text-white transition-opacity", isChecked ? "opacity-100" : "opacity-0")} />
                        </div>
                        <span className={cn("font-bold transition-colors", isChecked ? "line-through text-gray-300" : "text-gray-900")}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 font-medium">{convertToPersianNumbers(item.quantity)}</span>
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
