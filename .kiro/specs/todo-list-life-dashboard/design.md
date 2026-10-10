# Dokumen Desain — To-Do List Life Dashboard

## 1. Overview

To-Do List Life Dashboard adalah aplikasi web satu halaman (single-page application) yang berjalan sepenuhnya di sisi klien tanpa ketergantungan eksternal.

**Stack Teknologi:**
- **HTML5** (`index.html`) — struktur semantik dan kerangka antarmuka
- **CSS3 dengan Custom Properties** (`css/style.css`) — tata letak grid responsif, tema terang/gelap berbasis variabel CSS
- **Vanilla JavaScript ES6+** (`js/script.js`) — logika aplikasi, manipulasi DOM, manajemen state
- **Web API `localStorage`** — persistensi data di sisi klien

**Tidak ada framework, tidak ada library eksternal, tidak ada backend, tidak ada network request.** Aplikasi berjalan sepenuhnya offline.

**Empat Widget Utama:**
1. **Greeting Widget** — sapaan berbasis waktu, jam real-time, dan nama pengguna yang dapat diedit
2. **Pomodoro Timer** — timer mundur 25 menit dengan kontrol Start/Stop/Reset dan persistensi state
3. **To-Do List** — daftar tugas dengan tambah, edit, toggle selesai, hapus, validasi duplikat, dan persistensi
4. **Quick Links** — daftar tautan cepat dengan validasi URL, buka di tab baru, dan persistensi

**Fitur Tambahan:**
- **Light/Dark Mode** — toggle tema dengan persistensi preferensi dan pencegahan FOUC (Flash of Unstyled Content)

---

## 2. Arsitektur Aplikasi

### Diagram Arsitektur (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
│                                                                 │
│  ┌─────────────┐    ┌──────────────────────────────────────┐   │
│  │ index.html  │───▶│           css/style.css               │   │
│  │  <link>     │    │  (CSS Custom Properties, Grid, Media) │   │
│  │  <script>   │    └──────────────────────────────────────┘   │
│  └──────┬──────┘                                               │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    js/script.js                          │   │
│  │  GREETING | POMODORO | TODO LIST | QUICK LINKS | THEME  │   │
│  │                       │                                  │   │
│  │              STORAGE MANAGER                             │   │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  localStorage: userName|pomodoroState|todos|links|theme │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Alur Data

```
DOMContentLoaded
       │
       ▼
    init()
       │
       ├──▶ loadTheme()          (1. PERTAMA — cegah FOUC)
       ├──▶ updateClock()        (2. Jam & sapaan langsung tampil)
       ├──▶ loadUserName()       (3. Nama pengguna dari localStorage)
       ├──▶ loadPomodoroState()  (4. Pulihkan timer dengan koreksi timestamp)
       ├──▶ loadTodos()          (5. Render daftar tugas)
       ├──▶ loadLinks()          (6. Render daftar tautan)
       └──▶ registerEventListeners() (7. Aktifkan semua interaksi)
                   │
                   ▼
         Event Listener aktif
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
  Interaksi Pengguna    setInterval (jam & timer)
        │
        ▼
  Validasi Input
        │
        ▼
  Update State (array / objek JS)
        │
   ┌────┴────┐
   ▼         ▼
Render DOM  Simpan ke localStorage
```

### Organisasi Kode `script.js`

Kode diorganisasi menggunakan fungsi biasa (bukan class atau ES module), dikelompokkan dengan komentar pemisah yang jelas:

```javascript
// === KONSTANTA ===
// === STORAGE MANAGER ===
// === GREETING ===
// === POMODORO TIMER ===
// === TODO LIST ===
// === QUICK LINKS ===
// === THEME MANAGER ===
// === INIT ===
```

Pendekatan ini mempertahankan kesederhanaan sesuai dengan stack tanpa build tool. Setiap bagian berdiri sendiri dan dapat diuji secara independen.

---

## 3. Desain Antarmuka & Wireframe

### Desktop (≥1024px) — 2 Kolom

```
┌──────────────────────────────────────────────────────────────┐
│  [☀️/🌙 Toggle Tema]                                          │
├──────────────────────────────────────────────────────────────┤
│                  🌅 Selamat Pagi, [Nama] ✏️                   │
│                  Senin, 26 Mei 2025 — 08:30:00               │
├─────────────────────────────┬────────────────────────────────┤
│   📋 TO-DO LIST             │   ⏱️ POMODORO TIMER            │
│   [___ input tugas ___] [+] │        25:00                   │
│   ☐ Belajar JavaScript ✏🗑  │   [Start] [Stop] [Reset]       │
│   ☑ Membaca buku       ✏🗑  ├────────────────────────────────┤
│   ☐ Olahraga pagi      ✏🗑  │   🔗 QUICK LINKS              │
│                             │   [_ Nama _] [__ URL __] [+]   │
│                             │   • Google              [🗑]   │
│                             │   • GitHub              [🗑]   │
└─────────────────────────────┴────────────────────────────────┘
```

### Mobile (≥320px) — 1 Kolom

```
┌───────────────────────────────┐
│  [☀️/🌙]                       │
├───────────────────────────────┤
│   🌅 Selamat Pagi, [Nama] ✏️  │
│   Senin, 26 Mei 2025 08:30:00 │
├───────────────────────────────┤
│   ⏱️ POMODORO TIMER  25:00    │
│   [Start] [Stop] [Reset]      │
├───────────────────────────────┤
│   📋 TO-DO LIST               │
│   [___ input tugas ___] [+]   │
│   ☐ Belajar JavaScript   ✏🗑  │
├───────────────────────────────┤
│   🔗 QUICK LINKS              │
│   [_ Nama _][__ URL __] [+]   │
│   • Google               [🗑] │
└───────────────────────────────┘
```

---

## 4. Responsive Design

### Breakpoints

| Breakpoint | Lebar | Tata Letak |
|---|---|---|
| Mobile | `max-width: 767px` | 1 kolom |
| Tablet | `768px – 1023px` | 2 kolom [ASUMSI] |
| Desktop | `min-width: 1024px` | 2 kolom, max-width 1200px |

### CSS Custom Properties

```css
:root {
  --bg-primary: #f5f5f5;
  --bg-widget: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --accent-color: #4a90e2;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-widget: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --accent-color: #6fa8dc;
  --border-color: #2a2a4a;
}
```

Semua warna komponen mengacu pada variabel CSS ini, sehingga pergantian tema hanya memerlukan perubahan atribut `data-theme` pada elemen `<html>`.

### CSS Grid & Media Query

