import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ══════════════════════════════════════════════════════════
   RATE LIMITER — in-memory, harici paket yok
   1 IP → dakikada max 3 istek
══════════════════════════════════════════════════════════ */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now    = Date.now();
  const WINDOW = 60_000; // 1 dakika
  const MAX    = 3;

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW });
    return true;
  }

  if (entry.count >= MAX) return false;
  entry.count++;
  return true;
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/* ══════════════════════════════════════════════════════════
   POST /api/contact
══════════════════════════════════════════════════════════ */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website, formLoadedAt } = body;

    /* 1️⃣ Rate limit */
    if (!checkRateLimit(getIP(request))) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi. Lütfen 1 dakika bekleyin." },
        { status: 429 }
      );
    }

    /* 2️⃣ Honeypot — bot doldurmuşsa sessizce başarılı döndür */
    if (website && website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    /* 3️⃣ Time check — 2 saniyeden hızlı = bot */
    if (formLoadedAt && Date.now() - Number(formLoadedAt) < 2000) {
      return NextResponse.json(
        { error: "Lütfen formu doldurmak için biraz zaman ayırın." },
        { status: 400 }
      );
    }

    /* 4️⃣ Zorunlu alan kontrolü */
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ad, e-posta ve mesaj zorunludur." },
        { status: 400 }
      );
    }

    /* 5️⃣ Matematik CAPTCHA kontrolü */
    const { captchaAnswer, captchaExpected } = body;
    if (Number(captchaAnswer) !== Number(captchaExpected)) {
      return NextResponse.json(
        { error: "Matematik sorusunu yanlış cevapladınız." },
        { status: 400 }
      );
    }

    /* 6️⃣ E-posta gönder */
    await resend.emails.send({
      from:    "Portfolio Contact <onboarding@resend.dev>",
      to:      process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] Yeni mesaj — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0e0714;color:#ddd;padding:32px;border-radius:12px;">
          <h2 style="color:#8750f7;margin:0 0 24px;">📬 Yeni Mesaj</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="color:#888;font-size:12px;padding:6px 0;width:80px;">Gönderen</td>
              <td style="color:#fff;font-size:14px;padding:6px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color:#888;font-size:12px;padding:6px 0;">E-posta</td>
              <td style="padding:6px 0;">
                <a href="mailto:${email}" style="color:#8750f7;font-size:14px;">${email}</a>
              </td>
            </tr>
            ${subject ? `
            <tr>
              <td style="color:#888;font-size:12px;padding:6px 0;">Konu</td>
              <td style="color:#fff;font-size:14px;padding:6px 0;">${subject}</td>
            </tr>` : ""}
          </table>
          <div style="background:#1a0e28;border:1px solid #2a1454;border-radius:10px;padding:20px;">
            <div style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Mesaj</div>
            <p style="color:#ddd;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Mesajınız")}"
              style="display:inline-block;background:#8750f7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
              ↩ Yanıtla
            </a>
          </div>
          <p style="color:#444;font-size:11px;text-align:center;margin-top:24px;">
            Portfolio iletişim formu · ${new Date().toLocaleString("tr-TR")}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}