import os
from fastapi import UploadFile, File
import uuid
from fastapi import APIRouter, HTTPException
from backend.db import cursor, conn, DB_PATH
from backend.models import ClothingItem, ClothingItemCreate

filename = None

router = APIRouter()

@router.post("/clothes", response_model=ClothingItem)
def add_clothing(
    name: str,
    category: str,
    image: UploadFile = File(None)
):
    item_id = str(uuid.uuid4())
    image_path = None

    if image:
        os.makedirs("backend/images", exist_ok=True)
        filename = f"{item_id}_{image.filename}"
        image_path = f"backend/images/{filename}"

        with open(image_path, "wb") as f:
            f.write(image.file.read())

    cursor.execute(
        "INSERT INTO clothes (id, name, category, image_path) VALUES (?, ?, ?, ?)",
        (item_id, name, category, image_path)
    )
    conn.commit()

    return ClothingItem(
    id=item_id,
    name=name,
    category=category,
    image_url=f"/images/{filename}" if filename else None
)


@router.get("/clothes", response_model=list[ClothingItem])
def get_clothes():
    cursor.execute(
        "SELECT id, name, category, image_path FROM clothes"
    )
    rows = cursor.fetchall()

    results = []
    for row in rows:
        image_path = row[3]
        image_url = (
            f"/images/{image_path.split('/')[-1]}"
            if image_path
            else None
        )

        results.append(
            ClothingItem(
                id=row[0],
                name=row[1],
                category=row[2],
                image_url=image_url
            )
        )

    return results


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
    cursor.execute(
        "SELECT image_path FROM clothes WHERE id = ?",
        (item_id,)
    )
    row = cursor.fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    image_path = row[0]

    if image_path and os.path.exists(image_path):
        os.remove(image_path)

    cursor.execute(
        "DELETE FROM clothes WHERE id = ?",
        (item_id,)
    )
    conn.commit()

    return {"message": "Clothing item deleted"}