```css
.dashboard-grid {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 767px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Touch target WCAG 2.1 — ukuran minimum tombol */
button {
  min-width: 44px;
  min-height: 44px;
}
```

---

## 5. Struktur HTML

```html
<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>To-Do List Life Dashboard</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="app-header">
    <button id="theme-toggle" aria-label="Toggle tema">☀️</button>
  </header>

  <section id="greeting-widget" class="widget">
    <div id="greeting-text">Selamat Pagi, <span id="user-name">Pengguna</span></div>
    <button id="edit-name-btn" aria-label="Ubah nama">✏️</button>
    <div id="edit-name-form" hidden>
      <input type="text" id="name-input" placeholder="Masukkan nama..." />
      <button id="save-name-btn">Simpan</button>
      <button id="cancel-name-btn">Batal</button>
    </div>
    <div id="current-date"></div>
    <div id="current-time"></div>
  </section>

  <main class="dashboard-grid">
    <section id="todo-widget" class="widget">
      <h2>To-Do List</h2>
      <div class="todo-input-area">
        <input type="text" id="todo-input" placeholder="Tambah tugas baru..." />
        <button id="todo-add-btn" aria-label="Tambah tugas">+</button>
      </div>
      <p id="todo-warning" class="warning-message" hidden></p>
      <ul id="todo-list"></ul>
    </section>

    <section id="pomodoro-widget" class="widget">
      <h2>Pomodoro Timer</h2>
      <div id="pomodoro-display">25:00</div>
      <p id="pomodoro-done-msg" hidden>Sesi selesai! 🎉</p>
      <div class="pomodoro-controls">
        <button id="pomodoro-start">Start</button>
        <button id="pomodoro-stop">Stop</button>
        <button id="pomodoro-reset">Reset</button>
      </div>
    </section>

    <section id="quicklinks-widget" class="widget">
      <h2>Quick Links</h2>
      <div class="quicklinks-input-area">
        <input type="text" id="link-name-input" placeholder="Nama tautan..." />
        <input type="url" id="link-url-input" placeholder="https://..." />
        <button id="link-add-btn" aria-label="Tambah tautan">+</button>
      </div>
      <p id="link-warning" class="warning-message" hidden></p>
      <ul id="quicklinks-list"></ul>
    </section>
  </main>

  <script src="js/script.js"></script>
</body>
</html>
```

### Tabel ID dan Class Penting

| Selector | Tipe | Deskripsi |
|---|---|---|
| `#theme-toggle` | button | Tombol toggle tema terang/gelap |
| `.app-header` | header | Header aplikasi, menampung tombol tema |
| `#greeting-widget` | section | Wadah seluruh widget sapaan |
| `#greeting-text` | div | Teks sapaan + nama pengguna |
| `#user-name` | span | Nama pengguna yang ditampilkan |
| `#edit-name-btn` | button | Tombol aktivasi mode edit nama |
| `#edit-name-form` | div | Formulir edit nama (tersembunyi secara default) |
| `#name-input` | input | Input teks untuk nama pengguna |
| `#save-name-btn` | button | Simpan nama baru |
| `#cancel-name-btn` | button | Batalkan edit nama |
| `#current-date` | div | Tampilan tanggal hari ini |
| `#current-time` | div | Tampilan jam real-time |
| `.dashboard-grid` | main | Wadah grid dua kolom widget utama |
| `#todo-widget` | section | Wadah widget To-Do List |
| `#todo-input` | input | Input teks tugas baru |
| `#todo-add-btn` | button | Tombol tambah tugas |
| `#todo-warning` | p | Pesan peringatan validasi tugas |
| `#todo-list` | ul | Daftar item tugas |
| `#pomodoro-widget` | section | Wadah widget Pomodoro Timer |
| `#pomodoro-display` | div | Tampilan waktu timer MM:SS |
| `#pomodoro-done-msg` | p | Pesan sesi selesai |
| `#pomodoro-start` | button | Tombol Start timer |
| `#pomodoro-stop` | button | Tombol Stop timer |
| `#pomodoro-reset` | button | Tombol Reset timer |
| `#quicklinks-widget` | section | Wadah widget Quick Links |
| `#link-name-input` | input | Input nama tautan |
| `#link-url-input` | input | Input URL tautan |
| `#link-add-btn` | button | Tombol tambah tautan |
| `#link-warning` | p | Pesan peringatan validasi tautan |
| `#quicklinks-list` | ul | Daftar item tautan |
| `.widget` | section | Kelas umum semua widget |
| `.warning-message` | p | Kelas umum pesan peringatan |

---

## 6. Struktur JavaScript

### Konstanta

```javascript
const STORAGE_KEYS = {
  USER_NAME: 'userName',
  POMODORO: 'pomodoroState',
  TODOS: 'todos',
  LINKS: 'quickLinks',
  THEME: 'theme'
};

const POMODORO_DURATION = 1500; // 25 menit dalam detik
```

### Storage Manager

Semua akses ke `localStorage` dienkapsulasi di sini. Semua fungsi menggunakan `try/catch` untuk menangani potensi error (mode privat, kuota penuh, data corrupt).

```javascript
// Mendapatkan string dari localStorage, atau null jika tidak ada/error
function storageGet(key) { ... }

// Menyimpan nilai ke localStorage sebagai JSON string
function storageSet(key, value) { ... }

// Mendapatkan array dari localStorage, atau [] jika tidak ada/corrupt
function storageGetArray(key) { ... }

// Mendapatkan objek dari localStorage dengan nilai default fallback
function storageGetObject(key, defaultValue) { ... }
```

### Greeting

```javascript
// Memperbarui tampilan jam dan tanggal setiap detik via setInterval
function updateClock() { ... }

// Pure function: mengembalikan string sapaan berdasarkan jam (0–23)
// Rentang: 5–11 → "Selamat Pagi", 12–14 → "Selamat Siang",
//          15–17 → "Selamat Sore", 18–4 (wrap) → "Selamat Malam"
function getGreeting(hour) { ... }

// Membaca userName dari localStorage, render ke DOM
function loadUserName() { ... }

// Menyimpan nama ke localStorage dan memperbarui tampilan
function saveUserName(name) { ... }

// Menampilkan formulir edit nama, menyembunyikan tombol edit
function activateEditName() { ... }

// Memvalidasi dan menyimpan nama baru; menolak jika kosong/hanya spasi
function confirmEditName() { ... }

// Membatalkan edit nama, menyembunyikan formulir
function cancelEditName() { ... }
```

### Pomodoro Timer

