# Cardio

A simple flashcard web application built with React, FastAPI and MongoDB

## What problem does Cardio solve?

Cardio is an invaluable tool for users who need to learn or memorise large amounts of content, such as when preparing for exams. It allows users to create, study, search, update and delete custom flashcard sets. The web app also supports user authentication and an admin dashboard which displays users' learning history. 

---

## Backend Setup

### Install dependencies

```bash
pip install -r requirements.txt
```

### Configure environment variables

This project uses environment variables for configuration.

Create a `.env` file in the `backend/` directory:

```
SECRET_KEY=<your secret key>
```

An example file is also provided at `.env.example`.

### Install and start MongoDB

The following instructions are for **MacOS**. There would be a similar process for other operating systems.

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Run the FastAPI server

```bash
uvicorn main:app --reload
```

The backend will run at:

```
http://127.0.0.1:8000
```

---

## Frontend Setup

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## Default Admin Account

A default admin account is automatically created when the backend starts if it doesn't already exist.

### Admin Login

| Username | Password |
|----------|----------|
| admin | admin |

---

## Features

### Authentication
- User registration
- User login using JWT and password hashing
- Role-based access control

### Flashcard Management
- Create flashcard sets
- Edit flashcard sets
- Delete flashcard sets
- View all flashcard sets
- Search flashcards by term

### Study Mode
- Navigate between cards
- Flip cards to reveal definitions
  

### Admin Dashboard
- View all flashcard/user learning history including:
  - Created
  - Updated
  - Deleted
  - Studied
- Restricted to admin accounts

### User Interface
- Dark mode support
- Pop-up notifications and validation messages

---

## Technologies Used

### Frontend
- React
- JavaScript
- CSS

### Backend
- FastAPI
- Python

### Database
- MongoDB

---

## Project Structure

```
.
├── README.md                         # Setup and documentation
│
├── backend                           # Backend (FastAPI / Python)
│   ├── main.py                       # Entry point
│   │
│   ├── models                        # Database models
│   │   └── database.py               # Database connection and setup
│   │
│   ├── requirements.txt              # Python dependencies
│   │
│   ├── routes                        # API route definitions
│   │   ├── auth_routes.py            # Authentication routes
│   │   ├── flashcard_routes.py       # Flashcard CRUD routes
│   │   └── history_routes.py         # User history routes
│   │
│   ├── schemas                       # Data validation (Pydantic schemas)
│   │   ├── flashcard_schema.py       # Flashcard schemas
│   │   └── user_schema.py            # User-related schemas
│   │
│   └── services                      # Business logic
│       ├── auth_service.py           # Authentication / user logic
│       ├── flashcard_service.py      # Flashcard processing logic
│       └── history_service.py        # Learning history logic
│
└── frontend                          # Frontend (React / Vite app)
    │
    ├── eslint.config.js              # ESLint configuration
    ├── index.html                    # Root HTML file
    ├── package-lock.json             # Locked dependency versions
    ├── package.json                  # Frontend dependencies
    │
    ├── public                        # Static assets
    │   └── brain.png                 # App icon
    │
    ├── src                           # Frontend source code
    │   │
    │   ├── App.jsx                   # Root React component
    │   ├── main.jsx                  # App entrypoint
    │   │
    │   ├── components                # Reusable UI components
    │   │   ├── AuthSidebar.jsx       # Login UI
    │   │   ├── CardStack.jsx         # Flashcard stack UI
    │   │   ├── FlashcardForm.jsx     # Form to create flashcards
    │   │   ├── HistoryCard.jsx       # History display card
    │   │   ├── Navbar.jsx            # Top navigation bar
    │   │   ├── Popup.jsx             # Popup component
    │   │   └── SearchBar.jsx         # Search input component
    │   │
    │   ├── pages                     # Page-level components
    │   │   ├── AdminPage.jsx         # Admin dashboard
    │   │   ├── CreateSetPage.jsx     # Create flashcard set page
    │   │   ├── LandingPage.jsx       # Landing/home page
    │   │   ├── SetsPage.jsx          # List of flashcard sets
    │   │   └── StudyPage.jsx         # Study/flashcard view page
    │   │
    │   ├── services                  # API calls
    │   │   └── api.jsx               # Central API handler
    │   │
    │   └── styles                    # CSS stylesheets
    │       ├── admin.css             # Admin page styles
    │       ├── create.css            # Create set page styles
    │       ├── index.css             # Global styles
    │       ├── landing.css           # Landing page styles
    │       ├── sets.css              # Flashcard sets page styles
    │       └── study.css             # Study page styles
    │
    └── vite.config.js                # Vite build configuration
```

---

## Challenges Overcome

Setting up user authentication was initially challenging as I wasn't very familiar with hashing and JWTs. However, following on from the course content, and through my own research, I was able to successfully implement this feature through creating specific auth routes, implementing auth logic (which involved using the `bcrypt` and `jwt` modules) and setting up a `users` MongoDB collection.

Another challenge I faced was managing growing backend and frontend codebases and ensuring that both remained consistent with each other at all times. Every new frontend view required one or more new routes, which in turn involved their own business logic and database schemas. This contributed to the complexity of the project, however as I progressed, my ability to make end-to-end changes (across both frontend and backend) certainly improved.

Furthermore, even though dark mode was a feature I initially implemented in Assignment 1, I still needed to extend it significantly as it needed to apply to *every* single new component and view. Every time I added a new UI component, I needed to ensure it showed up well in both light and dark mode. This was a considerable effort, however I am pleased with the final result.