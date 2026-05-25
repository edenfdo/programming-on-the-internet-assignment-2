import "../styles/sets.css";

function SetsPage({
  savedSets,
  setCurrentView,
  setSelectedStudySetId,
  deleteSet,
  startEditingSet,
  recordHistory
}) {
  return (
    <div className="mysets-page">

      <div className="mysets-header">
        <button
          className="back-button"
          onClick={() => setCurrentView("landing")}
        >
          ← Back
        </button>

        <h1>My Flashcard Sets</h1>
      </div>

      {savedSets.length === 0 ? (
        <div className = "no-sets">No flashcard sets yet.</div>
      ) : (
        <div className="sets-grid">

          {savedSets.map((set) => (
            <div
              key={set.id}
              className="set-card"
            >
              <h2>{set.title}</h2>

              <p>
                {set.description}
              </p>

              <span>
                {set.terms.length} cards
              </span>

              <div className="set-actions">

                <button
                  onClick={() => {
                    recordHistory(
                      set.title,
                      "studied"
                    );

                    setSelectedStudySetId(
                      String(set.id)
                    );

                    setCurrentView("study");
                  }}
                >
                  Study
                </button>

                <button
                  onClick={() =>
                    startEditingSet(set)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteSet(set.id, set.title)
                  }
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default SetsPage;