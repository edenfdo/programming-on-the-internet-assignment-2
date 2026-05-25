// imports history card componenet
import HistoryCard from "../components/HistoryCard";

// imports css file
import "../styles/admin.css";

function AdminPage({
  history,
  setCurrentView
}) {

  document.body.classList.contains("dark")

  return (
    <div className="admin-page">

      {/* Back button */}
      <button
        className="back-button"
        onClick={() =>
          setCurrentView("landing")
        }
      >
        ← Back
      </button>
      
      {/* Page Title */}
      <h1>Activity History</h1>
      
      {/* Container for the list of history cards */}
      <div className="history-grid">
        {/* Loops from history array */}
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