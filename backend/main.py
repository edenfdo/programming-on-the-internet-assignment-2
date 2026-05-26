from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensures an admin user exists at startup
from services.auth_service import create_default_admin, get_password_hash
from models.database import users_collection

# Imports authentication routes
from routes.auth_routes import router as auth_router
# Imports flashcard  routes
from routes.flashcard_routes import router as flashcard_router
# Imports history routes
from routes.history_routes import router as history_router

# Runs at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensures an admin account exists
    await create_default_admin()
    # If missing, it creates one automatically
    yield

# Creates the FastAPI application 
app = FastAPI(lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registers API endpoints
app.include_router(auth_router)
app.include_router(flashcard_router)
app.include_router(history_router)