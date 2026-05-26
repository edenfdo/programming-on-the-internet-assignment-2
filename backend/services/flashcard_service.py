from bson import ObjectId
from fastapi import HTTPException

from models.database import sets_collection

# Fetching all sets for a user
async def get_all_flashcards(current_user: str):
    try:
        sets_cursor = sets_collection.find(
            {"owner": current_user}
        )

        sets = await sets_cursor.to_list(None)

        result = []

        # An empty list to store formatted sets
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

        # Logs any erroras
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve flashcard sets"
        )

# Creating a new set
async def create_flashcard_set(data, current_user: str):
    
    # Validates title
    if not data.title.strip():
      raise HTTPException(
          status_code=400,
          detail="Title cannot be empty"
      )

    # Validates description
    if not data.description.strip():
      raise HTTPException(
          status_code=400,
          detail="Description cannot be empty"
      )

    # Validates cards exist
    if len(data.terms) == 0:
      raise HTTPException(
          status_code=400,
          detail="A flashcard set must contain at least one card"
      )

    # Validates every card
    for card in data.terms:
        # Validates that the term is not empty
        if not card.term.strip():
            raise HTTPException(
                status_code=400,
                detail="Card term cannot be empty"
            )

        # Validates that the definition is not empty
        if not card.definition.strip():
            raise HTTPException(
                status_code=400,
                detail="Card definition cannot be empty"
            )

    # Creating a dictionary representing the flashcard set
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

    # Logs the error
    except Exception as e:
        print("Database error:", e)

        # Sends error
        raise HTTPException(
            status_code=500,
            detail="Failed to save flashcard set"
        )

# Deleting a set
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
    
    # Logs unexpected errors
    except Exception as e:
        print("Database error:", e)

        # Sends error 
        raise HTTPException(
            status_code=500,
            detail="Failed to delete flashcard set"
        )

# Updating an existing set
async def update_flashcard_set(
    set_id: str,
    data,
    current_user: str
):
    
    # Validates title
    if not data.title.strip():
      raise HTTPException(
          status_code=400,
          detail="Title cannot be empty"
      )

    # Validates description
    if not data.description.strip():
      raise HTTPException(
          status_code=400,
          detail="Description cannot be empty"
      )
    
    # Validates cards exist
    if len(data.terms) == 0:
      raise HTTPException(
          status_code=400,
          detail="A flashcard set must contain at least one card"
      )

    # Validates every card
    for card in data.terms:
      if not card.term.strip():
          raise HTTPException(
              status_code=400,
              detail="Card term cannot be empty"
          )

      if not card.definition.strip():
          raise HTTPException(
              status_code=400,
              detail="Card definition cannot be empty"
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

    # Logs errors
    except Exception as e:
        print("Database error:", e)

        # Sends error
        raise HTTPException(
            status_code=500,
            detail="Failed to update flashcard set"
        )