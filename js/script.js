/* ============================================================
   To-Do List Life Dashboard
   js/script.js
   ============================================================ */


/* ============================================================
   TASK 1.4 — KONSTANTA & STORAGE MANAGER
   ============================================================ */


// ============================================================
// KONSTANTA
// Nilai-nilai tetap yang digunakan di seluruh aplikasi.
// Menggunakan satu objek STORAGE_KEYS agar nama key localStorage
// tidak tersebar (hardcode) di banyak tempat — cukup ubah di sini.
// ============================================================

const STORAGE_KEYS = {
  USER_NAME: 'userName',       // nama pengguna untuk sapaan
  POMODORO:  'pomodoroState',  // status dan sisa waktu timer
  TODOS:     'todos',          // daftar tugas
  LINKS:     'quickLinks',     // daftar tautan favorit
  THEME:     'theme'           // preferensi tema terang/gelap
};

// Durasi satu sesi Pomodoro dalam detik (25 menit × 60 detik)
const POMODORO_DURATION = 1500;


// ============================================================
// STORAGE MANAGER
// Lapisan tipis di atas localStorage. Semua baca/tulis data
// melewati fungsi-fungsi ini — tidak ada yang langsung menyentuh
// localStorage.getItem / setItem di tempat lain.
//
// Manfaat:
//   1. Satu tempat untuk menangani error (try/catch)
//   2. Mudah diganti jika suatu saat ingin pakai storage lain
//   3. Kode fitur jadi lebih bersih dan mudah dibaca
// ============================================================

/**
 * Membaca nilai mentah (string) dari localStorage.
 *
 * @param  {string} key  - Nama kunci yang ingin dibaca
 * @returns {string|null} - Nilai string, atau null jika tidak ada / error
 *
 * Kenapa try/catch?
 *   localStorage bisa gagal di mode Incognito/Private yang sudah
 *   penuh, atau di browser tertentu dengan setting ketat.
 *   Daripada aplikasi crash, kita kembalikan null dan tangani di
 *   fungsi pemanggil.
 */
function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('[Storage] Gagal membaca key "' + key + '":', e);
    return null;
  }
}

/**
 * Menyimpan nilai ke localStorage.
 * Jika value bukan string (misal: array atau objek), secara
 * otomatis diubah ke JSON string terlebih dahulu.
 *
 * @param {string} key   - Nama kunci
 * @param {*}      value - Nilai yang ingin disimpan
 */
function storageSet(key, value) {
  try {
    var toStore = (typeof value === 'string') ? value : JSON.stringify(value);
    localStorage.setItem(key, toStore);
  } catch (e) {
    // Kemungkinan: storage penuh (QuotaExceededError) atau mode private
    console.warn('[Storage] Gagal menyimpan key "' + key + '":', e);
  }
}

/**
 * Membaca nilai dari localStorage dan mem-parse-nya sebagai array.
 *
 * Digunakan untuk: daftar tugas (todos) dan daftar tautan (quickLinks).
 *
 * @param  {string} key - Nama kunci
 * @returns {Array}     - Array hasil parse, atau [] jika:
 *                        - Key belum ada di localStorage
 *                        - Data tersimpan bukan JSON valid
 *                        - Hasil parse bukan array
 */
function storageGetArray(key) {
  try {
    var raw = localStorage.getItem(key);

    // Key belum pernah disimpan
    if (raw === null) return [];

    var parsed = JSON.parse(raw);

    // Pastikan hasil parse memang sebuah array (bukan objek atau angka)
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // JSON.parse gagal → data corrupt
    console.warn('[Storage] Data tidak valid untuk key "' + key + '", fallback ke []:', e);
    return [];
  }
}

/**
 * Membaca nilai dari localStorage dan mem-parse-nya sebagai objek.
 *
 * Digunakan untuk: pomodoroState (objek dengan timeLeft, status, savedAt).
 *
 * @param  {string} key          - Nama kunci
 * @param  {Object} defaultValue - Nilai cadangan jika data tidak ada/corrupt
 * @returns {Object}             - Objek hasil parse, atau defaultValue sebagai fallback
 */
