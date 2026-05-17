import { DashboardLayout } from "@/src/components/layout/DashboardLayout";

export default function Privacy() {
  const sections = [
    {
      title: "جمع‌آوری اطلاعات",
      body: "ما اطلاعات پایه‌ای مانند سن، وزن و هدف رژیمی شما را برای ساخت برنامه غذایی شخصی‌سازی‌شده جمع‌آوری می‌کنیم. این اطلاعات فقط روی دستگاه شما ذخیره می‌شود و به هیچ سرور خارجی ارسال نمی‌شود."
    },
    {
      title: "استفاده از اطلاعات",
      body: "اطلاعات شما صرفاً برای تولید برنامه غذایی مناسب استفاده می‌شود. ما هیچگاه اطلاعات شما را به اشخاص ثالث نمی‌فروشیم یا منتقل نمی‌کنیم."
    },
    {
      title: "امنیت داده‌ها",
      body: "تمام داده‌های شما به صورت محلی در مرورگر دستگاه شما ذخیره می‌شود. در صورت پاک کردن کش مرورگر، اطلاعات شما حذف خواهد شد."
    },
    {
      title: "پرداخت‌ها",
      body: "پرداخت‌ها از طریق درگاه امن زرین‌پال انجام می‌شود. ما هیچ اطلاعات کارت بانکی شما را ذخیره نمی‌کنیم."
    },
    {
      title: "تغییرات در قوانین",
      body: "ما حق داریم این قوانین را در هر زمان به‌روزرسانی کنیم. استفاده مستمر از برنامه به منزله پذیرش قوانین جدید است."
    }
  ];

  return (
    <DashboardLayout title="قوانین و حریم خصوصی">
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <header className="py-2">
          <h1 className="text-2xl font-black text-gray-900">قوانین و حریم خصوصی</h1>
          <p className="text-xs text-gray-400 mt-1">آخرین بروزرسانی: فروردین ۱۴۰۴</p>
        </header>

        <main className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-black text-base text-gray-900 mb-2">{section.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </main>
      </div>
    </DashboardLayout>
  );
}
