from fastapi import FastAPI, Body
#body is data from request
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello Closet App"}
@app.get("/health")
def health_check():
    return {"status": "ok"}
@app.post("/clothes")
def add_clothing(item = Body(...)):
    return {
        "received": item
    }

