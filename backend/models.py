from pydantic import BaseModel
from typing import Optional

class ClothingItemCreate(BaseModel):
    name: str
    category: str

class ClothingItem(BaseModel):
    id: str
    name: str
    category: str
    image_url: Optional[str] = None
