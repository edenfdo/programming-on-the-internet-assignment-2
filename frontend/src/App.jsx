import { useState, useEffect } from "react";
import "./index.css";


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
  
  const [terms, setTerms] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupButtonText, setPopupButtonText] = useState("Close");
  const [showPopup, setShowPopup] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const [currentView, setCurrentView] = useState("landing");

  const [selectedStudySetId, setSelectedStudySetId] = useState("");

  const [selectedCardIndex, setSelectedCardIndex] =
    useState(0);

  

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

// Tracks whether the user is viewing the Login or Register form
  

  const [authMode, setAuthMode] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Array to hold all saved flashcard sets fetched from MongoDB
  const [savedSets, setSavedSets] = useState([]);

  const [history, setHistory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("role") === "admin"
  );

  const cleanedTerms = terms.filter(
    t => t.term.trim() && t.definition.trim()
  );

  const [globalSearch, setGlobalSearch] = useState("");

  

  const [editingSetId, setEditingSetId] =
    useState(null);

  const startEditingSet = (set) => {
    setEditingSetId(set.id);

    setTitle(set.title);
    setDescription(set.description);
    setTerms(set.terms);

    setCurrentView("manage");
  };

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
  const loadHistory = async () => {
    try {

      const data = await getHistory();

      setHistory(data);
      setCurrentView("admin");
    } catch (err) {
      console.error(err);
    }
  };
  
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


  const register = async () => {
    if (email.length < 3 || password.length < 4) {
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setLoggedIn(false);
    setIsAdmin(false);

    setEmail("");
    setPassword("");
  };


  //add a new empty term row
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

  //delete a term by index
  const deleteTerm = (indexToDelete) => {
    setTerms(terms.filter((_, i) => i !== indexToDelete));
  };

  //save flashcard set
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
    if (cleanedTerms.length === 0) {
      setPopupTitle("Oops!");
      setPopupMessage(
        "Please add at least one flashcard before saving."
      );
      setPopupButtonText("Got It");
      console.log("Opening success popup");
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
        setTerms([
          {
            id: "",
            term: "",
            definition: ""
          }
        ]);

        fetchExistingItems();
        //setCurrentView("mysets");
      })
      .catch((err) =>
        console.error(
          "Error saving set:",
          err
        )
      );
  };

  // load existing set from backend
  useEffect(() => {
    if (loggedIn) {
      fetchExistingItems();
    }
  }, [loggedIn]);

  

  //dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const currentPage =
  currentView === "landing" ? (
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
      // showLoginPrompt={showLoginPrompt}
      // setShowLoginPrompt={setShowLoginPrompt}
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
    />
  ) : currentView === "study" ? (
    <StudyPage
      savedSets={savedSets}
      selectedStudySetId={selectedStudySetId}
      selectedCardIndex={selectedCardIndex}
      setSelectedStudySetId={setSelectedStudySetId}
      setCurrentView={setCurrentView}
      recordHistory={recordHistory}
    />
  ) : currentView === "manage" ? (
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
    <SetsPage
      savedSets={savedSets}
      setCurrentView={setCurrentView}
      setSelectedStudySetId={
        setSelectedStudySetId
      }
      deleteSet={deleteSet}
      startEditingSet={startEditingSet}
    />
  ) : (
    <AdminPage
      history={history}
      setCurrentView={setCurrentView}
    />
  );

  

  return (
    <>
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