```javascript
// Memuat state timer dari localStorage; mengoreksi waktu jika reload saat running
function loadPomodoroState() { ... }

// Menyimpan state timer (timeLeft, status, savedAt) ke localStorage
function savePomodoroState() { ... }

// Pure function: mengonversi detik ke string "MM:SS"
function formatTime(seconds) { ... }

// Memulai timer: set status running, simpan savedAt, mulai interval
function startTimer() { ... }

// Menghentikan timer: bersihkan interval, set status stopped, simpan
function stopTimer() { ... }

// Mereset timer ke 1500 detik, status stopped — berlaku dari kondisi apapun
function resetTimer() { ... }

// Dipanggil setiap detik: kurangi timeLeft, perbarui UI, cek selesai
function tickTimer() { ... }

// Memperbarui tampilan timer dan state tombol di DOM
function updatePomodoroUI() { ... }

// Dipanggil saat timeLeft mencapai 0: tampilkan pesan, hentikan interval
function timerFinished() { ... }
```

### To-Do List

```javascript
// Memuat todos dari localStorage dan merender ke DOM
function loadTodos() { ... }

// Menyimpan array todos saat ini ke localStorage
function saveTodos() { ... }

// Merender ulang seluruh daftar tugas ke #todo-list
function renderTodos() { ... }

// Memvalidasi dan menambah tugas baru; menolak kosong/duplikat
function addTodo() { ... }

// Membalik status completed tugas dengan id tertentu
function toggleTodo(id) { ... }

// Menghapus tugas dengan id tertentu
function deleteTodo(id) { ... }

// Menampilkan formulir edit inline untuk tugas dengan id tertentu
function activateEditTodo(id) { ... }

// Memvalidasi dan menyimpan perubahan edit tugas
function confirmEditTodo(id) { ... }

// Membatalkan mode edit tugas, mengembalikan ke tampilan normal
function cancelEditTodo(id) { ... }

// Pure function: memeriksa duplikat case-insensitive, mengecualikan excludeId
function isDuplicateTodo(text, excludeId) { ... }
```

### Quick Links

```javascript
// Memuat links dari localStorage dan merender ke DOM
function loadLinks() { ... }

// Menyimpan array links saat ini ke localStorage
function saveLinks() { ... }

// Merender ulang seluruh daftar tautan ke #quicklinks-list
function renderLinks() { ... }

// Memvalidasi dan menambah tautan baru; menolak nama kosong / URL invalid
function addLink() { ... }

// Menghapus tautan dengan id tertentu
function deleteLink(id) { ... }

// Pure function: memeriksa apakah URL dimulai dengan http:// atau https://
function isValidUrl(url) { ... }
```

### Theme Manager

Tiga fungsi dengan tanggung jawab yang dipisahkan secara ketat:

```javascript
// HANYA menerapkan tema ke antarmuka:
// - Set atribut data-theme pada <html>
// - Update ikon tombol #theme-toggle (☀️ untuk dark, 🌙 untuk light)
// TIDAK menyimpan ke localStorage.
function applyTheme(theme) { ... }

// Membaca preferensi tema dari localStorage (fallback ke "light"),
// kemudian memanggil applyTheme() untuk menerapkan ke UI.
// Dipanggil PERTAMA dalam init() untuk mencegah FOUC.
function loadTheme() { ... }

// Membaca tema aktif dari atribut data-theme pada <html>,
// membaliknya (light ↔ dark),
// memanggil applyTheme() untuk memperbarui UI,
// MENYIMPAN preferensi baru ke localStorage via storageSet().
function toggleTheme() { ... }
```

**Keputusan Desain — Pemisahan Tanggung Jawab:**
- `applyTheme()` murni mengubah UI. Ini memungkinkan pengujian UI secara terpisah dari penyimpanan.
- `loadTheme()` adalah jembatan antara storage dan UI saat inisialisasi.
- `toggleTheme()` adalah satu-satunya fungsi yang mengkoordinasikan perubahan UI *dan* penyimpanan saat interaksi pengguna.

### Init

```javascript
function init() {
  loadTheme();              // 1. PERTAMA: cegah FOUC
  updateClock();            // 2. Jam & sapaan langsung tampil
  loadUserName();           // 3. Nama pengguna
  loadPomodoroState();      // 4. Pulihkan timer (dengan koreksi timestamp)
  loadTodos();              // 5. Render daftar tugas
  loadLinks();              // 6. Render daftar tautan
  registerEventListeners(); // 7. Aktifkan semua interaksi
}

function registerEventListeners() {
  // Theme
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  // Greeting
  document.getElementById('edit-name-btn').addEventListener('click', activateEditName);
  document.getElementById('save-name-btn').addEventListener('click', confirmEditName);
  document.getElementById('cancel-name-btn').addEventListener('click', cancelEditName);
  document.getElementById('name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmEditName();
    if (e.key === 'Escape') cancelEditName();
  });
  // Pomodoro
  document.getElementById('pomodoro-start').addEventListener('click', startTimer);
  document.getElementById('pomodoro-stop').addEventListener('click', stopTimer);
  document.getElementById('pomodoro-reset').addEventListener('click', resetTimer);
  // To-Do
  document.getElementById('todo-add-btn').addEventListener('click', addTodo);
  document.getElementById('todo-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
  });
  // Quick Links
  document.getElementById('link-add-btn').addEventListener('click', addLink);
}

document.addEventListener('DOMContentLoaded', init);
```

---

## 7. Rancangan localStorage

Lima kunci penyimpanan dengan skema data berikut:

### `userName` — string

- **Tipe:** string
- **Default:** `"Pengguna"`
- **Contoh:** `"Budi Santoso"`

### `pomodoroState` — objek JSON

```json
{
  "timeLeft": 1500,
  "status": "stopped",
  "savedAt": null
}
```

| Field | Tipe | Rentang | Deskripsi |
|---|---|---|---|
| `timeLeft` | number | 0–1500 | Sisa waktu dalam detik |
| `status` | string | "running" \| "stopped" | Status timer saat ini |
| `savedAt` | number \| null | timestamp ms \| null | `Date.now()` saat disimpan; `null` jika stopped |

**Catatan:** `savedAt` digunakan untuk menghitung waktu berlalu saat halaman di-reload dalam keadaan timer berjalan.

### `todos` — array JSON

```json
[
  {
    "id": 1748123456789,
    "text": "Belajar JavaScript",
    "completed": false
  },
  {
    "id": 1748123456790,
    "text": "Membaca buku",
    "completed": true
  }
]
```

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | number | `Date.now()` saat dibuat — unik untuk aplikasi single-user [ASUMSI] |
| `text` | string | Deskripsi tugas (sudah di-trim) |
| `completed` | boolean | Status penyelesaian tugas |

