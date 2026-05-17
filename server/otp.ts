import axios from 'axios'

// In-memory OTP store: phone -> { code, expiresAt }
const otpStore = new Map<string, { code: string; expiresAt: number }>()

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeOTP(phone: string, code: string) {
  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  })
}

export function verifyOTP(phone: string, code: string): boolean {
  const entry = otpStore.get(phone)
  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone)
    return false
  }
  if (entry.code !== code) return false
  otpStore.delete(phone)
  return true
}

export async function sendOTPviaSMS(phone: string, code: string) {
  const message = `کد ورود غذاتو: ${code}\nاین کد ۵ دقیقه اعتبار دارد.`
  console.log(`[SMS] ${phone}: ${message}`)
  
  // Use Kavenegar API
  const apiKey = process.env.KAVENEGAR_API_KEY
  if (!apiKey || apiKey === 'your_kavenegar_api_key') {
    return
  }

  await axios.get(`https://api.kavenegar.com/v1/${apiKey}/sms/send.json`, {
    params: {
      receptor: phone,
      sender: process.env.KAVENEGAR_SENDER,
      message,
    }
  })
}
