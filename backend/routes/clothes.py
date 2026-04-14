import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from db import get_connection
from models import ClothingItem
from typing import Optional

router = APIRouter()

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "../images")
os.makedirs(IMAGES_DIR, exist_ok=True)


@router.post("/clothes", response_model=ClothingItem)
def add_clothing(
    name: str = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    conn = get_connection()
    cursor = conn.cursor()

    item_id = str(uuid.uuid4())
    image_path = None
    filename = None

    if image:
        safe_name = image.filename.replace(" ", "_").lower()
        filename = f"{item_id}_{safe_name}"
        image_path = os.path.join("images", filename)

        with open(image_path, "wb") as f:
            f.write(image.file.read())

    cursor.execute(
        "INSERT INTO clothes (id, name, category, image_path) VALUES (?, ?, ?, ?)",
        (item_id, name, category, image_path),
    )
    conn.commit()
    conn.close()

    return ClothingItem(
        id=item_id,
        name=name,
        category=category,
        image_url=f"/images/{filename}" if filename else None,
    )


@router.get("/clothes", response_model=list[ClothingItem])
def get_clothes():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, name, category, image_path FROM clothes"
    )
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        image_path = row[3]
        image_url = (
            f"/images/{os.path.basename(image_path)}"
            if image_path
            else None
        )

        results.append(
            ClothingItem(
                id=row[0],
                name=row[1],
                category=row[2],
                image_url=image_url,
            )
        )

    return results


@router.get("/clothes/{item_id}", response_model=ClothingItem)
def get_clothing_by_id(item_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, name, category, image_path FROM clothes WHERE id = ?",
        (item_id,),
    )
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    image_url = (
        f"/images/{os.path.basename(row[3])}"
        if row[3]
        else None
    )

    return ClothingItem(
        id=row[0],
        name=row[1],
        category=row[2],
        image_url=image_url,
    )


@router.put("/clothes/{item_id}", response_model=ClothingItem)
def update_clothing(
    item_id: str,
    name: str = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT image_path FROM clothes WHERE id = ?",
        (item_id,),
    )
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Clothing item not found")

    old_image_path = row[0]
    new_image_path = old_image_path
    filename = None

    if image:
        if old_image_path and os.path.exists(old_image_path):
            os.remove(old_image_path)

        safe_name = image.filename.replace(" ", "_").lower()
        filename = f"{item_id}_{safe_name}"
        new_image_path = os.path.join("images", filename)

        with open(new_image_path, "wb") as f:
            f.write(image.file.read())

    cursor.execute(
        """
        UPDATE clothes
        SET name = ?, category = ?, image_path = ?
        WHERE id = ?
        """,
        (name, category, new_image_path, item_id),
    )
    conn.commit()
    conn.close()

    return ClothingItem(
        id=item_id,
        name=name,
        category=category,
        image_url=f"/images/{filename}" if filename else None,
    )


@router.delete("/clothes/{item_id}")
def delete_clothing(item_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT image_path FROM clothes WHERE id = ?",
        (item_id,),
    )
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Clothing item not found")

    image_path = row[0]

    if image_path and os.path.exists(image_path):
        os.remove(image_path)

    cursor.execute(
        "DELETE FROM clothes WHERE id = ?",
        (item_id,),
    )
    conn.commit()
    conn.close()

    return {"message": "Clothing item deleted"}