### `quickLinks` — array JSON

```json
[
  {
    "id": 1748123456791,
    "name": "Google",
    "url": "https://google.com"
  },
  {
    "id": 1748123456792,
    "name": "GitHub",
    "url": "https://github.com"
  }
]
```

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | number | `Date.now()` saat dibuat |
| `name` | string | Nama tampilan tautan |
| `url` | string | URL lengkap dimulai dengan http:// atau https:// |

### `theme` — string

- **Nilai valid:** `"light"` \| `"dark"`
- **Default:** `"light"`

[ASUMSI] ID menggunakan `Date.now()` — cukup unik untuk aplikasi single-user yang tidak memerlukan sinkronisasi multi-perangkat.

---

## 8. Logika Pomodoro Timer Detail

### Diagram Alur

```
[Start diklik]
      │
      ▼
status = "running"
savedAt = Date.now()
interval = setInterval(tickTimer, 1000)
updatePomodoroUI()
savePomodoroState()

[Stop diklik]
      │
      ▼
clearInterval(interval)
status = "stopped"
savedAt = null
updatePomodoroUI()
savePomodoroState()

[Reset diklik] ← SELALU aktif, dari kondisi apapun
      │
      ▼
clearInterval(interval)
timeLeft = 1500
status = "stopped"
savedAt = null
sembunyikan #pomodoro-done-msg
updatePomodoroUI()
savePomodoroState()

[tickTimer — setiap detik saat running]
      │
      ▼
timeLeft = timeLeft - 1
      │
      ├── timeLeft > 0 → updatePomodoroUI() → savePomodoroState()
      │
      └── timeLeft === 0 → timerFinished()

[timerFinished — saat mencapai 00:00]
      │
      ▼
clearInterval(interval)
status = "stopped"
tampilkan #pomodoro-done-msg
updatePomodoroUI()
savePomodoroState()

[Reload saat status "running"]
      │
      ▼
baca state dari localStorage
      │
      ├── savedAt === null → anggap elapsed = 0 → lanjut tanpa koreksi
      │
      └── savedAt !== null
                │
                ▼
          elapsed = Math.floor((Date.now() - savedAt) / 1000)
          timeLeft = timeLeft - elapsed
                │
                ├── timeLeft <= 0 → timeLeft = 0, status = "stopped"
                │                   tampilkan selesai
                │
                └── timeLeft > 0 → startTimer() (lanjutkan otomatis)
```

### Kode Koreksi Timestamp saat Reload

```javascript
if (state.status === 'running' && state.savedAt !== null) {
  const elapsed = Math.floor((Date.now() - state.savedAt) / 1000);
  state.timeLeft = state.timeLeft - elapsed;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.status = 'stopped';
    // tampilkan pesan selesai
  } else {
    startTimer(); // lanjutkan otomatis
  }
}
```

### Tabel State Tombol

| Kondisi Timer | Tombol Start | Tombol Stop | Tombol Reset |
|---|---|---|---|
| Berhenti (stopped) | ✅ aktif | ❌ disabled | ✅ aktif |
| Berjalan (running) | ❌ disabled | ✅ aktif | ✅ aktif |
| Selesai (00:00) | ❌ disabled | ❌ disabled | ✅ aktif |

**Catatan:** Tombol Reset **selalu aktif** — tidak pernah dinonaktifkan, dari kondisi apapun.

---

## 9. Logika Validasi

### To-Do List

| Kondisi Input | Pesan Peringatan | Aksi Sistem |
|---|---|---|
| Input kosong atau hanya spasi | "Tugas tidak boleh kosong." | Tampilkan di `#todo-warning`, tolak penambahan |
| Duplikat (case-insensitive, trim) | "Tugas sudah ada dalam daftar." | Tampilkan di `#todo-warning`, pertahankan teks input |
| Edit menjadi kosong/spasi | "Tugas tidak boleh kosong." | Peringatan inline pada item, batalkan simpan |
| Edit menjadi duplikat dengan tugas **lain** | "Tugas sudah ada dalam daftar." | Peringatan inline pada item, batalkan simpan |
| Edit dengan teks **sama** dengan diri sendiri | — (tidak ada peringatan) | Diizinkan, simpan normalisasi |

**Fungsi `isDuplicateTodo(text, excludeId)`:** Membandingkan `text.toLowerCase().trim()` dengan semua tugas di array, **mengecualikan** tugas dengan `excludeId`. Mengembalikan `true` jika duplikat ditemukan.

[ASUMSI] Pesan peringatan ditampilkan melalui manipulasi DOM (bukan `alert()`). Pesan dihapus secara otomatis saat pengguna mulai mengetik di input yang bersangkutan.

### Quick Links

| Kondisi Input | Pesan Peringatan |
|---|---|
| Nama kosong atau hanya spasi | "Nama tautan tidak boleh kosong." |
| URL kosong | "URL tidak boleh kosong." |
| URL tanpa prefix `http://` atau `https://` | "URL harus diawali dengan http:// atau https://." |

---

## 10. Penanganan Error

### Strategi Fallback per Kunci Storage

| Kunci | Kondisi Error | Nilai Fallback |
|---|---|---|
| `todos` | Data corrupt / tidak ada | `[]` (array kosong) |
| `quickLinks` | Data corrupt / tidak ada | `[]` (array kosong) |
| `pomodoroState` | Data corrupt / tidak ada | `{ timeLeft: 1500, status: "stopped", savedAt: null }` |
| `userName` | Tidak ada di localStorage | `"Pengguna"` |
| `theme` | Tidak ada / nilai tidak valid | `"light"` |

### Edge Case Timer

| Kondisi | Penanganan |
|---|---|
| `savedAt === null` saat `status === "running"` | Anggap `elapsed = 0`, lanjutkan dari `timeLeft` yang tersimpan |
| `timeLeft <= 0` setelah koreksi timestamp | Paksa `timeLeft = 0`, tampilkan pesan selesai, hentikan timer |
| `timeLeft > 1500` (data corrupt) | Reset paksa ke `1500` |
| `status` bukan "running" atau "stopped" | Fallback ke `"stopped"` |

### Pola Penanganan Error Storage

```javascript
function storageGetArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('storageGetArray: data corrupt untuk kunci', key, e);
    return [];
  }
}
```

---

## 11. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: Kelengkapan & Determinisme Sapaan

