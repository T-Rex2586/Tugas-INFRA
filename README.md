# Cara Menjalankan Project

1. Clone repo

```bash
git clone https://github.com/T-Rex2586/Tugas-INFRA.git
cd Tugas-INFRA
```

2. (Opsional) buat virtual environment

```bash
python -m venv venv
```

Aktifkan:

* Windows:

```bash
venv\Scripts\activate
```

* Linux/Mac:

```bash
source venv/bin/activate
```

3. Install dependency

```bash
pip install -r requirements.txt
```

4. Jalankan backend (FastAPI)

```bash
uvicorn app.main:app --reload
```

5. Akses di browser

```text
http://127.0.0.1:8000
```

Docs API:

```text
http://127.0.0.1:8000/docs
```

---

## Cara Melihat Tampilan Blog

Masuk ke folder frontend lalu jalankan:

```bash
npm install
npm run dev
```

atau kalau sederhana:

```bash
live-server
```

Lalu buka:

```text
http://localhost:3000
```

> Sesuaikan dengan port yang muncul di terminal