function storageGetObject(key, defaultValue) {
  try {
    var raw = localStorage.getItem(key);

    // Key belum pernah disimpan → kembalikan nilai default
    if (raw === null) return defaultValue;

    var parsed = JSON.parse(raw);

    // Pastikan hasil parse adalah objek (bukan null, array, atau tipe primitif)
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }

    return defaultValue;
  } catch (e) {
    // JSON.parse gagal → data corrupt → kembalikan nilai default
    console.warn('[Storage] Data tidak valid untuk key "' + key + '", fallback ke default:', e);
    return defaultValue;
  }
}


// ============================================================
// GREETING
// Task 2.1 — Tampilan Jam dan Tanggal Real-Time
// Task 2.2 — Sapaan Dinamis (getGreeting, diisi nanti)
// Task 2.3 — Nama Pengguna
// ============================================================

/**
 * getGreeting(hour) — mengembalikan sapaan sesuai waktu.
 *
 * Rentang jam yang digunakan (sesuai requirements.md):
 *   05:00 – 11:59  → "Selamat Pagi"
 *   12:00 – 14:59  → "Selamat Siang"
 *   15:00 – 17:59  → "Selamat Sore"
 *   18:00 – 04:59  → "Selamat Malam"  (termasuk tengah malam 00–04)
 *
 * Ini adalah pure function: output hanya bergantung pada input,
 * tidak membaca DOM atau localStorage, sehingga mudah diuji
 * langsung dari Console tanpa membuka halaman.
 *
 * @param  {number} hour - Jam saat ini dalam rentang 0–23
 * @returns {string}     - Salah satu dari empat sapaan
 */
function getGreeting(hour) {
  if (hour >= 5 && hour < 12) {
    return 'Selamat Pagi';    // 05:00 – 11:59
  }
  if (hour >= 12 && hour < 15) {
    return 'Selamat Siang';   // 12:00 – 14:59
  }
  if (hour >= 15 && hour < 18) {
    return 'Selamat Sore';    // 15:00 – 17:59
  }
  return 'Selamat Malam';     // 18:00 – 04:59 (sisanya, termasuk 00–04)
}

/**
 * updateClock() — memperbarui tampilan tanggal, jam, dan sapaan.
 *
 * Dipanggil:
 *   1. Sekali saat halaman dimuat (di init(), Task 7)
 *   2. Setiap 1 detik oleh setInterval (di init(), Task 7)
 *
 * Elemen HTML yang diperbarui:
 *   - #current-date  → tanggal panjang bahasa Indonesia
 *   - #current-time  → jam dalam format HH:MM:SS
 *   - #greeting-text → sapaan + nama (greeting diisi Task 2.2,
 *                       nama diisi Task 2.3; untuk sekarang
 *                       hanya bagian tanggal/jam yang aktif)
 */
