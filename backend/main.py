from datetime import timedelta

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
from bson import ObjectId

import motor.motor_asyncio

from auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user, get_password_hash, verify_password

# -----------------------------
# MongoDB Setup
# -----------------------------
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.flashcards_db
sets_collection = db.flashcard_sets

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Pydantic Models
# -----------------------------
class Term(BaseModel):
    term: str
    definition: str

class FlashcardSet(BaseModel):
    title: str
    description: str
    terms: List[Term]

# -----------------------------
# GET /items
# -----------------------------
@app.get("/items")
async def get_items(
    _: str = Depends(get_current_user)
):
    sets_cursor = sets_collection.find({})
    sets = await sets_cursor.to_list(None)

    result = []
    for s in sets:
        result.append({
            "id": str(s["_id"]),
            "title": s["title"],
            "description": s.get("description", ""),
            "terms": s.get("terms", [])
        })

    return result

# -----------------------------
# POST /items
# -----------------------------
@app.post("/items")
async def save_items(
    data: FlashcardSet,
    _: str = Depends(get_current_user)
):
    # Clear all sets (same behavior as your Flask version)
    await sets_collection.delete_many({})

    # Insert new set
    new_set = {
        "title": data.title,
        "description": data.description,
        "terms": [
            {
                "id": str(ObjectId()),
                "term": t.term,
                "definition": t.definition
            }
            for t in data.terms
        ]
    }

    await sets_collection.insert_one(new_set)

    return {"message": "Flashcard set saved"}

# -----------------------------
# POST /token
# -----------------------------
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = {
        "username": "admin",
        "hashed_password": get_password_hash("admin")
    }

    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}