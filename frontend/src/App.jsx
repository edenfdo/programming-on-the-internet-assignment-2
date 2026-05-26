// Imports react hooks 
import { useState, useEffect } from "react";

// Imports css file
import "./styles/index.css";

// Imports all components and pages
import LandingPage from "./pages/LandingPage";
import StudyPage from "./pages/StudyPage";
import CreateSetPage from "./pages/CreateSetPage";
import AdminPage from "./pages/AdminPage";
import SetsPage from "./pages/SetsPage";
import Popup from "./components/Popup"

import {
  loginUser,
  getItems,
  saveHistory,
  getHistory
} from "./services/api";


function App() {
  
  // Stores the flashcard set currently being created or edited
  const [terms, setTerms] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Stores the popup used for notifications
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupButtonText, setPopupButtonText] = useState("Close");
  const [showPopup, setShowPopup] = useState(false);

  // Stores darkMode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  // Stores navigation state
  const [currentView, setCurrentView] = useState("landing");

  // Stores which set is being studied and which card is active
  const [selectedStudySetId, setSelectedStudySetId] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] =
    useState(0);

  // Stores authentification state
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [authMode, setAuthMode] = useState(null);

  // Login and register form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Stores all flashcard sets fetched from the backend
  const [savedSets, setSavedSets] = useState([]);
  const [history, setHistory] = useState([]);

  // Stores whether the user is an admin
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("role") === "admin"
  );

  // Stores the global search query
  const [globalSearch, setGlobalSearch] = useState("");

  // Stores which set is being edited
  const [editingSetId, setEditingSetId] =
    useState(null);

  // Removes empty or incomplete cards before saving
  const cleanedTerms = terms.filter(
    t => t.term.trim() && t.definition.trim()
  );

  // When opening create set page
  const openCreateSet = () => {
    setTitle("");
    setDescription("");
    setTerms([]);
    setEditingSetId(null);

    setCurrentView("manage");
  };
  
  // When editing a set
  const startEditingSet = (set) => {
    setEditingSetId(set.id);

    setTitle(set.title);
    setDescription(set.description);
    setTerms(set.terms);

    setCurrentView("manage");
  };

  // Deleting a flashcard set
  const deleteSet = async (id, title) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/items/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      await recordHistory(
        title,
        "deleted"
      );

      fetchExistingItems();
    } catch (err) {
      console.error(err);
    }
  };

  // Search 
  const searchResults = globalSearch.trim()
  ? savedSets.flatMap((set) =>
      (set.terms || [])
        .map((card, index) => ({
          card,
          index
        }))
        .filter(({ card }) =>
          card.term
            .toLowerCase()
            .includes(globalSearch.toLowerCase())
        )
        .map(({ card, index }) => ({
          setId: set.id,
          setTitle: set.title,
          term: card.term,
          definition: card.definition,
          cardIndex: index
        }))
    )
  : [];

  // Login 
  const login = async () => {
    try {
      const data = await loginUser(email, password);

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      setLoggedIn(true);
      setIsAdmin(data.role === "admin");

      fetchExistingItems();
    } catch {
      setPopupTitle("Oops!");
      setPopupMessage("Invalid username or password.");
      setPopupButtonText("Try Again");
      setShowPopup(true);
    }
  };

  // Registering 
  const register = async () => {
    if (email.length < 3 || password.length < 4) {
      setPopupTitle("Invalid Details");
      setPopupMessage(
        "Username must be at least 3 characters and password must be at least 4 characters."
      );

      setShowPopup(true);
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setPopupTitle("Oops!");
      setPopupMessage(
        data.detail || "Registration failed"
      );
      setShowPopup(true);
      return;
    }

    setPopupTitle("Yay!");
    setPopupMessage(
      "Account created successfully! Please log in."
    );
    setPopupButtonText("Login");
    setShowPopup(true);

    setAuthMode("login");
  };

  // Loading history for admin users
  const loadHistory = async () => {
    try {

      const data = await getHistory();

      setHistory(data);
      setCurrentView("admin");
    } catch (err) {
      console.error(err);
    }
  };
  
  // Fetching flashcard sets 
  const fetchExistingItems = async () => {
    try {

      const data = await getItems();

      if (Array.isArray(data)) {
        setSavedSets(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recording history 
  const recordHistory = async (
    flashcardSet,
    action
  ) => {
    try {
      await saveHistory(
        flashcardSet,
        action
      );
    } catch (err) {
      console.error(err);
    }
  };

  
  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setLoggedIn(false);
    setIsAdmin(false);

    setEmail("");
    setPassword("");
  };


  //Adding a new empty term row
  const addTerm = () => {
  setTerms((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      term: "",
      definition: ""
    }
  ]);
};

  //Deleting a term 
  const deleteTerm = (indexToDelete) => {
    setTerms(terms.filter((_, i) => i !== indexToDelete));
  };

  //Saving flashcard set
  const submitForm = () => {
    if (!title.trim() || !description.trim()) {
      setPopupTitle("Oops!");
      setPopupMessage(
        "Please fill in the title and description."
      );
      setPopupButtonText("Got It");
      setShowPopup(true);
      return;
    }
    if (terms.length === 0) {
      setPopupTitle("No Flashcards");
      setPopupMessage(
        "Add at least one flashcard before saving."
      );
      setPopupButtonText("OK");
      setShowPopup(true);
      return;
    }

    const incompleteCards = terms.some(
      t =>
        !t.term.trim() ||
        !t.definition.trim()
    );

    if (incompleteCards) {
      setPopupTitle("Incomplete Flashcards");
      setPopupMessage(
        "Some flashcards are missing a term or definition."
      );
      setPopupButtonText("OK");
      setShowPopup(true);
      return;
    }

    const payload = {
      title,
      description,
      terms: cleanedTerms
    };

    const url = editingSetId
      ? `http://127.0.0.1:8000/items/${editingSetId}`
      : "http://127.0.0.1:8000/items";

    const method = editingSetId
      ? "PUT"
      : "POST";

    fetch(url, {
      method,
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("token"),
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(async () => {
        console.log(
          editingSetId
            ? "Set updated!"
            : "Set created!"
        );

        await recordHistory(
          title,
          editingSetId
            ? "updated"
            : "created"
        );

        setPopupTitle("Success!");
        setPopupMessage(
          editingSetId
            ? "Flashcard set updated."
            : "Flashcard set created."
        );
        setPopupButtonText("OK");
        setShowPopup(true);
        setEditingSetId(null);

        setTitle("");
        setDescription("");
        setTerms([]);

        fetchExistingItems();
      })
      .catch((err) =>
        console.error(
          "Error saving set:",
          err
        )
      );
  };

  // Loading existing set from backend
  useEffect(() => {
    if (loggedIn) {
      fetchExistingItems();
    }
  }, [loggedIn]);

  

  // Dark Mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const currentPage =
  currentView === "landing" ? (
    // Landing page props
    <LandingPage
      loggedIn={loggedIn}
      
      logout={logout}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      login={login}
      register={register}
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      searchResults={searchResults}
      setCurrentView={setCurrentView}
      isAdmin={isAdmin}
      loadHistory={loadHistory}
      recordHistory={recordHistory}
      setSelectedStudySetId={setSelectedStudySetId}
      setSelectedCardIndex={setSelectedCardIndex}
      showPopup={showPopup}
      popupTitle={popupTitle}
      popupMessage={popupMessage}
      setPopupMessage={setPopupMessage}
      popupButtonText={popupButtonText}
      setPopupTitle={setPopupTitle}
      setPopupButtonText={setPopupButtonText} 
      setShowPopup={setShowPopup}
      authMode={authMode}
      setAuthMode={setAuthMode}
      savedSets={savedSets}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      openCreateSet={openCreateSet}
    />
  ) : currentView === "study" ? (
    // Study page props
    <StudyPage
      savedSets={savedSets}
      selectedStudySetId={selectedStudySetId}
      selectedCardIndex={selectedCardIndex}
      setSelectedStudySetId={setSelectedStudySetId}
      setCurrentView={setCurrentView}
      recordHistory={recordHistory}
      setSelectedCardIndex={setSelectedCardIndex}
    />
  ) : currentView === "manage" ? (
    // Create set page props
    <CreateSetPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      setCurrentView={setCurrentView}
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      terms={terms}
      setTerms={setTerms}
      addTerm={addTerm}
      deleteTerm={deleteTerm}
      submitForm={submitForm}
      showPopup={showPopup}
      popupMessage={popupMessage}
      setShowPopup={setShowPopup}
      popupTitle={popupTitle}
      popupButtonText={popupButtonText}
      logout={logout}
      editingSetId={editingSetId}
      setEditingSetId={setEditingSetId}
    />
  ) : currentView === "mysets" ? (
    // Sets page props
    <SetsPage
      savedSets={savedSets}
      setCurrentView={setCurrentView}
      setSelectedStudySetId={
        setSelectedStudySetId
      }
      deleteSet={deleteSet}
      startEditingSet={startEditingSet}
      recordHistory={recordHistory}
    />
  ) : (
    // Admin page props
    <AdminPage
      history={history}
      setCurrentView={setCurrentView}
    />
  );
  
  return (
    <>
      {/* Rendering popup and current view */}
      <Popup
        show={showPopup}
        title={popupTitle}
        message={popupMessage}
        buttonText={popupButtonText}
        onClose={() => {
          setShowPopup(false);

          if (popupTitle === "Success!") {
            setCurrentView("mysets");
          }

          if (popupButtonText === "Login") {
            setAuthMode("login");
          }
        }}
      />

      {currentPage}
    </>
  );
}

export default App;
