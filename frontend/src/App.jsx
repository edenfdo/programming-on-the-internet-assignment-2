import { useState, useEffect } from "react";
import "./index.css";

// import CardStack from "./components/CardStack";
// import AuthSidebar from "./components/AuthSidebar";
import LandingPage from "./pages/LandingPage";
import StudyPage from "./pages/StudyPage";
import ManagePage from "./pages/ManagePage";
import AdminPage from "./pages/AdminPage";
import SetsPage from "./pages/SetsPage";

import {
  loginUser,
  // registerUser,
  getItems,
  // saveItems,
  saveHistory,
  getHistory
} from "./services/api";

// Cleaned CardStack component using CSS classes
// function CardStack({ title, description, terms }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [flipped, setFlipped] = useState(false);

//   const hasCards = terms && terms.length > 0;
//   const currentCard = hasCards ? terms[currentIndex] : null;

//   const nextCard = (e) => {
//     e.stopPropagation();
//     setFlipped(false);
//     setCurrentIndex((prev) => (prev + 1) % terms.length);
//   };

//   const prevCard = (e) => {
//     e.stopPropagation();
//     setFlipped(false);
//     setCurrentIndex((prev) => (prev - 1 + terms.length) % terms.length);
//   };

//   return (
//     <div className="set-card-stack">
//       <h3 className="set-card-title">{title}</h3>
//       <p className="set-card-description">{description}</p>
      
//       {hasCards ? (
//         <div className="stack-inner-container">
//           <div className="stack-perspective-wrapper">
//             <div className="stack-bg-layer-1"></div>
//             <div className="stack-bg-layer-2"></div>
            
//             <div 
//               onClick={() => setFlipped(!flipped)}
//               className={`main-flashcard ${flipped ? "flipped" : ""}`}
//             >
//               <span className="card-side-indicator">
//                 {flipped ? "Definition" : "Term"}
//               </span>
//               <strong className="card-text-content">
//                 {flipped ? currentCard.definition : currentCard.term}
//               </strong>
//             </div>
//           </div>

//           <div className="stack-navigation-row">
//             <button onClick={prevCard} className="stack-nav-button">← Back</button>
//             <span className="stack-counter">{currentIndex + 1} / {terms.length}</span>
//             <button onClick={nextCard} className="stack-nav-button">Next →</button>
//           </div>
//         </div>
//       ) : (
//         <p className="empty-set-message">
//           No matching flashcards found.
//         </p>
//       )}
//     </div>
//   );
// }

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
  // const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // const [searchTerm, setSearchTerm] = useState("");
  

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
        .filter((card) =>
          card.term.toLowerCase().includes(globalSearch.toLowerCase()) 
        )
        .map((card) => ({
          setId: set.id,
          setTitle: set.title,
          term: card.term,
          definition: card.definition
        }))
    )
  : [];

  // const loadHistory = async () => {
  //     try {
  //       const token = localStorage.getItem("token");

  //       const res = await fetch(
  //         "http://127.0.0.1:8000/view_history",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         }
  //       );

  //       const data = await res.json();

  //       setHistory(data);

  //       setCurrentView("admin");
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

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

  // const login = async () => {
  //   const body = new URLSearchParams();
  //   body.append("username", email);
  //   body.append("password", password);

  //   const res = await fetch("http://127.0.0.1:8000/token", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body
  //   });

  //   if (!res.ok) {
  //     alert("Invalid login credentials");
  //     return;
  //   }

  //   const data = await res.json();

  //   localStorage.setItem(
  //     "token",
  //     data.access_token
  //   );

  //   localStorage.setItem(
  //     "role",
  //     data.role
  //   );

  //   setLoggedIn(true);

  //   setIsAdmin(
  //     data.role === "admin"
  //   );

  //   fetchExistingItems();
  // };

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

//   const fetchExistingItems = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const res = await fetch("http://127.0.0.1:8000/items", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     const data = await res.json();

//     if (Array.isArray(data)) {
//       setSavedSets(data);
//     }
//   } catch (err) {
//     console.error("Error getting items", err);
//   }
// };

// const recordHistory = async (
//   flashcardSet,
//   action
// ) => {
//   const token = localStorage.getItem("token");

//   await fetch(
//     `http://127.0.0.1:8000/history?flashcard_set=${encodeURIComponent(
//       flashcardSet
//     )}&action=${encodeURIComponent(action)}`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );
// };

  // const login = async () => {
  //   const body = new URLSearchParams();
  //   body.append("username", email);
  //   body.append("password", password);

  //   const res = await fetch("http://127.0.0.1:8000/token", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body
  //   });

  //   if (!res.ok) {
  //     alert("Invalid login");
  //     return;
  //   }

  //   const data = await res.json();
  //   localStorage.setItem("token", data.access_token);
  //   setLoggedIn(true);

  //   fetch(
  //     "http://127.0.0.1:8000/items",
  //     {
  //       headers: {
  //         "Authorization": "Bearer " + localStorage.getItem("token")
  //       }
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.length > 0) {
  //         const firstSet = data[0];
  //         setTitle(firstSet.title);
  //         setDescription(firstSet.description);
  //         setTerms(firstSet.terms);
  //       }
  //     })
  //     .catch((err) => console.error("Error getting items", err));
  // };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setLoggedIn(false);

  //   // Reset login form fields
  //   setEmail("");
  //   setPassword("");
  // }

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

  // useEffect(() => {
  //   fetch(
  //     "http://127.0.0.1:8000/items",
  //     {
  //       headers: {
  //         "Authorization": "Bearer " + localStorage.getItem("token")
  //       }
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.length > 0) {
  //         const firstSet = data[0];
  //         setTitle(firstSet.title);
  //         setDescription(firstSet.description);
  //         setTerms(firstSet.terms);
  //       }
  //     })
  //     .catch((err) => console.error("Error getting items", err));
  // }, []);

  

  //dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (currentView === "landing") {
  return (
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
    />
  );
}

  if (currentView === "study") {
    return (
      <StudyPage
        savedSets={savedSets}
        selectedStudySetId={selectedStudySetId}
        setSelectedStudySetId={setSelectedStudySetId}
        setCurrentView={setCurrentView}
        recordHistory={recordHistory}
      />
    );
  }

  if (currentView === "admin") {
    return (
      <AdminPage
        history={history}
        setCurrentView={setCurrentView}
      />
    );
  }

  if (currentView === "mysets") {
    return(
      <SetsPage
        savedSets={savedSets}
        setCurrentView={setCurrentView}
        setSelectedStudySetId={
          setSelectedStudySetId
        }
        deleteSet={deleteSet}
        startEditingSet={startEditingSet}
      />
    )
  }
  


  if (currentView === "manage") {
    return (
      <ManagePage
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
    );
  }
  return null;
}

export default App;