*Untuk semua* jam `h` dalam rentang `0–23`, fungsi `getGreeting(h)` menghasilkan tepat satu dari empat sapaan valid ("Selamat Pagi", "Selamat Siang", "Selamat Sore", "Selamat Malam"). Untuk nilai `h` yang sama, fungsi selalu menghasilkan sapaan yang identik (deterministik).

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

---

### Property 2: Round-Trip Nama Pengguna

*Untuk semua* string nama `n` yang tidak kosong, menyimpan `n` ke localStorage via `storageSet(STORAGE_KEYS.USER_NAME, n)` kemudian membaca kembali via `storageGet(STORAGE_KEYS.USER_NAME)` menghasilkan nilai yang identik dengan `n`.

**Validates: Requirements 3.3, 3.6**

---

### Property 3: Monotonik Menurun & Batas Bawah Timer

*Untuk semua* kondisi timer yang berjalan, setiap pembaruan `timeLeft` melalui `tickTimer()` menghasilkan nilai `timeLeft` yang lebih kecil atau sama dengan nilai sebelumnya, dan `timeLeft` tidak pernah lebih kecil dari `0`.

**Validates: Requirements 4.2, 4.5**

---

### Property 4: Reset Universal Timer

*Untuk semua* kondisi timer yang mungkin (running, stopped, atau selesai di 00:00), memanggil `resetTimer()` selalu menghasilkan `timeLeft = 1500` dan `status = "stopped"`, tanpa memandang nilai awalnya.

**Validates: Requirements 4.4, 4.6**

---

### Property 5: Konsistensi Persistensi Pomodoro

*Untuk semua* kombinasi nilai `timeLeft` dalam rentang `0–1500` dan `status` dalam `{"running", "stopped"}`, menyimpan state via `storageSet` kemudian memuat ulang via `storageGetObject` menghasilkan nilai yang identik untuk kedua field.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

---

### Property 6: Penolakan Input Kosong/Spasi Tugas

*Untuk semua* string `s` di mana `s.trim() === ""`, memanggil `addTodo()` dengan nilai `s` harus ditolak sehingga panjang array `todos` tidak berubah.

**Validates: Requirements 6.4**

---

### Property 7: Keunikan Tugas (Case-Insensitive)

*Untuk semua* daftar tugas dan semua string input `t`, jika `todos` sudah mengandung tugas dengan `text.toLowerCase().trim() === t.toLowerCase().trim()`, maka memanggil `addTodo()` dengan `t` harus ditolak dan panjang array `todos` tidak berubah.

**Validates: Requirements 7.1, 7.2, 7.3**

---

### Property 8: Toggle Status Tugas — Idempoten & Isolasi

*Untuk semua* tugas dengan `id` tertentu dan daftar tugas manapun, memanggil `toggleTodo(id)` dua kali berturut-turut menghasilkan nilai `completed` yang identik dengan nilai awal sebelum pemanggilan pertama. Selain itu, `toggleTodo(id)` tidak mengubah nilai `completed` tugas-tugas lain dengan `id` berbeda.

**Validates: Requirements 9.2, 9.3**

---

### Property 9: Preservasi Tugas Saat Penghapusan

*Untuk semua* daftar `n` tugas dan tugas dengan `id` tertentu dalam daftar tersebut, memanggil `deleteTodo(id)` menghasilkan daftar dengan tepat `n-1` tugas, dan semua tugas dengan `id` yang berbeda tidak mengalami perubahan pada field `text` maupun `completed`.

**Validates: Requirements 10.2, 10.3**

---

### Property 10: Round-Trip To-Do List

*Untuk semua* array `todos` yang valid (setiap elemen memiliki `id`, `text`, dan `completed`), menyimpan array via `storageSet(STORAGE_KEYS.TODOS, todos)` kemudian memuat kembali via `storageGetArray(STORAGE_KEYS.TODOS)` menghasilkan array yang identik dalam hal nilai `text` dan `completed` setiap elemen.

**Validates: Requirements 11.1, 11.3**

---

### Property 11: Validasi URL Quick Links

*Untuk semua* string URL `u` yang tidak dimulai dengan `"http://"` atau `"https://"`, memanggil `addLink()` dengan nilai `u` harus ditolak sehingga panjang array `links` tidak berubah.

**Validates: Requirements 12.7**

---

### Property 12: Round-Trip Quick Links

*Untuk semua* array `links` yang valid (setiap elemen memiliki `id`, `name`, dan `url`), menyimpan array via `storageSet(STORAGE_KEYS.LINKS, links)` kemudian memuat kembali via `storageGetArray(STORAGE_KEYS.LINKS)` menghasilkan array yang identik dalam hal nilai `name` dan `url` setiap elemen.

**Validates: Requirements 13.4, 13.5**

---

### Property 13: Toggle Tema — Idempoten & Eksklusivitas

*Untuk semua* tema aktif `t ∈ {"light", "dark"}`, memanggil `toggleTheme()` dua kali berturut-turut menghasilkan `storageGet(STORAGE_KEYS.THEME)` yang identik dengan `t`. Selain itu, pada setiap titik waktu, nilai `data-theme` pada elemen `<html>` hanya bernilai `"light"` atau `"dark"` (tidak pernah nilai lain atau kosong).

**Validates: Requirements 14.2, 14.3**

---

### Property 14: Round-Trip Tema via Storage & Pemisahan Tanggung Jawab `applyTheme`

*Untuk semua* nilai tema `t ∈ {"light", "dark"}`, menyimpan `t` via `storageSet(STORAGE_KEYS.THEME, t)` kemudian membaca via `storageGet(STORAGE_KEYS.THEME)` menghasilkan nilai yang identik dengan `t`.

Selain itu, memanggil `applyTheme(t)` hanya mengubah atribut `data-theme` pada elemen `<html>` dan ikon tombol `#theme-toggle` di antarmuka — fungsi ini **tidak** menulis ke `localStorage` secara langsung. Penyimpanan preferensi tema ke `localStorage` adalah tanggung jawab eksklusif `toggleTheme()`.

**Validates: Requirements 14.5, 14.6**

---

## 12. Testing Strategy

> Seluruh pengujian dalam dokumen ini dilakukan **tanpa library, framework, atau file tambahan apapun**. Fungsi `assert()` yang digunakan adalah fungsi sederhana yang ditulis dengan JavaScript standar dan dijalankan langsung di DevTools Console browser. Tidak diperlukan instalasi apapun.

### Fungsi Assert Sederhana

Salin dan tempel fungsi ini di DevTools Console sebelum menjalankan pengujian apapun:

```javascript
function assert(condition, message) {
  if (!condition) {
    console.error('❌ GAGAL:', message);
  } else {
    console.log('✅ LULUS:', message);
  }
}
```