function updateClock() {
  var now = new Date();

  // --- Tanggal ---
  // toLocaleDateString dengan locale 'id-ID' menghasilkan format:
  // "Jumat, 9 Oktober 2026"
  var dateString = now.toLocaleDateString('id-ID', {
    weekday: 'long',   // "Jumat"
    year:    'numeric', // "2026"
    month:   'long',   // "Oktober"
    day:     'numeric'  // "9"
  });

  var dateEl = document.getElementById('current-date');
  if (dateEl) {
    dateEl.textContent = dateString;
  }

  // --- Jam ---
  // toLocaleTimeString dengan locale 'id-ID' + hour12:false menghasilkan:
  // "08:30:05"  (format 24 jam, dua digit, dengan detik)
  var timeString = now.toLocaleTimeString('id-ID', {
    hour12:  false,
    hour:    '2-digit',
    minute:  '2-digit',
    second:  '2-digit'
  });

  var timeEl = document.getElementById('current-time');
  if (timeEl) {
    timeEl.textContent = timeString;
  }

  // --- Sapaan ---
  // getGreeting() mengembalikan salah satu dari empat sapaan.
  // Nama pengguna diambil dari #user-name yang diperbarui oleh
  // loadUserName() (Task 2.3) saat halaman pertama dimuat.
  var greetingWord = getGreeting(now.getHours());

  // Ambil nama terkini dari span #user-name di DOM.
  // loadUserName() (Task 2.3) sudah mengisinya dari localStorage.
  var nameEl   = document.getElementById('user-name');
  var userName = nameEl ? nameEl.textContent.trim() : 'Pengguna';
  if (!userName) { userName = 'Pengguna'; }

  var greetingEl = document.getElementById('greeting-text');
  if (greetingEl) {
    // Tulis ulang innerHTML agar span #user-name tetap ada di DOM
    // (dibutuhkan oleh fungsi-fungsi Task 2.3).
    greetingEl.innerHTML = greetingWord + ', <span id="user-name">' + userName + '</span>';
  }
}

// ------------------------------------------------------------
// CATATAN UNTUK TASK 7 (init):
// Dua baris berikut akan dipindahkan ke dalam fungsi init()
// dan dipanggil setelah DOMContentLoaded.
// Jangan aktifkan di sini sekarang — DOM belum tentu siap
// saat script.js dimuat jika dipanggil di luar event listener.
//
//   updateClock();                      ← panggil sekali langsung
//   setInterval(updateClock, 1000);     ← ulangi setiap 1 detik
// ------------------------------------------------------------

// ============================================================
// Task 2.3 — NAMA PENGGUNA
// Fungsi-fungsi untuk memuat, menyimpan, dan mengelola
// mode edit nama pengguna di Greeting Widget.
// ============================================================

/**
 * loadUserName() — membaca nama dari localStorage dan menampilkannya
 * pada #user-name. Dipanggil sekali di init() sebelum updateClock().
 *
 * Jika belum ada nama tersimpan, fallback ke "Pengguna".
 */
function loadUserName() {
  var saved = storageGet(STORAGE_KEYS.USER_NAME);

  // null  = belum pernah disimpan
  // ''    = disimpan kosong (tidak seharusnya, tapi tangani dengan aman)
  var name = (saved && saved.trim()) ? saved.trim() : 'Pengguna';

  var nameEl = document.getElementById('user-name');
  if (nameEl) {
    nameEl.textContent = name;
  }
}

/**
 * saveUserName(name) — menyimpan nama ke localStorage dan memperbarui DOM.
 *
 * Jika name kosong atau hanya spasi, simpan "Pengguna" sebagai fallback.
 *
 * @param {string} name - Nama baru yang dimasukkan pengguna
 */
function saveUserName(name) {
  var trimmed = (typeof name === 'string') ? name.trim() : '';
  var toSave  = trimmed || 'Pengguna';

  // Simpan ke localStorage
  storageSet(STORAGE_KEYS.USER_NAME, toSave);

  // Perbarui span #user-name di DOM agar sapaan langsung berubah
  var nameEl = document.getElementById('user-name');
  if (nameEl) {
    nameEl.textContent = toSave;
  }
}

/**
 * activateEditName() — menampilkan form edit nama dan menyembunyikan
 * tombol ✏️. Field input diisi dengan nama yang sedang tampil.
 */
function activateEditName() {
  var editForm  = document.getElementById('edit-name-form');
  var editBtn   = document.getElementById('edit-name-btn');
  var nameInput = document.getElementById('name-input');
  var nameEl    = document.getElementById('user-name');

  if (!editForm || !editBtn || !nameInput) { return; }

  // Pre-fill input dengan nama saat ini
  var currentName = nameEl ? nameEl.textContent.trim() : '';
  nameInput.value = (currentName === 'Pengguna') ? '' : currentName;

  // Tampilkan form, sembunyikan tombol edit
  editForm.removeAttribute('hidden');
  editBtn.setAttribute('hidden', '');

  // Langsung fokus ke input agar pengguna bisa langsung mengetik
  nameInput.focus();
}

