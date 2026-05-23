import { useState, useEffect } from "react";

// Cleaned CardStack component using CSS classes
function CardStack({ title, description, terms }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const hasCards = terms && terms.length > 0;
  const currentCard = hasCards ? terms[currentIndex] : null;

  const nextCard = (e) => {
    e.stopPropagation();
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % terms.length);
  };

  const prevCard = (e) => {
    e.stopPropagation();
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + terms.length) % terms.length);
  };

  return (
    <div className="set-card-stack">
      <h3 className="set-card-title">{title}</h3>
      <p className="set-card-description">{description}</p>
      
      {hasCards ? (
        <div className="stack-inner-container">
          <div className="stack-perspective-wrapper">
            <div className="stack-bg-layer-1"></div>
            <div className="stack-bg-layer-2"></div>
            
            <div 
              onClick={() => setFlipped(!flipped)}
              className={`main-flashcard ${flipped ? "flipped" : ""}`}
            >
              <span className="card-side-indicator">
                {flipped ? "Definition" : "Term"}
              </span>
              <strong className="card-text-content">
                {flipped ? currentCard.definition : currentCard.term}
              </strong>
            </div>
          </div>

          <div className="stack-navigation-row">
            <button onClick={prevCard} className="stack-nav-button">← Back</button>
            <span className="stack-counter">{currentIndex + 1} / {terms.length}</span>
            <button onClick={nextCard} className="stack-nav-button">Next →</button>
          </div>
        </div>
      ) : (
        <p className="empty-set-message">
          No matching flashcards found.
        </p>
      )}
    </div>
  );
}

