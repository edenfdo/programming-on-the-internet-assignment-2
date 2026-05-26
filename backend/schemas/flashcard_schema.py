from pydantic import BaseModel
from typing import List

# Terms have a term and defintion
class Term(BaseModel):
    term: str
    definition: str

# Flashcards have a title, description and a list of Terms
class FlashcardSet(BaseModel):
    title: str
    description: str
    terms: List[Term]