---

### Pengujian Unit via DevTools Console

#### Property 1 — Kelengkapan & Determinisme Sapaan

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.
// (Catatan: Tes ini hanya membaca fungsi — tidak mengubah state apapun.)

const validGreetings = ['Selamat Pagi', 'Selamat Siang', 'Selamat Sore', 'Selamat Malam'];

for (let h = 0; h <= 23; h++) {
  assert(
    validGreetings.includes(getGreeting(h)),
    'jam ' + h + ' menghasilkan sapaan valid'
  );
  assert(
    getGreeting(h) === getGreeting(h),
    'jam ' + h + ' deterministik (panggil dua kali → hasil sama)'
  );
}

// Batas rentang pagi (5–11)
assert(getGreeting(5) === 'Selamat Pagi', 'batas bawah pagi: jam 5');
assert(getGreeting(11) === 'Selamat Pagi', 'batas atas pagi: jam 11');

// Batas rentang siang (12–14)
assert(getGreeting(12) === 'Selamat Siang', 'batas bawah siang: jam 12');
assert(getGreeting(14) === 'Selamat Siang', 'batas atas siang: jam 14');

// Batas rentang sore (15–17)
assert(getGreeting(15) === 'Selamat Sore', 'batas bawah sore: jam 15');
assert(getGreeting(17) === 'Selamat Sore', 'batas atas sore: jam 17');

// Malam (18–23 dan 0–4)
assert(getGreeting(18) === 'Selamat Malam', 'batas bawah malam: jam 18');
assert(getGreeting(23) === 'Selamat Malam', 'batas atas malam: jam 23');
assert(getGreeting(0) === 'Selamat Malam', 'tengah malam: jam 0');
assert(getGreeting(4) === 'Selamat Malam', 'jam 4 subuh: Selamat Malam');
```

---

#### Property 2 — Round-Trip Nama Pengguna

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.

const namaCoba = ['Budi Santoso', 'Ani', '名前', 'João', 'A'.repeat(100)];
namaCoba.forEach(function(nama) {
  storageSet(STORAGE_KEYS.USER_NAME, nama);
  assert(
    storageGet(STORAGE_KEYS.USER_NAME) === nama,
    'round-trip nama: "' + nama + '"'
  );
});

// Kembalikan ke nilai sebelumnya setelah pengujian
storageSet(STORAGE_KEYS.USER_NAME, 'Pengguna');
```

---

#### Property 3 — Monotonik Menurun Timer (simulasi manual)

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.
// Tes ini mengubah state timer — pastikan timer dalam kondisi stopped sebelum memulai.

// Verifikasi nilai awal dalam rentang valid
const timeAwal = getPomodoroTimeLeft(); // getter untuk state internal timeLeft
assert(timeAwal >= 0 && timeAwal <= 1500, 'timeLeft awal dalam rentang 0–1500');

// Mulai timer, amati penurunan selama beberapa detik
startTimer();
let nilaiSebelumnya = getPomodoroTimeLeft();

setTimeout(function() {
  const nilaiSekarang = getPomodoroTimeLeft();
  assert(
    nilaiSekarang <= nilaiSebelumnya,
    'timeLeft setelah 1 detik ≤ nilai sebelumnya (' + nilaiSebelumnya + ' → ' + nilaiSekarang + ')'
  );
  assert(nilaiSekarang >= 0, 'timeLeft tidak pernah negatif');
  nilaiSebelumnya = nilaiSekarang;
  stopTimer(); // hentikan setelah verifikasi
}, 1500);
```

---

#### Property 4 — Reset Universal Timer

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.

// Reset dari kondisi berhenti
resetTimer();
assert(getPomodoroTimeLeft() === 1500, 'Reset dari stopped → timeLeft = 1500');
assert(getPomodoroStatus() === 'stopped', 'Reset dari stopped → status = stopped');

// Reset dari kondisi berjalan
startTimer();
setTimeout(function() {
  resetTimer();
  assert(getPomodoroTimeLeft() === 1500, 'Reset dari running → timeLeft = 1500');
  assert(getPomodoroStatus() === 'stopped', 'Reset dari running → status = stopped');
}, 2000);
```

---

#### Property 6 — Penolakan Input Kosong/Spasi

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.

const inputInvalid = ['', ' ', '   ', '\t', '\n', '  \t  '];
inputInvalid.forEach(function(input) {
  const jumlahSebelum = getTodos().length;
  // Set nilai input secara programatik lalu panggil addTodo
  document.getElementById('todo-input').value = input;
  addTodo();
  assert(
    getTodos().length === jumlahSebelum,
    'input "' + JSON.stringify(input) + '" ditolak, jumlah tugas tidak berubah'
  );
});
```

---

#### Property 7 — Keunikan Tugas (Case-Insensitive)

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.
// Tes ini menambah data ke To-Do List. Bersihkan daftar tugas sebelum menjalankan
// atau gunakan browser profil terpisah.

// Tambah tugas baru
const jumlahSebelum = getTodos().length;
document.getElementById('todo-input').value = 'TestUnik123';
addTodo();
assert(getTodos().length === jumlahSebelum + 1, 'tugas baru "TestUnik123" ditambahkan');

// Coba duplikat dengan variasi huruf — semua harus ditolak
['testunik123', 'TESTUNIK123', 'TeStUnIk123', '  TestUnik123  '].forEach(function(duplikat) {
  const jumlahSaatIni = getTodos().length;
  document.getElementById('todo-input').value = duplikat;
  addTodo();
  assert(
    getTodos().length === jumlahSaatIni,
    'duplikat "' + duplikat + '" ditolak, jumlah tidak berubah'
  );
});
```

---

#### Property 11 — Validasi URL Quick Links

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.

const urlInvalid = ['google.com', 'ftp://example.com', 'www.google.com', 'htp://typo.com', ''];
urlInvalid.forEach(function(url) {
  const jumlahSebelum = getLinks().length;
  document.getElementById('link-name-input').value = 'Tes';
  document.getElementById('link-url-input').value = url;
  addLink();
  assert(
    getLinks().length === jumlahSebelum,
    'URL invalid "' + url + '" ditolak, jumlah links tidak berubah'
  );
});

// URL valid harus diterima
const jumlahSebelumValid = getLinks().length;
document.getElementById('link-name-input').value = 'Google';
document.getElementById('link-url-input').value = 'https://google.com';
addLink();
assert(getLinks().length === jumlahSebelumValid + 1, 'URL valid diterima');
```

---

#### Property 13 — Toggle Tema Idempoten & Eksklusivitas

```javascript
// ⚠️ PERINGATAN: Jalankan tes ini dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.
// Tes ini mengubah preferensi tema Anda.

