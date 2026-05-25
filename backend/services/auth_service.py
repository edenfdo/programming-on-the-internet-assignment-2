from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Optional
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
import jwt
from models.database import users_collection
from schemas.user_schema import UserRegister

SECRET_KEY = "cardio-secret-key"
# SECRET_KEY = os.environ["SECRET_KEY"]

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# class Status(Enum):
#     HTTP_401_UNAUTHORIZED = 401

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode(
        "utf-8"
    )
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = ACCESS_TOKEN_EXPIRE_MINUTES): # if caller doesn't specify expires_delta use default which is 30mins
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")

        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload"
            )

        return {
            "username": username,
            "role": role
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Token has expired"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )
    
async def register_user_service(
    user_data: UserRegister
):
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

    await users_collection.insert_one({
        "username": user_data.username,
        "hashed_password": hashed_password,
        "role": "student"
    })

    return {
        "message": "User registered successfully"
    }

async def login_user_service(
    form_data
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
            detail="Incorrect username or password"
        )

    access_token = create_access_token(
        data={
            "sub": user["username"],
            "role": user["role"]
        },
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"]
    }