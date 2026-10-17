// POST /api/stripe-webhook
// Stripe wywołuje ten adres po płatności; wysyłamy kupującej maila z linkiem do pobrania.
import { verifyStripeSignature, isPaidForThisProduct, purchaseEmail, sendEmail, env } from "./_lib.js";

export async function POST(request) {
  const raw = await request.text();
  const ok = verifyStripeSignature(raw, request.headers.get("stripe-signature"), env("STRIPE_WEBHOOK_SECRET"));
  if (!ok) return new Response("invalid signature", { status: 400 });

  let event;
  try { event = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }

  const types = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!types.includes(event.type)) return Response.json({ received: true, ignored: event.type });

  const s = event.data && event.data.object;
  if (!isPaidForThisProduct(s)) return Response.json({ received: true, skipped: "not paid or other product" });

  const to = s.customer_details && s.customer_details.email;
  if (!to) { console.error("webhook: no email in session", s.id); return Response.json({ received: true, skipped: "no email" }); }

  try {
    const { html, text } = purchaseEmail({ name: s.customer_details.name, sessionId: s.id });
    await sendEmail({ to, subject: "Tu ebook «No soy tu madre» ya está aquí", html, text, idempotencyKey: `nstm-${s.id}` });
  } catch (e) {
    console.error("webhook: email failed", e);
    // 500 => Stripe ponowi zdarzenie później (a Idempotency-Key nie pozwoli wysłać dwa razy).
    return new Response("email failed", { status: 500 });
  }
  return Response.json({ received: true, sent: true });
}
