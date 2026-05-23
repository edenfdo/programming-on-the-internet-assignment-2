from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from models.database import users_collection

from schemas.user_schema import UserRegister

from services.auth_service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password
)

router = APIRouter()


@router.post("/register")
async def register_user(user_data: UserRegister):

    existing_user = await users_collection.find_one(
        {"username": user_data.username}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )

    hashed_password = get_password_hash(
        user_data.password
    )

    new_user = {
        "username": user_data.username,
        "hashed_password": hashed_password,
        "role": "student"
    }

    await users_collection.insert_one(new_user)

    return {
        "message": "User registered successfully"
    }


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    user = await users_collection.find_one(
        {"username": form_data.username}
    )

    if not user or not verify_password(
        form_data.password,
        user["hashed_password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    access_token_expires = timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    access_token = create_access_token(
        data={
            "sub": user["username"],
            "role": user["role"]
        },
        expires_delta=access_token_expires
    )

    return {
      "access_token": access_token,
      "token_type": "bearer",
      "role": user["role"]
    }