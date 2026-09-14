// Cloudflare Pages Function — endpoint auth untuk Decap CMS
// Login pakai username/password admin (bukan OAuth GitHub).
// Guru tidak perlu punya akun GitHub; semua commit memakai PAT server-side.
export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  if (request.method === 'POST') {
    const form = await request.formData()
    const user = String(form.get('username') || '').trim()
    const pass = String(form.get('password') || '')

    if (!env.MIN2KP_ADMIN_USER || !env.MIN2KP_ADMIN_PASS || !env.MIN2KP_GH_SCHOOL_PAT) {
      return loginPage('Autentikasi belum dikonfigurasi. Hubungi pengelola situs.')
    }
    if (!safeEqual(user, env.MIN2KP_ADMIN_USER) || !safeEqual(pass, env.MIN2KP_ADMIN_PASS)) {
      return loginPage('Username atau password salah.')
    }

    const payload = JSON.stringify({ token: env.MIN2KP_GH_SCHOOL_PAT, provider: 'github' })
    const msg = 'authorization:github:success:' + payload
    return page(`authorize(${JSON.stringify(msg)})`)
  }

  // GET: tampilkan form login (dipanggil dari popup authorize Decap)
  return loginPage(null)
}

// Bandingkan string pakai operasi constant-waktu (anti timing attack).
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ba = new TextEncoder().encode(a)
  const bb = new TextEncoder().encode(b)
  if (ba.length !== bb.length) return false
  let diff = 0
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i]
  return diff === 0
}

function loginPage(error) {
  const errHtml = error ? `<p class="err">${esc(error)}</p>` : ''
  const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Masuk Admin</title><style>
  body{font-family:system-ui,sans-serif;background:#f1f5f9;display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center}
  .card{background:#fff;border-radius:12px;padding:28px;width:min(360px,90vw);box-shadow:0 10px 30px rgba(0,0,0,.1)}
  h1{font-size:20px;margin:0 0 4px;color:#0f172a}
  p.sub{color:#64748b;font-size:13px;margin:0 0 16px}
  label{display:block;font-size:13px;font-weight:600;color:#334155;margin:12px 0 4px}
  input{width:100%;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px}
  button{width:100%;margin-top:18px;padding:11px;border:0;border-radius:8px;background:#065f46;color:#fff;font-size:15px;font-weight:600;cursor:pointer}
  .err{color:#b91c1c;font-size:13px;border:1px solid #fecaca;background:#fef2f2;padding:8px 10px;border-radius:8px;margin:12px 0 0}
  </style></head><body><div class="card">
  <h1>Masuk Admin</h1><p class="sub">Hanya untuk pengelola situs MIN 2 Kulon Progo.</p>
  <form method="post" action="">
    <label for="u">Username</label><input id="u" name="username" autocomplete="username" required autofocus/>
    <label for="p">Password</label><input id="p" name="password" type="password" autocomplete="current-password" required/>
    ${errHtml}
    <button type="submit">Masuk</button>
  </form></div></body></html>`
  return new Response(html, {
    status: error ? 401 : 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
    },
  })
}

function page(script) {
  const html = `<!DOCTYPE html><html><body><script>
function authorize(msg) {
  var win = window.opener;
  if (!win) { document.body.textContent = 'Selesai. Silakan tutup tab ini.'; return; }
  // Fase 1: handshake (Decap menunggu ini untuk attach authorizeCallback)
  win.postMessage('authorizing:github', '*');
  // Fase 2: kirim token setelah Decap siap
  window.setTimeout(function(){ win.postMessage(msg, '*'); }, 1200);
  window.setTimeout(function(){ window.close(); }, 2600);
}
${script}
</script></body></html>`
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
    },
  })
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
