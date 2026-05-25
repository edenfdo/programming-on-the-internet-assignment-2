import HistoryCard from "../components/HistoryCard";
import "../styles/admin.css";

function AdminPage({
  history,
  setCurrentView
}) {

  document.body.classList.contains("dark")

  return (
    <div className="admin-page">

      <button
        className="back-button"
        onClick={() =>
          setCurrentView("landing")
        }
      >
        ← Back
      </button>

      <h1>Activity History</h1>

      <div className="history-grid">
        {history.map((item) => (
          <HistoryCard
            key={item.id}
            flashcardSet={item.flashcard_set}
            action={item.action}
            username={item.username}
          />
        ))}
      </div>

    </div>
  );
}

export default AdminPage;