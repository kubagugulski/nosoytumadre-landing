// Wspólne funkcje dla /api (pliki z "_" nie są endpointami na Vercelu).
import crypto from "node:crypto";

export const env = (k, d = "") => (process.env[k] || d).trim();

// Pobiera sesję Checkout ze Stripe (bez SDK, zwykły fetch).
export async function getCheckoutSession(id) {
  const key = env("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${key}` }
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Stripe ${r.status}: ${await r.text()}`);
  return r.json();
}

// Czy sesja to opłacony zakup TEGO ebooka.
export function isPaidForThisProduct(s) {
  if (!s) return false;
  const paid = s.payment_status === "paid" || s.payment_status === "no_payment_required";
  if (!paid) return false;
  // Opcjonalnie: tylko konkretne Payment Linki (plink_...), oddzielone przecinkami.
  // Chroni przed tym, żeby kupujący polskiego ebooka (to samo konto Stripe) pobrał hiszpański.
  const allowed = env("ALLOWED_PAYMENT_LINKS").split(",").map((x) => x.trim()).filter(Boolean);
  if (allowed.length && !allowed.includes(s.payment_link)) return false;
  return true;
}

// Weryfikacja podpisu webhooka Stripe (nagłówek Stripe-Signature).
export function verifyStripeSignature(raw, header, secret, toleranceSec = 300) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.split("=")).filter((p) => p.length === 2).map(([k, v]) => [k.trim(), v.trim()])
  );
  const sigs = header.split(",").filter((p) => p.trim().startsWith("v1=")).map((p) => p.trim().slice(3));
  const t = Number(parts.t);
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`, "utf8").digest("hex");
  const a = Buffer.from(expected, "hex");
  return sigs.some((s) => {
    const b = Buffer.from(s, "hex");
    return b.length === a.length && crypto.timingSafeEqual(a, b);
  });
}

export const siteUrl = () => env("SITE_URL", "https://nosoytumadre.com").replace(/\/$/, "");

const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function purchaseEmail({ name, sessionId }) {
  const link = `${siteUrl()}/api/download?session_id=${encodeURIComponent(sessionId)}`;
  const contact = env("CONTACT_EMAIL", "nosoytumadre.es@gmail.com");
  const hi = name ? `¡Hola, ${esc(name.split(" ")[0])}!` : "¡Hola!";
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#FFF8F4;font-family:Arial,Helvetica,sans-serif;color:#24131C">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;border:1px solid #F1D5E2">
<tr><td style="padding:30px 26px 8px;text-align:center">
  <div style="font-size:14px;color:#E8247A;font-weight:bold;letter-spacing:1px">♥ NO SOY TU MADRE</div>
  <h1 style="font-size:26px;line-height:1.2;margin:16px 0 10px">${hi} Tu plan ya es tuyo.</h1>
  <p style="font-size:16px;line-height:1.55;color:#5B4652;margin:0 0 22px">Gracias por tu compra. Aquí tienes tu ebook <b>«No soy tu madre»</b> con sus dos bonus.</p>
  <a href="${link}" style="display:inline-block;background:#E8247A;color:#ffffff;text-decoration:none;font-weight:bold;font-size:17px;padding:16px 28px;border-radius:999px">Descargar mi ebook (PDF)</a>
  <p style="font-size:13px;color:#8c7681;margin:14px 0 0">Si el botón no funciona, copia este enlace en el navegador:<br><a href="${link}" style="color:#8c7681;word-break:break-all">${link}</a></p>
</td></tr>
<tr><td style="padding:22px 26px">
  <div style="background:#FFF0F6;border-radius:14px;padding:16px 18px;font-size:15px;line-height:1.55">
    <b>Cómo empezar hoy:</b><br>1. Lee el libro (se lee en una tarde).<br>2. Haz el test del capítulo 1.<br>3. Mañana, empieza el día 1 del detox.
  </div>
</td></tr>
<tr><td style="padding:0 26px 26px;font-size:12px;line-height:1.55;color:#8c7681">
  Confirmación: compraste un contenido digital y solicitaste recibirlo de inmediato, por lo que, conforme al art. 103 m) del TRLGDCU, no se aplica el derecho de desistimiento. Conservas nuestra garantía voluntaria de satisfacción de 14 días: si no te sirve, responde a este email y te devolvemos el dinero.<br><br>
  ¿Dudas? Escríbenos a <a href="mailto:${contact}" style="color:#8c7681">${contact}</a>.<br>
  Jakub Gugulski · NIP 6821811984 · Ratajów 30, 32-090 Słomniki (Polonia) · <a href="${siteUrl()}/condiciones" style="color:#8c7681">Condiciones de venta</a>
</td></tr></table></td></tr></table></body></html>`;
  const text = `${hi.replace(/<[^>]+>/g, "")} Gracias por tu compra de «No soy tu madre».\n\nDescarga tu ebook aquí: ${link}\n\nCómo empezar: lee el libro, haz el test del capítulo 1 y mañana empieza el día 1 del detox.\n\nConfirmación: compraste un contenido digital y solicitaste recibirlo de inmediato, por lo que, conforme al art. 103 m) del TRLGDCU, no se aplica el derecho de desistimiento. Garantía voluntaria de satisfacción de 14 días: responde a este email.\n\n${contact}`;
  return { html, text };
}

// Wysyłka przez Resend (bez SDK). Idempotency-Key = ID zdarzenia Stripe, więc ponowienia nie dublują maili.
export async function sendEmail({ to, subject, html, text, idempotencyKey }) {
  const key = env("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY not set");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {})
    },
    body: JSON.stringify({
      from: env("EMAIL_FROM", "No soy tu madre <hola@nosoytumadre.com>"),
      to: [to],
      reply_to: env("CONTACT_EMAIL", "nosoytumadre.es@gmail.com"),
      subject, html, text
    })
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return r.json();
}

export function htmlPage(status, title, msg) {
  return new Response(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><link rel="stylesheet" href="/assets/style.css"></head><body><main class="page" style="text-align:center"><h1>${title}</h1><p>${msg}</p><p><a class="btn" href="/">Volver</a></p></main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
