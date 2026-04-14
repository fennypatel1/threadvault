from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.clothes import router as clothes_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://threadvault-two.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os

if not os.path.exists("images"):
    os.makedirs("images")

app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get("/")
def root():
    return {"message": "Hello ThreadVault"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return {"message": "OK"}

app.include_router(clothes_router)
