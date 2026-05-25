from fastapi import HTTPException

from models.database import history_collection


async def save_history_service(
    flashcard_set: str,
    action: str,
    current_user: dict
):
    await history_collection.insert_one({
        "username": current_user["username"],
        "flashcard_set": flashcard_set,
        "action": action
    })

    return {"message": "History saved"}


async def view_history_service(
    current_user: dict
):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    history = await (
        history_collection
        .find({})
        .sort("_id", -1)
        .to_list(None)
    )

    return [
        {
            "id": str(item["_id"]),
            "username": item["username"],
            "flashcard_set": item["flashcard_set"],
            "action": item.get("action", "")
        }
        for item in history
    ]