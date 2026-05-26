import motor.motor_asyncio

# Connects to a mongodb instance running locally
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")

# Chooses the database - flashcards_db
db = client.flashcards_db

# Selects the specific "table"
sets_collection = db.flashcard_sets

# Collection for user data
users_collection = db.users

# Selects the learning_history collection
history_collection = db.learning_history