import CardStack from "../components/CardStack";
import "../styles/study.css";

function StudyPage({
  savedSets,
  selectedStudySetId,
  selectedCardIndex,
  setSelectedCardIndex,
  setSelectedStudySetId,
  setCurrentView,
  recordHistory
}) {

  const selectedSet = savedSets.find(
    (set) => String(set.id) === selectedStudySetId
  );

  const safeIndex = selectedSet
    ? Math.min(
        selectedCardIndex,
        selectedSet.terms.length - 1
      )
    : 0;

  console.log(
    "StudyPage received index:",
    selectedCardIndex
  );
  return (
    
    <div className="study-page">

      <div className="study-header">
        <button
          className="back-button"
          onClick={() => {
            setSelectedStudySetId("");
            setSelectedCardIndex(0);
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

            // Always start from card 1 when opening a set
            setSelectedCardIndex(0);

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
            key={selectedStudySetId}
            title={selectedSet.title}
            description={selectedSet.description}
            terms={selectedSet.terms}
            startIndex={safeIndex}
          />
        </div>
      )}

    </div>
  );
}

export default StudyPage;