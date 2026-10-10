# Dokumen Requirements

## Pendahuluan

To-Do List Life Dashboard adalah aplikasi web berbasis klien yang berfungsi sebagai dasbor produktivitas pribadi. Aplikasi ini menggabungkan beberapa widget dalam satu antarmuka: Greeting Widget yang menampilkan tanggal, jam, dan sapaan dinamis; To-Do List untuk manajemen tugas; Pomodoro Timer untuk teknik manajemen waktu; Quick Links untuk akses cepat ke tautan penting; serta dukungan Light/Dark Mode. Seluruh data disimpan secara lokal menggunakan `localStorage` tanpa ketergantungan pada server atau framework eksternal.

---

## Glosarium

- **Aplikasi**: Keseluruhan sistem To-Do List Life Dashboard yang berjalan di browser pengguna.
- **Greeting_Widget**: Komponen antarmuka yang menampilkan tanggal, jam real-time, sapaan dinamis, dan nama pengguna.
- **Todo_List**: Komponen antarmuka yang mengelola daftar tugas, termasuk penambahan, pengeditan, penandaan selesai, dan penghapusan tugas.
- **Pomodoro_Timer**: Komponen antarmuka yang mengimplementasikan teknik Pomodoro dengan hitungan mundur 25 menit beserta kontrol Start, Stop, dan Reset.
- **Quick_Links**: Komponen antarmuka yang menampilkan dan mengelola daftar tautan favorit yang dapat diklik.
- **Theme_Manager**: Komponen yang mengelola preferensi tema tampilan (terang/gelap) dan menerapkannya ke seluruh antarmuka.
- **Storage_Manager**: Lapisan abstraksi yang bertanggung jawab atas seluruh operasi baca dan tulis ke `localStorage`.
- **Local_Storage**: Web API `localStorage` yang digunakan sebagai satu-satunya mekanisme penyimpanan data persisten di sisi klien.
- **Tema_Terang**: Skema warna antarmuka dengan latar belakang terang dan teks gelap.
- **Tema_Gelap**: Skema warna antarmuka dengan latar belakang gelap dan teks terang.

---

## Requirements

### Requirement 1: Greeting Widget — Tampilan Tanggal dan Waktu Real-Time

**User Story:** Sebagai pengguna, saya ingin melihat tanggal saat ini dan jam yang diperbarui secara real-time, agar saya selalu mengetahui waktu terkini tanpa meninggalkan dasbor.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL menampilkan tanggal saat ini dalam format lengkap berbahasa Indonesia (contoh: "Senin, 26 Mei 2025").
2. THE Greeting_Widget SHALL menampilkan waktu saat ini dalam format 24 jam (HH:MM:SS).
3. WHEN tampilan waktu diperbarui, THE Greeting_Widget SHALL memperbarui jam setiap satu detik tanpa memuat ulang halaman.
4. WHEN pengguna membuka aplikasi, THE Greeting_Widget SHALL langsung menampilkan waktu yang akurat tanpa jeda yang terlihat.

---

### Requirement 2: Greeting Widget — Sapaan Dinamis Sesuai Waktu

**User Story:** Sebagai pengguna, saya ingin mendapatkan sapaan yang sesuai dengan waktu saat ini, agar dasbor terasa lebih personal dan ramah.

#### Acceptance Criteria

1. WHEN waktu berada di antara 05:00 dan 11:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Pagi".
2. WHEN waktu berada di antara 12:00 dan 14:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Siang".
3. WHEN waktu berada di antara 15:00 dan 17:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Sore".
4. WHEN waktu berada di antara 18:00 dan 04:59, THE Greeting_Widget SHALL menampilkan sapaan "Selamat Malam".
5. WHEN jam melewati batas rentang waktu, THE Greeting_Widget SHALL memperbarui sapaan secara otomatis tanpa memuat ulang halaman.

#### Correctness Properties

