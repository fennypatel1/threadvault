import uuid
from fastapi import APIRouter, HTTPException
from backend.db import cursor, conn
from backend.models import ClothingItem, ClothingItemCreate


router = APIRouter()

@router.post("/clothes", response_model=ClothingItem)
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

@router.get("/clothes", response_model=list[ClothingItem])
def get_clothes():
    cursor.execute("SELECT id, name, category FROM clothes")
    rows = cursor.fetchall()

    return [
        ClothingItem(id=row[0], name=row[1], category=row[2])
        for row in rows
    ]

@router.get("/clothes/{item_id}", response_model=ClothingItem)
def get_clothing_by_id(item_id: str):
    cursor.execute(
        "SELECT id, name, category FROM clothes WHERE id = ?",
        (item_id,)
    )
    row = cursor.fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    return ClothingItem(id=row[0], name=row[1], category=row[2])

@router.put("/clothes/{item_id}", response_model=ClothingItem)
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

@router.delete("/clothes/{item_id}")
def delete_clothing(item_id: str):
    cursor.execute("DELETE FROM clothes WHERE id = ?", (item_id,))
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    return {"message": "Clothing item deleted"}
