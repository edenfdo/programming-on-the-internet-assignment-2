export default function AuthSidebar({
  email,
  password,
  setEmail,
  setPassword,
  login,
  register,
  isRegisterMode
}) {
  return (
    <div className="auth-sidebar">

      <h2>
        {isRegisterMode
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
  );
}