- **Properti Kelengkapan Sapaan**: UNTUK SEMUA nilai jam dalam rentang 0–23, THE Greeting_Widget SHALL menghasilkan tepat satu sapaan.
- **Properti Determinisme**: UNTUK SEMUA nilai jam yang sama, THE Greeting_Widget SHALL selalu menghasilkan sapaan yang identik.

---

### Requirement 3: Greeting Widget — Nama Pengguna yang Dapat Diubah

**User Story:** Sebagai pengguna, saya ingin dapat mengatur dan mengubah nama saya di dasbor, agar sapaan terasa lebih personal.

#### Acceptance Criteria

1. WHEN pengguna membuka aplikasi untuk pertama kali, THE Greeting_Widget SHALL menampilkan nama default "Pengguna" jika belum ada nama yang tersimpan di Local_Storage.
2. WHEN pengguna mengklik area nama atau tombol ubah nama, THE Greeting_Widget SHALL mengaktifkan mode edit yang memungkinkan pengguna mengetik nama baru.
3. WHEN pengguna mengonfirmasi perubahan nama, THE Storage_Manager SHALL menyimpan nama baru ke Local_Storage.
4. WHEN pengguna mengonfirmasi perubahan nama, THE Greeting_Widget SHALL langsung menampilkan nama baru dalam sapaan.
5. IF pengguna mengosongkan field nama dan mengonfirmasi, THEN THE Greeting_Widget SHALL menampilkan kembali nama default "Pengguna".
6. WHEN pengguna membuka ulang aplikasi, THE Greeting_Widget SHALL memuat dan menampilkan nama yang sebelumnya disimpan dari Local_Storage.

#### Correctness Properties

- **Properti Round-Trip Nama**: UNTUK SEMUA string nama yang valid, menyimpan nama ke Local_Storage kemudian memuat ulang aplikasi SHALL menghasilkan Greeting_Widget yang menampilkan nama yang identik.

---

### Requirement 4: Pomodoro Timer — Fungsionalitas Dasar

**User Story:** Sebagai pengguna, saya ingin menggunakan Pomodoro Timer dengan hitungan mundur 25 menit, agar saya dapat mengelola waktu kerja secara terstruktur.

#### Acceptance Criteria

1. WHEN pengguna membuka aplikasi, THE Pomodoro_Timer SHALL menampilkan hitungan mundur dengan nilai awal 25:00 dalam kondisi berhenti.
2. WHEN pengguna mengklik tombol Start, THE Pomodoro_Timer SHALL memulai hitungan mundur dari waktu yang ditampilkan saat ini.
3. WHEN pengguna mengklik tombol Stop, THE Pomodoro_Timer SHALL menghentikan sementara hitungan mundur dan mempertahankan sisa waktu yang ada.
4. WHEN pengguna mengklik tombol Reset, THE Pomodoro_Timer SHALL mengembalikan hitungan mundur ke 25:00 dan menghentikan timer jika sedang berjalan.
5. WHEN hitungan mundur mencapai 00:00, THE Pomodoro_Timer SHALL berhenti secara otomatis, menampilkan indikator bahwa sesi selesai, dan tetap memungkinkan pengguna mengklik tombol Reset.
6. WHEN pengguna mengklik tombol Reset setelah timer mencapai 00:00, THE Pomodoro_Timer SHALL mengembalikan tampilan ke 25:00 dalam keadaan berhenti (status stopped).
7. WHILE Pomodoro_Timer sedang berjalan, THE Pomodoro_Timer SHALL menonaktifkan tombol Start.
8. WHILE Pomodoro_Timer dalam kondisi berhenti (termasuk setelah selesai di 00:00), THE Pomodoro_Timer SHALL menonaktifkan tombol Stop.
9. THE Pomodoro_Timer SHALL selalu mengaktifkan tombol Reset tanpa menonaktifkannya, baik saat timer berjalan, berhenti, maupun setelah selesai di 00:00.

#### Correctness Properties

