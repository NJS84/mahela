/**
 * Contact form handler (Cloudflare Pages Function, POST /api/contact).
 *
 * Environment variables (set in Cloudflare Pages > Settings > Variables, never committed):
 *   RESEND_API_KEY    Resend API key
 *   CONTACT_TO        Inbox that receives enquiries (comma-separated for several)
 *   CONTACT_FROM      Verified Resend sender, e.g. "Mahela website <web@mahela.co.za>"
 *   TURNSTILE_SECRET  Cloudflare Turnstile secret key
 */
interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  TURNSTILE_SECRET?: string;
}

type Ctx = { request: Request; env: Env };

const TOPICS = ['Export and programmes', 'Produce', 'Nursery trees', 'Mahela Game', 'Careers', 'Media', 'Other'];

function reply(req: Request, status: number, body: { ok: boolean; error?: string }) {
  const wantsJson = (req.headers.get('accept') ?? '').includes('application/json');
  if (wantsJson) return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  const to = body.ok ? '/contact-us?sent=1#form' : `/contact-us?error=${encodeURIComponent(body.error ?? 'error')}#form`;
  return new Response(null, { status: 303, headers: { location: to } });
}

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);

export const onRequestPost = async ({ request, env }: Ctx) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, 400, { ok: false, error: 'invalid' });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (clean(form.get('website'), 200)) return reply(request, 200, { ok: true });

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200);
  const company = clean(form.get('company'), 160);
  const phone = clean(form.get('phone'), 40);
  const country = clean(form.get('country'), 80);
  const topic = TOPICS.includes(clean(form.get('topic'), 60)) ? clean(form.get('topic'), 60) : 'Other';
  const message = clean(form.get('message'), 5000);
  const consent = form.get('consent') === 'yes';

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !consent) {
    return reply(request, 422, { ok: false, error: 'validation' });
  }

  if (env.TURNSTILE_SECRET) {
    const token = clean(form.get('cf-turnstile-response'), 4096);
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('cf-connecting-ip') ?? '' }),
    });
    const result = (await verify.json()) as { success?: boolean };
    if (!result.success) return reply(request, 403, { ok: false, error: 'captcha' });
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return reply(request, 503, { ok: false, error: 'config' });
  }

  const details = [['Name', name], ['Email', email], ['Company', company], ['Phone', phone], ['Country', country], ['Topic', topic]]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  const text = [...details, '', message, '', '— Sent from the contact form on www.mahela.co.za (POPIA consent given)'].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `Website enquiry: ${topic} from ${name}${company ? ` (${company})` : ''}`,
      text,
    }),
  });
  if (!res.ok) return reply(request, 502, { ok: false, error: 'send' });
  return reply(request, 200, { ok: true });
};

export const onRequest = async () => new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
