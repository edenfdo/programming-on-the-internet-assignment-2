export default function AuthSidebar({
  email,
  password,
  setEmail,
  setPassword,
  login,
  register,
  authMode
}) {
  return (
    <div className="auth-sidebar">

      <h2>
        {authMode === "register"
          ? "Create Account"
          : "Login"}
      </h2>

      <input
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
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
  );
}