from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from pydantic import BaseModel
from jose import jwt

app = FastAPI(title="API & Blog Sederhana")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth = HTTPBearer()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class Mahasiswa(BaseModel):
    nama: str
    nim: str
    kelas: str


class Blog(BaseModel):
    title: str
    content: str


mahasiswa_db = []
blog_db = []

blog_id_counter = 1


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: HTTPAuthorizationCredentials = Depends(auth)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        nim = payload.get("sub")

        user = next((m for m in mahasiswa_db if m["nim"] == nim), None)

        if not user:
            raise HTTPException(status_code=401, detail="user tidak ditemukan")

        return user
    except:
        raise HTTPException(status_code=401, detail="token tidak valid")


@app.get("/")
def home():
    return {"msg": "API aktif"}


@app.post("/register")
def register(mhs: Mahasiswa):
    if any(u["nim"] == mhs.nim for u in mahasiswa_db):
        raise HTTPException(status_code=400, detail="NIM sudah terdaftar")

    data = mhs.model_dump()
    mahasiswa_db.append(data)

    token = create_access_token({"sub": mhs.nim})

    return {
        "access_token": token,
        "token_type": "bearer",
        "mahasiswa": data
    }


@app.get("/mahasiswa")
def get_mahasiswa():
    return {
        "msg": "list mahasiswa",
        "data": mahasiswa_db
    }


@app.get("/blogs")
def get_blogs():
    return {
        "msg": "semua blog",
        "data": blog_db
    }


@app.post("/blogs")
def create_blog(
    blog: Blog,
    user: dict = Depends(get_current_user)
):
    global blog_id_counter

    new_data = {
        "id": blog_id_counter,
        "judul": blog.title,
        "isi": blog.content,
        "author_nama": user["nama"],
        "author_nim": user["nim"],
        "author_kelas": user["kelas"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

    blog_db.append(new_data)
    blog_id_counter += 1  # increment ID

    return {
        "msg": "blog berhasil dibuat",
        "data": new_data
    }


@app.put("/blogs/{blog_id}")
def update_blog(
    blog_id: int,
    blog: Blog,
    user: dict = Depends(get_current_user)
):
    for item in blog_db:
        if item["id"] == blog_id:
            if item["author_nim"] != user["nim"]:
                raise HTTPException(status_code=403, detail="bukan pemilik blog")

            item["judul"] = blog.title
            item["isi"] = blog.content
            item["updated_at"] = datetime.now().isoformat()

            return {
                "msg": "blog berhasil diupdate",
                "data": item
            }

    raise HTTPException(status_code=404, detail="blog tidak ditemukan")


@app.delete("/blogs/{blog_id}")
def delete_blog(
    blog_id: int,
    user: dict = Depends(get_current_user)
):
    for i, item in enumerate(blog_db):
        if item["id"] == blog_id:
            if item["author_nim"] != user["nim"]:
                raise HTTPException(status_code=403, detail="bukan pemilik blog")

            deleted = blog_db.pop(i)

            return {
                "msg": "blog berhasil dihapus",
                "data": deleted
            }

    raise HTTPException(status_code=404, detail="blog tidak ditemukan")


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "msg": "server aman"
    }