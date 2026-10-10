# Rencana Implementasi: To-Do List Life Dashboard

## Ikhtisar

Implementasi To-Do List Life Dashboard sebagai aplikasi web satu halaman (SPA) yang berjalan sepenuhnya di sisi klien menggunakan HTML5, CSS3, dan Vanilla JavaScript ES6+ tanpa framework, library, atau backend apapun. Semua data disimpan di `localStorage`. Implementasi mengikuti 7 tahap berurutan: Fondasi → Greeting → Theme → To-Do List → Pomodoro Timer → Quick Links → Integrasi.

---

## Tugas

- [ ] 1. Tahap 1 — Fondasi
  - Membangun kerangka HTML, CSS, dan Storage Manager sebagai pondasi seluruh fitur.

  - [ ] 1.1 Kerangka HTML
    - Buat struktur HTML lengkap di `index.html` dengan `<!DOCTYPE html>`, atribut `lang="id"`, dan `data-theme="light"` pada elemen `<html>`
    - Sertakan `<link rel="stylesheet" href="css/style.css">` di `<head>` dan `<script src="js/script.js">` sebelum penutup `</body>`
    - Buat `<header class="app-header">` berisi `<button id="theme-toggle" aria-label="Toggle tema">☀️</button>`
    - Buat `<section id="greeting-widget" class="widget">` berisi: `#greeting-text` (dengan `<span id="user-name">`), `#edit-name-btn`, `#edit-name-form` (atribut `hidden`), `#name-input`, `#save-name-btn`, `#cancel-name-btn`, `#current-date`, `#current-time`
    - Buat `<main class="dashboard-grid">` berisi tiga section widget:
      - `<section id="todo-widget" class="widget">` dengan `#todo-input`, `#todo-add-btn`, `#todo-warning` (hidden), `#todo-list`
      - `<section id="pomodoro-widget" class="widget">` dengan `#pomodoro-display` (isi awal "25:00"), `#pomodoro-done-msg` (hidden), `#pomodoro-start`, `#pomodoro-stop`, `#pomodoro-reset`
      - `<section id="quicklinks-widget" class="widget">` dengan `#link-name-input`, `#link-url-input`, `#link-add-btn`, `#link-warning` (hidden), `#quicklinks-list`
    - Tambahkan atribut `aria-label` yang sesuai pada semua tombol interaktif
    - _Requirements: Req 16.1_

  - [ ] 1.2 CSS Dasar dan Variabel Tema
    - Definisikan CSS custom properties pada `:root` untuk Tema Terang: `--bg-primary: #f5f5f5`, `--bg-widget: #ffffff`, `--text-primary: #1a1a1a`, `--text-secondary: #555555`, `--accent-color: #4a90e2`, `--border-color: #e0e0e0`
    - Definisikan CSS custom properties pada `[data-theme="dark"]` untuk Tema Gelap: `--bg-primary: #1a1a2e`, `--bg-widget: #16213e`, `--text-primary: #e0e0e0`, `--text-secondary: #a0a0b0`, `--accent-color: #6fa8dc`, `--border-color: #2a2a4a`
    - Terapkan variabel ke `body` (background, color), `.widget` (background, border, border-radius, padding, box-shadow)
    - Tambahkan reset CSS: `*, *::before, *::after { box-sizing: border-box; }`, `margin: 0`, `font-family` sans-serif
    - Tambahkan transisi tema halus: `transition: background-color 0.3s ease, color 0.3s ease` pada `body` dan `.widget`
    - _Requirements: Req 14, Req 15_

  - [ ] 1.3 CSS Layout Grid Responsif
    - Style `.app-header`: `display: flex`, `justify-content: flex-end`, `padding: 0.75rem 1rem`, background menggunakan `var(--bg-widget)`
    - Style `#greeting-widget`: `text-align: center`, `padding: 1.5rem`, `margin-bottom: 1rem`
    - Style `.dashboard-grid`: `display: grid`, `gap: 1rem`, `padding: 0 1rem 1rem`
    - Media query `@media (max-width: 767px)` → `.dashboard-grid { grid-template-columns: 1fr; }`
    - Media query `@media (min-width: 768px)` → `.dashboard-grid { grid-template-columns: 1fr 1fr; }`
    - Media query `@media (min-width: 1024px)` → `.dashboard-grid { max-width: 1200px; margin: 0 auto; }`
    - Style `button`: `min-width: 44px`, `min-height: 44px`, `cursor: pointer`, menggunakan variabel warna
    - _Requirements: Req 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 1.4 Storage Manager di JavaScript
    - Tambahkan komentar pemisah bagian di `js/script.js`: `// === KONSTANTA ===`, `// === STORAGE MANAGER ===`, dst.
    - Definisikan `const STORAGE_KEYS = { USER_NAME: 'userName', POMODORO: 'pomodoroState', TODOS: 'todos', LINKS: 'quickLinks', THEME: 'theme' }` dan `const POMODORO_DURATION = 1500`
    - Tulis `storageGet(key)`: `localStorage.getItem(key)` dibungkus `try/catch`, kembalikan `null` jika error
    - Tulis `storageSet(key, value)`: `localStorage.setItem(key, JSON.stringify(value))` dibungkus `try/catch`; jika `value` sudah string, gunakan langsung
    - Tulis `storageGetArray(key)`: parse JSON dari `localStorage`, kembalikan `[]` jika tidak ada, bukan array, atau corrupt (catch)
    - Tulis `storageGetObject(key, defaultValue)`: parse JSON, kembalikan `defaultValue` jika tidak ada atau corrupt
    - **Verifikasi Tahap 1:** Buka browser → DevTools Console → `storageSet('test', 'halo')` → `storageGet('test')` harus mengembalikan `'halo'` → `storageGetArray('kosong')` harus mengembalikan `[]` → `storageGetObject('kosong', {a:1})` harus mengembalikan `{a:1}`
    - _Requirements: Req 16.4_

