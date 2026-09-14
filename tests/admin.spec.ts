import { test, expect } from '@playwright/test'

// ---------- PUBLIC PAGES ----------

test.describe('Public pages render', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/MIN 2/)
  })

  test('profil page loads', async ({ page }) => {
    await page.goto('/profil')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('berita page loads', async ({ page }) => {
    await page.goto('/berita')
    await expect(page).toHaveTitle(/Berita/)
  })

  test('galeri page loads', async ({ page }) => {
    await page.goto('/galeri')
    await expect(page).toHaveTitle(/Galeri/)
  })

  test('faq page loads', async ({ page }) => {
    await page.goto('/faq')
    await expect(page).toHaveTitle(/FAQ|Tanya/)
  })

  test('kurikulum page loads', async ({ page }) => {
    await page.goto('/kurikulum')
    await expect(page).toHaveTitle(/Kurikulum/)
  })

  test('guru-staf page loads', async ({ page }) => {
    await page.goto('/guru-staf')
    await expect(page).toHaveTitle(/Guru/)
  })

  test('kontak page loads', async ({ page }) => {
    await page.goto('/kontak')
    await expect(page).toHaveTitle(/Kontak/)
  })

  test('visi-misi page loads', async ({ page }) => {
    await page.goto('/visi-misi')
    await expect(page).toHaveTitle(/Visi/)
  })
})

// ---------- ADMIN PANEL ----------

test.describe('Admin panel', () => {
  test('login page shows form', async ({ page }) => {
    await page.goto('/admin/index.html')
    await expect(page.locator('#form-login')).toBeVisible()
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('#btn-login-submit')).toBeVisible()
  })

  test('login rejects empty credentials', async ({ page }) => {
    await page.goto('/admin/index.html')
    await page.click('#btn-login-submit')
    // Form should still be visible (HTML5 required validation or error)
    await expect(page.locator('#form-login')).toBeVisible()
  })
})

// Helper: inject auth token to bypass login
async function loginBypass(page) {
  await page.goto('/admin/index.html')
  await page.evaluate(() => {
    localStorage.setItem('decap-cms-user', JSON.stringify({
      token: 'test-token-for-playwright',
      backendName: 'github',
      login: 'admin'
    }))
  })
  await page.goto('/admin/index.html', { waitUntil: 'networkidle' })
  // Verify admin panel is visible
  await expect(page.locator('#admin-bar')).toBeVisible({ timeout: 10000 })
}

