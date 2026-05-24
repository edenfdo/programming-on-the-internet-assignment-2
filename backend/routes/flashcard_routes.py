from fastapi import APIRouter, Depends

from schemas.flashcard_schema import FlashcardSet

from services.flashcard_service import (
    get_all_flashcards,
    create_flashcard_set,
    delete_flashcard_set,
    update_flashcard_set
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

@router.delete("/items/{set_id}")
async def delete_item(
    set_id: str,
    current_user: str = Depends(get_current_user)
):
    return await delete_flashcard_set(
        set_id,
        current_user
    )

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