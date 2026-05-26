import os
from dotenv import load_dotenv

# Reads .env file
load_dotenv()

# Retrieves the value named SECRET_KEY
SECRET_KEY = os.getenv("SECRET_KEY")