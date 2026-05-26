from fastapi import APIRouter, Depends
from schemas.flashcard_schema import FlashcardSet
from services.auth_service import get_current_user


from services.flashcard_service import (
    get_all_flashcards,
    create_flashcard_set,
    delete_flashcard_set,
    update_flashcard_set
)

# Router initialisation
router = APIRouter()

# Retrieve all flashcard sets
@router.get("/items")
async def get_items(
    current_user: str = Depends(get_current_user)
):
    return await get_all_flashcards(current_user)

# Create a new flashcard set
@router.post("/items")
async def save_items(
    data: FlashcardSet,
    current_user: str = Depends(get_current_user)
):
    return await create_flashcard_set(data, current_user)

# Delete a flashcard set
@router.delete("/items/{set_id}")
async def delete_item(
    set_id: str,
    current_user: str = Depends(get_current_user)
):
    return await delete_flashcard_set(
        set_id,
        current_user
    )

# Update an existing flashcard set
@router.put("/items/{set_id}")
async def update_item(
    set_id: str,
    data: FlashcardSet,
    current_user: str = Depends(get_current_user)
):
    return await update_flashcard_set(
        set_id,
        data,
        current_user
    )