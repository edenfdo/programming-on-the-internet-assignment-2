from pydantic import BaseModel
from typing import List

class Term(BaseModel):
    term: str
    definition: str

# flashcards has a title, description and a list of Term objects
class FlashcardSet(BaseModel):
    title: str
    description: str
    terms: List[Term]
