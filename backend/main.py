from fastapi import FastAPI, Body
#body is data from request
from pydantic import BaseModel
import uuid


app = FastAPI()

clothes_db = []
#list for clothing

class ClothingItemCreate(BaseModel):
    name: str
    category: str

class ClothingItem(BaseModel):
    id: str
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
    new_item = ClothingItem(
        id=str(uuid.uuid4()),
        name=item.name,
        category=item.category
    )
    clothes_db.append(new_item)
    return new_item
@app.get("/clothes")
def get_clothes():
    return clothes_db