/**
 * confirmEditName() — membaca nilai dari #name-input, menyimpannya,
 * dan menutup mode edit. Nama kosong/spasi akan diganti "Pengguna".
 */
function confirmEditName() {
  var nameInput = document.getElementById('name-input');
  if (!nameInput) { return; }

  var newName = nameInput.value;
  saveUserName(newName);   // validasi dan simpan ada di saveUserName()
  closeEditNameForm();
}

/**
 * cancelEditName() — menutup form edit tanpa mengubah nama.
 */
function cancelEditName() {
  closeEditNameForm();
}

/**
 * closeEditNameForm() — helper internal: sembunyikan form edit,
 * tampilkan kembali tombol ✏️, dan bersihkan field input.
 * Dipanggil oleh confirmEditName() dan cancelEditName().
 */
function closeEditNameForm() {
  var editForm  = document.getElementById('edit-name-form');
  var editBtn   = document.getElementById('edit-name-btn');
  var nameInput = document.getElementById('name-input');

  if (editForm)  { editForm.setAttribute('hidden', ''); }
  if (editBtn)   { editBtn.removeAttribute('hidden'); }
  if (nameInput) { nameInput.value = ''; }
}

// ------------------------------------------------------------
// CATATAN UNTUK TASK 7 (init) — nama pengguna:
// Tambahkan baris berikut di dalam init(), sebelum updateClock():
//
//   loadUserName();   ← muat nama dari localStorage ke #user-name
//                        sebelum updateClock() membaca #user-name
//
// Event listener yang perlu didaftarkan di registerEventListeners():
//   #edit-name-btn   → click  → activateEditName()
//   #save-name-btn   → click  → confirmEditName()
//   #cancel-name-btn → click  → cancelEditName()
//   #name-input      → keydown → Enter: confirmEditName()
//                              → Escape: cancelEditName()
// ------------------------------------------------------------


// ============================================================
// POMODORO TIMER
// (akan diisi di Task 5)
// ============================================================

let pomodoroRemaining = POMODORO_DURATION;
let pomodoroInterval = null;
let pomodoroRunning = false;


function renderPomodoro() {
  const display = document.getElementById('pomodoro-display');

  if (!display) return;

  const minutes = Math.floor(pomodoroRemaining / 60);
  const seconds = pomodoroRemaining % 60;

  display.textContent =
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0');
}


function startPomodoro() {
  if (pomodoroRunning) return;

  if (pomodoroRemaining <= 0) return;

  pomodoroRunning = true;

  pomodoroInterval = setInterval(function() {
    pomodoroRemaining--;
    renderPomodoro();

    if (pomodoroRemaining <= 0) {
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;
      pomodoroRunning = false;

      const doneMessage = document.getElementById('pomodoro-done-msg');
      if (doneMessage) {
        doneMessage.hidden = false;
      }
    }
  }, 1000);
}


function stopPomodoro() {
  if (pomodoroInterval !== null) {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
  }

  pomodoroRunning = false;
}


function resetPomodoro() {
  stopPomodoro();

  pomodoroRemaining = POMODORO_DURATION;

  const doneMessage = document.getElementById('pomodoro-done-msg');
  if (doneMessage) {
    doneMessage.hidden = true;
  }

  renderPomodoro();
}

// ============================================================
// TODO LIST
// (akan diisi di Task 4)
// ============================================================

 // === TODO LIST ===

let todos = [];

function loadTodos() {
  todos = storageGetArray(STORAGE_KEYS.TODOS);
  renderTodos();
}

function saveTodos() {
  storageSet(STORAGE_KEYS.TODOS, todos);
}


function isDuplicateTodo(text, excludeId) {
  const normalizedText = text.toLowerCase().trim();

  return todos.some(function(todo) {
    if (todo.id === excludeId) {
      return false;
    }

    return todo.text.toLowerCase().trim() === normalizedText;
  });
}