- [ ] 2. Tahap 2 — Greeting Widget
  - Membangun tampilan jam real-time, sapaan dinamis, dan manajemen nama pengguna.

  - [ ] 2.1 Tampilan Jam dan Tanggal Real-Time
    - Tambahkan bagian `// === GREETING ===` di `js/script.js`
    - Tulis fungsi `updateClock()`:
      - Buat `const now = new Date()`
      - Format tanggal Indonesia: `now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })` → update `#current-date`
      - Format jam: `now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })` → update `#current-time`
      - Panggil juga `getGreeting()` untuk memperbarui sapaan (akan diimplementasi di 2.2)
    - Di fungsi `init()` (akan dibuat di Tahap 7), `updateClock()` harus dipanggil sekali segera, lalu `setInterval(updateClock, 1000)` untuk pembaruan tiap detik
    - _Requirements: Req 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.2 Sapaan Dinamis
    - Tulis pure function `getGreeting(hour)`:
      - `hour >= 5 && hour <= 11` → `"Selamat Pagi"`
      - `hour >= 12 && hour <= 14` → `"Selamat Siang"`
      - `hour >= 15 && hour <= 17` → `"Selamat Sore"`
      - Selainnya (18–23 dan 0–4) → `"Selamat Malam"`
    - Di dalam `updateClock()`, ambil `new Date().getHours()` dan perbarui teks sapaan di `#greeting-text` agar menampilkan `"[Sapaan], [Nama]"` — nama diambil dari `#user-name`
    - _Requirements: Req 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 2.3 Nama Pengguna yang Dapat Diubah
    - Tulis `loadUserName()`: baca `STORAGE_KEYS.USER_NAME` via `storageGet()`, fallback ke `"Pengguna"` jika null atau string kosong, update `#user-name`
    - Tulis `saveUserName(name)`: jika `name.trim()` kosong simpan `"Pengguna"`, lainnya simpan `name.trim()` via `storageSet()`, perbarui `#user-name`
    - Tulis `activateEditName()`: isi `#name-input` dengan teks `#user-name` saat ini, tampilkan `#edit-name-form` (hapus atribut `hidden`), sembunyikan `#edit-name-btn`, fokus ke `#name-input`
    - Tulis `confirmEditName()`: baca nilai `#name-input`, panggil `saveUserName(value)`, sembunyikan `#edit-name-form`, tampilkan `#edit-name-btn`
    - Tulis `cancelEditName()`: sembunyikan `#edit-name-form`, tampilkan `#edit-name-btn`
    - **Verifikasi Tahap 2:** Buka browser → jam bergerak setiap detik → tanggal tampil format Indonesia → sapaan sesuai jam → klik ✏️ → ketik nama → Simpan → sapaan diperbarui → kosongkan nama → Simpan → kembali ke "Pengguna" → refresh → nama tersimpan
    - _Requirements: Req 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Tahap 3 — Theme Manager
  - Membangun toggle tema terang/gelap dengan persistensi dan pencegahan FOUC.

  - [ ] 3.1 Fungsi applyTheme, loadTheme, toggleTheme
    - Tambahkan bagian `// === THEME MANAGER ===` di `js/script.js`
    - Tulis `applyTheme(theme)`:
      - `document.documentElement.setAttribute('data-theme', theme)`
      - Update ikon `#theme-toggle`: tampilkan `"🌙"` jika `theme === 'light'` (menunjukkan opsi gelap), tampilkan `"☀️"` jika `theme === 'dark'`
      - **TIDAK** menulis ke `localStorage`
    - Tulis `loadTheme()`:
      - Baca `STORAGE_KEYS.THEME` via `storageGet()`
      - Validasi: jika bukan `"light"` atau `"dark"`, fallback ke `"light"`
      - Panggil `applyTheme(theme)`
    - Tulis `toggleTheme()`:
      - Baca tema aktif: `document.documentElement.getAttribute('data-theme')`
      - Balik: `"light"` → `"dark"` atau `"dark"` → `"light"`
      - Panggil `applyTheme(temaBaru)`
      - Simpan via `storageSet(STORAGE_KEYS.THEME, temaBaru)`
    - _Requirements: Req 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [ ] 3.2 CSS Style Komponen Tema
    - Pastikan semua warna di `css/style.css` menggunakan variabel CSS (tidak ada warna hardcode seperti `#fff` atau `black` di luar definisi variabel)
    - Tambahkan style `#theme-toggle`: `font-size: 1.25rem`, `background: transparent`, `border: 1px solid var(--border-color)`, `border-radius: 50%`
    - Tambahkan style `.warning-message`: `color: #e74c3c`, `font-size: 0.8rem`, `margin-top: 0.25rem`
    - Tambahkan style `#pomodoro-done-msg`: `color: var(--accent-color)`, `font-size: 0.9rem`, `text-align: center`
    - Tambahkan style `.todo-item.completed .todo-text`: `text-decoration: line-through`, `opacity: 0.6`
    - **Verifikasi Tahap 3:** Klik tombol tema → seluruh halaman berubah warna serentak tanpa flash → refresh → tema tersimpan → toggle dua kali → kembali ke tema awal → DevTools Console: jalankan pengujian Property 13 dan Property 14 dari design.md

