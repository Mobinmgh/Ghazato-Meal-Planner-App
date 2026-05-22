import { DashboardLayout } from "@/src/components/layout/DashboardLayout";
import { Card } from "@/src/components/ui/Card";

export default function About() {
  return (
    <DashboardLayout title="درباره ما">
      <div className="space-y-6 pb-20">
        <section className="bg-primary-600 text-white px-6 py-10 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <span className="text-xs font-bold opacity-70">درباره ما</span>
            <h1 className="text-2xl font-black mt-1">غذاتو چیست؟</h1>
            <p className="text-sm opacity-80 leading-relaxed mt-3">
              غذاتو یک دستیار هوشمند تغذیه ایرانی است که با استفاده از 
              هوش مصنوعی، برنامه غذایی شخصی‌سازی‌شده بر اساس غذاهای اصیل 
              ایرانی برای شما می‌سازد.
            </p>
          </div>
        </section>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="flex flex-row items-start gap-4 p-5">
            <div className="text-2xl w-10 shrink-0 mt-0.5">🍲</div>
            <div>
              <h3 className="font-black text-base text-gray-900">غذاهای ایرانی</h3>
              <p className="text-sm text-gray-500 mt-1">برنامه‌های ما کاملاً بر اساس غذاهای سنتی و اصیل ایرانی طراحی شده‌اند.</p>
            </div>
          </Card>

          <Card className="flex flex-row items-start gap-4 p-5">
            <div className="text-2xl w-10 shrink-0 mt-0.5">🤖</div>
            <div>
              <h3 className="font-black text-base text-gray-900">هوش مصنوعی پیشرفته</h3>
              <p className="text-sm text-gray-500 mt-1">از جدیدترین الگوریتم‌های هوش مصنوعی برای شخصی‌سازی برنامه غذایی شما استفاده می‌کنیم.</p>
            </div>
          </Card>

          <Card className="flex flex-row items-start gap-4 p-5">
            <div className="text-2xl w-10 shrink-0 mt-0.5">🎯</div>
            <div>
              <h3 className="font-black text-base text-gray-900">هدف‌محور</h3>
              <p className="text-sm text-gray-500 mt-1">چه هدف کاهش وزن داشته باشید چه افزایش عضله، برنامه شما دقیقاً بر اساس هدفتان ساخته می‌شود.</p>
            </div>
          </Card>
        </main>

        <footer className="text-center text-xs text-gray-300">
          نسخه ۱.۰.۰ — ساخته شده با ❤️ در ایران
        </footer>
      </div>
    </DashboardLayout>
  );
}
