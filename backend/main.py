from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.routes.clothes import router as clothes_router

app = FastAPI()

app.mount("/images", StaticFiles(directory="backend/images"), name="images")

@app.get("/")
def root():
    return {"message": "Hello ThreadVault"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(clothes_router)
