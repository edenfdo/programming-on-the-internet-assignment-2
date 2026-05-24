import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";

function LandingPage({
  loggedIn,
  isRegisterMode,
  setIsRegisterMode,
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
  showLoginPrompt,
  setShowLoginPrompt,
  setCurrentView,
  isAdmin,
  loadHistory,
  recordHistory,
  setSelectedStudySetId
}) {

  const handleStudyClick = () => {
    if (!loggedIn) {
      setShowLoginPrompt(true);

      setTimeout(() => {
        setShowLoginPrompt(false);
      }, 2000);

      return;
    }

    setCurrentView("study");
  };

  const handleManageClick = () => {
    if (!loggedIn) {
      setShowLoginPrompt(true);

      setTimeout(() => {
        setShowLoginPrompt(false);
      }, 2000);

      return;
    }

    setCurrentView("manage");
  };

  return (
    <div className="landing-page">

      {/* Navbar */}
      <Navbar
        loggedIn={loggedIn}
        isRegisterMode={isRegisterMode}
        setIsRegisterMode={setIsRegisterMode}
        logout={logout}
      />

      {/* Login Warning */}
      {showLoginPrompt && (
        <div className="login-warning-overlay">
          <div className="login-warning-popup">
            <p>You need to login first</p>
            <div className="arrow-right">→</div>
          </div>
        </div>
      )}

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

                      setCurrentView("study");
                    }}
                  >
                    <strong>{result.term}</strong>

                    <p>{result.definition}</p>

                    <small>
                      {result.setTitle}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="landing-buttons">

          <button
            className="hero-button study"
            onClick={handleStudyClick}
          >
            Study Now
          </button>

          <button
            className="hero-button manage"
            onClick={handleManageClick}
          >
            Manage Cards
          </button>

          {isAdmin && (
            <button
              className="hero-button"
              onClick={loadHistory}
            >
              Admin Dashboard
            </button>
          )}

        </div>

      </div>

      {/* Login/Register Panel */}
      {!loggedIn && (
        <div className="auth-sidebar">

          <h2>
            {isRegisterMode
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
                isRegisterMode
                  ? register()
                  : login();
              }
            }}
          />

          <button
            onClick={
              isRegisterMode
                ? register
                : login
            }
          >
            {isRegisterMode
              ? "Register"
              : "Login"}
          </button>

        </div>
      )}

    </div>
  );
}

export default LandingPage;