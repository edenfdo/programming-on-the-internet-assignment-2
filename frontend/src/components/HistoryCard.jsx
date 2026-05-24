function HistoryCard({
  flashcardSet,
  action,
  username
}) {
  return (
    <div className="history-card">

      <h3>{flashcardSet}</h3>

      <p className="history-action">
        Action: {action}
      </p>

      <p className="history-user">
        User: {username}
      </p>

    </div>
  );
}

export default HistoryCard;