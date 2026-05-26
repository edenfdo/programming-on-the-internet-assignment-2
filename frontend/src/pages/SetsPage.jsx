// Imports css file
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

      {/* Back button */}
      <div className="mysets-header">
        <button
          className="back-button"
          onClick={() => setCurrentView("landing")}
        >
          ← Back
        </button>

        {/* Title */}
        <h1>My Flashcard Sets</h1>
      </div>

      {/* If the user has no saved sets, show a message */}
      {savedSets.length === 0 ? (
        // Message displayed
        <div className = "no-sets">No flashcard sets yet.</div>
      ) : (
        // Show grid
        <div className="sets-grid">

          {/* Mapping through saved sets */}
          {savedSets.map((set) => (
            <div
              key={set.id}
              className="set-card"
            >
              {/* Set title */}
              <h2>{set.title}</h2>

              {/* Set description */}
              <p>
                {set.description}
              </p>

              {/* Card count */}
              <span>
                {set.terms.length} cards
              </span>

              {/* Buttons */}
              <div className="set-actions">

                {/* Study button */}
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
                
                {/* Edit button */}
                <button
                  onClick={() =>
                    startEditingSet(set)
                  }
                >
                  Edit
                </button>
                
                {/* Delete button */}
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