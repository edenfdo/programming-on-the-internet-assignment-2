from bson import ObjectId

from models.database import sets_collection


async def get_all_flashcards(current_user: str):
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


async def create_flashcard_set(
    data,
    current_user: str
):
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