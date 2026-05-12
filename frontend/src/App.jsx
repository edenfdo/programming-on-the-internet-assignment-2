import { useState, useEffect } from "react";

function App() {
  // Single source of truth for terms
  const [terms, setTerms] = useState([
    { id: "", term: "", definition: "" }
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  // -----------------------------
  // Add a new empty term row
  // -----------------------------
  const addTerm = () => {
    setTerms([
      ...terms,
      { id: "", term: "", definition: "" }
    ]);
  };

  // -----------------------------
  // Delete a term by index
  // -----------------------------
  const deleteTerm = (indexToDelete) => {
    setTerms(terms.filter((_, i) => i !== indexToDelete));
  };

  // -----------------------------
  // Save flashcard set
  // -----------------------------
  const submitForm = () => {
    if (!title.trim() || !description.trim()) {
      setPopupMessage("Please fill in the title and description.");
      setShowPopup(true);
      return;
    }

    const payload = { title, description, terms };

    fetch("http://127.0.0.1:5000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => alert("Set saved successfully!"))
      .catch((err) => console.error("Error saving set:", err));
  };

  // -----------------------------
  // Load existing set from backend
  // -----------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:5000/items")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const firstSet = data[0];
          setTitle(firstSet.title);
          setDescription(firstSet.description);
          setTerms(firstSet.terms);
        }
      })
      .catch((err) => console.error("Error getting items", err));
  }, []);

  // -----------------------------
  // Dark mode sync
  // -----------------------------
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`wrapper ${darkMode ? "dark" : ""}`}>
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
                  🗑
                </button>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="form-footer">
            <button className="add-term-button" onClick={addTerm}>+</button>
            <button className="done-button" onClick={submitForm}>Save Set</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
