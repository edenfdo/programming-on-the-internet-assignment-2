from fastapi import APIRouter, Depends
from services.auth_service import get_current_user
from services.history_service import (
    save_history_service,
    view_history_service
)

# Router initialisation
router = APIRouter()

# Save a history entry
@router.post("/history")
async def save_history(
    flashcard_set: str,
    action: str,
    current_user=Depends(get_current_user)
):
    return await save_history_service(
        flashcard_set,
        action,
        current_user
    )

# Retrieve user history
@router.get("/view_history")
async def view_history(
    current_user=Depends(get_current_user)
):
    return await view_history_service(
        current_user
    )