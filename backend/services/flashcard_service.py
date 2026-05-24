from bson import ObjectId
from fastapi import HTTPException

from models.database import sets_collection


async def get_all_flashcards(current_user: str):
    try:
        sets_cursor = sets_collection.find(
            {"owner": current_user}
        )

        sets = await sets_cursor.to_list(None)

        result = []

        for s in sets:
            result.append({
                "id": str(s["_id"]),
                "title": s["title"],
                "description": s.get("description", ""),
                "terms": s.get("terms", [])
            })

        return result

    except Exception as e:
        print("Database error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve flashcard sets"
        )


async def create_flashcard_set(data, current_user: str):
    if len(data.terms) == 0:
        raise HTTPException(
            status_code=400,
            detail="A flashcard set must contain at least one card"
        )

    try:
        new_set = {
            "owner": current_user,
            "title": data.title,
            "description": data.description,
            "terms": [
                {
                    "id": str(ObjectId()),
                    "term": t.term,
                    "definition": t.definition
                }
                for t in data.terms
            ]
        }

        await sets_collection.insert_one(new_set)

        return {"message": "Flashcard set saved"}

    except Exception as e:
        print("Database error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to save flashcard set"
        )

async def delete_flashcard_set(
    set_id: str,
    current_user: str
):
    try:
        result = await sets_collection.delete_one({
            "_id": ObjectId(set_id),
            "owner": current_user
        })

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Flashcard set not found"
            )

        return {"message": "Deleted"}

    except HTTPException:
        raise

    except Exception as e:
        print("Database error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to delete flashcard set"
        )

async def update_flashcard_set(
    set_id: str,
    data,
    current_user: str
):
    if len(data.terms) == 0:
        raise HTTPException(
            status_code=400,
            detail="A flashcard set must contain at least one card"
        )

    try:
        result = await sets_collection.update_one(
            {
                "_id": ObjectId(set_id),
                "owner": current_user
            },
            {
                "$set": {
                    "title": data.title,
                    "description": data.description,
                    "terms": [
                        {
                            "id": getattr(
                                t,
                                "id",
                                str(ObjectId())
                            ),
                            "term": t.term,
                            "definition": t.definition
                        }
                        for t in data.terms
                    ]
                }
            }
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Flashcard set not found"
            )

        return {"message": "Updated"}

    except HTTPException:
        raise

    except Exception as e:
        print("Database error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to update flashcard set"
        )