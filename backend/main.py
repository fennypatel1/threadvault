from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.routes.clothes import router as clothes_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/images", StaticFiles(directory="backend/images"), name="images")

@app.get("/")
def root():
    return {"message": "Hello ThreadVault"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(clothes_router)
