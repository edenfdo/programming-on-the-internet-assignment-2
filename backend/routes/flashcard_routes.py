from fastapi import APIRouter, Depends

from schemas.flashcard_schema import FlashcardSet

from services.flashcard_service import (
    get_all_flashcards,
    create_flashcard_set
)

from services.auth_service import get_current_user


router = APIRouter()


@router.get("/items")
async def get_items(
    current_user: str = Depends(get_current_user)
):
    return await get_all_flashcards(current_user)


@router.post("/items")
async def save_items(
    data: FlashcardSet,
    current_user: str = Depends(get_current_user)
):
    return await create_flashcard_set(data, current_user)