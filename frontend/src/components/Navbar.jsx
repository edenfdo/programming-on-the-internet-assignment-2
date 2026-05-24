function Navbar({
  loggedIn,
  authMode,
  setAuthMode,
  logout
}) {
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
    </div>
  );
}

export default Navbar;