- **Properti Monotonik Menurun**: SELAMA Pomodoro_Timer berjalan, setiap pembaruan waktu SHALL menghasilkan nilai yang lebih kecil atau sama dengan nilai sebelumnya.
- **Properti Batas Bawah**: THE Pomodoro_Timer SHALL tidak pernah menampilkan nilai di bawah 00:00.
- **Properti Reset Universal**: KAPANPUN pengguna mengklik Reset (saat berjalan, berhenti, maupun setelah selesai di 00:00), THE Pomodoro_Timer SHALL menampilkan tepat 25:00 dan berada dalam status berhenti.

---

### Requirement 5: Pomodoro Timer — Persistensi di Local Storage

**User Story:** Sebagai pengguna, saya ingin status Pomodoro Timer tetap tersimpan ketika saya menyegarkan halaman, agar sesi timer tidak terganggu secara tidak sengaja.

#### Acceptance Criteria

1. WHEN Pomodoro_Timer berjalan, THE Storage_Manager SHALL menyimpan sisa waktu dan status "running" ke Local_Storage setiap detik.
2. WHEN Pomodoro_Timer berhenti (pause), THE Storage_Manager SHALL menyimpan sisa waktu dan status "stopped" ke Local_Storage.
3. WHEN pengguna memuat ulang halaman selama timer berjalan, THE Pomodoro_Timer SHALL memulihkan sisa waktu dari Local_Storage dan melanjutkan hitungan mundur secara otomatis.
4. WHEN pengguna memuat ulang halaman selama timer berhenti (pause), THE Pomodoro_Timer SHALL memulihkan sisa waktu yang tersimpan dan tetap dalam kondisi berhenti (tidak otomatis berjalan).
5. WHEN timer mencapai 00:00 dan pengguna memuat ulang halaman, THE Pomodoro_Timer SHALL menampilkan 00:00 dalam kondisi berhenti (tidak otomatis berjalan).
6. WHEN pengguna mengklik Reset, THE Storage_Manager SHALL menimpa data timer di Local_Storage dengan nilai awal 25:00 dan status "stopped".

#### Correctness Properties

- **Properti Konsistensi Persistensi**: UNTUK SEMUA nilai sisa waktu yang valid (0–1500 detik) dan semua nilai status (running/stopped), menyimpan ke Local_Storage kemudian memuat ulangnya SHALL menghasilkan nilai dan status yang identik.
- **Properti Pemulihan Status Berhenti**: WHEN status tersimpan adalah "stopped", memuat ulang aplikasi SHALL tidak memulai hitungan mundur secara otomatis.

---

### Requirement 6: To-Do List — Penambahan Tugas

**User Story:** Sebagai pengguna, saya ingin menambahkan tugas baru ke dalam daftar saya, agar saya dapat melacak pekerjaan yang perlu diselesaikan.

#### Acceptance Criteria

1. THE Todo_List SHALL menyediakan sebuah field input teks dan tombol tambah tugas.
2. WHEN pengguna memasukkan teks tugas dan mengklik tombol tambah (atau menekan Enter), THE Todo_List SHALL menambahkan tugas baru ke dalam daftar dengan status belum selesai.
3. WHEN tugas baru berhasil ditambahkan, THE Todo_List SHALL mengosongkan field input teks secara otomatis.
4. IF pengguna mencoba menambahkan tugas dengan field input kosong atau hanya berisi spasi, THEN THE Todo_List SHALL menolak penambahan dan menampilkan pesan peringatan kepada pengguna.
5. WHEN tugas baru berhasil ditambahkan, THE Storage_Manager SHALL menyimpan daftar tugas terbaru ke Local_Storage.

---

### Requirement 7: To-Do List — Pencegahan Duplikat Tugas

**User Story:** Sebagai pengguna, saya ingin dicegah dari menambahkan tugas yang sudah ada, agar daftar tugas saya tetap bersih dan tidak redundan.

#### Acceptance Criteria

1. IF pengguna mencoba menambahkan tugas yang teksnya identik secara case-insensitive (setelah trimming spasi di awal dan akhir) dengan tugas yang sudah ada, THEN THE Todo_List SHALL menolak penambahan tersebut.
2. WHEN penambahan tugas ditolak karena duplikat, THE Todo_List SHALL menampilkan pesan peringatan bahwa tugas tersebut sudah ada.
3. WHEN penambahan tugas ditolak karena duplikat, THE Todo_List SHALL mempertahankan teks yang diketik pengguna di field input.

