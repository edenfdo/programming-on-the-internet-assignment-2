# used to set how long the login token remains valid
from datetime import timedelta

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId

import motor.motor_asyncio

from auth import (
  ACCESS_TOKEN_EXPIRE_MINUTES, 
  create_access_token, 
  get_current_user, 
  get_password_hash, 
  verify_password
)

# connects to a mongodf instance running locally
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")

#chooses the database - flashcards_db
db = client.flashcards_db

#selects the specific "table"
sets_collection = db.flashcard_sets

#collection for user data
users_collection = db.users

#fastapi

#initialises the web server
app = FastAPI()

# configures CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=4)

#must have a string term and a string definition
class Term(BaseModel):
    term: str
    definition: str

# flashcards has a title, description and a list of Term objects
class FlashcardSet(BaseModel):
    title: str
    description: str
    terms: List[Term]

#get

#defines route to get data
@app.get("/items")
async def get_items(
    #checking valid token is provided
    _: str = Depends(get_current_user)
):
    sets_cursor = sets_collection.find({})
    #converts database into a python list
    sets = await sets_cursor.to_list(None)

    #loops through the database items and converts the MongoDB _id into a string so it can be sent as JSON
    result = []
    for s in sets:
        result.append({
            "id": str(s["_id"]),
            "title": s["title"],
            "description": s.get("description", ""),
            "terms": s.get("terms", [])
        })

    return result

#post 

#register user
@app.post("/register")
async def register_user(user_data: UserRegister):
    # Check if username already exists in database
    existing_user = await users_collection.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    # Hash password before saving
    hashed_password = get_password_hash(user_data.password)
    
    new_user = {
        "username": user_data.username,
        "hashed_password": hashed_password
    }
    
    await users_collection.insert_one(new_user)
    return {"message": "User registered successfully"}

##defines route to post data
@app.post("/items")
async def save_items(
    data: FlashcardSet,
    _: str = Depends(get_current_user)
):
    # clears database
    #await sets_collection.delete_many({})

    # inserts new set
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

    #saves the new flashcard set into MongoDB
    await sets_collection.insert_one(new_set)

    return {"message": "Flashcard set saved"}

#post token

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # TODO: This needs to come from DB
    # Need to also add a "sign up" flow which persists
    # user-specified username and password

    #hard-coded username and password
    # user = {
    #     "username": "admin",
    #     "hashed_password": get_password_hash("admin")
    # }
    user = await users_collection.find_one({"username": form_data.username})


    #checks if the password provided matches the hashed password
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # if the password is correct, it generates a JWT 
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}