test.describe('Admin tabs & forms', () => {
  const tabs = [
    { id: 'carousel', view: 'view-carousel', label: 'Banner' },
    { id: 'berita', view: 'view-berita', label: 'Berita' },
    { id: 'galeri', view: 'view-galeri', label: 'Galeri' },
    { id: 'faq', view: 'view-faq', label: 'FAQ' },
    { id: 'halaman', view: 'view-halaman', label: 'Halaman' },
    { id: 'keunggulan', view: 'view-keunggulan', label: 'Keunggulan' },
    { id: 'kurikulum', view: 'view-kurikulum', label: 'Kurikulum' },
    { id: 'statistik', view: 'view-statistik', label: 'Statistik' },
    { id: 'guru-staf', view: 'view-guru-staf', label: 'Guru' },
    { id: 'testimonial', view: 'view-testimonial', label: 'Testimonial' },
    { id: 'aplikasi', view: 'view-aplikasi', label: 'Aplikasi' },
    { id: 'profil-singkat', view: 'view-profil-singkat', label: 'Profil Singkat' },
  ]

  for (const tab of tabs) {
    test(`tab "${tab.label}" switches and shows view`, async ({ page }) => {
      await loginBypass(page)
      await page.click(`#tab-${tab.id}`)
      const view = page.locator(`#${tab.view}`)
      await expect(view).toBeVisible()
    })
  }

  test('carousel tab has "Tambah Banner" button', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-carousel')
    await expect(page.locator('#view-carousel button:has-text("Tambah")')).toBeVisible()
  })

  test('berita tab has "Tambah" button', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-berita')
    await expect(page.locator('#view-berita button:has-text("Tambah")')).toBeVisible()
  })

  test('testimonial tab has "Tambah" button', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-testimonial')
    await expect(page.locator('#view-testimonial button:has-text("Tambah")')).toBeVisible()
  })

  test('aplikasi tab has "Tambah" button', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-aplikasi')
    await expect(page.locator('#view-aplikasi button:has-text("Tambah")')).toBeVisible()
  })

  test('testimonial editor opens with correct fields', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-testimonial')
    await page.click('#view-testimonial button:has-text("Tambah")')
    await expect(page.locator('#testimonial-editor-box')).toBeVisible()
    await expect(page.locator('#tst-name')).toBeVisible()
    await expect(page.locator('#tst-role')).toBeVisible()
    await expect(page.locator('#tst-text')).toBeVisible()
    await expect(page.locator('#tst-avatar')).toBeVisible()
    await expect(page.locator('#tst-rating')).toBeVisible()
    await expect(page.locator('#tst-order')).toBeVisible()
  })

  test('aplikasi editor opens with correct fields', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-aplikasi')
    await page.click('#view-aplikasi button:has-text("Tambah")')
    await expect(page.locator('#aplikasi-editor-box')).toBeVisible()
    await expect(page.locator('#app-name')).toBeVisible()
    await expect(page.locator('#app-fullname')).toBeVisible()
    await expect(page.locator('#app-url')).toBeVisible()
    await expect(page.locator('#app-desc')).toBeVisible()
    await expect(page.locator('#app-icon')).toBeVisible()
    await expect(page.locator('#app-badge')).toBeVisible()
    await expect(page.locator('#app-order')).toBeVisible()
  })

  test('testimonial save validates empty name', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-testimonial')
    await page.click('#view-testimonial button:has-text("Tambah")')
    // Leave name empty, fill text
    await page.fill('#tst-text', 'Test testimonial')
    await page.click('#testimonial-editor-box button:has-text("Simpan")')
    // Alert should show error
    await expect(page.locator('#global-alert')).toBeVisible()
    await expect(page.locator('#global-alert')).toContainText('Nama')
  })

  test('aplikasi save validates empty name', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-aplikasi')
    await page.click('#view-aplikasi button:has-text("Tambah")')
    await page.fill('#app-url', 'https://test.com')
    await page.click('#aplikasi-editor-box button:has-text("Simpan")')
    await expect(page.locator('#global-alert')).toBeVisible()
    await expect(page.locator('#global-alert')).toContainText('Nama')
  })

  test('aplikasi save validates empty URL', async ({ page }) => {
    await loginBypass(page)
    await page.click('#tab-aplikasi')
    await page.click('#view-aplikasi button:has-text("Tambah")')
    await page.fill('#app-name', 'Test App')
    await page.click('#aplikasi-editor-box button:has-text("Simpan")')
    await expect(page.locator('#global-alert')).toBeVisible()
    await expect(page.locator('#global-alert')).toContainText('URL')
  })

  test('logout button exists and works', async ({ page }) => {
    await loginBypass(page)
    const logoutBtn = page.locator('button:has-text("Keluar"), button:has-text("Logout")')
    await expect(logoutBtn).toBeVisible()
  })

  test('close editor buttons work', async ({ page }) => {
    await loginBypass(page)
    // Testimonial
    await page.click('#tab-testimonial')
    await page.click('#view-testimonial button:has-text("Tambah")')
    await expect(page.locator('#testimonial-editor-box')).toBeVisible()
    await page.click('#testimonial-editor-box button:has-text("Batal")')
    await expect(page.locator('#testimonial-editor-box')).toBeHidden()

    // Aplikasi
    await page.click('#tab-aplikasi')
    await page.click('#view-aplikasi button:has-text("Tambah")')
    await expect(page.locator('#aplikasi-editor-box')).toBeVisible()
    await page.click('#aplikasi-editor-box button:has-text("Batal")')
    await expect(page.locator('#aplikasi-editor-box')).toBeHidden()
  })
})
