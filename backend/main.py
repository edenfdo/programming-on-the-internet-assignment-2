from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.auth_service import create_default_admin, get_password_hash
from models.database import users_collection

from routes.auth_routes import router as auth_router
from routes.flashcard_routes import router as flashcard_router
from routes.history_routes import router as history_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_default_admin()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(flashcard_router)
app.include_router(history_router)