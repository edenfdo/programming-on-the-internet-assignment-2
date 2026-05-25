function Navbar({
  loggedIn,
  authMode,
  setAuthMode,
  logout,
  darkMode,
  setDarkMode
}) {
  return (
    <div className="landing-navbar">
      {/* If the user is not logged in, show Login + Register buttons. */}
      {!loggedIn ? (
        <>
          {/* Login button */}
          <button
            className="nav-button"
            onClick={() =>
              setAuthMode(
                authMode === "login"
                  ? null
                  : "login"
              )
            }
          >
            Login
          </button>
          
          {/* Register button */}
          <button
            className="nav-button register"
            onClick={() =>
              setAuthMode(
                authMode === "register"
                  ? null
                  : "register"
              )
            }
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

      {/* Dark mode toggle */}
      <button
        className={`theme-toggle ${darkMode ? "active" : ""}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        <span className="toggle-thumb">
          {darkMode ? "☀" : "☾"}
        </span>
      </button>
      
    </div>
  );
}

export default Navbar;