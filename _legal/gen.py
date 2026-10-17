# -*- coding: utf-8 -*-
# Generuje strony prawne ze wspólnym szablonem. Uruchom: python3 _legal/gen.py
import os
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")

SELLER = "Jakub Gugulski"
NIP = "6821811984"
ADDR = "Ratajów 30, 32-090 Słomniki (Polonia)"
EMAIL = "nosoytumadre.es@gmail.com"
SITE = "nosoytumadre.com"
UPD = "17 de octubre de 2026"

def page(slug, title, body):
    html = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · No soy tu madre</title><meta name="robots" content="noindex,follow">
<link rel="icon" href="/assets/favicon.ico"><link rel="stylesheet" href="/assets/style.css"></head>
<body><main class="page"><a class="back" href="/">← Volver</a><h1>{title}</h1><p class="upd">Última actualización: {UPD}</p>
{body}
</main><footer><div class="wrap"><div class="links"><a href="/aviso-legal">Aviso legal</a><a href="/privacidad">Privacidad</a><a href="/condiciones">Condiciones de venta</a><a href="/cookies">Cookies</a></div><div>© 2026 No soy tu madre</div></div></footer>
<script src="/assets/config.js"></script></body></html>"""
    open(os.path.join(D, slug + ".html"), "w", encoding="utf-8").write(html)

ID = f"""<ul>
<li><strong>Titular:</strong> {SELLER} (empresario individual)</li>
<li><strong>NIF polaco (NIP):</strong> {NIP}</li>
<li><strong>Domicilio:</strong> {ADDR}</li>
<li><strong>Registro:</strong> inscrito en el Registro Central de Actividades Económicas de Polonia (CEIDG)</li>
<li><strong>Email:</strong> <a href="mailto:{EMAIL}">{EMAIL}</a></li>
</ul>"""

page("aviso-legal", "Aviso legal", f"""
<h2>1. Datos identificativos</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular del sitio web {SITE}:</p>
{ID}
<h2>2. Objeto</h2>
<p>Este sitio web ofrece información sobre el ebook «No soy tu madre» y permite comprarlo. La compra se rige por las <a href="/condiciones">Condiciones de venta</a>.</p>
<h2>3. Propiedad intelectual</h2>
<p>Los textos, el diseño, los logotipos y el ebook son propiedad del titular o se usan con licencia. Queda prohibida su reproducción, distribución o comunicación pública sin autorización expresa, salvo los usos permitidos por la ley.</p>
<h2>4. Responsabilidad</h2>
<p>El titular procura que la información del sitio sea correcta y esté actualizada, pero no garantiza la ausencia de errores. El contenido del sitio y del ebook tiene carácter orientativo sobre la convivencia en pareja y no sustituye el consejo de profesionales de la salud mental, la medicina o el derecho.</p>
<p>Si sufres violencia de género, puedes llamar al 016 (gratuito, 24 horas) o escribir por WhatsApp al 600 000 016. En caso de emergencia, llama al 112.</p>
<h2>5. Enlaces</h2>
<p>El sitio puede contener enlaces a sitios de terceros (por ejemplo, la pasarela de pago). El titular no se responsabiliza de sus contenidos ni de sus políticas.</p>
<h2>6. Legislación aplicable</h2>
<p>Este aviso legal se rige por la normativa de la Unión Europea y por la legislación aplicable. Si eres consumidora, conservas siempre la protección que te otorgan las normas imperativas de tu país de residencia.</p>
""")

page("privacidad", "Política de privacidad", f"""
<p>En esta política te explicamos qué datos personales tratamos, para qué y cuáles son tus derechos, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>
<h2>1. Responsable del tratamiento</h2>
{ID}
<h2>2. Qué datos tratamos</h2>
<ul>
<li><strong>Datos de compra:</strong> nombre, email, país y datos del pago. Los datos de tu tarjeta los gestiona directamente Stripe; nosotros no los vemos ni los guardamos.</li>
<li><strong>Datos de contacto:</strong> lo que nos escribas por email.</li>
<li><strong>Datos de navegación:</strong> solo si aceptas las cookies de medición (ver la <a href="/cookies">Política de cookies</a>).</li>
</ul>
<h2>3. Para qué y con qué base legal</h2>
<table>
<tr><th>Finalidad</th><th>Base legal</th></tr>
<tr><td>Gestionar tu compra y enviarte el ebook y el enlace de descarga</td><td>Ejecución del contrato (art. 6.1.b RGPD)</td></tr>
<tr><td>Emitir facturas y cumplir obligaciones fiscales y contables</td><td>Obligación legal (art. 6.1.c RGPD)</td></tr>
<tr><td>Atender tus consultas, reclamaciones y la garantía</td><td>Ejecución del contrato e interés legítimo (art. 6.1.b y f RGPD)</td></tr>
<tr><td>Medir qué campañas funcionan (píxel de TikTok)</td><td>Tu consentimiento (art. 6.1.a RGPD), que puedes retirar cuando quieras</td></tr>
</table>
<p>No enviamos publicidad por email sin tu consentimiento previo y no tomamos decisiones automatizadas con efectos jurídicos sobre ti.</p>
<h2>4. Cuánto tiempo los guardamos</h2>
<p>Los datos de compra se conservan mientras sea necesario para la relación contractual y, después, durante los plazos que exige la normativa fiscal y contable (en general, 5 años desde el final del año de la operación según la ley polaca), y el tiempo necesario para atender posibles reclamaciones. Las consultas por email se conservan mientras se gestionan y durante el plazo de posibles reclamaciones.</p>
<h2>5. Con quién los compartimos</h2>
<p>Solo con proveedores que necesitamos para darte el servicio, que actúan como encargados del tratamiento o como responsables independientes en el caso de los pagos:</p>
<ul>
<li><strong>Stripe</strong> (procesamiento de pagos).</li>
<li><strong>Resend</strong> (envío del email con tu ebook).</li>
<li><strong>Vercel</strong> (alojamiento de la web).</li>
<li><strong>TikTok</strong> (medición, solo si aceptas las cookies).</li>
<li>Asesoría contable y autoridades fiscales, cuando la ley lo exija.</li>
</ul>
<p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo (por ejemplo, en EE. UU.). En esos casos, las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>
<h2>6. Tus derechos</h2>
<p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar tu consentimiento en cualquier momento, escribiendo a <a href="mailto:{EMAIL}">{EMAIL}</a>. Te responderemos en el plazo de un mes.</p>
<p>Si consideras que no hemos tratado bien tus datos, puedes reclamar ante la autoridad de control de tu país de residencia. En España es la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener">www.aepd.es</a>); en Polonia, donde está establecido el responsable, es la Oficina de Protección de Datos Personales (UODO, <a href="https://uodo.gov.pl" rel="noopener">uodo.gov.pl</a>).</p>
<h2>7. Seguridad</h2>
<p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos, como conexiones cifradas (HTTPS) y el acceso restringido a la información de compra.</p>
""")

page("condiciones", "Condiciones de venta", f"""
<p>Estas condiciones regulan la compra del ebook «No soy tu madre» a través de {SITE}. Al comprar, declaras haberlas leído y aceptado.</p>
<h2>1. Vendedor</h2>
{ID}
<h2>2. Producto</h2>
<p>Ebook en formato PDF (aprox. 40 páginas) titulado «No soy tu madre», con dos bonus incluidos: «Respuestas rápidas» y «Checklist de 14 días». Es un contenido digital que se entrega sin soporte material.</p>
<h2>3. Precio y pago</h2>
<p>El precio es de <strong>17 € (pago único)</strong> y es el precio final que pagas, impuestos aplicables incluidos, sin gastos de envío. El pago se realiza a través de Stripe con los métodos que se muestran en la página de pago. Recibirás la confirmación de la compra por email.</p>
<h2>4. Proceso de compra</h2>
<ol>
<li>Pulsa el botón de compra en la web.</li>
<li>Introduce tus datos y paga en la página segura de Stripe.</li>
<li>Al confirmarse el pago, se te redirige a la página de descarga y recibes un email con el enlace al ebook.</li>
</ol>
<p>El contrato se formaliza en español. Puedes guardar o imprimir estas condiciones en cualquier momento.</p>
<h2>5. Entrega</h2>
<p>La entrega es inmediata tras confirmarse el pago, mediante descarga en la web y un enlace enviado por email. Si no lo recibes en unos minutos, revisa la carpeta de spam o escríbenos a <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
<h2>6. Derecho de desistimiento</h2>
<p>Por tratarse de contenido digital que no se presta en soporte material, y conforme al artículo 103 m) del Real Decreto Legislativo 1/2007 (TRLGDCU) y al artículo 16 m) de la Directiva 2011/83/UE, <strong>no hay derecho de desistimiento</strong> una vez iniciada la descarga o el acceso, siempre que hayas dado tu consentimiento expreso para recibir el ebook de inmediato y hayas reconocido que con ello pierdes ese derecho. Este consentimiento se recoge al realizar la compra y se confirma en el email de compra.</p>
<h2>7. Garantía voluntaria de satisfacción (14 días)</h2>
<p>Además de tus derechos legales, te ofrecemos una garantía comercial: si en los 14 días siguientes a la compra consideras que el ebook no te sirve, escríbenos a <a href="mailto:{EMAIL}">{EMAIL}</a> desde el email con el que compraste y te devolveremos el importe íntegro, por el mismo medio de pago, en un plazo máximo de 14 días. No hace falta que des explicaciones.</p>
<h2>8. Conformidad y reclamaciones</h2>
<p>Si el archivo no se descarga, está dañado o no coincide con lo descrito, tienes derecho a que se subsane o, en su defecto, a la reducción del precio o la resolución del contrato, conforme a la ley. Escríbenos a <a href="mailto:{EMAIL}">{EMAIL}</a> y te responderemos lo antes posible y, en todo caso, en un plazo máximo de 14 días.</p>
<h2>9. Uso del ebook</h2>
<p>El ebook es para tu uso personal. No está permitido revenderlo, compartirlo públicamente ni distribuirlo sin autorización. Su contenido tiene carácter orientativo y no sustituye la ayuda profesional (psicológica, médica o legal).</p>
<h2>10. Ley aplicable</h2>
<p>Estas condiciones se rigen por la legislación de la Unión Europea aplicable. Si eres consumidora con residencia habitual en otro Estado miembro, como España, conservas la protección que te otorgan las normas imperativas de tu país, y puedes acudir a los tribunales de tu domicilio.</p>
""")

page("cookies", "Política de cookies", f"""
<h2>1. Qué son</h2>
<p>Las cookies y tecnologías similares son pequeños archivos o datos que se guardan en tu navegador cuando visitas una web.</p>
<h2>2. Cuáles usamos</h2>
<table>
<tr><th>Nombre</th><th>Tipo</th><th>Finalidad</th><th>Duración</th></tr>
<tr><td>nstm_consent (almacenamiento local)</td><td>Técnica, propia</td><td>Recordar si has aceptado o rechazado las cookies</td><td>Hasta que la borres</td></tr>
<tr><td>_ttp, ttclid y similares</td><td>Análisis y publicidad, de TikTok</td><td>Medir qué contenidos de TikTok te traen a la web y si se realiza una compra</td><td>Hasta 13 meses</td></tr>
</table>
<p>Las cookies de TikTok <strong>solo se activan si pulsas «Aceptar»</strong> en el aviso de cookies. Si las rechazas, la web funciona con normalidad.</p>
<p>La página de pago la gestiona Stripe en su propio dominio, con sus propias cookies técnicas necesarias para procesar el pago de forma segura.</p>
<h2>3. Cómo cambiar tu elección</h2>
<p>Puedes cambiar tu elección en cualquier momento: <a href="#" onclick="nstmResetConsent&&nstmResetConsent();return false;">volver a mostrar el aviso de cookies</a>. También puedes borrar las cookies desde la configuración de tu navegador.</p>
<h2>4. Más información</h2>
<p>Responsable: {SELLER}. Más detalles sobre el tratamiento de tus datos en la <a href="/privacidad">Política de privacidad</a>. Política de TikTok: <a href="https://www.tiktok.com/legal/privacy-policy-eea" rel="noopener">tiktok.com/legal/privacy-policy-eea</a>.</p>
<script src="/assets/app.js"></script>
""")
print("ok")
