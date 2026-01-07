from fastapi import FastAPI
from backend.routes.clothes import router as clothes_router


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello ThreadVault"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(clothes_router)