function App() {
  
  const [terms, setTerms] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const [currentView, setCurrentView] = useState("landing");

  const [selectedStudySetId, setSelectedStudySetId] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // const [searchTerm, setSearchTerm] = useState("");
  

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

// Tracks whether the user is viewing the Login or Register form
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Array to hold all saved flashcard sets fetched from MongoDB
  const [savedSets, setSavedSets] = useState([]);

  const cleanedTerms = terms.filter(
    t => t.term.trim() && t.definition.trim()
  );

  const [globalSearch, setGlobalSearch] = useState("");

  const searchResults = globalSearch.trim()
  ? savedSets.flatMap((set) =>
      (set.terms || [])
        .filter((card) =>
          card.term.toLowerCase().includes(globalSearch.toLowerCase()) ||
          card.definition.toLowerCase().includes(globalSearch.toLowerCase())
        )
        .map((card) => ({
          setId: set.id,
          setTitle: set.title,
          term: card.term,
          definition: card.definition
        }))
    )
  : [];

  const login = async () => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    const res = await fetch("http://127.0.0.1:8000/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    if (!res.ok) {
      alert("Invalid login credentials");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    setLoggedIn(true);

    fetchExistingItems();
  };

  const register = async () => {
    if (email.length < 3 || password.length < 4) {
      alert("Username must be ≥ 3 chars, password ≥ 4 chars");
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
      alert(data.detail || "Registration failed");
      return;
    }

    alert("Registration successful! You can now log in.");
    setIsRegisterMode(false); // Switch back to login view automatically
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const fetchExistingItems = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://127.0.0.1:8000/items", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setSavedSets(data);
    }
  } catch (err) {
    console.error("Error getting items", err);
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
      setPopupMessage("Please fill in the title and description.");
      setShowPopup(true);
      return;
    }

    const payload = {
      title,
      description,
      terms: cleanedTerms
    };

    fetch("http://127.0.0.1:8000/items", {
      method: "POST",
      headers: { 
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
       },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        console.log("Set saved successfully!");
        // Clear input form fields for the next entry
        setTitle("");
        setDescription("");
        setTerms([{ id: "", term: "", definition: "" }]);
        // Pull latest updates down from server immediately
        fetchExistingItems();
      })
      .catch((err) => console.error("Error saving set:", err));
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
      <div className="landing-page">

        {/* Right Menu */}
        <div className="landing-navbar">
          {!loggedIn ? (
            <>
              <button
                className="nav-button"
                onClick={() => setIsRegisterMode(false)}
              >
                Login
              </button>

              <button
                className="nav-button register"
                onClick={() => setIsRegisterMode(true)}
              >
                Register
              </button>
            </>
          ) : (
            <button
              className="nav-button"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        {/* Main Hero Section */}
        {showLoginPrompt && (
          <div className="login-warning-overlay">
            <div className="login-warning-popup">
              <p>You need to login first</p>
              <div className="arrow-right">→</div>
            </div>
          </div>
        )}
        <div className="landing-content">
          <h1 className="landing-title">Cardio</h1>

          <p className="landing-subtitle">
            Create, study, and master flashcards faster.
          </p>

          {loggedIn && (
            <>
            <div className="global-search-container">
              <input
                type="text"
                placeholder="Search all flashcards..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="global-search-input"
              />
            </div>
            {globalSearch && (
              <div className="search-results">
                {searchResults.length === 0 ? (
                  <p className="no-results">No matches found</p>
                ) : (
                  searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-result-item"
                      onClick={() => {
                        setSelectedStudySetId(result.setId);
                        setCurrentView("study");
                        setGlobalSearch("");
                      }}
                    >
                      <strong>{result.term}</strong>
                      <p>{result.definition}</p>
                      <small>{result.setTitle}</small>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

          <div className="landing-buttons">
            <button
              className="hero-button study"
              onClick={() => {
                if (!loggedIn) {
                  setShowLoginPrompt(true);

                  setTimeout(() => {
                    setShowLoginPrompt(false);
                  }, 3000);

                  return;
                }

                setCurrentView("study");
              }}
            >
              Study Now
            </button>

            <button
              className="hero-button manage"
              onClick={() => setCurrentView("manage")}
            >
              Manage Cards
            </button>
          </div>
        </div>

        {/* Slideout Auth Panel */}
        {!loggedIn && (
          <div className="auth-sidebar">
            <h2>{isRegisterMode ? "Create Account" : "Login"}</h2>

            <input
              type="text"
              placeholder="Username / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isRegisterMode ? (
              <button onClick={register}>
                Register
              </button>
            ) : (
              <button onClick={login}>
                Login
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (currentView === "study") {

    const selectedSet = savedSets.find(
      (set) => String(set.id) === selectedStudySetId
    );

    // const filteredTerms = selectedSet
    //   ? selectedSet.terms.filter((card) =>
    //       card.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       card.definition.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    //   : [];

    return (
      <div className="study-page">

        <div className="study-header">
          <button
            className="back-button"
            onClick={() => {
              setSelectedStudySetId("");
             setCurrentView("landing");
            }}
          >
            ← Back
          </button>

          <h1>Study Flashcards</h1>
        </div>

        

        {/* <div className="study-search-container">
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="study-search-input"
          />
        </div> */}

        <div className="study-selector-container">

          <select
            className="study-dropdown"
            value={selectedStudySetId}
            onChange={(e) => setSelectedStudySetId(e.target.value)}
          >
            <option value="">Select a flashcard set</option>

            {savedSets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.title}
              </option>
            ))}
          </select>

        </div>

        {selectedSet && (
          <div className="study-card-container">
            <CardStack
              title={selectedSet.title}
              description={selectedSet.description}
              terms={selectedSet.terms}
            />
          </div>
        )}
      </div>
    );
  }

  if (currentView === "manage") {
    return (
      <div className={`wrapper ${darkMode ? "dark" : ""}`}>
        <div className="manage-topbar">
          <button
            className="back-button"
            onClick={() => setCurrentView("landing")}
          >
            ← Back
          </button>
        </div>
        <h1>Cardio</h1>
        <p>Flash Card Creation Website</p>

        {/* Popup */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>{popupMessage}</p>
              <button className="popup-close" onClick={() => setShowPopup(false)}>OK</button>
            </div>
          </div>
        )}

        {/* Dark Mode Toggle */}
        <div className="toggle-wrapper" onClick={() => setDarkMode(!darkMode)}>
          <div className={`toggle-switch ${darkMode ? "on" : ""}`}>
            <div className="toggle-circle">{darkMode ? "☀" : "☾"}</div>
          </div>
        </div>

        <div className="form-wrapper">
          <div className="form-container show">
            <div className="card-bg show"></div>

            {/* Title + Description */}
            <div className="title-description-grid">
              <div className="grid-item">
                <label className="input-label">Title</label>
                <input
                  className="title-input"
                  type="text"
                  placeholder="Enter title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid-item">
                <label className="input-label">Description</label>
                <textarea
                  className="description-input"
                  placeholder="Enter description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Terms List */}
            <div className="terms-list">
              {terms.map((item, index) => (
                <div className="term-row" key={index}>
                  <div className="term-number">{index + 1}</div>

                  <input
                    className="term-input"
                    placeholder="Term"
                    value={item.term}
                    onChange={(e) => {
                      const updated = [...terms];
                      updated[index].term = e.target.value;
                      setTerms(updated);
                    }}
                  />

                  <textarea
                    className="description-input"
                    placeholder="Definition"
                    value={item.definition}
                    onChange={(e) => {
                      const updated = [...terms];
                      updated[index].definition = e.target.value;
                      setTerms(updated);
                    }}
                  />

                  <button
                    className={`delete-term-button ${terms.length > 1 ? "" : "hide"}`}
                    onClick={() => deleteTerm(index)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="form-footer">
              <button className="add-term-button" onClick={addTerm}>+</button>
              <button className="done-button" onClick={submitForm}>Save Set</button>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
        
        {/* STACKED LIST SECTION */}
        {/* Cleaned STACKED LIST SECTION near the bottom of App.jsx */}
        {/* <div className="saved-sets-section">
          <h2 className="saved-sets-heading">Your Flashcard Sets</h2>
          
          {savedSets.length === 0 ? (
            <p className="no-sets-message">No flashcard sets saved yet.</p>
          ) : (
            <div className="saved-sets-responsive-grid">
              {savedSets.map((set) => (
                <div key={set.id} className="set-card-column">
                  <CardStack 
                    title={set.title} 
                    description={set.description} 
                    terms={set.terms} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>


 */}

      </div>
    );
  }
}

export default App;
