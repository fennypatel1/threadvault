from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.clothes import router as clothes_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
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

app.include_router(clothes_router)