const temaSaatIni = storageGet(STORAGE_KEYS.THEME) || 'light';

// Toggle dua kali → harus kembali ke tema awal
toggleTheme();
toggleTheme();

assert(
  storageGet(STORAGE_KEYS.THEME) === temaSaatIni,
  'toggle dua kali → tema kembali ke nilai awal (' + temaSaatIni + ')'
);

// Verifikasi eksklusivitas — hanya dua nilai valid
assert(
  ['light', 'dark'].includes(storageGet(STORAGE_KEYS.THEME)),
  'tema aktif hanya "light" atau "dark"'
);

assert(
  ['light', 'dark'].includes(document.documentElement.getAttribute('data-theme')),
  'data-theme pada <html> hanya "light" atau "dark"'
);
```

---

#### Property 14 — Round-Trip Tema via Storage & Pemisahan Tanggung Jawab `applyTheme`

```javascript
// ⚠️ PERINGATAN: Jalankan dengan data percobaan. Tes ini mengubah localStorage.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.
// Setelah selesai, preferensi tema akan berubah ke "light".

// applyTheme() hanya mengubah UI — tidak menyimpan ke localStorage
applyTheme('dark');
assert(
  document.documentElement.getAttribute('data-theme') === 'dark',
  'applyTheme("dark"): data-theme diubah ke dark di UI'
);
// Verifikasi bahwa applyTheme tidak menulis ke localStorage secara langsung
// (penyimpanan dilakukan oleh toggleTheme() atau storageSet() secara eksplisit)

applyTheme('light');
assert(
  document.documentElement.getAttribute('data-theme') === 'light',
  'applyTheme("light"): data-theme diubah ke light di UI'
);

// Round-trip melalui storageSet + storageGet
storageSet(STORAGE_KEYS.THEME, 'dark');
assert(
  storageGet(STORAGE_KEYS.THEME) === 'dark',
  'round-trip: simpan "dark" → baca "dark"'
);

storageSet(STORAGE_KEYS.THEME, 'light');
assert(
  storageGet(STORAGE_KEYS.THEME) === 'light',
  'round-trip: simpan "light" → baca "light"'
);

// Verifikasi loadTheme() membaca dari storage dan menerapkan ke UI
storageSet(STORAGE_KEYS.THEME, 'dark');
loadTheme(); // harus memanggil applyTheme('dark')
assert(
  document.documentElement.getAttribute('data-theme') === 'dark',
  'loadTheme() membaca "dark" dari storage dan menerapkan ke UI'
);

// Kembalikan ke light setelah pengujian
storageSet(STORAGE_KEYS.THEME, 'light');
loadTheme();
assert(
  document.documentElement.getAttribute('data-theme') === 'light',
  'cleanup: dikembalikan ke tema "light"'
);
```

---

### Simulasi Data Corrupt

```javascript
// ⚠️ PERINGATAN: Jalankan dengan data percobaan.
// Tes ini dapat mengubah atau mengosongkan data localStorage Anda.
// Cadangkan data penting sebelum menjalankan.
// Tes ini MENGOSONGKAN data todos dan quickLinks Anda.

// Masukkan data corrupt secara langsung ke localStorage
localStorage.setItem('todos', 'ini bukan JSON valid {{{');
localStorage.setItem('pomodoroState', '{broken:true');
localStorage.setItem('quickLinks', null);
localStorage.setItem('theme', 'invalid-theme-value');

