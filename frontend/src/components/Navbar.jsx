function Navbar({
  loggedIn,
  // isRegisterMode,
  setIsRegisterMode,
  logout
}) {
  return (
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
  );
}

export default Navbar;