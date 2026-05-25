function HistoryCard({
  flashcardSet,
  action,
  username
}) {
  return (
    <div className="history-card">

      {/* Flashcard title */}
      <h3>{flashcardSet}</h3>

      {/* Action */}
      <p className="history-action">
        Action: {action}
      </p>

      {/* Username */}
      <p className="history-user">
        User: {username}
      </p>

    </div>
  );
}

export default HistoryCard;