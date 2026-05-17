import { useState, useEffect } from "react";
import { generateShoppingList } from "@/src/lib/gemini";
import { storage } from "@/src/lib/storage";
import { Card } from "@/src/components/ui/Card";
import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Check, ShoppingBasket } from "lucide-react";
import { convertToPersianNumbers, cn } from "@/src/lib/utils";

export default function ShoppingList() {
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const loadList = async () => {
    try {
      const plan = storage.getPlan();
      if (!plan) return;

      const cached = localStorage.getItem('shopping_list');
      if (cached) {
        setList(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const data = await generateShoppingList(plan);
      localStorage.setItem('shopping_list', JSON.stringify(data));
      setList(data);
    } catch (err) {
      setError("خطا در ساخت لیست خرید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center rtl">
        <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-black mb-2">در حال تدارک لیست خرید... 🛒</h2>
      </div>
    );
  }

  return (
    <DashboardLayout title="لیست خرید هفته">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white">
            <ShoppingBasket className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black">لیست خرید هفته</h2>
            <p className="text-sm text-gray-500">همه چیزهایی که برای رژیم این هفته لازم داری</p>
          </div>
        </div>

        <div className="space-y-8">
          {list?.categories.map((cat: any) => (
            <div key={cat.name} className="space-y-4">
              <h3 className="text-lg font-bold text-primary-900 border-r-4 border-primary-600 pr-3">{cat.name}</h3>
              <Card className="space-y-0 p-0 overflow-hidden divide-y divide-gray-100">
                {cat.items.map((item: any, idx: number) => {
                  const itemKey = `${cat.name}-${idx}`;
                  const isChecked = checked.has(itemKey);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleItem(itemKey)}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          isChecked 
                            ? "bg-primary-600 border-primary-600" 
                            : "border-gray-200"
                        )}>
                          <Check className={cn(
                            "w-3.5 h-3.5 text-white transition-opacity",
                            isChecked ? "opacity-100" : "opacity-0"
                          )} />
                        </div>
                        <span className={cn(
                          "font-bold transition-colors",
                          isChecked 
                            ? "line-through text-gray-300" 
                            : "text-gray-900"
                        )}>
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