#### Correctness Properties

- **Properti Keunikan Tugas**: UNTUK SEMUA pasang tugas dalam Todo_List, tidak ada dua tugas yang memiliki teks identik secara case-insensitive setelah trimming.
- **Properti Idempoten Penambahan**: Mencoba menambahkan tugas yang sama (case-insensitive) lebih dari sekali SHALL menghasilkan tepat satu tugas dalam daftar.
- **Properti Normalisasi Duplikat**: UNTUK SEMUA teks masukan `a` dan `b` di mana `a.toLowerCase().trim() === b.toLowerCase().trim()`, penambahan `b` ke daftar yang sudah mengandung `a` SHALL ditolak.

---

### Requirement 8: To-Do List — Pengeditan Tugas

**User Story:** Sebagai pengguna, saya ingin dapat mengedit teks tugas yang sudah ada, agar saya dapat memperbarui detail pekerjaan tanpa menghapus dan membuat tugas baru.

#### Acceptance Criteria

1. WHEN pengguna mengklik tombol edit pada sebuah tugas, THE Todo_List SHALL mengaktifkan mode edit dengan menampilkan field input berisi teks tugas saat ini.
2. WHEN pengguna mengonfirmasi hasil edit, THE Todo_List SHALL memperbarui teks tugas dengan nilai baru dan keluar dari mode edit.
3. IF hasil edit menghasilkan teks yang identik secara case-insensitive (setelah trimming) dengan tugas lain yang sudah ada, THEN THE Todo_List SHALL menolak perubahan dan menampilkan pesan peringatan duplikat.
4. IF pengguna mengosongkan field edit dan mencoba mengonfirmasi, THEN THE Todo_List SHALL menolak perubahan dan menampilkan pesan peringatan.
5. WHEN pengguna membatalkan proses edit, THE Todo_List SHALL mempertahankan teks tugas asli dan keluar dari mode edit.
6. WHEN pengeditan tugas berhasil, THE Storage_Manager SHALL menyimpan daftar tugas terbaru ke Local_Storage.

---

### Requirement 9: To-Do List — Penandaan Tugas Selesai

**User Story:** Sebagai pengguna, saya ingin menandai tugas sebagai selesai, agar saya dapat melacak progres pekerjaan.

#### Acceptance Criteria

1. THE Todo_List SHALL menampilkan setiap tugas dengan checkbox atau tombol toggle status selesai.
2. WHEN pengguna mengklik checkbox pada tugas yang belum selesai, THE Todo_List SHALL mengubah status tugas menjadi selesai dengan indikator visual yang jelas (contoh: teks dicoret).
3. WHEN pengguna mengklik checkbox pada tugas yang sudah selesai, THE Todo_List SHALL mengubah status tugas kembali menjadi belum selesai.
4. WHEN status tugas berubah, THE Storage_Manager SHALL menyimpan daftar tugas terbaru ke Local_Storage.

#### Correctness Properties

- **Properti Toggle Idempoten**: Menandai tugas selesai kemudian menandainya belum selesai SHALL menghasilkan status awal (belum selesai).
- **Properti Isolasi Toggle**: WHEN status satu tugas diubah, status semua tugas lain SHALL tidak berubah.

---

### Requirement 10: To-Do List — Penghapusan Tugas

**User Story:** Sebagai pengguna, saya ingin dapat menghapus tugas yang tidak lagi relevan, agar daftar tugas tetap ringkas.

#### Acceptance Criteria

1. THE Todo_List SHALL menampilkan tombol hapus pada setiap item tugas.
2. WHEN pengguna mengklik tombol hapus, THE Todo_List SHALL menghapus tugas tersebut dari daftar secara permanen.
3. WHEN sebuah tugas dihapus, THE Storage_Manager SHALL menyimpan daftar tugas terbaru ke Local_Storage.

