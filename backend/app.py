from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# --- MongoDB connection ---
client = MongoClient("mongodb://localhost:27017/")
db = client["flashcards_db"]
sets_collection = db["flashcard_sets"]

@app.before_request
def debug_request():
    print(">>>", request.method, request.path)

# ---------------------------
# GET /items  (retrieve sets)
# ---------------------------
@app.route('/items', methods=['GET'])
def get_items():
    sets = list(sets_collection.find({}))

    result = []
    for s in sets:
        result.append({
            "id": str(s["_id"]),
            "title": s["title"],
            "description": s.get("description", ""),
            "terms": [
                {
                    "id": str(t.get("id", "")),
                    "term": t["term"],
                    "definition": t["definition"]
                }
                for t in s.get("terms", [])
            ]
        })

    return jsonify(result)

# ---------------------------
# POST /items  (save set)
# ---------------------------
@app.route('/items', methods=['POST'])
def add_item():
    data = request.get_json()
    print("POST received:", data)

    # Clear all sets (matching your SQLite behavior)
    sets_collection.delete_many({})

    # Insert new set
    new_set = {
        "title": data["title"],
        "description": data["description"],
        "terms": [
            {
                "id": str(ObjectId()),
                "term": t["term"],
                "definition": t["definition"]
            }
            for t in data["terms"]
        ]
    }

    sets_collection.insert_one(new_set)

    return jsonify({"message": "Flashcard set saved"}), 200


if __name__ == '__main__':
    print("MongoDB Flashcard API running on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
