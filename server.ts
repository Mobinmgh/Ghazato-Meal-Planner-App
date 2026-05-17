import express from "express";
import path from "path";
import axios from "axios";
import crypto from "crypto";
import { generateOTP, storeOTP, verifyOTP, sendOTPviaSMS } from "./server/otp";
import { getSupabaseAdmin } from "./server/supabase";
import { generateMealPlanServer, generateShoppingListServer } from "./server/gemini";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ZarinPal API Configuration
  const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
  const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
  const ZARINPAL_BASE = ZARINPAL_SANDBOX
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://api.zarinpal.com/pg/v4/payment";

  // Auth Routes
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) return res.status(400).json({ error: "شماره تلفن الزامی است" });
      
      const normalized = phone.startsWith("0") 
        ? "98" + phone.slice(1) 
        : phone;

      const code = generateOTP();
      console.log(`[AUTH] Generating OTP for ${phone}: ${code} (normalized: ${normalized})`);
      storeOTP(normalized, code);
      await sendOTPviaSMS(normalized, code);
      
      res.json({ success: true, message: "کد ارسال شد" });
    } catch (err: any) {
      console.error("OTP send error:", err);
      res.status(500).json({ error: "خطا در ارسال کد" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, code } = req.body;
      
      const normalized = phone.startsWith("0") 
        ? "98" + phone.slice(1) 
        : phone;

      const valid = verifyOTP(normalized, code);
      if (!valid) {
        return res.status(400).json({ error: "کد اشتباه یا منقضی شده" });
      }

      // Sign in user and return custom session information
      const supabase = getSupabaseAdmin()
      if (!supabase) {
        return res.status(500).json({ error: "Supabase not configured" })
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", normalized)
        .maybeSingle()

      let userId: string

      if (existingUser) {
        // Returning user
        userId = existingUser.id
      } else {
        // New user — generate our own UUID
        const newId = crypto.randomUUID()
        
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: newId, phone: normalized })
        
        if (insertError) throw insertError
        
        userId = newId
      }

      res.json({
        success: true,
        userId,
        phone: normalized,
        isNewUser: !existingUser
      })
    } catch (err: any) {
      console.error("OTP verify error:", err);
      res.status(500).json({ error: "خطا در تأیید کد" });
    }
  });

  // Plan Routes
  app.post("/api/plans/save", async (req, res) => {
    try {
      const { userId, planData, profileData } = req.body;
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("Supabase not configured");
      
      await supabase
        .from("plans")
        .insert({
          user_id: userId,
          plan_data: planData,
          profile_data: profileData,
        });
      
      res.json({ success: true });
    } catch (err: any) {
      console.error("Save plan error:", err);
      res.status(500).json({ error: "خطا در ذخیره برنامه" });
    }
  });

  app.get("/api/plans/latest", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId is required" });
      
      const supabase = getSupabaseAdmin();
      if (!supabase) return res.json({ plan: null });

      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return res.json({ plan: null });
      }

      const createdAt = new Date(data.created_at);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const isRecent = createdAt > sevenDaysAgo;

      res.json({ 
        plan: isRecent ? data.plan_data : null,
        profileData: data.profile_data,
        isRecent,
        createdAt: data.created_at
      });
    } catch (err: any) {
      console.error("Get plan error:", err);
      res.status(500).json({ error: "خطا در دریافت برنامه" });
    }
  });

  // API Routes
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { profile } = req.body;
      if (!profile) return res.status(400).json({ error: "Profile is required" });
      const plan = await generateMealPlanServer(profile);
      res.json(plan);
    } catch (err: any) {
      console.error("Generate plan error:", err);
      res.status(500).json({ error: "خطا در برقراری ارتباط با مدل هوش مصنوعی" });
    }
  });

  app.post("/api/generate-shopping-list", async (req, res) => {
    try {
      const { mealPlan } = req.body;
      if (!mealPlan) return res.status(400).json({ error: "Meal plan is required" });
      const list = await generateShoppingListServer(mealPlan);
      res.json(list);
    } catch (err: any) {
      console.error("Generate shopping list error:", err);
      res.status(500).json({ error: "خطا در ساخت لیست خرید" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/landing-data", (req, res) => {
    res.json({
      badges: [
        { icon: "🍲", text: "غذای ایرانی" },
        { icon: "✨", text: "شخصی‌سازی شده" },
        { icon: "⚖️", text: "کالری‌شمار" },
        { icon: "✔", text: "زندگی سالم" },
        { icon: "🎁", text: "عمر طولانی" }
      ],
      features: [
        { 
          title: "هوش مصنوعی هوشمند", 
          desc: "الگوریتم‌های ما با یادگیری ذائقه شما، بهترین پیشنهادات غذایی را بر اساس کالری مورد نیاز ارائه می‌دهند.",
          iconType: "brain",
          color: "bg-primary-50 text-primary-600"
        },
        { 
          title: "لیست خرید خودکار", 
          desc: "دیگر نگران فراموش کردن مواد اولیه نباشید. لیست خرید هفتگی شما به صورت خودکار آماده می‌شود.",
          iconType: "shopping",
          color: "bg-orange-50 text-orange-600"
        },
        { 
          title: "تاریخچه پیشرفت", 
          desc: "نمودارهای دقیق از کالری مصرفی، وزن و سلامتی شما در طول زمان برای رصد دقیق اهداف سلامتی.",
          iconType: "history",
          color: "bg-rose-50 text-rose-600"
        }
      ],
      dailySuggestion: {
        title: "قورمه سبزی اصیل",
        image: "/input_file_1.png",
        cookTime: "۴۵ دقیقه",
        calories: 520,
        currentUserCalories: 1200,
        targetCalories: 2000
      },
      testimonials: [
        { 
          name: "رضا احمدی", 
          role: "کاربر ویژه", 
          text: "از وقتی از غذاتو استفاده می‌کنم، دیگه استرس ندارم که ناهار چی بپزم. پیشنهاداتش دقیقا طبق سلیقه خانواده ماست.",
          initial: "ر",
          color: "bg-amber-100 text-amber-700"
        },
        { 
          name: "مریم حسینی", 
          role: "ورزشکار", 
          text: "کنترل کالری با غذاهای ایرانی همیشه سخت بود، اما این اپلیکیشن با دقت خیلی بالایی این کار رو برای من انجام میده.",
          initial: "م",
          color: "bg-primary-100 text-primary-700"
        },
        { 
          name: "علی مرادی", 
          role: "کاربر فعال", 
          text: "لیست خریدش عالیه! از هدر رفتن مواد غذایی تو خونه جلوگیری می‌کنه و واقعا به صرفه است.",
          initial: "ع",
          color: "bg-rose-100 text-rose-700"
        }
      ]
    });
  });

  // ZarinPal Payment Request
  app.post("/api/payment/request", async (req, res) => {
    try {
      const { amount, description, callback_url } = req.body;

      if (!ZARINPAL_MERCHANT_ID || ZARINPAL_MERCHANT_ID === "your_merchant_id_here") {
        console.warn("ZarinPal Merchant ID is not configured. Returning success for testing.");
        return res.json({ 
          url: `${process.env.APP_URL}/payment/verify?Authority=000000000000000000000000000000000001&Status=OK`, 
          authority: "000000000000000000000000000000000001" 
        });
      }

      const response = await axios.post(`${ZARINPAL_BASE}/request.json`, {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: Math.floor(amount), // in Tomans
        description,
        callback_url: callback_url || `${process.env.APP_URL}/payment/verify`,
      });

      if (response.data.data?.code === 100) {
        const authority = response.data.data.authority;
        const paymentUrl = ZARINPAL_SANDBOX
          ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
          : `https://www.zarinpal.com/pg/StartPay/${authority}`;
        
        return res.json({ url: paymentUrl, authority });
      }

      res.status(400).json({ error: "Failed to create payment request", details: response.data });
    } catch (error: any) {
      console.error("ZarinPal Request Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Internal Server Error during payment request" });
    }
  });

  // ZarinPal Payment Verification
  app.post("/api/payment/verify", async (req, res) => {
    try {
      const { authority, amount } = req.body;

      if (!ZARINPAL_MERCHANT_ID || ZARINPAL_MERCHANT_ID === "your_merchant_id_here") {
        console.warn("ZarinPal Merchant ID is not configured. Returning verification success for testing.");
        return res.json({ data: { code: 100, message: "Verified (Mock)" } });
      }

      const response = await axios.post(`${ZARINPAL_BASE}/verify.json`, {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: Math.floor(amount),
        authority,
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("ZarinPal Verify Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Internal Server Error during payment verification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