#### Correctness Properties

- **Properti Penghapusan**: WHEN tugas dengan teks `t` dihapus, Todo_List SHALL tidak lagi mengandung tugas dengan teks `t`.
- **Properti Preservasi**: WHEN tugas dihapus dari daftar berisi `n` tugas, jumlah tugas SHALL menjadi `n - 1` dan semua tugas lain SHALL tetap ada dengan data tidak berubah.

---

### Requirement 11: To-Do List — Persistensi Data di Local Storage

**User Story:** Sebagai pengguna, saya ingin daftar tugas tetap tersimpan ketika saya menutup atau menyegarkan halaman, agar saya tidak kehilangan data pekerjaan.

#### Acceptance Criteria

1. WHEN pengguna membuka aplikasi, THE Storage_Manager SHALL memuat daftar tugas dari Local_Storage dan THE Todo_List SHALL menampilkannya.
2. WHEN tidak ada data tugas di Local_Storage, THE Todo_List SHALL menampilkan daftar kosong.
3. WHEN aplikasi dimuat ulang setelah data tugas tersimpan, THE Todo_List SHALL menampilkan semua tugas beserta status selesai masing-masing secara akurat.

#### Correctness Properties

- **Properti Round-Trip Todo**: UNTUK SEMUA daftar tugas yang valid, menyimpan ke Local_Storage kemudian memuat ulang aplikasi SHALL menghasilkan Todo_List yang menampilkan daftar identik (teks dan status selesai).

---

### Requirement 12: Quick Links — Penambahan dan Tampilan Tautan

**User Story:** Sebagai pengguna, saya ingin menyimpan tautan ke situs yang sering dikunjungi, agar dapat mengaksesnya dengan cepat dari dasbor.

#### Acceptance Criteria

1. THE Quick_Links SHALL menyediakan form input dengan field nama tautan dan field URL.
2. WHEN pengguna mengisi nama dan URL yang valid lalu mengklik tombol simpan, THE Quick_Links SHALL menambahkan tautan baru ke dalam daftar.
3. WHEN tautan baru berhasil ditambahkan, THE Quick_Links SHALL mengosongkan kedua field input secara otomatis.
4. WHEN tautan ditampilkan, THE Quick_Links SHALL menampilkan nama tautan sebagai teks yang dapat diklik.
5. WHEN pengguna mengklik sebuah tautan, THE Quick_Links SHALL membuka URL tujuan di tab browser baru.
6. IF pengguna mencoba menyimpan tautan dengan field nama atau URL kosong, THEN THE Quick_Links SHALL menolak penambahan dan menampilkan pesan peringatan.
7. IF pengguna mencoba menyimpan URL yang tidak diawali "http://" atau "https://", THEN THE Quick_Links SHALL menolak penambahan dan menampilkan pesan peringatan format URL tidak valid.
8. WHEN tautan baru berhasil ditambahkan, THE Storage_Manager SHALL menyimpan daftar tautan terbaru ke Local_Storage.

---

### Requirement 13: Quick Links — Penghapusan Tautan dan Persistensi

**User Story:** Sebagai pengguna, saya ingin dapat menghapus tautan yang tidak dibutuhkan dan memastikan daftar tautan tersimpan antar sesi.

#### Acceptance Criteria

1. THE Quick_Links SHALL menampilkan tombol hapus pada setiap item tautan.
2. WHEN pengguna mengklik tombol hapus, THE Quick_Links SHALL menghapus tautan tersebut dari daftar secara permanen.
3. WHEN sebuah tautan dihapus, THE Storage_Manager SHALL menyimpan daftar tautan terbaru ke Local_Storage.
4. WHEN pengguna membuka aplikasi, THE Storage_Manager SHALL memuat daftar tautan dari Local_Storage dan THE Quick_Links SHALL menampilkannya.
5. WHEN tidak ada data tautan di Local_Storage, THE Quick_Links SHALL menampilkan daftar tautan kosong.

#### Correctness Properties

