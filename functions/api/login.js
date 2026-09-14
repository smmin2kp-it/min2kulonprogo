// Cloudflare Pages Function — API Login JSON untuk Admin
// Menerima form POST username & password, mengembalikan PAT GitHub jika valid.
export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const form = await request.formData()
    const user = String(form.get('username') || '').trim()
    const pass = String(form.get('password') || '')

    if (!env.MIN2KP_ADMIN_USER || !env.MIN2KP_ADMIN_PASS || !env.MIN2KP_GH_SCHOOL_PAT) {
      return jsonResponse({ ok: false, message: 'Autentikasi belum dikonfigurasi pada server.' }, 500)
    }

    if (!safeEqual(user, env.MIN2KP_ADMIN_USER) || !safeEqual(pass, env.MIN2KP_ADMIN_PASS)) {
      return jsonResponse({ ok: false, message: 'Username atau password salah.' }, 401)
    }

    // Sukses: kembalikan token ke browser untuk disimpan di localStorage
    return jsonResponse({ ok: true, token: env.MIN2KP_GH_SCHOOL_PAT })
  } catch (err) {
    return jsonResponse({ ok: false, message: 'Terjadi kesalahan pada server.' }, 500)
  }
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ba = new TextEncoder().encode(a)
  const bb = new TextEncoder().encode(b)
  if (ba.length !== bb.length) return false
  let diff = 0
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i]
  return diff === 0
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
    },
  })
}
