import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import "../styles/landing.css";
import Popup from "../components/Popup";

function LandingPage({
  loggedIn,
  // isRegisterMode,
  // setIsRegisterMode,
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
  // showLoginPrompt,
  // setShowLoginPrompt,
  setCurrentView,
  isAdmin,
  loadHistory,
  recordHistory,
  setSelectedStudySetId,
  setSelectedCardIndex,
  setPopupButtonText,
  showPopup,
  popupMessage,
  setPopupMessage,
  popupButtonText,
  setPopupTitle,
  popupTitle,
  setShowPopup

  
}) {

  const handleManageClick = () => {
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

    setCurrentView("manage");
  };

  const handleStudyClick = () => {
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
  setCurrentView("study");
}

  const handleSetsClick = () => {
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

      {/* Navbar */}
      <Navbar
        loggedIn={loggedIn}
        authMode={authMode}
        setAuthMode={setAuthMode}
        logout={logout}
      />

      

      {/* Hero */}
      <div className="landing-content">

        <h1 className="landing-title">
          Cardio
        </h1>

        <p className="landing-subtitle">
          Create, study, and master flashcards faster.
        </p>

        {loggedIn && (
          <>
            <SearchBar
              value={globalSearch}
              onChange={setGlobalSearch}
            />

            {globalSearch && (
              <div className="search-results">

                {searchResults.length === 0 && (
                  <p>No results found.</p>
                )}

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

        <div className="landing-buttons">

          <button
            className="managecard-button study"
            onClick={handleStudyClick}
          >
            Study Now
          </button>

          <button
            className="managecard-button manage"
            onClick={handleManageClick}
          >
            Create Set
          </button>

          <button
            className="managecard-button"
            onClick={handleSetsClick}
          >
            My Sets
          </button>

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

      {/* Login/Register Panel */}
      {!loggedIn && authMode && (
      <div className="auth-sidebar">

          <h2>
            {authMode === "register"
              ? "Create Account"
              : "Login"}
          </h2>

          <input
            type="text"
            placeholder="Username / Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

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