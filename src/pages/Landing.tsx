import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Sparkles, User, Star, Bell, Brain, ShoppingBag, History, PlusCircle, ChevronRight, ChevronLeft, Globe, Share2 } from "lucide-react";
import { storage } from "@/src/lib/storage";
import { convertToPersianNumbers, cn } from "@/src/lib/utils";
import { auth } from "@/src/lib/auth";
import { BottomNav } from "@/src/components/layout/BottomNav";
import { isDemoMode } from "@/src/lib/demo";
import { landingFallbackData } from "@/src/lib/landingFallback";

const HERO_IMAGES = [
  "/input_file_6.png",
  "/input_file_1.png",
  "/input_file_4.png",
  "/input_file_5.png",
  "/input_file_2.png"
];

const BADGES = [
  { icon: "🍲", text: "غذای ایرانی" },
  { icon: "✨", text: "شخصی‌سازی شده" },
  { icon: "⚖️", text: "کالری‌شمار" },
  { icon: "✔", text: "زندگی سالم" },
  { icon: "🎁", text: "عمر طولانی" }
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [data, setData] = useState<any>(landingFallbackData);

  useEffect(() => {
    if (storage.getProfile() && auth.isLoggedIn()) {
      navigate("/plan");
    }

    const fetchData = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8_000);

      try {
        const response = await fetch("/api/landing-data", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Landing data request failed: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Landing data response was not JSON");
        }

        const json = await response.json();
        if (!json?.features?.length || !json?.testimonials?.length || !json?.dailySuggestion) {
          throw new Error("Landing data response was incomplete");
        }

        setData(json);
      } catch (error) {
        console.warn("Using demo landing data fallback", error);
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    if (!isDemoMode) {
      fetchData();
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const testimonialsRef = useRef<HTMLDivElement>(null);

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (testimonialsRef.current) {
      const scrollAmount = 432; // card width + gap
      testimonialsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const iconMap: Record<string, any> = {
    brain: <Brain className="w-6 h-6" />,
    shopping: <ShoppingBag className="w-6 h-6" />,
    history: <History className="w-6 h-6" />,
  };

  const mobileIconMap: Record<string, any> = {
    brain: <Brain className="w-6 h-6" />,
    shopping: <ShoppingBag className="w-5 h-5" />,
    history: <History className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-white rtl font-vazirmatn overflow-x-hidden">
      {/* MOBILE VERSION (Current layout strictly preserved in fixed breakpoints) */}
      <div className="md:hidden">
        <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <img src="/input_file_2.png" alt="غذاتو" className="h-8 w-auto object-contain" />
            <h1 className="text-2xl font-black text-primary-700 tracking-tighter">غذاتو</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
              <User className="w-6 h-6" />
            </div>
          </div>
        </header>

        <section className="relative min-h-[580px] max-h-[85vh] overflow-hidden">
          <div className="absolute inset-0">
            {HERO_IMAGES.map((img, idx) => (
              <motion.img
                key={img}
                src={img}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentImageIndex === idx ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Persian Food"
              />
            ))}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-8 px-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white/70 backdrop-blur-md border border-white/30 rounded-[20px] p-6 text-center space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-tight text-gray-900">
                  برنامه غذایی هوشمند برای ذائقه ایرانی
                </h2>
                <p className="text-base font-normal text-gray-700 leading-relaxed">
                  بر اساس اهداف سلامتی شما، یک برنامه کامل و خوشمزه می‌سازیم
                </p>
              </div>

              <div className="flex justify-center gap-2 overflow-hidden py-1">
                <motion.div 
                   className="flex gap-2 w-max"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    duration: 18, 
                    ease: "linear", 
                    repeat: Infinity
                  }}
                >
                  {[...data.badges, ...data.badges].map((badge: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-white/50 whitespace-nowrap text-xs font-medium text-gray-800 shadow-sm">
                      <span>{badge.icon}</span>
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <Button 
                className="w-full h-[52px] rounded-[14px] bg-[#16a34a] hover:bg-[#15803d] text-white text-base font-bold shadow-sm transition-all active:scale-[0.98]"
                onClick={() => navigate("/login")}
              >
                شروع برنامه رایگان
              </Button>
            </motion.div>
          </div>
        </section>

        <main className="px-6 py-12 space-y-12 bg-gray-50">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">چرا غذاتو؟</h2>
            <div className="grid grid-cols-1 gap-3">
              {data.features.map((feat: any, idx: number) => (
                <Card key={idx} className="flex flex-row items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", feat.color)}>
                    {mobileIconMap[feat.iconType] || <Sparkles className="w-6 h-6" />}
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-lg">{feat.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{feat.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
              <div className="relative h-56">
                <img src={data.dailySuggestion.image} className="w-full h-full object-cover" alt="Lunch" />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  پیشنهاد ناهار امروز
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-primary-700">{data.dailySuggestion.title}</h3>
                    <p className="text-xs text-gray-400 font-bold">زمان پخت: {data.dailySuggestion.cookTime} | کالری: {convertToPersianNumbers(data.dailySuggestion.calories.toString())}</p>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shadow-sm active:scale-90 transition-transform">
                    <PlusCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-black">
                    <span className="text-gray-500">کالری مصرفی</span>
                    <span className="text-primary-600">{convertToPersianNumbers(data.dailySuggestion.currentUserCalories.toString())} / {convertToPersianNumbers(data.dailySuggestion.targetCalories.toString())}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(data.dailySuggestion.currentUserCalories / data.dailySuggestion.targetCalories) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-black text-gray-900 pr-2">نظرات کاربران</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
              {data.testimonials.map((item: any, idx: number) => (
                <Card key={idx} className="min-w-[300px] p-6 space-y-4 shadow-xl shadow-gray-200/30 border-none bg-white snap-center">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed text-sm">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white", item.color)}>
                      {item.initial}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      {item.role && <p className="text-xs text-primary-600 font-bold">{item.role}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </main>
        <BottomNav />
        <div className="h-10" />
      </div>

      {/* DESKTOP VERSION (New Layout) */}
      <div className="hidden md:block">
        {/* Top Bar Desktop */}
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-2">
                <img src="/input_file_2.png" alt="غذاتو" className="h-10 w-auto object-contain" />
                <h1 className="text-2xl font-black text-primary-700 tracking-tighter">غذاتو</h1>
              </div>
              <nav className="flex items-center gap-10 font-bold text-gray-500">
                <a href="#" className="text-primary-600 border-b-2 border-primary-600 pb-1">خانه</a>
                <a href="#" className="hover:text-primary-600 transition-colors">برنامه‌های غذایی</a>
                <a href="#" className="hover:text-primary-600 transition-colors">دستور پخت‌ها</a>
                <a href="#" className="hover:text-primary-600 transition-colors">درباره ما</a>
              </nav>
            </div>
            <Button className="rounded-xl px-8 bg-primary-600 hover:bg-primary-700" onClick={() => navigate("/login")}>ورود</Button>
          </div>
        </header>

        {/* Hero Section Desktop */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {HERO_IMAGES.map((img, idx) => (
              <motion.img
                key={img}
                src={img}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentImageIndex === idx ? 1 : 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Persian Food Hero"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          
          <div className="relative z-10 w-full max-w-4xl px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl border border-white/30 p-16 rounded-[24px] text-center space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            >
              <div className="space-y-4">
                <h2 className="text-5xl font-black leading-tight text-gray-900">
                  دستیار هوشمند تغذیه <br/>برای ذائقه اصیل ایرانی
                </h2>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-normal">
                  با استفاده از پیشرفته‌ترین الگوریتم‌ها، رژیم غذایی خود را بر اساس سلیقه و فرهنگ ایرانی مدیریت کنید. سالم بمانید، بدون آنکه لذت طعم‌های خانگی را فراموش کنید.
                </p>
              </div>
              <Button 
                className="h-[64px] px-16 rounded-[18px] bg-[#16a34a] hover:bg-[#15803d] text-white text-xl font-bold shadow-xl transition-transform active:scale-[0.98]"
                onClick={() => navigate("/login")}
              >
                شروع رایگان برنامه
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Desktop */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-8 space-y-12 text-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900">چرا غذاتو؟</h2>
              <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-3 gap-8 text-right">
              {data.features.map((feat: any, i: number) => (
                <Card key={i} className="p-8 rounded-2xl border-none bg-surface-container-lowest hover:bg-white transition-all hover:shadow-2xl hover:shadow-primary-100/20 group text-center flex flex-col items-center">
                  <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform", feat.color)}>
                    {iconMap[feat.iconType] || <Sparkles className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-gray-900">{feat.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Desktop */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8 space-y-16">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black text-gray-900">تجربه کاربران ما</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => scrollTestimonials('right')}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => scrollTestimonials('left')}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div ref={testimonialsRef} className="flex gap-8 overflow-x-auto pb-8 no-scrollbar snap-x scroll-smooth">
              {data.testimonials.map((user: any, i: number) => (
                <Card key={i} className="min-w-[340px] p-7 rounded-2xl space-y-5 glass-card border-none shadow-xl shadow-gray-200/50 text-right snap-center">
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-black text-base text-white shadow-inner", user.color)}>
                      {user.initial}
                    </div>
                    <div className="text-right">
                      <h4 className="text-base font-black">{user.name}</h4>
                      <p className="text-primary-600 font-bold text-sm">{user.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed italic">"{user.text}"</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Banner CTA Desktop */}
        <section className="py-16 max-w-7xl mx-auto px-8">
          <div className="rounded-3xl p-16 text-center space-y-8 relative overflow-hidden shadow-2xl" style={{ background: "var(--color-green-600)" }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-black text-white">آماده‌اید رژیم غذایی خود را متحول کنید؟</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
                به هزاران کاربر هوشمندی بپیوندید که با استفاده از غذاتو، سلامتی خود را تضمین کرده‌اند. همین حالا ثبت‌نام کنید.
              </p>
            </div>
            
            <div className="relative z-10 flex justify-center gap-6">
              <Button className="h-14 px-10 rounded-2xl bg-white text-primary hover:bg-gray-100 text-base font-black shadow-xl" onClick={() => navigate("/login")}>رایگان شروع کنید</Button>
              <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/30 text-white hover:bg-white/10 text-base font-black">مشاهده دمو</Button>
            </div>
          </div>
        </section>

        {/* Footer Desktop */}
        <footer className="bg-surface-container-low pt-16 pb-12 border-t border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-4 gap-12 mb-12 text-right">
              <div className="col-span-1 space-y-6 flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <img src="/input_file_2.png" alt="غذاتو" className="h-10 w-auto object-contain" />
                  <h1 className="text-2xl font-black text-primary-700">غذاتو</h1>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm max-w-xs">هوشمندترین دستیار تغذیه ایرانی برای سبک زندگی سالم و مدرن.</p>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-black text-gray-900 text-lg">خدمات</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                  <li><Link to="/contact" className="hover:text-primary-600 transition-colors">تماس با ما</Link></li>
                  <li><Link to="/about" className="hover:text-primary-600 transition-colors">درباره ما</Link></li>
                  <li><a href="#" className="hover:text-primary-600 transition-colors">همکاری با ما</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-gray-900 text-lg">راهنما</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                  <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">قوانین و مقررات</Link></li>
                  <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">حریم خصوصی</Link></li>
                  <li><a href="#" className="hover:text-primary-600 transition-colors">سوالات متداول</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black text-gray-900 text-lg">ارتباط با ما</h4>
                <div className="flex gap-4 justify-end">
                  <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 transition-all"><Globe className="w-5 h-5" /></button>
                  <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 transition-all"><Share2 className="w-5 h-5" /></button>
                  <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 transition-all"><Bell className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
            
            <div className="pt-12 border-t border-gray-200 flex items-center justify-between text-gray-400 text-xs font-bold font-vazirmatn">
              <p className="flex items-center gap-4">
                <span>© ۱۴۰۲ غذاتو. تمامی حقوق برای این سرویس هوشمند محفوظ است.</span>
                <span>•</span>
                <span>طراحی شده با ❤️ در ایران</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
