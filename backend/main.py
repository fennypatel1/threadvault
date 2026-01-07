from fastapi import FastAPI, Body
#body is data from request
from pydantic import BaseModel
import uuid
from fastapi import HTTPException


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
@app.post("/clothes", response_model=ClothingItem)
def add_clothing(item: ClothingItemCreate):
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
@app.get("/clothes/{item_id}", response_model=ClothingItem)
def get_clothing_by_id(item_id: str):
    for item in clothes_db:
        if item.id == item_id:
            return item

    raise HTTPException(status_code=404, detail="Clothing item not found")

@app.delete("/clothes/{item_id}")
def delete_clothing(item_id: str):
    for index, item in enumerate(clothes_db):
        if item.id == item_id:
            clothes_db.pop(index)
            return {"message": "Clothing item deleted"}

    raise HTTPException(status_code=404, detail="Clothing item not found")

