// GET /api/download?session_id=cs_...
// Wydaje PDF tylko, jeśli sesja Stripe jest opłacona (i należy do dozwolonego Payment Linku).
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCheckoutSession, isPaidForThisProduct, htmlPage, env } from "./_lib.js";

const CONTACT = () => env("CONTACT_EMAIL", "nosoytumadre.es@gmail.com");

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)) {
    return htmlPage(400, "Enlace no válido", `Revisa el enlace de tu email o escríbenos a <a href="mailto:${CONTACT()}">${CONTACT()}</a>.`);
  }
  let session;
  try {
    session = await getCheckoutSession(id);
  } catch (e) {
    console.error("download: stripe error", e);
    return htmlPage(503, "Un momento…", `No hemos podido comprobar tu compra ahora mismo. Inténtalo de nuevo en unos minutos o escríbenos a <a href="mailto:${CONTACT()}">${CONTACT()}</a>.`);
  }
  if (!isPaidForThisProduct(session)) {
    return htmlPage(403, "No encontramos tu compra", `Si acabas de pagar, espera un minuto y recarga. Si el problema sigue, escríbenos a <a href="mailto:${CONTACT()}">${CONTACT()}</a> y te lo enviamos a mano.`);
  }
  const file = await readFile(path.join(process.cwd(), "private", "no-soy-tu-madre.pdf"));
  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="No-soy-tu-madre.pdf"',
      "Content-Length": String(file.length),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex"
    }
  });
}
