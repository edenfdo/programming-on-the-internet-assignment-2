# Cardio

A simple flashcard web application built with React, FastAPI and MongoDB, which allows users to create, study, search, update and delete custom flashcard sets. The application also supports user authentication and an admin dashboard which displays users' learning history.

---

## Backend Setup

### Install dependencies

```bash
pip install -r requirements.txt
```

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

## Project Structure

