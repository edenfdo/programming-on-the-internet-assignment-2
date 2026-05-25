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

      {/* Title based on whether the user is logged in or not */}
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

      {/* Password */}
      <input
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        // enter key handling
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
  );
}