function addTodo() {
  const input = document.getElementById('todo-input');
  const warning = document.getElementById('todo-warning');
  const value = input.value;

  // Validasi tugas kosong
  if (value.trim() === '') {
    warning.textContent = 'Tugas tidak boleh kosong.';
    warning.hidden = false;
    return;
  }

  // Validasi tugas duplikat
  if (isDuplicateTodo(value, null)) {
    warning.textContent = 'Tugas sudah ada dalam daftar.';
    warning.hidden = false;
    return;
  }

  // Buat dan tambahkan tugas baru
  const newTodo = {
    id: Date.now(),
    text: value.trim(),
    completed: false
  };

  todos.push(newTodo);

  // Simpan dan tampilkan ulang daftar
  saveTodos();
  renderTodos();

  // Bersihkan input dan pesan peringatan
  input.value = '';
  warning.hidden = true;
}


function toggleTodo(id) {
  const todo = todos.find(function(todo) {
    return todo.id === id;
  });

  if (!todo) return;

  todo.completed = !todo.completed;

  saveTodos();
  renderTodos();
}


function deleteTodo(id) {
  todos = todos.filter(function(todo) {
    return todo.id !== id;
  });

  saveTodos();
  renderTodos();
}


function activateEditTodo(id) {
  const todoItem = document.querySelector(
    '.todo-item[data-id="' + id + '"]'
  );

  if (!todoItem) return;

  const todoText = todoItem.querySelector('.todo-text');
  if (!todoText) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-edit-input';
  input.value = todoText.textContent;

  todoItem.replaceChild(input, todoText);
  input.focus();
  input.select();

  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      confirmEditTodo(id, input.value);
    }

    if (event.key === 'Escape') {
      renderTodos();
    }
  });
}

function confirmEditTodo(id, newText) {
  const text = newText.trim();
  const warning = document.getElementById('todo-warning');

  if (text === '') {
    warning.textContent = 'Tugas tidak boleh kosong.';
    warning.hidden = false;
    renderTodos();
    return;
  }

  if (isDuplicateTodo(text, id)) {
    warning.textContent = 'Tugas sudah ada dalam daftar.';
    warning.hidden = false;
    renderTodos();
    return;
  }

  const todo = todos.find(function(todo) {
    return todo.id === id;
  });

  if (!todo) return;

  todo.text = text;

  saveTodos();
  renderTodos();
  warning.hidden = true;
}

function renderTodos() {
  const todoList = document.getElementById('todo-list');

  if (!todoList) return;

  // Kosongkan daftar sebelum menampilkan ulang
  todoList.innerHTML = '';

  todos.forEach(function(todo) {
    // Buat elemen utama tugas
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;

    // Tandai tugas yang sudah selesai
    if (todo.completed === true) {
      li.classList.add('completed');
    }

    // Checkbox untuk status tugas
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed === true;
    checkbox.setAttribute('aria-label', 'Tandai tugas selesai');

    checkbox.addEventListener('change', function() {
      toggleTodo(todo.id);
    });

    // Teks tugas
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    // Tombol edit
    const editButton = document.createElement('button');
    editButton.className = 'todo-edit-btn';
    editButton.textContent = '✏️';
    editButton.setAttribute('aria-label', 'Edit tugas');

    editButton.addEventListener('click', function() {
      activateEditTodo(todo.id);
    });

    // Tombol hapus
    const deleteButton = document.createElement('button');
    deleteButton.className = 'todo-delete-btn';
    deleteButton.textContent = '🗑️';
    deleteButton.setAttribute('aria-label', 'Hapus tugas');

    deleteButton.addEventListener('click', function() {
      deleteTodo(todo.id);
    });

    // Masukkan semua elemen ke dalam tugas
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    // Masukkan tugas ke daftar
    todoList.appendChild(li);
  });
}

