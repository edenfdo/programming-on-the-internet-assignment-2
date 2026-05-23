from fastapi import APIRouter, Depends

from models.database import history_collection
from services.auth_service import get_current_user

from fastapi import HTTPException

router = APIRouter()

@router.post("/history")
async def save_history(
    flashcard_set: str,
    action: str,
    current_user=Depends(get_current_user)
):
    await history_collection.insert_one({
        "username": current_user["username"],
        "flashcard_set": flashcard_set,
        "action": action
    })

    return {"message": "History saved"}

@router.get("/view_history")
async def view_history(
    current_user=Depends(get_current_user)
):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    history = await history_collection.find({}).sort("_id", -1).to_list(None)

    return [
    {
        "id": str(item["_id"]),
        "username": item["username"],
        "flashcard_set": item["flashcard_set"],
        "action": item.get("action", "")
    }
    for item in history
]