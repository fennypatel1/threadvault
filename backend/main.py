from fastapi import FastAPI
#body is data from request
from pydantic import BaseModel
import uuid
from fastapi import HTTPException
import sqlite3



app = FastAPI()

conn = sqlite3.connect("threadvault.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS clothes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL
)
""")

conn.commit()


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
    item_id = str(uuid.uuid4())

    cursor.execute(
        "INSERT INTO clothes (id, name, category) VALUES (?, ?, ?)",
        (item_id, item.name, item.category)
    )
    conn.commit()

    return ClothingItem(
        id=item_id,
        name=item.name,
        category=item.category
    )

@app.get("/clothes", response_model=list[ClothingItem])
def get_clothes():
    cursor.execute("SELECT id, name, category FROM clothes")
    rows = cursor.fetchall()

    return [
        ClothingItem(id=row[0], name=row[1], category=row[2])
        for row in rows
    ]

@app.get("/clothes/{item_id}", response_model=ClothingItem)
def get_clothing_by_id(item_id: str):
    cursor.execute(
        "SELECT id, name, category FROM clothes WHERE id = ?",
        (item_id,)
    )
    row = cursor.fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    return ClothingItem(id=row[0], name=row[1], category=row[2])


@app.delete("/clothes/{item_id}")
def delete_clothing(item_id: str):
    cursor.execute("DELETE FROM clothes WHERE id = ?", (item_id,))
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    return {"message": "Clothing item deleted"}


@app.put("/clothes/{item_id}", response_model=ClothingItem)
def update_clothing(item_id: str, updated_item: ClothingItemCreate):
    cursor.execute(
        "UPDATE clothes SET name = ?, category = ? WHERE id = ?",
        (updated_item.name, updated_item.category, item_id)
    )
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    return ClothingItem(
        id=item_id,
        name=updated_item.name,
        category=updated_item.category
    )