- **Properti Round-Trip Tautan**: UNTUK SEMUA daftar tautan yang valid, menyimpan ke Local_Storage kemudian memuat ulang aplikasi SHALL menghasilkan Quick_Links yang menampilkan daftar identik (nama dan URL).

---

### Requirement 14: Light/Dark Mode — Toggle Tema

**User Story:** Sebagai pengguna, saya ingin dapat beralih antara tema terang dan gelap, agar tampilan dasbor sesuai dengan preferensi visual saya.

#### Acceptance Criteria

1. THE Theme_Manager SHALL menyediakan tombol toggle yang dapat diakses dari seluruh area antarmuka.
2. WHEN pengguna mengklik tombol toggle tema, THE Theme_Manager SHALL mengubah tema aktif dari Tema_Terang ke Tema_Gelap atau sebaliknya.
3. WHEN tema berubah, THE Theme_Manager SHALL menerapkan perubahan ke seluruh komponen antarmuka secara bersamaan.
4. WHEN pengguna mengklik tombol toggle, THE Theme_Manager SHALL memperbarui ikon atau label tombol untuk mencerminkan tema aktif.
5. WHEN tema berubah, THE Storage_Manager SHALL menyimpan preferensi tema ke Local_Storage.
6. WHEN pengguna membuka aplikasi, THE Theme_Manager SHALL memuat preferensi tema dari Local_Storage dan menerapkannya sebelum antarmuka ditampilkan untuk mencegah flash of unstyled content.
7. WHEN tidak ada preferensi tema di Local_Storage, THE Theme_Manager SHALL menerapkan Tema_Terang sebagai default.

#### Correctness Properties

- **Properti Toggle Idempoten**: Mengklik tombol toggle dua kali berturut-turut SHALL menghasilkan tema identik dengan tema sebelum kedua klik.
- **Properti Eksklusivitas Tema**: THE Theme_Manager SHALL hanya menerapkan satu tema pada satu waktu.
- **Properti Round-Trip Tema**: UNTUK SEMUA nilai tema yang valid, menyimpan ke Local_Storage kemudian memuat ulang aplikasi SHALL menghasilkan tema identik.

---

### Requirement 15: Responsivitas Antarmuka

**User Story:** Sebagai pengguna, saya ingin aplikasi dapat digunakan dengan nyaman di berbagai ukuran layar.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan tata letak yang dapat digunakan pada lebar layar minimal 320 piksel.
2. THE Aplikasi SHALL menampilkan tata letak yang dioptimalkan untuk lebar layar 768–1023 piksel (tablet).
3. THE Aplikasi SHALL menampilkan tata letak yang dioptimalkan untuk lebar layar 1024 piksel ke atas (desktop).
4. WHEN ukuran jendela browser berubah, THE Aplikasi SHALL menyesuaikan tata letak secara dinamis tanpa memuat ulang halaman.
5. THE Aplikasi SHALL memastikan semua elemen interaktif dapat disentuh dengan area sentuh minimal 44x44 piksel.

---

### Requirement 16: Batasan Teknis dan Ketergantungan

**User Story:** Sebagai pengembang, saya ingin aplikasi dibangun hanya dengan teknologi standar web tanpa framework atau backend.

#### Acceptance Criteria

1. THE Aplikasi SHALL diimplementasikan menggunakan tepat satu file HTML (`index.html`), satu file CSS (`css/style.css`), dan satu file JavaScript (`js/script.js`).
2. THE Aplikasi SHALL tidak menggunakan framework JavaScript atau CSS apapun.
3. THE Aplikasi SHALL tidak melakukan permintaan jaringan ke server atau API eksternal.
4. THE Storage_Manager SHALL menggunakan Web API `localStorage` sebagai satu-satunya mekanisme penyimpanan data.
5. THE Aplikasi SHALL berjalan sepenuhnya di sisi klien tanpa server backend.
6. THE Aplikasi SHALL berfungsi pada browser modern terkini (Chrome, Firefox, Edge, Safari) tanpa plugin tambahan.