- [ ] 4. Tahap 4 — To-Do List
  - Membangun fitur daftar tugas lengkap: tambah, edit, toggle selesai, hapus, validasi, dan persistensi.

  - [ ] 4.1 Load dan Render Daftar Tugas
    - Tambahkan bagian `// === TODO LIST ===` di `js/script.js`
    - Deklarasikan `let todos = []` di lingkup modul
    - Tulis `loadTodos()`: baca `STORAGE_KEYS.TODOS` via `storageGetArray()`, simpan ke `todos`, panggil `renderTodos()`
    - Tulis `saveTodos()`: `storageSet(STORAGE_KEYS.TODOS, todos)`
    - Tulis `renderTodos()`:
      - Kosongkan `innerHTML` dari `#todo-list`
      - Untuk setiap todo, buat elemen `<li class="todo-item" data-id="[id]">` (tambah class `completed` jika `todo.completed === true`)
      - Di dalam `<li>`, buat: `<input type="checkbox" class="todo-checkbox">` (set `.checked` jika completed), `<span class="todo-text">[teks]</span>`, `<button class="todo-edit-btn" aria-label="Edit tugas">✏️</button>`, `<button class="todo-delete-btn" aria-label="Hapus tugas">🗑️</button>`
      - Tambahkan event listener: checkbox `change` → `toggleTodo(id)`, tombol edit `click` → `activateEditTodo(id)`, tombol hapus `click` → `deleteTodo(id)`
    - _Requirements: Req 11.1, 11.2, 11.3_

  - [ ] 4.2 Tambah Tugas dengan Validasi
    - Tulis `isDuplicateTodo(text, excludeId)`: iterasi `todos`, bandingkan `todo.text.toLowerCase().trim() === text.toLowerCase().trim()`, skip todo dengan `todo.id === excludeId`; kembalikan `true` jika ditemukan duplikat
    - Tulis `addTodo()`:
      - Baca `document.getElementById('todo-input').value`
      - Jika `value.trim() === ''`: tampilkan `"Tugas tidak boleh kosong."` di `#todo-warning` (hapus atribut `hidden`), `return`
      - Jika `isDuplicateTodo(value, null)` true: tampilkan `"Tugas sudah ada dalam daftar."` di `#todo-warning`, `return`
      - Buat objek `{ id: Date.now(), text: value.trim(), completed: false }`, push ke `todos`
      - `saveTodos()`, `renderTodos()`, kosongkan `#todo-input`, sembunyikan `#todo-warning`
    - _Requirements: Req 6.1, 6.2, 6.3, 6.4, 6.5, Req 7.1, 7.2, 7.3_

  - [ ] 4.3 Toggle Selesai dan Hapus Tugas
    - Tulis `toggleTodo(id)`:
      - Temukan todo dengan `todo.id === id` (perhatikan tipe data: `id` dari `data-id` adalah string, konversi dengan `Number()`)
      - Balik nilai `todo.completed`
      - `saveTodos()`, `renderTodos()`
    - Tulis `deleteTodo(id)`:
      - `todos = todos.filter(todo => todo.id !== id)`
      - `saveTodos()`, `renderTodos()`
    - _Requirements: Req 9.1, 9.2, 9.3, 9.4, Req 10.1, 10.2, 10.3_

  - [ ] 4.4 Edit Tugas
    - Tulis `activateEditTodo(id)`:
      - Temukan `<li>` dengan `data-id` yang cocok di `#todo-list`
      - Ganti konten inner dengan: `<input class="todo-edit-input" value="[teks saat ini]">`, `<button class="todo-confirm-edit-btn" aria-label="Simpan edit">✔</button>`, `<button class="todo-cancel-edit-btn" aria-label="Batal edit">✖</button>`
      - Tambahkan event listener: tombol ✔ `click` → `confirmEditTodo(id)`, tombol ✖ `click` → `cancelEditTodo(id)`, input `keydown` → Enter: `confirmEditTodo(id)`, Escape: `cancelEditTodo(id)`
      - Fokus ke input edit
    - Tulis `confirmEditTodo(id)`:
      - Baca nilai dari `.todo-edit-input` dalam `<li>` yang sesuai
      - Jika `trim()` kosong: tampilkan pesan peringatan inline, `return`
      - Jika `isDuplicateTodo(newText, id)` true: tampilkan pesan peringatan duplikat inline, `return`
      - Temukan todo di array, update `todo.text = newText.trim()`, `saveTodos()`, `renderTodos()`
    - Tulis `cancelEditTodo(id)`: panggil `renderTodos()` tanpa mengubah data (me-render ulang ke tampilan normal)
    - **Verifikasi Tahap 4:** Tambah tugas → muncul di daftar, input dikosongkan → tambah kosong → peringatan muncul → tambah "Belajar" lalu "belajar" → ditolak duplikat → checkbox → teks dicoret → checkbox lagi → kembali normal → edit → simpan → diperbarui → edit ke duplikat → ditolak → hapus → hilang → refresh → semua data tersimpan → DevTools Console: jalankan pengujian Property 6 dan Property 7 dari design.md
    - _Requirements: Req 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 5. Tahap 5 — Pomodoro Timer
  - Membangun timer Pomodoro 25 menit dengan kontrol Start/Stop/Reset, persistensi state, dan koreksi timestamp saat reload.

  - [ ] 5.1 Format Waktu dan Load State
    - Tambahkan bagian `// === POMODORO TIMER ===` di `js/script.js`
    - Deklarasikan variabel state di lingkup modul: `let pomodoroInterval = null`, `let timeLeft = POMODORO_DURATION`, `let pomodoroStatus = 'stopped'`
    - Tulis pure function `formatTime(seconds)`: kembalikan string `"MM:SS"` — `String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')`
    - Tulis `savePomodoroState()`: simpan `{ timeLeft, status: pomodoroStatus, savedAt: pomodoroStatus === 'running' ? Date.now() : null }` via `storageSet(STORAGE_KEYS.POMODORO, ...)`
    - Tulis `loadPomodoroState()`:
      - Baca state dengan `storageGetObject(STORAGE_KEYS.POMODORO, { timeLeft: 1500, status: 'stopped', savedAt: null })`
      - Validasi data corrupt: jika `state.timeLeft > 1500` → paksa `1500`; jika `state.timeLeft < 0` → paksa `0`; jika `state.status` bukan `'running'/'stopped'` → paksa `'stopped'`
      - Jika `state.status === 'running'` dan `state.savedAt !== null`: hitung `elapsed = Math.floor((Date.now() - state.savedAt) / 1000)`, kurangi `state.timeLeft -= elapsed`
        - Jika `timeLeft <= 0`: set `timeLeft = 0`, `pomodoroStatus = 'stopped'`, tampilkan `#pomodoro-done-msg`
        - Jika `timeLeft > 0`: set variabel, panggil `startTimer()` untuk melanjutkan otomatis
      - Jika `state.status === 'stopped'`: set `timeLeft = state.timeLeft`, `pomodoroStatus = 'stopped'`, panggil `updatePomodoroUI()`
    - _Requirements: Req 4.1, Req 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 5.2 Update UI Timer
    - Tulis `updatePomodoroUI()`:
      - Update `#pomodoro-display` dengan `formatTime(timeLeft)`
      - `document.getElementById('pomodoro-start').disabled`: `true` jika `pomodoroStatus === 'running'` ATAU `timeLeft === 0`
      - `document.getElementById('pomodoro-stop').disabled`: `true` jika `pomodoroStatus === 'stopped'`
      - `document.getElementById('pomodoro-reset').disabled`: **selalu `false`** (tidak pernah dinonaktifkan)
    - _Requirements: Req 4.7, 4.8, 4.9_

  - [ ] 5.3 Start, Stop, Reset, Tick, dan Selesai
    - Tulis `startTimer()`: set `pomodoroStatus = 'running'`, `pomodoroInterval = setInterval(tickTimer, 1000)`, panggil `savePomodoroState()` dan `updatePomodoroUI()`
    - Tulis `stopTimer()`: `clearInterval(pomodoroInterval)`, `pomodoroInterval = null`, set `pomodoroStatus = 'stopped'`, panggil `savePomodoroState()` dan `updatePomodoroUI()`
    - Tulis `resetTimer()`: `clearInterval(pomodoroInterval)`, `pomodoroInterval = null`, set `timeLeft = POMODORO_DURATION`, `pomodoroStatus = 'stopped'`, sembunyikan `#pomodoro-done-msg` (tambah atribut `hidden`), panggil `savePomodoroState()` dan `updatePomodoroUI()`
    - Tulis `tickTimer()`: `timeLeft -= 1`, panggil `updatePomodoroUI()` dan `savePomodoroState()`; jika `timeLeft <= 0` panggil `timerFinished()`
    - Tulis `timerFinished()`: `clearInterval(pomodoroInterval)`, `pomodoroInterval = null`, set `timeLeft = 0`, `pomodoroStatus = 'stopped'`, tampilkan `#pomodoro-done-msg` (hapus atribut `hidden`), panggil `savePomodoroState()` dan `updatePomodoroUI()`
    - **Verifikasi Tahap 5:** Klik Start → timer mulai mundur, Start disabled, Stop aktif, Reset aktif → Klik Stop → timer berhenti, Stop disabled, Start aktif → Klik Reset → kembali 25:00 → di Console: `timeLeft = 3` lalu `startTimer()` → tunggu selesai → pesan muncul → Klik Reset → kembali 25:00 pesan hilang → Klik Start → refresh → timer melanjutkan dari nilai berkurang → Klik Stop → refresh → timer tetap berhenti → DevTools Console: jalankan pengujian Property 3 dan Property 4 dari design.md
    - _Requirements: Req 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

