// imports navbar componenet
import Navbar from "../components/Navbar";

// imports search bar componenet
import SearchBar from "../components/SearchBar";

// imports css file
import "../styles/landing.css";

function LandingPage({
  loggedIn,
  authMode,
  setAuthMode,
  logout,
  email,
  setEmail,
  password,
  setPassword,
  login,
  register,
  globalSearch,
  setGlobalSearch,
  searchResults,
  setCurrentView,
  isAdmin,
  loadHistory,
  recordHistory,
  setSelectedStudySetId,
  setSelectedCardIndex,
  setPopupButtonText,
  setPopupMessage,
  setPopupTitle,
  setShowPopup,
  darkMode,
  setDarkMode,
  openCreateSet

  
}) {

  // When the user clicks "Create Set"
  const handleManageClick = () => {
    // If user not logged in show popup
    if (!loggedIn) {
      setPopupTitle("Hold on...");
      setPopupMessage(
        "Please log in to manage flashcards."
      );
      setPopupButtonText("Login");

      setShowPopup(true);
      setAuthMode("login");

      return;
    }

    openCreateSet();
  };

  // Defines the function for the "Study Now" button
  const handleStudyClick = () => {
    // If not logged in show popup
    if (!loggedIn) {
      setPopupTitle("Hold on...");
      setPopupMessage(
        "Please log in to study flashcards."
      );
      setPopupButtonText("Login");
      setShowPopup(true);

      setAuthMode("login");
      return;
    };
    setSelectedCardIndex(0);
    setCurrentView("study");
    
  }

  // Defines the function for the "My Sets" button
  const handleSetsClick = () => {
    // If not logged in show popup
    if (!loggedIn) {
      setPopupTitle("Hold on...");
      setPopupMessage(
        "Please log in to view your flashcard sets."
      );
      setPopupButtonText("Login");
      setShowPopup(true);

      setAuthMode("login");
      return;
    }

    setCurrentView("mysets");
  };


  

  return (
    <div className="landing-page">

      {/* Navbar */}
      <Navbar
        loggedIn={loggedIn}
        authMode={authMode}
        setAuthMode={setAuthMode}
        logout={logout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

    
      <div className="landing-content">

        {/* Website Title */}
        <h1 className="landing-title">
          Cardio
        </h1>
        
        {/* Subtitle */}
        <p className="landing-subtitle">
          Create, study, and master flashcards faster.
        </p>

        {/* Search bar only when logged in */}
        {loggedIn && (
          <>
            <SearchBar
              value={globalSearch}
              onChange={setGlobalSearch}
            />

            {/* Only show results if the search bar is not empty */}
            {globalSearch && (
              <div className="search-results">
                
                {/* If no results, show message */}
                {searchResults.length === 0 && (
                  <p>No results found.</p>
                )}

                {/* Maps search results */}
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => {
                      recordHistory(
                        result.setTitle,
                        "studied"
                      );

                      setSelectedStudySetId(
                        String(result.setId)
                      );

                      setSelectedCardIndex(
                        result.cardIndex
                      );

                      setCurrentView("study");
                    }}
                  >
                    <div
                      key={index}
                      className="search-result-item"
                      onClick={() => {
                        recordHistory(
                          result.setTitle,
                          "studied"
                        );

                        setSelectedStudySetId(
                          String(result.setId)
                        );

                        setSelectedCardIndex(
                          result.cardIndex
                        );

                        setCurrentView("study");
                      }}
                    >
                      {/* Result display */}
                      <div className="search-result-item">
                        <strong>{result.term}</strong>

                        <div className="search-result-set">
                          Found in: {result.setTitle}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Buttons */}
        <div className="landing-buttons">

          {/* Study now button */}
          <button
            className="managecard-button study"
            onClick={handleStudyClick}
          >
            Study Now
          </button>

          {/* Create set button */}
          <button
            className="managecard-button manage"
            onClick={handleManageClick}
          >
            Create Set
          </button>

          {/* My Sets button */}
          <button
            className="managecard-button"
            onClick={handleSetsClick}
          >
            My Sets
          </button>

          {/* Only if admin show admin button */}
          {isAdmin && (
            <button
              className="admincard-button"
              onClick={loadHistory}
            >
              Admin Dashboard
            </button>
          )}

        </div>

      </div>

      {/* Login and register sidebar */}
      {!loggedIn && authMode && (
      <div className="auth-sidebar">

          {/* Title */}
          <div className="auth-sidebar-title">
            {authMode === "register"
              ? "Create Account"
              : "Login"}
          </div>
          
          {/* Username/Email input */}
          <input
            type="text"
            placeholder="Username / Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                authMode === "register"
                ? register()
                : login();
              }
            }}
          />

          {/* Submit button */}
          <button
            onClick={
              authMode === "register"
                ? register
                : login
            }
          >
            {authMode === "register"
            ? "Register"
            : "Login"}
          </button>

        </div>
      )}

    </div>
  );
}

export default LandingPage;