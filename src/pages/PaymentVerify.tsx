import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zarinpal } from "@/src/lib/zarinpal";
import { storage } from "@/src/lib/storage";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  
  const authority = searchParams.get("Authority");
  const urlStatus = searchParams.get("Status");

  useEffect(() => {
    async function verify() {
      if (urlStatus === "OK" && authority) {
        try {
          // In a real app, amount should be stored in session or passed back
          // For MVP demo, we assume the amounts we set
          const amount = 129000; 
          const result = await zarinpal.verify(authority, amount);
          
          if (result.data?.code === 100 || result.data?.code === 101) {
            storage.setSubscribed(true);
            setStatus("success");
          } else {
            setStatus("error");
          }
        } catch (err) {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    }
    
    verify();
  }, [authority, urlStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 rtl text-center">
      <Card className="max-w-sm w-full py-12 space-y-8">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto" />
            <h2 className="text-2xl font-black">در حال تایید پرداخت...</h2>
            <p className="text-gray-500">لطفاً چند لحظه صبر کنید تا تراکنش شما تایید شود.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-black">پرداخت با موفقیت انجام شد! 🎉</h2>
            <p className="text-gray-500">حساب کاربری شما به وضعیت ویژه ارتقا یافت. هم‌اکنون می‌توانید از تمامی امکانات استفاده کنید.</p>
            <Button className="w-full" onClick={() => navigate("/plan")}>برو به برنامه غذایی</Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-black">پرداخت ناموفق بود 😕</h2>
            <p className="text-gray-500">متاسفانه تراکنش شما با خطا مواجه شد یا توسط شما لغو گردید.</p>
            <Button className="w-full" variant="outline" onClick={() => navigate("/plan")}>بازگشت به برنامه</Button>
          </>
        )}
      </Card>
    </div>
  );
}