- [ ] 6. Tahap 6 — Quick Links
  - Membangun fitur daftar tautan cepat dengan validasi URL, buka tab baru, hapus, dan persistensi.

  - [ ] 6.1 Load dan Render Quick Links
    - Tambahkan bagian `// === QUICK LINKS ===` di `js/script.js`
    - Deklarasikan `let links = []` di lingkup modul
    - Tulis `loadLinks()`: baca `STORAGE_KEYS.LINKS` via `storageGetArray()`, simpan ke `links`, panggil `renderLinks()`
    - Tulis `saveLinks()`: `storageSet(STORAGE_KEYS.LINKS, links)`
    - Tulis `renderLinks()`:
      - Kosongkan `innerHTML` dari `#quicklinks-list`
      - Untuk setiap link, buat `<li class="link-item" data-id="[id]">` berisi:
        - `<a href="[url]" target="_blank" rel="noopener noreferrer" class="link-anchor">[nama]</a>`
        - `<button class="link-delete-btn" aria-label="Hapus tautan [nama]">🗑️</button>`
      - Tambahkan event listener: tombol hapus `click` → `deleteLink(id)`
    - _Requirements: Req 12.4, 12.5, Req 13.4, 13.5_

  - [ ] 6.2 Tambah dan Hapus Tautan
    - Tulis `isValidUrl(url)`: kembalikan `url.startsWith('http://') || url.startsWith('https://')`
    - Tulis `addLink()`:
      - Baca `#link-name-input`.value dan `#link-url-input`.value
      - Jika `name.trim() === ''`: tampilkan `"Nama tautan tidak boleh kosong."` di `#link-warning`, `return`
      - Jika `url.trim() === ''`: tampilkan `"URL tidak boleh kosong."` di `#link-warning`, `return`
      - Jika `!isValidUrl(url.trim())`: tampilkan `"URL harus diawali dengan http:// atau https://."` di `#link-warning`, `return`
      - Buat `{ id: Date.now(), name: name.trim(), url: url.trim() }`, push ke `links`, `saveLinks()`, `renderLinks()`, kosongkan kedua input, sembunyikan `#link-warning`
    - Tulis `deleteLink(id)`: `links = links.filter(link => link.id !== id)`, `saveLinks()`, `renderLinks()`
    - **Verifikasi Tahap 6:** Tambah tautan valid → muncul di daftar, input dikosongkan → coba URL tanpa https:// → pesan error muncul → klik nama tautan → terbuka di tab baru → hapus tautan → hilang dari daftar → refresh → tautan tersimpan → DevTools Console: jalankan pengujian Property 11 dan Property 12 dari design.md
    - _Requirements: Req 12.1, 12.2, 12.3, 12.6, 12.7, 12.8, Req 13.1, 13.2, 13.3_

