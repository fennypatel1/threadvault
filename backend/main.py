from fastapi import FastAPI, Body
#body is data from request
from pydantic import BaseModel

app = FastAPI()

clothes_db = []
#list for clothing

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
    clothes_db.append(item)
    return {
        "message": "Item added",
        "total_items": len(clothes_db)
    }
@app.get("/clothes")
def get_clothes():
    return clothes_db


