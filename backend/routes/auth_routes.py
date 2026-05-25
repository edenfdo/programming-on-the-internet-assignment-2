from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException

from models.database import users_collection

from fastapi.security import OAuth2PasswordRequestForm
from schemas.user_schema import UserRegister

from services.auth_service import (
    register_user_service,
    login_user_service
)


router = APIRouter()

@router.post("/register")
async def register_user(user_data: UserRegister):
    return await register_user_service(user_data)

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    return await login_user_service(form_data)