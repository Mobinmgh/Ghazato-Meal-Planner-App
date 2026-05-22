import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { Leaf, Loader2, ChevronRight } from "lucide-react";
import { auth } from "@/src/lib/auth";
import { storage } from "@/src/lib/storage";
import { DEMO_OTP_CODE, isDemoMode } from "@/src/lib/demo";

const REQUEST_TIMEOUT_MS = 15_000;

async function postJsonWithTimeout(path: string, body: unknown) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return { response, data };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function getJsonWithTimeout(path: string) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(path, { signal: controller.signal });
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export default function Login() {
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtpCode, setDemoOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigate("/plan", { replace: true });
    }
  }, [navigate]);

  const finishLogin = (userId: string, userPhone: string) => {
    auth.setUser(userId, userPhone);
    navigate(storage.getProfile() ? "/plan" : "/onboarding");
  };

  const handleSendOTP = async () => {
    if (!/^09\d{9}$/.test(phone)) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    setLoading(true);
    setError("");

    if (isDemoMode) {
      setDemoOtpCode(DEMO_OTP_CODE);
      window.setTimeout(() => {
        setStage("otp");
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const { response, data } = await postJsonWithTimeout("/api/auth/send-otp", { phone });
      if (response.ok) {
        setDemoOtpCode(DEMO_OTP_CODE);
        setStage("otp");
      } else {
        setError(data.error || "خطا در ارسال کد");
      }
    } catch (err) {
      console.warn("OTP send failed:", err);
      setError("خطا در برقراری ارتباط");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("کد ۶ رقمی را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    if (isDemoMode) {
      if (otp !== DEMO_OTP_CODE) {
        setError("کد دمو را وارد کنید: ۱۲۳۴۵۶");
        setLoading(false);
        return;
      }

      window.setTimeout(() => {
        finishLogin(`demo-${phone}`, phone);
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const { response, data } = await postJsonWithTimeout("/api/auth/verify-otp", { phone, code: otp });

      if (response.ok) {
        auth.setUser(data.userId, data.phone);

        try {
          const planData = await getJsonWithTimeout(`/api/plans/latest?userId=${data.userId}`);

          if (planData.plan) {
            storage.setPlan(planData.plan);
            if (planData.profileData) {
              storage.setProfile(planData.profileData);
            }
            navigate("/plan");
          } else if (planData.profileData) {
            storage.setProfile(planData.profileData);
            navigate("/onboarding");
          } else {
            navigate("/onboarding");
          }
        } catch (err) {
          console.warn("Latest plan fetch skipped:", err);
          navigate("/onboarding");
        }
      } else {
        setError(data.error || "کد اشتباه است");
      }
    } catch (err) {
      console.warn("OTP verify failed:", err);
      setError("خطا در تأیید کد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 rtl font-vazirmatn relative">
      <Link
        to="/"
        className="absolute top-6 right-6 flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
        بازگشت
      </Link>

      <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
        <Leaf className="w-10 h-10 fill-white" />
      </div>
      <h1 className="text-2xl font-black text-primary-700 mt-4 leading-none">غذاتو</h1>
      <p className="text-sm text-gray-400 mt-2 font-medium">برنامه‌ریزی هوشمند تغذیه</p>

      <div className="w-full max-w-sm mt-10">
        {stage === "phone" ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-black text-gray-900">ورود یا ثبت‌نام</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">شماره موبایلت را وارد کن</p>
            </div>

            <div className="space-y-4">
              <input
                type="tel"
                dir="ltr"
                placeholder="09XX-XXX-XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                className="h-14 w-full rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 text-lg font-bold tracking-widest outline-none text-center placeholder:text-gray-200"
              />

              {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}

              <Button
                className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg transition-all"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ارسال کد"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-black text-gray-900">کد تأیید</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                کد ۶ رقمی ارسال‌شده به {phone}
              </p>
              {isDemoMode && (
                <p className="text-xs text-primary-600 mt-2 font-bold">
                  در حالت دمو هر کد ۶ رقمی پذیرفته می‌شود.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="tel"
                dir="ltr"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-14 w-full rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 text-2xl font-bold tracking-[0.5em] outline-none text-center"
              />

              {isDemoMode && demoOtpCode && (
                <div className="rounded-2xl bg-primary-50 border border-primary-100 px-4 py-3 text-center">
                  <p className="text-xs font-bold text-primary-700 mb-1">کد ورود دمو</p>
                  <p className="text-2xl font-black tracking-[0.35em] text-primary-700" dir="ltr">
                    {demoOtpCode}
                  </p>
                  <p className="text-[11px] text-primary-600 mt-1">
                    برای نمایش زنده، این کد را وارد کنید.
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}

              <Button
                className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "تأیید و ورود"}
              </Button>

              <button
                onClick={() => {
                  setStage("phone");
                  setOtp("");
                  setDemoOtpCode("");
                  setError("");
                }}
                className="w-full py-2 text-sm text-primary-600 font-black hover:text-primary-700 transition-colors"
                disabled={loading}
              >
                تغییر شماره موبایل
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-300 font-bold max-w-[200px] leading-relaxed">
          با ورود، <Link to="/privacy" className="underline hover:text-gray-400">قوانین و حریم خصوصی</Link> غذاتو را می‌پذیرید
        </p>
      </div>
    </div>
  );
}