// ============================================================
// QUICK LINKS
// (akan diisi di Task 6)
// ============================================================

let quickLinks = [];
let editingLinkId = null;


function loadQuickLinks() {
  quickLinks = storageGetArray(STORAGE_KEYS.LINKS);
  renderQuickLinks();
}

function saveQuickLinks() {
  storageSet(STORAGE_KEYS.LINKS, quickLinks);
}


function renderQuickLinks() {
  const list = document.getElementById('quicklinks-list');
  if (!list) return;

  list.innerHTML = '';

  quickLinks.forEach(function(link) {
    const li = document.createElement('li');
    li.className = 'quicklink-item';
    li.dataset.id = link.id;

    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.textContent = link.name;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'quicklink-delete-btn';
    deleteButton.textContent = '🗑️';
    deleteButton.setAttribute('aria-label', 'Hapus tautan');

    deleteButton.addEventListener('click', function() {
      deleteQuickLink(link.id);
    });

    li.appendChild(anchor);
    li.appendChild(deleteButton);
    list.appendChild(li);
  });
}


function addQuickLink() {
  const nameInput = document.getElementById('link-name-input');
  const urlInput = document.getElementById('link-url-input');
  const warning = document.getElementById('link-warning');

  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (name === '' || url === '') {
    warning.textContent = 'Nama dan URL tautan wajib diisi.';
    warning.hidden = false;
    return;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch (error) {
    warning.textContent = 'URL tidak valid.';
    warning.hidden = false;
    return;
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    warning.textContent = 'URL harus menggunakan HTTP atau HTTPS.';
    warning.hidden = false;
    return;
  }

  const newLink = {
    id: Date.now(),
    name: name,
    url: parsedUrl.href
  };

  quickLinks.push(newLink);

  saveQuickLinks();
  renderQuickLinks();

  nameInput.value = '';
  urlInput.value = '';
  warning.hidden = true;
}


function deleteQuickLink(id) {
  quickLinks = quickLinks.filter(function(link) {
    return link.id !== id;
  });

  saveQuickLinks();
  renderQuickLinks();
}

// ============================================================
// THEME MANAGER — Task 3.1
// Tiga fungsi dengan tanggung jawab yang dipisah secara ketat:
//   applyTheme()  → ubah UI saja, tidak menyimpan ke storage
//   loadTheme()   → baca storage → panggil applyTheme()
//   toggleTheme() → balik tema → panggil applyTheme() + simpan
// ============================================================

/**
 * applyTheme(theme) — menerapkan tema ke antarmuka.
 *
 * Yang dikerjakan:
 *   1. Set atribut data-theme pada <html> → CSS custom properties
 *      langsung berganti, semua warna berubah seketika.
 *   2. Perbarui ikon tombol #theme-toggle sesuai tema aktif.
 *
 * Yang TIDAK dikerjakan:
 *   Fungsi ini TIDAK menyimpan ke localStorage.
 *   Penyimpanan adalah tanggung jawab toggleTheme().
 *
 * @param {string} theme - "light" atau "dark"
 */
function applyTheme(theme) {
  // Terapkan ke <html data-theme="...">
  // CSS di style.css sudah siap membaca atribut ini dan
  // mengganti semua variabel warna secara otomatis.
  document.documentElement.setAttribute('data-theme', theme);

  // Perbarui ikon tombol:
  //   Tema terang aktif → tampilkan 🌙 (menunjukkan opsi gelap)
  //   Tema gelap aktif  → tampilkan ☀️ (menunjukkan opsi terang)
  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = (theme === 'dark') ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label',
      (theme === 'dark') ? 'Beralih ke tema terang' : 'Beralih ke tema gelap'
    );
  }
}

/**
 * loadTheme() — membaca preferensi tema dari localStorage dan
 * menerapkannya ke UI. Dipanggil PERTAMA dalam DOMContentLoaded
 * untuk mencegah FOUC (Flash of Unstyled Content).
 *
 * Jika tidak ada preferensi tersimpan, default ke "light".
 */
