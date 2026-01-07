from pydantic import BaseModel

class ClothingItemCreate(BaseModel):
    name: str
    category: str

class ClothingItem(BaseModel):
    id: str
    name: str
    category: str
