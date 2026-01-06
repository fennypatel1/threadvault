from fastapi import FastAPI, Body
#body is data from request
from pydantic import BaseModel

app = FastAPI()

class ClothingItem(BaseModel):
    name: str
    category: str

@app.get("/")
def root():
    return {"message": "Hello Closet App"}
@app.get("/health")
def health_check():
    return {"status": "ok"}
@app.post("/clothes")
def add_clothing(item: ClothingItem):
    return {
        "received": item
    }

