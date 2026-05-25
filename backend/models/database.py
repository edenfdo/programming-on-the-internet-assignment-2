import motor.motor_asyncio

# connects to a mongodb instance running locally
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")

#chooses the database - flashcards_db
db = client.flashcards_db

#selects the specific "table"
sets_collection = db.flashcard_sets

#collection for user data
users_collection = db.users

history_collection = db.learning_history