// Reload halaman — aplikasi harus tetap berfungsi dengan nilai default
// Setelah reload, verifikasi di Console:
// assert(getTodos().length === 0, 'todos corrupt → fallback ke array kosong');
// assert(getPomodoroTimeLeft() === 1500, 'pomodoro corrupt → fallback ke 25:00');
// assert(getLinks().length === 0, 'quickLinks corrupt → fallback ke array kosong');
// assert(document.documentElement.getAttribute('data-theme') === 'light',
//        'theme invalid → fallback ke "light"');
```

---

### Tabel Pengujian Manual UI

| No | Fitur | Langkah | Hasil yang Diharapkan |
|---|---|---|---|
| 1 | Greeting — Jam & Tanggal | Buka aplikasi | Jam real-time (HH:MM:SS) dan tanggal hari ini ditampilkan |
| 2 | Greeting — Sapaan | Buka aplikasi pagi hari (05:00–11:59) | Menampilkan "Selamat Pagi, Pengguna" |
| 3 | Greeting — Sapaan | Buka aplikasi siang (12:00–14:59) | Menampilkan "Selamat Siang, Pengguna" |
| 4 | Greeting — Sapaan | Buka aplikasi sore (15:00–17:59) | Menampilkan "Selamat Sore, Pengguna" |
| 5 | Greeting — Sapaan | Buka aplikasi malam (18:00–04:59) | Menampilkan "Selamat Malam, Pengguna" |
| 6 | Greeting — Ubah Nama | Klik ✏️ → ketik "Budi" → klik Simpan | Sapaan berubah menjadi "Selamat Pagi, Budi" |
| 7 | Greeting — Nama Kosong | Klik ✏️ → kosongkan input → klik Simpan | Input ditolak, nama tidak berubah |
| 8 | Greeting — Persistensi | Simpan nama "Budi" → refresh halaman | Nama "Budi" masih tampil setelah refresh |
| 9 | Pomodoro — Start | Klik Start | Timer mulai menghitung mundur dari 25:00, tombol Start disabled, tombol Stop aktif |
| 10 | Pomodoro — Stop | Klik Start → tunggu 3 detik → klik Stop | Timer berhenti di nilai saat ini, tombol Start aktif kembali |
| 11 | Pomodoro — Reset saat Running | Klik Start → tunggu 5 detik → klik Reset | Timer kembali ke 25:00, status stopped |
| 12 | Pomodoro — Reset setelah 00:00 | Tunggu timer mencapai 00:00 → klik Reset | Timer kembali ke 25:00, pesan selesai hilang |
| 13 | Pomodoro — Tombol Disabled | Timer berjalan | Tombol Start disabled; timer berhenti → tombol Stop disabled |
| 14 | Pomodoro — Reload saat Running | Klik Start → tunggu 10 detik → refresh halaman | Timer lanjut dari nilai yang sudah dikurangi 10 detik |
| 15 | Pomodoro — Reload saat Stopped | Klik Stop → refresh halaman | Timer menampilkan nilai terakhir sebelum refresh |
| 16 | To-Do — Tambah Tugas | Ketik "Belajar JavaScript" → klik + | Tugas baru muncul di daftar |
| 17 | To-Do — Tolak Kosong | Klik + tanpa mengisi input | Pesan peringatan muncul, daftar tidak berubah |
| 18 | To-Do — Tolak Duplikat | Tambah "Belajar" → tambah "belajar" lagi | Pesan peringatan duplikat muncul, tugas tidak ditambahkan |
| 19 | To-Do — Edit Tugas | Klik ✏️ pada tugas → ubah teks → konfirmasi | Teks tugas diperbarui |
| 20 | To-Do — Batalkan Edit | Klik ✏️ → ubah teks → klik Batal | Teks tugas kembali ke nilai semula |
| 21 | To-Do — Toggle Selesai | Klik checkbox tugas | Tugas ditandai selesai (visual berubah) |
| 22 | To-Do — Toggle Ulang | Klik checkbox dua kali | Tugas kembali ke status belum selesai |
| 23 | To-Do — Hapus | Klik 🗑️ pada tugas | Tugas dihapus, tugas lain tidak berubah |
| 24 | To-Do — Persistensi | Tambah tugas → refresh halaman | Tugas masih ada setelah refresh |
| 25 | Quick Links — Tambah Valid | Isi "Google" + "https://google.com" → klik + | Tautan muncul di daftar |
| 26 | Quick Links — URL Invalid | Isi "Google" + "google.com" → klik + | Pesan error URL muncul, tautan tidak ditambahkan |
| 27 | Quick Links — Buka Tab Baru | Klik nama tautan | Tautan terbuka di tab baru |
| 28 | Quick Links — Hapus | Klik 🗑️ pada tautan | Tautan dihapus |
| 29 | Quick Links — Persistensi | Tambah tautan → refresh halaman | Tautan masih ada setelah refresh |
| 30 | Tema — Toggle | Klik tombol ☀️/🌙 | Tema beralih antara terang dan gelap; ikon tombol berubah |
| 31 | Tema — Persistensi | Aktifkan tema gelap → refresh halaman | Tema gelap masih aktif setelah refresh |
| 32 | Tema — Tidak FOUC | Refresh halaman dengan tema gelap | Halaman langsung tampil dengan tema gelap (tidak berkedip terang sebentar) |
| 33 | Responsivitas — Mobile | Resize browser ke < 768px | Tampilan berubah ke 1 kolom, semua konten tetap terlihat |
| 34 | Responsivitas — Touch Target | Buka di perangkat mobile | Semua tombol dapat diklik dengan mudah (min 44×44px) |

---

## 13. Urutan Implementasi

Tujuh tahap dengan dependensi yang jelas:

### Tahap 1 — Fondasi (tanpa dependensi)

1. **Struktur HTML** (`index.html`) — kerangka lengkap dengan semua ID dan class sesuai Bagian 5
2. **CSS dasar + variabel tema + grid + breakpoints** (`css/style.css`) — layout dua kolom, tema terang/gelap, tombol touch-target
3. **StorageManager** (`script.js`) — `storageGet`, `storageSet`, `storageGetArray`, `storageGetObject`

### Tahap 2 — Greeting Widget (depends: StorageManager, CSS)

4. `updateClock()` dengan `setInterval` 1 detik — jam dan tanggal real-time
5. `getGreeting(hour)` — pure function, sapaan berbasis rentang jam
6. Fungsi nama pengguna — `loadUserName()`, `saveUserName()`, `activateEditName()`, `confirmEditName()`, `cancelEditName()`, validasi kosong

### Tahap 3 — Theme Manager (depends: StorageManager, CSS)

7. `applyTheme()`, `loadTheme()`, `toggleTheme()`

   **⚠️ Penting:** `loadTheme()` HARUS dipanggil PERTAMA dalam `init()` untuk mencegah FOUC. Pastikan CSS variables dan atribut `data-theme` sudah terdefinisi sebelum konten lain dirender.

### Tahap 4 — To-Do List (depends: StorageManager)

8. `loadTodos()`, `renderTodos()` — baca storage, render daftar ke DOM
9. `addTodo()` — validasi kosong + duplikat, tambah ke array, render ulang
10. `toggleTodo(id)`, `deleteTodo(id)` — ubah state, simpan, render ulang
11. `activateEditTodo(id)`, `confirmEditTodo(id)`, `cancelEditTodo(id)` — mode edit inline

### Tahap 5 — Pomodoro Timer (depends: StorageManager)

12. `loadPomodoroState()` — baca storage dengan koreksi timestamp untuk kasus reload saat running
13. `formatTime(seconds)`, `updatePomodoroUI()` — format MM:SS, update display & state tombol
14. `startTimer()`, `stopTimer()`, `resetTimer()`, `tickTimer()`, `timerFinished()`

### Tahap 6 — Quick Links (depends: StorageManager)

15. `loadLinks()`, `renderLinks()` — baca storage, render daftar ke DOM
16. `addLink()` — validasi nama + URL, tambah ke array, render ulang
17. `deleteLink(id)` — hapus dari array, simpan, render ulang

### Tahap 7 — Integrasi & Pengujian

18. `init()` dengan urutan kritis:

```javascript
function init() {
  loadTheme();              // 1. PERTAMA: cegah FOUC
  updateClock();            // 2. Jam & sapaan langsung tampil
  loadUserName();           // 3. Nama pengguna
  loadPomodoroState();      // 4. Pulihkan timer (dengan koreksi timestamp)
  loadTodos();              // 5. Render daftar tugas
  loadLinks();              // 6. Render daftar tautan
  registerEventListeners(); // 7. Aktifkan semua interaksi
}
document.addEventListener('DOMContentLoaded', init);
```

19. `registerEventListeners()` — daftarkan semua event listener (theme, greeting, pomodoro, todo, quicklinks)
20. **Pengujian lintas browser:** Chrome, Firefox, Edge, Safari — verifikasi CSS variables, localStorage, dan `setInterval` bekerja konsisten

### Diagram Dependensi Tahap

```
Tahap 1 (Fondasi)
    │
    ├──▶ Tahap 2 (Greeting)
    ├──▶ Tahap 3 (Theme)
    ├──▶ Tahap 4 (To-Do)
    ├──▶ Tahap 5 (Pomodoro)
    └──▶ Tahap 6 (Quick Links)
              │
              └──▶ Tahap 7 (Integrasi & Testing)
```

Tahap 2–6 tidak bergantung satu sama lain dan dapat dikerjakan secara paralel setelah Tahap 1 selesai.
