function Navbar({
  loggedIn,
  authMode,
  setAuthMode,
  logout,
  darkMode,
  setDarkMode
}) {
  console.log("darkMode =", darkMode);
  return (
    <div className="landing-navbar">
      {!loggedIn ? (
        <>
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