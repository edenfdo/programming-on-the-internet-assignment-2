from pydantic import BaseModel
from typing import List

# Term have a term and defintion
class Term(BaseModel):
    term: str
    definition: str

# Flashcards has a title, description and a list of terms
class FlashcardSet(BaseModel):
    title: str
    description: str
    terms: List[Term]
