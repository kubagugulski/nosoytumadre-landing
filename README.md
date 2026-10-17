# nosoytumadre.com: landing + automatyczna wysyłka ebooka

Statyczna strona (folder `public/`) + 2 funkcje na Vercelu (`api/`). Bez frameworka, bez builda, bez zależności npm.

```
public/                     ← to widzi świat
  index.html                landing
  gracias-e00ff0d9d5e0d691.html   ukryta strona z podziękowaniem (noindex, nie ma do niej linków)
  aviso-legal / privacidad / condiciones / cookies .html
  assets/config.js          ← JEDYNE miejsce do edycji: link płatności i piksel TikToka
api/
  download.js               /api/download?session_id=…  → oddaje PDF tylko po opłaconej płatności
  stripe-webhook.js         /api/stripe-webhook         → po płatności wysyła maila przez Resend
private/no-soy-tu-madre.pdf ← ebook, NIE jest publicznie dostępny pod żadnym adresem
_legal/gen.py               generator stron prawnych (dane sprzedawcy w jednym miejscu)
```

## Jak to działa
1. Klientka klika „Comprar”, płaci na Payment Linku Stripe.
2. Stripe przekierowuje ją na `/gracias-e00ff0d9d5e0d691?session_id=cs_…`, gdzie jest przycisk pobierania.
3. Przycisk prowadzi do `/api/download`, który sprawdza w Stripe, czy ta sesja jest opłacona, i dopiero wtedy wysyła PDF.
4. Równolegle Stripe wysyła webhook, a `/api/stripe-webhook` wysyła maila z tym samym linkiem (przez Resend).

Nawet ktoś, kto zna adres strony z podziękowaniem, nie pobierze ebooka bez opłaconej sesji.

---

## Wdrożenie krok po kroku

### 1. Repo + Vercel
1. Nowe repo na GitHubie (np. `nosoytumadre-landing`), wrzuć zawartość tego folderu.
2. Vercel → Add New Project → wybierz repo → Framework: **Other** → Deploy (bez zmian w ustawieniach builda; `vercel.json` ustawia wszystko).
3. Vercel → Settings → Domains → dodaj `nosoytumadre.com` i `www.nosoytumadre.com`, ustaw DNS u rejestratora tak, jak pokaże Vercel.

### 2. Stripe: produkt i Payment Link
1. Stripe → Product catalog → nowy produkt „No soy tu madre (ebook)”, cena **17 EUR**, jednorazowo.
2. Payment Links → New → wybierz produkt. W ustawieniach:
   - **After payment** → *Don't show confirmation page* → *Redirect customers to your website*:
     `https://nosoytumadre.com/gracias-e00ff0d9d5e0d691?session_id={CHECKOUT_SESSION_ID}`
     (dosłownie z `{CHECKOUT_SESSION_ID}`, Stripe podmieni to sam).
   - **Require customers to accept your terms of service**: włącz (wcześniej w Settings → Public details wpisz URL `https://nosoytumadre.com/condiciones`).
   - **Custom text** przy przycisku płatności (wymóg prawny dla treści cyfrowych):
     `Solicito recibir el ebook de inmediato y reconozco que, al tratarse de contenido digital, pierdo el derecho de desistimiento (art. 103 m TRLGDCU). Mantengo la garantía voluntaria de 14 días.`
   - Język strony płatności: hiszpański/auto.
3. Skopiuj link (`https://buy.stripe.com/…`) i wklej do `public/assets/config.js` → `paymentLink`.
4. Skopiuj **ID Payment Linku** (`plink_…`, widać w URL w panelu) → zmienna `ALLOWED_PAYMENT_LINKS` (punkt 4).
5. Settings → Public details → **Statement descriptor**: coś neutralnego (np. `JG DIGITAL`), żeby na wyciągu nie było tytułu książki (obiecujemy to w FAQ).

### 3. Resend (automatyczne maile)
1. Załóż konto na resend.com (darmowy plan wystarczy na start).
2. Domains → Add `nosoytumadre.com` → dodaj rekordy DNS, które pokaże (SPF/DKIM) → poczekaj na „Verified”.
3. API Keys → utwórz klucz z uprawnieniem „Sending access”.
4. Kontakt dla klientek to `nosoytumadre.es@gmail.com` (odpowiedzi na maile z ebookiem trafiają tam przez Reply-To). Adres nadawcy `hola@nosoytumadre.com` nie potrzebuje skrzynki, wystarczy zweryfikowana domena w Resend. Zmiana kontaktu: `_legal/gen.py` (EMAIL), `public/index.html`, `public/gracias-…html`, potem `python3 _legal/gen.py`.

### 4. Zmienne środowiskowe (Vercel → Settings → Environment Variables)
Wzór w `.env.example`:

| Zmienna | Skąd |
|---|---|
| `SITE_URL` | `https://nosoytumadre.com` |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → **Create restricted key** → uprawnienie *Checkout Sessions: Read* (nic więcej) |
| `STRIPE_WEBHOOK_SECRET` | z punktu 5 |
| `ALLOWED_PAYMENT_LINKS` | `plink_…` hiszpańskiego linku (chroni przed pobraniem przez kupujących polski ebook) |
| `RESEND_API_KEY` | z Resend |
| `EMAIL_FROM` | `No soy tu madre <hola@nosoytumadre.com>` |
| `CONTACT_EMAIL` | `nosoytumadre.es@gmail.com` |

Po dodaniu zmiennych: Deployments → Redeploy.

### 5. Webhook Stripe
Stripe → Developers → Webhooks → Add endpoint:
- URL: `https://nosoytumadre.com/api/stripe-webhook`
- Zdarzenia: `checkout.session.completed` i `checkout.session.async_payment_succeeded`
- Skopiuj **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET` → Redeploy.

### 6. Test (zanim puścisz ruch)
Stwórz w Payment Linku kod rabatowy 100% (albo kup za 17 € i zwróć sobie pieniądze) i sprawdź:
- przekierowanie na stronę z podziękowaniem i pobieranie,
- mail od Resend (sprawdź też spam),
- Stripe → Webhooks → zdarzenie ma status 200.

### 7. Piksel TikToka (opcjonalnie)
TikTok Ads Manager → Events → Web → utwórz piksel → wklej ID do `config.js` → `tiktokPixel`. Baner cookies pojawi się wtedy sam (piksel ładuje się dopiero po „Aceptar”, zgodnie z RGPD). Zdarzenia: `ViewContent` po wejściu, `InitiateCheckout` po kliknięciu „comprar”, `CompletePayment` na stronie z podziękowaniem.

---

## Do sprawdzenia z księgową (nie da się tego załatwić kodem)
- **VAT przy sprzedaży do Hiszpanii (B2C, usługi elektroniczne):** do 10 000 € rocznej sprzedaży B2C do innych krajów UE zwykle stosujesz zasady polskie; powyżej tego progu VAT kraju klientki (w Hiszpanii e-booki mają obniżoną stawkę) rozliczany przez OSS. Cena 17 € jest podana jako „precio final”, więc ewentualny VAT jest w środku.
- Faktury/ewidencja sprzedaży dla zagranicznych klientek.

## Zmiana danych sprzedawcy / tekstów prawnych
Edytuj zmienne na górze `_legal/gen.py` i uruchom `python3 _legal/gen.py`. Strony w `public/` wygenerują się od nowa.
