import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from db import get_connection
from models import ClothingItem
from typing import Optional

router = APIRouter()

cloudinary.config(
    cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
    api_key=os.environ["CLOUDINARY_API_KEY"],
    api_secret=os.environ["CLOUDINARY_API_SECRET"],
)


@router.post("/clothes", response_model=ClothingItem)
def add_clothing(
    name: str = Form(...),
    category: str = Form(...),
    user_id: str = Form(...),
    image: Optional[UploadFile] = File(None),
):

    conn = get_connection()
    cursor = conn.cursor()

    item_id = str(uuid.uuid4())
    image_url = None
    image_path = None

    if image:
        result = cloudinary.uploader.upload(image.file, public_id=f"threadvault/{item_id}")
        image_url = result["secure_url"]
        image_path = image_url  # store the URL as the "path"

    #user_id = "demo-user"

    cursor.execute(
        "INSERT INTO clothes (id, name, category, image_path, user_id) VALUES (%s, %s, %s, %s, %s)",
        (item_id, name, category, image_path, user_id),
    )
    conn.commit()
    conn.close()

    return ClothingItem(id=item_id, name=name, category=category, image_url=image_url)

@router.get("/clothes", response_model=list[ClothingItem])
def get_clothes(user_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, name, category, image_path FROM clothes WHERE user_id = %s",
        (user_id,)
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        ClothingItem(id=r[0], name=r[1], category=r[2], image_url=r[3])
        for r in rows
    ]


@router.get("/clothes/{item_id}", response_model=ClothingItem)
def get_clothing_by_id(item_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, category, image_path FROM clothes WHERE id = %s", (item_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Clothing item not found")

    return ClothingItem(id=row[0], name=row[1], category=row[2], image_url=row[3])

@router.put("/clothes/{item_id}", response_model=ClothingItem)
def update_clothing(
    item_id: str,
    name: str = Form(...),
    category: str = Form(...),
    user_id: str = Form(...),  
    image: Optional[UploadFile] = File(None),
):
    conn = get_connection()
    cursor = conn.cursor()
    #user_id = "demo-user"

    cursor.execute(
        "SELECT image_path FROM clothes WHERE id = %s AND user_id = %s",
        (item_id, user_id),
)
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Clothing item not found")

    image_url = row[0]

    if image:
        # Overwrite the same public_id in Cloudinary
        result = cloudinary.uploader.upload(image.file, public_id=f"threadvault/{item_id}", overwrite=True)
        image_url = result["secure_url"]

    cursor.execute(
        "UPDATE clothes SET name = %s, category = %s, image_path = %s WHERE id = %s",
        (name, category, image_url, item_id),
    )
    conn.commit()
    conn.close()

    return ClothingItem(id=item_id, name=name, category=category, image_url=image_url)


@router.delete("/clothes/{item_id}")
def delete_clothing(item_id: str, user_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    #user_id = "demo-user"

    cursor.execute(
        "SELECT image_path FROM clothes WHERE id = %s AND user_id = %s",
        (item_id, user_id),
)
    row = cursor.fetchone()

    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Clothing item not found")

    # Delete from Cloudinary
    cloudinary.uploader.destroy(f"threadvault/{item_id}")

    cursor.execute("DELETE FROM clothes WHERE id = %s", (item_id,))
    conn.commit()
    conn.close()

    return {"message": "Clothing item deleted"}