- [ ] 7. Tahap 7 — Integrasi dan Pengujian Akhir
  - Menyambungkan semua komponen, mendaftarkan event listener, dan menjalankan pengujian menyeluruh.

  - [ ] 7.1 Fungsi init() dan registerEventListeners()
    - Tambahkan bagian `// === INIT ===` di `js/script.js`
    - Tulis `registerEventListeners()` yang mendaftarkan semua event listener berikut:
      - `#theme-toggle` `click` → `toggleTheme()`
      - `#edit-name-btn` `click` → `activateEditName()`
      - `#save-name-btn` `click` → `confirmEditName()`
      - `#cancel-name-btn` `click` → `cancelEditName()`
      - `#name-input` `keydown` → `if (e.key === 'Enter') confirmEditName()` dan `if (e.key === 'Escape') cancelEditName()`
      - `#todo-add-btn` `click` → `addTodo()`
      - `#todo-input` `keydown` → `if (e.key === 'Enter') addTodo()`
      - `#todo-input` `input` → sembunyikan `#todo-warning` (tambah atribut `hidden`)
      - `#pomodoro-start` `click` → `startTimer()`
      - `#pomodoro-stop` `click` → `stopTimer()`
      - `#pomodoro-reset` `click` → `resetTimer()`
      - `#link-add-btn` `click` → `addLink()`
      - `#link-url-input` `input` → sembunyikan `#link-warning`
      - `#link-name-input` `input` → sembunyikan `#link-warning`
    - Tulis `init()` dengan urutan kritis ini (urutan tidak boleh diubah):
      ```
      loadTheme()              // 1. PERTAMA — cegah FOUC
      updateClock()            // 2. Jam & sapaan langsung tampil
      setInterval(updateClock, 1000) // 3. Perbarui setiap detik
      loadUserName()           // 4. Nama pengguna
      loadPomodoroState()      // 5. Pulihkan timer (dengan koreksi timestamp)
      loadTodos()              // 6. Render daftar tugas
      loadLinks()              // 7. Render daftar tautan
      registerEventListeners() // 8. Aktifkan semua interaksi
      ```
    - Tambahkan `document.addEventListener('DOMContentLoaded', init)` sebagai baris terakhir di file
    - _Requirements: semua requirement_

  - [ ] 7.2 CSS Tambahan untuk Item Tugas dan Tautan
    - Style `.todo-item`: `display: flex`, `align-items: center`, `gap: 0.5rem`, `padding: 0.5rem 0`, `border-bottom: 1px solid var(--border-color)`
    - Style `.todo-text`: `flex: 1`, `word-break: break-word`
    - Style `.todo-edit-input`: `flex: 1`, `padding: 0.25rem 0.5rem`, `border: 1px solid var(--accent-color)`, background dan color dari variabel tema
    - Style `.link-item`: `display: flex`, `justify-content: space-between`, `align-items: center`, `padding: 0.4rem 0`, `border-bottom: 1px solid var(--border-color)`
    - Style `.link-anchor`: `color: var(--accent-color)`, `text-decoration: none`; pada hover: `text-decoration: underline`
    - Style `#pomodoro-display`: `font-size: 3.5rem`, `text-align: center`, `font-weight: bold`, `letter-spacing: 0.05em`, `color: var(--text-primary)`, `margin: 1rem 0`
    - Style `.pomodoro-controls`: `display: flex`, `justify-content: center`, `gap: 0.5rem`
    - Style `h2` dalam `.widget`: `font-size: 1.1rem`, `margin-bottom: 0.75rem`, `color: var(--text-secondary)`, `text-transform: uppercase`, `letter-spacing: 0.05em`
    - Style `input[type="text"]`, `input[type="url"]`: `padding: 0.5rem`, `border: 1px solid var(--border-color)`, `border-radius: 4px`, background dan color dari variabel tema, `width: 100%`

  - [ ] 7.3 Pengujian Terintegrasi Manual
    - Jalankan semua 34 kasus pengujian dari Tabel Pengujian Manual UI di design.md secara berurutan
    - Pastikan tidak ada error di DevTools Console (tab Console)
    - Verifikasi semua data (nama, tugas, tautan, timer, tema) tersimpan dan dipulihkan dengan benar setelah refresh halaman
    - Jalankan simulasi data corrupt dari bagian Testing Strategy di design.md: masukkan data JSON tidak valid ke localStorage → refresh → aplikasi harus tetap berjalan dengan nilai default tanpa crash
    - _Requirements: semua requirement_

  - [ ] 7.4 Pengujian Console — Semua Properties
    - Salin fungsi `assert()` dari design.md ke DevTools Console
    - Jalankan pengujian untuk setiap property berikut dari design.md (gunakan data percobaan, jangan data nyata):
      - Property 1 — Kelengkapan & Determinisme Sapaan (`getGreeting()` untuk jam 0–23)
      - Property 2 — Round-Trip Nama Pengguna
      - Property 3 — Monotonik Menurun Timer
      - Property 4 — Reset Universal Timer
      - Property 6 — Penolakan Input Kosong/Spasi Tugas
      - Property 7 — Keunikan Tugas Case-Insensitive
      - Property 11 — Validasi URL Quick Links
      - Property 13 — Toggle Tema Idempoten & Eksklusivitas
      - Property 14 — Round-Trip Tema & Pemisahan Tanggung Jawab `applyTheme`
    - Semua assertion harus menampilkan `✅ LULUS` tanpa ada `❌ GAGAL`
    - _Requirements: Req 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14_

  - [ ]* 7.5 Pengujian Lintas Browser (Optional)
    - Buka `index.html` langsung di Chrome, Firefox, Edge, dan Safari (atau gunakan Live Server)
    - Di setiap browser, verifikasi: CSS custom properties dan tema bekerja → `localStorage` berfungsi → `setInterval` berjalan (jam bergerak) → grid layout responsif saat resize → semua fitur (tambah tugas, timer, tautan, tema) berfungsi normal
    - Catat jika ada perbedaan perilaku antar browser
    - _Requirements: Req 16.6_

