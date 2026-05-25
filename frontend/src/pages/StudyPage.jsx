import CardStack from "../components/CardStack";
import "../styles/study.css";

function StudyPage({
  savedSets,
  selectedStudySetId,
  selectedCardIndex,
  setSelectedStudySetId,
  setCurrentView,
  recordHistory
}) {
  const selectedSet = savedSets.find(
    (set) => String(set.id) === selectedStudySetId
  );

  return (
    <div className="study-page">

      <div className="study-header">
        <button
          className="back-button"
          onClick={() => {
            setSelectedStudySetId("");
            setCurrentView("landing");
          }}
        >
          ← Back
        </button>

        <div className="pagetitle">
          Study Flashcards
        </div>
      </div>

      <div className="study-selector-container">
        <select
          className="study-dropdown"
          value={selectedStudySetId}
          onChange={(e) => {
            const selectedId = e.target.value;

            setSelectedStudySetId(selectedId);

            const selectedSet = savedSets.find(
              (set) => String(set.id) === selectedId
            );

            if (selectedSet) {
              recordHistory(
                selectedSet.title,
                "studied"
              );
            }
          }}
        >
          <option value="">
            Select a flashcard set
          </option>

          {savedSets.map((set) => (
            <option
              key={set.id}
              value={set.id}
            >
              {set.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSet && (
        <div className="study-card-container">
          <CardStack
            title={selectedSet.title}
            description={selectedSet.description}
            terms={selectedSet.terms}
            startIndex={selectedCardIndex}
          />
        </div>
      )}

    </div>
  );
}

export default StudyPage;