function loadTheme() {
  var saved = storageGet(STORAGE_KEYS.THEME);

  // Hanya terima "light" atau "dark" — nilai lain → fallback ke "light"
  var theme = (saved === 'dark') ? 'dark' : 'light';

  applyTheme(theme);
}

/**
 * toggleTheme() — membalik tema aktif dan menyimpan preferensi.
 *
 * Alur:
 *   1. Baca tema aktif dari atribut data-theme pada <html>
 *   2. Balik: "light" → "dark" atau "dark" → "light"
 *   3. Terapkan ke UI via applyTheme()
 *   4. Simpan ke localStorage (satu-satunya fungsi yang menyimpan tema)
 *
 * Dipanggil oleh event listener klik pada #theme-toggle.
 */
function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  var next    = (current === 'dark') ? 'light' : 'dark';

  applyTheme(next);
  storageSet(STORAGE_KEYS.THEME, next);
}


// ============================================================
// INIT
// Task 2.3 — Bootstrap sementara untuk Greeting Widget
// Catatan: blok ini akan DIGANTI SELURUHNYA di Task 7 dengan
// fungsi init() dan registerEventListeners() yang lengkap.
// Semua pemanggilan di sini akan dipindahkan ke sana.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // --- 1. Tema: HARUS dipanggil PERTAMA ---
  // Mencegah FOUC: tanpa ini, halaman sekilas tampil dengan tema
  // terang sebelum tema gelap diterapkan (kedipan terlihat oleh mata).
  loadTheme();

  // --- Event listener: tombol toggle tema ---
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // --- Muat nama pengguna dari localStorage ---
  // Harus dijalankan sebelum updateClock() agar sapaan pertama
  // sudah menampilkan nama yang benar (bukan "Pengguna" default HTML).
  loadUserName();

  // --- Jalankan jam sekali langsung, lalu ulangi tiap detik ---
  updateClock();
  setInterval(updateClock, 1000);

  // --- Muat daftar tugas dari localStorage ---
  loadTodos();

  const todoAddButton = document.getElementById('todo-add-btn');
    
  if (todoAddButton) {
    todoAddButton.addEventListener('click', addTodo);
  }

  
  // Hubungkan tombol Pomodoro
  const pomodoroStartButton = document.getElementById('pomodoro-start');
  const pomodoroStopButton = document.getElementById('pomodoro-stop');
  const pomodoroResetButton = document.getElementById('pomodoro-reset');

  if (pomodoroStartButton) {
    pomodoroStartButton.addEventListener('click', startPomodoro);
  }

  if (pomodoroStopButton) {
    pomodoroStopButton.addEventListener('click', stopPomodoro);
  }

  if (pomodoroResetButton) {
    pomodoroResetButton.addEventListener('click', resetPomodoro);
  }

  renderPomodoro();

  
  // Hubungkan tombol Quick Links
  const linkAddButton = document.getElementById('link-add-btn');

  if (linkAddButton) {
    linkAddButton.addEventListener('click', addQuickLink);
  }

  loadQuickLinks();


  // --- Event listener: tombol edit nama (✏️) ---
  var editBtn = document.getElementById('edit-name-btn');
  if (editBtn) {
    editBtn.addEventListener('click', activateEditName);
  }

  // --- Event listener: tombol Simpan ---
  var saveBtn = document.getElementById('save-name-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', confirmEditName);
  }

  // --- Event listener: tombol Batal ---
  var cancelBtn = document.getElementById('cancel-name-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelEditName);
  }

  // --- Event listener: keyboard pada field input nama ---
  // Enter  → simpan nama (sama seperti klik Simpan)
  // Escape → batal edit (sama seperti klik Batal)
  var nameInput = document.getElementById('name-input');
  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter')  { confirmEditName(); }
      if (e.key === 'Escape') { cancelEditName();  }
    });
  }

});