---

## Catatan

- Tugas bertanda `*` bersifat opsional dan dapat dilewati untuk MVP lebih cepat
- Seluruh implementasi hanya menggunakan 3 file: `index.html`, `css/style.css`, `js/script.js` — jangan buat file baru
- Tidak ada framework, library eksternal, atau network request yang diizinkan
- Setiap tugas merujuk ke requirement spesifik untuk traceability
- Checkpoint verifikasi tersebar di setiap akhir tahap untuk validasi bertahap
- Property-based tests dijalankan via DevTools Console tanpa setup tambahan
- `loadTheme()` **harus** menjadi pemanggilan pertama di `init()` untuk mencegah Flash of Unstyled Content (FOUC)
- ID `Date.now()` cukup unik untuk aplikasi single-user tanpa sinkronisasi multi-perangkat

---

## Task Dependency Graph

```
Task 1.1 (HTML Kerangka) ─────────────────────────────────────┐
Task 1.2 (CSS Variabel Tema) ─────────────────────────────────┤
Task 1.3 (CSS Grid Responsif) ────────────────────────────────┤
Task 1.4 (Storage Manager) ─────┬─────────────────────────────┤
                                 │                             │
               ┌─────────────────┼──────────────┐             │
               ▼                 ▼              ▼             │
        Task 2.1–2.3      Task 3.1–3.2    Task 4.1–4.4        │
        (Greeting)         (Theme)         (To-Do List)        │
               │                 │              │             │
               └─────────────────┤              ▼             │
                                 │        Task 5.1–5.3        │
                                 │        (Pomodoro)          │
                                 │              │             │
                                 │              ▼             │
                                 │        Task 6.1–6.2        │
                                 │        (Quick Links)       │
                                 │              │             │
                                 └──────────────┘             │
                                                │             │
                                                ▼             │
                                       Task 7.1–7.5 ◄─────────┘
                                       (Integrasi)
```

Tahap 2, 3, 4, 5, dan 6 tidak bergantung satu sama lain — dapat dikerjakan paralel setelah Tahap 1 selesai. Tahap 7 mengintegrasikan seluruh hasil tahap sebelumnya.

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.2", "4.1", "5.1", "6.1"] },
    { "id": 2, "tasks": ["2.2", "4.2", "5.2", "6.2"] },
    { "id": 3, "tasks": ["2.3", "4.3", "5.3"] },
    { "id": 4, "tasks": ["4.4"] },
    { "id": 5, "tasks": ["7.1", "7.2"] },
    { "id": 6, "tasks": ["7.3", "7.4", "7.5"] }
  ]
}
```
